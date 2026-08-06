import { NextResponse } from "next/server";
import { getMtnPaymentStatus, MtnUnavailableError } from "@/lib/mtnMomo";

export async function GET(_req: Request, { params }: { params: Promise<{ referenceId: string }> }) {
  try {
    const { referenceId } = await params;

    if (!referenceId) {
      return NextResponse.json({ error: "Missing MTN payment reference." }, { status: 400 });
    }

    const payment = await getMtnPaymentStatus(referenceId);
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
