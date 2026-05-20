import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthorizedOrder, getBearerOrQueryToken } from "@/lib/checkout/security";
import { createPaypalOrder } from "@/lib/checkout/paypal";

type Params = Promise<{ orderId: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { orderId } = await params;
    const id = Number(orderId);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const token = getBearerOrQueryToken(request);
    const { order, authorized } = await getAuthorizedOrder(id, token);
    if (!authorized || !order) {
      return NextResponse.json({ error: "Order not found or forbidden" }, { status: 403 });
    }

    if (order.payment_status !== "pending") {
      return NextResponse.json({ error: "Order is not pending payment" }, { status: 409 });
    }

    if (order.expires_at && new Date(order.expires_at).getTime() < Date.now()) {
      await supabaseServer.rpc("release_order_inventory", { p_order_id: order.id });
      await supabaseServer.from("orders").update({ payment_status: "expired" }).eq("id", order.id);
      return NextResponse.json({ error: "Order has expired" }, { status: 410 });
    }

    const { data: existingPayment } = await supabaseServer
      .from("order_payments")
      .select("provider_order_id")
      .eq("order_id", order.id)
      .eq("provider", "paypal")
      .in("status", ["created", "approved"])
      .maybeSingle();

    if (existingPayment?.provider_order_id) {
      return NextResponse.json({ paypalOrderId: existingPayment.provider_order_id });
    }

    const paypalOrder = await createPaypalOrder({
      orderId: order.id,
      amount: Number(order.total_amount),
      currency: "USD",
    });

    await supabaseServer.from("order_payments").insert({
      order_id: order.id,
      provider: "paypal",
      provider_order_id: paypalOrder.id,
      amount: order.total_amount,
      currency: "USD",
      status: paypalOrder.status?.toLowerCase() || "created",
      raw_payload: paypalOrder,
    });

    await supabaseServer
      .from("orders")
      .update({ payment_method: "paypal", payment_reference: paypalOrder.id })
      .eq("id", order.id);

    return NextResponse.json({ paypalOrderId: paypalOrder.id });
  } catch (error) {
    console.error("Error creating PayPal checkout order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create PayPal order" },
      { status: 500 },
    );
  }
}

