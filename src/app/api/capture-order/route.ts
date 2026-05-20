import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Legacy PayPal capture route disabled. Use /api/checkout/orders/{orderId}/paypal/capture." },
    { status: 410 },
  );
}
