import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { appointments, getDb, payments } from "@/lib/db";
import { MtnUnavailableError, requestMtnPayment } from "@/lib/mtnMomo";
import { hasPendingPayment, hasSettledPayment } from "@/lib/payments";
import { normalizeGhanaPhone } from "@/lib/phone";
import { checkPaymentRateLimit, clientIpOf, userAgentOf } from "@/lib/rateLimit";

/**
 * Starts a MoMo collection for an existing appointment.
 *
 * The body carries an `appointmentId`, not a price and not a service selection.
 * The amount is read from the appointment the booking endpoint already stored,
 * and the payment is bound to that appointment at creation. This is what closes
 * the bypass: previously the two calls were independent and the client chose
 * which payment covered which booking afterwards, so paying 80 GHS for the
 * cheapest item could confirm a 700 GHS booking. Now the only thing an attacker
 * controls is which appointment to pay for — and paying for an expensive
 * appointment means actually paying for it.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const appointmentId = String(body.appointmentId || "");
    const customerName = String(body.customerName || "");

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointment." }, { status: 400 });
    }

    // Validated before anything else touches MTN — this endpoint sends a real
    // prompt to whatever number it is given, so an unchecked number is a
    // harassment vector.
    const phone = normalizeGhanaPhone(body.phone);
    if (!phone.ok) {
      return NextResponse.json({ error: phone.reason }, { status: 400 });
    }

    const db = getDb();
    const clientIp = clientIpOf(req);

    const limit = await checkPaymentRateLimit(db, phone.msisdn, clientIp);
    if (!limit.allowed) {
      console.warn(
        `Payment rate limit hit (${limit.rule.label}): phone=${phone.msisdn} ip=${clientIp ?? "unknown"}`,
      );
      return NextResponse.json(
        { error: "Too many payment attempts. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const [appointment] = await db
      .select({
        id: appointments.id,
        status: appointments.status,
        amountDue: appointments.amountDue,
        currency: appointments.currency,
        serviceId: appointments.serviceId,
      })
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (!appointment) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (appointment.status === "CONFIRMED" || (await hasSettledPayment(db, appointment.id))) {
      return NextResponse.json({ error: "This booking is already paid." }, { status: 409 });
    }

    if (await hasPendingPayment(db, appointment.id)) {
      return NextResponse.json(
        { error: "A payment prompt is already awaiting approval for this booking." },
        { status: 409 },
      );
    }

    if (!(appointment.amountDue > 0)) {
      // Priced at 0 means the booking could not be priced from the catalogue.
      // Charging an arbitrary amount here is exactly the bug this design removes.
      return NextResponse.json(
        { error: "This booking has no price set. Please contact us to pay." },
        { status: 409 },
      );
    }

    // Recorded BEFORE MTN is contacted. The previous order — call MTN, then
    // insert, swallowing insert failures — meant the system could take money it
    // had no record of. Failing to write the row must abort the collection.
    const referenceId = crypto.randomUUID();

    try {
      await db.insert(payments).values({
        referenceId,
        appointmentId: appointment.id,
        amount: appointment.amountDue,
        currency: appointment.currency,
        status: "INITIATED",
        mode: "live", // corrected below from the result; never left as a guess
        payerPhone: phone.msisdn,
        customerName,
        serviceName: appointment.serviceId,
        clientIp,
        userAgent: userAgentOf(req),
      });
    } catch (dbError) {
      console.error(
        "Refusing to start MoMo collection — could not record the payment:",
        dbError instanceof Error ? `${dbError.name}: ${dbError.message}` : dbError,
      );
      return NextResponse.json(
        { error: "Mobile Money is not available right now. Please try again shortly." },
        { status: 503 },
      );
    }

    let payment;
    try {
      payment = await requestMtnPayment({
        referenceId,
        amount: appointment.amountDue,
        phone: phone.msisdn,
        customerName,
        serviceName: appointment.serviceId,
      });
    } catch (mtnError) {
      // The row exists, so the failed attempt stays visible for reconciliation
      // and still counts toward the rate limit.
      await db
        .update(payments)
        .set({ status: "FAILED", updatedAt: new Date() })
        .where(eq(payments.referenceId, referenceId))
        .catch(() => {});
      throw mtnError;
    }

    await db
      .update(payments)
      .set({
        status: payment.status,
        mode: payment.mode,
        currency: payment.currency,
        updatedAt: new Date(),
      })
      .where(eq(payments.referenceId, referenceId));

    return NextResponse.json({ ...payment, appointmentId: appointment.id }, { status: 202 });
  } catch (error) {
    console.error("MTN MoMo request error:", error);

    if (error instanceof MtnUnavailableError) {
      return NextResponse.json(
        {
          error:
            "Mobile Money is not available right now. Please choose another payment method or contact us to complete your booking.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Unable to start MTN Mobile Money payment." }, { status: 500 });
  }
}
