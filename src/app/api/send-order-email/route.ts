import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Legacy public order email route disabled. Checkout emails are sent server-side after valid payment transitions." },
    { status: 410 },
  );
}
