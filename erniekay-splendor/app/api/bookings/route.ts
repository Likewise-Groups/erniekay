import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { slotProblem, slotStart, SLOT_MINUTES } from "@/lib/availability";
import { getDb } from "@/lib/db";
import { appointments, services, users } from "@/lib/schema";
import { asSelectionArray, getCategory, priceSelection } from "@/lib/serviceCatalog";

/**
 * Creates a booking as an unpaid intent.
 *
 * This endpoint no longer links payments. Previously it accepted a
 * `paymentReferenceId` and attached that payment to the appointment it had just
 * created, checking nothing — so a caller could pay for the cheapest service and
 * quote the reference against an expensive booking, which polling would then
 * mark CONFIRMED. Payment is now bound at creation time in request-to-pay,
 * against the appointment recorded here, so there is nothing for a client to
 * pair up.
 */
/** Thrown inside the booking transaction so the rollback and the 409 agree. */
class SlotUnavailable extends Error {}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      address,
      notes,
      serviceId,
      serviceName,
      category,
      selectedServices,
      date,
      time,
    } = body;
    // `totalPrice` and `paymentReferenceId` are deliberately not read. The
    // catalogue prices this booking, and payment binding happens elsewhere.

    if (!email || !fullName || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Split full name
    const nameParts = String(fullName).trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Canonical list is what gets priced and stored. Accepts an array from the
    // booking modal, or a comma-joined string from the older /booking page —
    // splitting on "," is lossy (two catalogue names contain commas) so it is
    // only ever a fallback for service ids that are not in the catalogue.
    const selection = asSelectionArray(selectedServices);
    const selectionLabel = selection.join(", ");

    // Format notes to include address if it's a home service
    const finalNotes = [
      address ? `Home Service Address: ${address}` : "",
      selectionLabel ? `Requested Services: ${selectionLabel}` : "",
      `Client Notes: ${notes || "None"}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    /**
     * The slot, as an exact instant.
     *
     * This used to be `new Date(\`${date}T${time}\`)` with a space-separated
     * fallback and, failing both, *now* — so an unparseable time silently
     * booked the client in for the moment they pressed the button. The date and
     * the time are now validated against the published slot grid instead, and
     * anything that does not land on it is refused rather than guessed at.
     * See lib/availability.ts for why appending "Z" is exact here.
     */
    const requestedDay = String(date);
    const requestedTime = String(time);

    /**
     * Everything about the slot except whether it is full, checked before the
     * database is touched at all.
     *
     * The order matters: `slotStart()` on a time that is not "HH:MM" yields an
     * Invalid Date, and passing that into a query is a 500 rather than the
     * "appointments start on the half hour" the caller needs to read. Passing
     * 0 as the taken count skips only the capacity rule, which needs a query.
     */
    const shapeProblem = slotProblem(requestedDay, requestedTime, 0);
    if (shapeProblem) {
      return NextResponse.json({ error: shapeProblem }, { status: 409 });
    }

    const normalizedDate = slotStart(requestedDay, requestedTime);
    const normalizedServiceId = serviceId || "custom-service";
    const normalizedServiceName = serviceName || selectionLabel || normalizedServiceId;
    const normalizedCategory = category || "Booking Flow";

    // Price from the catalogue, or 0 when this service is not a catalogue
    // category (the /booking page posts ids like "facial"). An amountDue of 0
    // means "not priced here" — such a booking can never be auto-confirmed,
    // because no payment can cover a price we never computed.
    const catalogueCategory = getCategory(normalizedServiceId);
    let amountDue = 0;

    if (catalogueCategory && selection.length) {
      try {
        amountDue = priceSelection(normalizedServiceId, selection).total;
      } catch (pricingError) {
        // Selection did not match the catalogue. Recorded as unpriced rather
        // than guessed at; staff settle it manually.
        console.warn(
          "Booking selection could not be priced:",
          pricingError instanceof Error ? pricingError.message : pricingError,
        );
      }
    }

    // One connection for this request; see getDb().
    const db = getDb();

    /**
     * How many bookings already hold this slot.
     *
     * Counted over the half-hour the slot occupies rather than on an exact
     * timestamp match, so a row written before the two booking flows agreed on
     * a time format still occupies the slot it was meant to.
     */
    const countSlot = async (client: typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0]) => {
      const [row] = await client
        .select({ value: count() })
        .from(appointments)
        .where(
          and(
            gte(appointments.appointmentDate, normalizedDate),
            lt(
              appointments.appointmentDate,
              new Date(normalizedDate.getTime() + SLOT_MINUTES * 60 * 1000),
            ),
            sql`${appointments.status} IN ('PENDING', 'CONFIRMED', 'COMPLETED')`,
          ),
        );
      return row?.value ?? 0;
    };

    // Capacity, before creating a client record for a booking that cannot be
    // made. Re-checked under a lock at insert time; this is the courteous
    // early exit, not the guarantee.
    const capacityProblem = slotProblem(requestedDay, requestedTime, await countSlot(db));
    if (capacityProblem) {
      return NextResponse.json({ error: capacityProblem }, { status: 409 });
    }

    // Insert only. An existing Service row is left untouched — its price is
    // catalogue data, not something a booking request gets to modify.
    await db
      .insert(services)
      .values({
        id: normalizedServiceId,
        name: normalizedServiceName,
        category: normalizedCategory,
        durationMinutes: 60,
        price: amountDue,
      })
      .onConflictDoNothing({ target: services.id });

    // Equivalent of Prisma's connectOrCreate: reuse the existing client if the
    // email is already known, otherwise create them.
    const [createdUser] = await db
      .insert(users)
      .values({ email, firstName, lastName, phone })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });

    const userId =
      createdUser?.id ??
      (
        await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
      )[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: "Failed to resolve client" }, { status: 500 });
    }

    /**
     * Take the slot.
     *
     * The count above is not enough on its own: two requests can both read
     * "2 of 3 taken" and both insert, putting four bookings on a slot that
     * holds three. The advisory lock serialises requests for *this* slot only —
     * keyed on the slot itself, so bookings for other times are unaffected —
     * and it is released when the transaction ends, however it ends.
     *
     * An advisory lock rather than a unique constraint because capacity is 3,
     * not 1; there is no column combination to make unique.
     */
    const booking = await db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${`slot:${requestedDay} ${requestedTime}`}))`,
      );

      const problem = slotProblem(requestedDay, requestedTime, await countSlot(tx));
      if (problem) throw new SlotUnavailable(problem);

      const [row] = await tx
        .insert(appointments)
        .values({
          appointmentDate: normalizedDate,
          notes: finalNotes,
          userId,
          serviceId: normalizedServiceId,
          selectedServices: JSON.stringify(selection),
          amountDue,
          currency: "GHS",
          status: "PENDING",
        })
        .returning();

      return row;
    });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          status: booking.status,
          amountDue: booking.amountDue,
          currency: booking.currency,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    // Losing the race for the last place in a slot is an ordinary outcome, not
    // a fault: the client is told which and can pick another time.
    if (error instanceof SlotUnavailable) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    // Logged in full so Worker observability shows the real cause; the client
    // only ever sees the generic message.
    console.error(
      "Booking Error:",
      error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : error,
    );

    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
