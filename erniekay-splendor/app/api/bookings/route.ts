import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { appointments, payments, services, users } from "@/lib/schema";
import { getCategory, priceSelection } from "@/lib/serviceCatalog";

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
      paymentReferenceId,
    } = body;
    // `totalPrice` is deliberately not destructured — the catalogue prices this
    // booking. See the Service insert below.

    if (!email || !fullName || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Split full name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Format notes to include address if it's a home service
    const finalNotes = [
      address ? `Home Service Address: ${address}` : "",
      selectedServices ? `Requested Services: ${selectedServices}` : "",
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
    const normalizedServiceName = serviceName || selectedServices || normalizedServiceId;
    const normalizedCategory = category || "Booking Flow";

    // Price the booking from the catalogue where the service is known there.
    // `totalPrice` from the request is display-only and is never written: this
    // endpoint is unauthenticated, and it previously upserted the client's
    // figure over Service.price, so any POST could permanently rewrite the
    // catalogue — and /booking, which sends no totalPrice at all, was resetting
    // prices to 0 on every submission.
    const catalogueCategory = getCategory(normalizedServiceId);
    const cataloguePrice = catalogueCategory
      ? (() => {
          const names = String(selectedServices || "")
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean);
          try {
            return priceSelection(normalizedServiceId, names).total;
          } catch {
            // Selection did not match the catalogue; fall through to leaving
            // the stored price alone rather than guessing.
            return null;
          }
        })()
      : null;

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
        price: cataloguePrice ?? 0,
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
      })
      .returning();

    // Close the loop on the payment row created by request-to-pay. Until this
    // runs the payment exists but points at no booking, which is why the column
    // is nullable — the customer can approve on their phone before (or without)
    // the booking write ever landing.
    if (paymentReferenceId) {
      try {
        await db
          .update(payments)
          .set({ appointmentId: booking.id, updatedAt: new Date() })
          .where(eq(payments.referenceId, String(paymentReferenceId)));
      } catch (linkError) {
        // The booking is saved and the money is real either way; a missing link
        // is a reconciliation problem, not a reason to fail the customer.
        console.error(
          "Failed to link payment to appointment:",
          linkError instanceof Error ? `${linkError.name}: ${linkError.message}` : linkError,
          `referenceId=${paymentReferenceId} appointmentId=${booking.id}`,
        );
      }
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
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
