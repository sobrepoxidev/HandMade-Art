import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Generic payment links are disabled. Generate a quote link instead." },
    { status: 410 },
  );
}
