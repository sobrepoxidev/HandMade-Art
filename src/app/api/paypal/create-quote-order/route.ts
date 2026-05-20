import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Legacy quote PayPal route disabled. Use /api/checkout/quotes/{quoteId}/orders." },
    { status: 410 },
  );
}
