import { NextResponse } from "next/server";

import { getDb, payments } from "@/lib/db";
import { MtnUnavailableError, requestMtnPayment } from "@/lib/mtnMomo";
import { priceSelection, UnpriceableSelectionError } from "@/lib/serviceCatalog";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "");
    const customerName = String(body.customerName || "");
    const serviceId = String(body.serviceId || "");
    const selectedServices: string[] = Array.isArray(body.selectedServices)
      ? body.selectedServices.map(String)
      : [];

    if (!phone || !customerName) {
      return NextResponse.json({ error: "Missing phone or customer name." }, { status: 400 });
    }

    // The amount is derived from the catalogue, never read from the request.
    // `body.amount` is ignored entirely: it used to be charged as sent, so any
    // caller could pay 0.01 for a 500 GHS booking and the Payment row would
    // record that as a legitimate collection.
    let priced;
    try {
      priced = priceSelection(serviceId, selectedServices);
    } catch (pricingError) {
      if (pricingError instanceof UnpriceableSelectionError) {
        console.warn("Rejected unpriceable payment request:", pricingError.message);
        return NextResponse.json({ error: pricingError.message }, { status: 400 });
      }
      throw pricingError;
    }

    const amount = priced.total;
    const serviceName = priced.category.title;

    if (amount <= 0) {
      return NextResponse.json({ error: "Selected services have no price." }, { status: 400 });
    }

    const payment = await requestMtnPayment({
      amount,
      phone,
      customerName,
      serviceName,
    });

    // Recorded before the booking exists on purpose. The customer approves on
    // their phone and MTN calls back on its own schedule — that callback
    // carries only the reference id, so there has to be a row to find.
    try {
      const db = getDb();
      await db.insert(payments).values({
        referenceId: payment.referenceId,
        amount,
        // From the result, not from config — sandbox overrides the configured
        // currency, and the row must say what was actually charged.
        currency: payment.currency,
        status: payment.status,
        mode: payment.mode,
        payerPhone: phone,
        customerName,
        serviceName,
      });
    } catch (dbError) {
      // Deliberately not fatal. The prompt is already on the customer's phone;
      // failing the request here would tell them the payment never started
      // when it did. Log loudly — the status endpoint can still reconcile
      // against MTN from the reference id we return below.
      console.error(
        "Failed to record MTN payment row:",
        dbError instanceof Error ? `${dbError.name}: ${dbError.message}` : dbError,
        `referenceId=${payment.referenceId}`,
      );
    }

    return NextResponse.json(payment, { status: 202 });
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
