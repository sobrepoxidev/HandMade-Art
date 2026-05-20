import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { assertAdminRequest } from "@/lib/checkout/security";

const ALLOWED_QUOTE_STATUSES = new Set(["received", "priced", "sent_to_client", "closed_won", "closed_lost"]);

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest();

    const { orderId, quoteId, status, responded_at } = await request.json() as {
      orderId?: number;
      quoteId?: number;
      status?: string;
      responded_at?: string;
    };

    if (orderId) {
      return NextResponse.json(
        { error: "Legacy order status updates are disabled. Update payment/shipping statuses through checkout APIs." },
        { status: 410 },
      );
    }

    if (!quoteId || !status || !ALLOWED_QUOTE_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid quote status update" }, { status: 400 });
    }

    const updateData: { status: string; responded_at?: string } = { status };
    if (responded_at) {
      updateData.responded_at = responded_at;
    }

    const { error } = await supabaseServer
      .from("interest_requests")
      .update(updateData)
      .eq("id", quoteId);

    if (error) {
      return NextResponse.json({ error: "Failed to update quote status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in update-quote-status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }
}
