import { NextResponse } from "next/server";
import { requestMtnPayment } from "@/lib/mtnMomo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const phone = String(body.phone || "");
    const customerName = String(body.customerName || "");
    const serviceName = String(body.serviceName || "Erniekay service");

    if (!amount || amount <= 0 || !phone || !customerName) {
      return NextResponse.json({ error: "Missing payment amount, phone, or customer name." }, { status: 400 });
    }

    const payment = await requestMtnPayment({
      amount,
      phone,
      customerName,
      serviceName,
    });

    return NextResponse.json(payment, { status: 202 });
  } catch (error) {
    console.error("MTN MoMo request error:", error);
    return NextResponse.json({ error: "Unable to start MTN Mobile Money payment." }, { status: 500 });
  }
}
