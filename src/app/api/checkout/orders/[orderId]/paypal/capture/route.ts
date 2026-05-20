import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthorizedOrder } from "@/lib/checkout/security";
import { capturePaypalOrder, getPrimaryCapture, validatePaypalCapture } from "@/lib/checkout/paypal";
import { getOrderEmailPayload } from "@/lib/checkout/orders";
import { sendCheckoutOrderEmail } from "@/lib/checkout/email";

type Params = Promise<{ orderId: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { orderId } = await params;
    const id = Number(orderId);
    const body = await request.json() as { paypalOrderId?: string; checkoutToken?: string };

    if (!Number.isInteger(id) || !body.paypalOrderId) {
      return NextResponse.json({ error: "Missing PayPal order id" }, { status: 400 });
    }

    const { order, authorized } = await getAuthorizedOrder(id, body.checkoutToken);
    if (!authorized || !order) {
      return NextResponse.json({ error: "Order not found or forbidden" }, { status: 403 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ status: "COMPLETED", orderId: order.id });
    }

    const { data: payment } = await supabaseServer
      .from("order_payments")
      .select("*")
      .eq("order_id", order.id)
      .eq("provider", "paypal")
      .eq("provider_order_id", body.paypalOrderId)
      .maybeSingle();

    if (!payment) {
      return NextResponse.json({ error: "PayPal order is not linked to this checkout order" }, { status: 409 });
    }

    const captureResult = await capturePaypalOrder(body.paypalOrderId);
    const validationError = validatePaypalCapture(captureResult, order.id, Number(order.total_amount));
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const capture = getPrimaryCapture(captureResult);
    await supabaseServer
      .from("order_payments")
      .update({
        provider_capture_id: capture?.id ?? null,
        status: "completed",
        raw_payload: captureResult,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    const { error: orderUpdateError } = await supabaseServer
      .from("orders")
      .update({
        payment_status: "paid",
        payment_method: "paypal",
        payment_reference: body.paypalOrderId,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (orderUpdateError) {
      throw new Error(orderUpdateError.message);
    }

    await supabaseServer.rpc("commit_order_inventory", { p_order_id: order.id });

    if (order.source_type === "quote" && order.source_quote_id) {
      await supabaseServer
        .from("interest_requests")
        .update({ status: "closed_won", responded_at: new Date().toISOString() })
        .eq("id", order.source_quote_id);
    }

    try {
      const emailPayload = await getOrderEmailPayload(order.id);
      if (emailPayload.customerEmail) {
        await sendCheckoutOrderEmail({
          ...emailPayload,
          paymentMethod: "paypal",
          paymentStatus: "paid",
        });
      }
    } catch (emailError) {
      console.error("Checkout email failed after PayPal capture:", emailError);
    }

    return NextResponse.json({ status: "COMPLETED", orderId: order.id });
  } catch (error) {
    console.error("Error capturing PayPal checkout order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to capture PayPal order" },
      { status: 500 },
    );
  }
}

