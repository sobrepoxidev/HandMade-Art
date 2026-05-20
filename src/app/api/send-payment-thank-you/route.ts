import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Legacy generic payment email route disabled. Checkout emails are sent by secure payment transitions." },
    { status: 410 },
  );
}
