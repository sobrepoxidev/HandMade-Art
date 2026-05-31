import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthorizedOrder } from "@/lib/checkout/security";
import { capturePaypalOrder, getPrimaryCapture, validatePaypalCapture } from "@/lib/checkout/paypal";
import { getOrderEmailPayload } from "@/lib/checkout/orders";
import { sendCheckoutOrderEmail } from "@/lib/checkout/email";
import { CheckoutError, getCheckoutErrorPayload, isOutOfStockDatabaseError } from "@/lib/checkout/errors";

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
      return NextResponse.json({ error: "Order not found or forbidden", code: "unauthorized" }, { status: 403 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ status: "COMPLETED", orderId: order.id });
    }

    if (order.payment_status !== "pending_payment") {
      return NextResponse.json({ error: "Order is not pending payment", code: "payment_failed" }, { status: 409 });
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
    const { error: paymentUpdateError } = await supabaseServer
      .from("order_payments")
      .update({
        provider_capture_id: capture?.id ?? null,
        status: "completed",
        raw_payload: captureResult,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (paymentUpdateError) {
      throw new CheckoutError("payment_failed", paymentUpdateError.message);
    }

    const { data: paidOrder, error: orderUpdateError } = await supabaseServer
      .from("orders")
      .update({
        payment_status: "paid",
        payment_method: "paypal",
        payment_reference: body.paypalOrderId,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .eq("payment_status", "pending_payment")
      .select("id")
      .single();

    if (orderUpdateError || !paidOrder) {
      throw new CheckoutError("payment_failed", orderUpdateError?.message ?? "Order payment state was already changed", 409);
    }

    const { error: inventoryError } = await supabaseServer.rpc("commit_order_inventory", { p_order_id: order.id });
    if (inventoryError) {
      if (isOutOfStockDatabaseError(inventoryError)) {
        throw new CheckoutError("out_of_stock", "Order inventory is no longer available");
      }

      throw new Error(inventoryError.message);
    }

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
    const payload = getCheckoutErrorPayload(error, "Failed to capture PayPal order");
    return NextResponse.json(
      payload.body,
      { status: payload.status },
    );
  }
}
