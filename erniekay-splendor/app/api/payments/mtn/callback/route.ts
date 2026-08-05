import { NextResponse } from "next/server";

/**
 * MTN MoMo webhook callback endpoint
 * MTN sends payment status updates here
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // MTN sends these fields in the callback
    const {
      externalId,        // Your referenceId
      transactionStatus, // "SUCCESSFUL" | "FAILED" | etc.
      amount,
      currency,
      payer,
      timestamp,
    } = body;

    console.log("MTN Payment Callback received:", {
      externalId,
      transactionStatus,
      amount,
      payer,
    });

    // TODO: Update your database with payment status
    // Example: await updatePaymentStatus(externalId, transactionStatus);

    // Acknowledge receipt to MTN (important - prevents retries)
    return NextResponse.json(
      { 
        status: "received",
        externalId 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("MTN callback error:", error);
    
    // Return error but don't block - MTN may retry
    return NextResponse.json(
      { error: "Callback processing failed" },
      { status: 500 }
    );
  }
}

// GET for testing
export async function GET() {
  return NextResponse.json({
    message: "MTN MoMo callback endpoint is active",
    endpoint: "/api/payments/mtn/callback",
  });
}
