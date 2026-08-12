import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

    // For the appointment date, create a basic Date object.
    // In a real app, you would parse the specific timezone, but this works for local demo.
    const appointmentDate = new Date(`${date}T${time}`);
    const fallbackAppointmentDate = new Date(`${date} ${time}`);
    const normalizedDate = !isNaN(appointmentDate.getTime())
      ? appointmentDate
      : !isNaN(fallbackAppointmentDate.getTime())
        ? fallbackAppointmentDate
        : new Date();
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

    const [booking] = await db
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
    // Logged in full so Worker observability shows the real cause; the client
    // only ever sees the generic message.
    console.error(
      "Booking Error:",
      error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : error,
    );

    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
