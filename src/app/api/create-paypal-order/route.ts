import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Legacy PayPal route disabled. Use /api/checkout/orders/{orderId}/paypal/create." },
    { status: 410 },
  );
}
