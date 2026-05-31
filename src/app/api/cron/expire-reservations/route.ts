import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer.rpc("release_expired_inventory_reservations");

  if (error) {
    console.error("Error expiring inventory reservations:", error);
    return NextResponse.json({ error: "Failed to expire reservations" }, { status: 500 });
  }

  return NextResponse.json({
    releasedReservations: data ?? 0,
  });
}

