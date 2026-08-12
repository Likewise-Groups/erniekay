import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { getMtnPaymentStatus, MtnUnavailableError } from "@/lib/mtnMomo";
import { applyPaymentStatus } from "@/lib/payments";

export async function GET(_req: Request, { params }: { params: Promise<{ referenceId: string }> }) {
  try {
    const { referenceId } = await params;

    if (!referenceId) {
      return NextResponse.json({ error: "Missing MTN payment reference." }, { status: 400 });
    }

    const payment = await getMtnPaymentStatus(referenceId);

    // Persist what MTN just told us. The callback is the primary path, but it
    // depends on MTN being able to reach us and on the registered URL being
    // correct; polling is the fallback that always works, so it must not leave
    // the database stale behind it.
    //
    // Shared with the callback route so the confirmation rule has exactly one
    // implementation — including the guarantee that a later failed payment can
    // never un-confirm an appointment that was already paid.
    try {
      await applyPaymentStatus(getDb(), referenceId, payment.status);
    } catch (dbError) {
      // Reporting MTN's answer matters more than recording it — the caller is
      // usually a customer watching a spinner.
      console.error(
        "Failed to persist MTN payment status:",
        dbError instanceof Error ? `${dbError.name}: ${dbError.message}` : dbError,
        `referenceId=${referenceId}`,
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("MTN MoMo status error:", error);

    if (error instanceof MtnUnavailableError) {
      return NextResponse.json(
        { error: "Mobile Money is not available right now." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Unable to check MTN Mobile Money payment." }, { status: 500 });
  }
}
