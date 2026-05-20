import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Legacy route disabled. Use /api/checkout/orders/{orderId}/paypal/create." },
    { status: 410 },
  );
}
