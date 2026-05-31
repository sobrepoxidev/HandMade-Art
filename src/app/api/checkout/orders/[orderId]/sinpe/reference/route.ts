import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthorizedOrder } from "@/lib/checkout/security";
import { getOrderEmailPayload } from "@/lib/checkout/orders";
import { sendCheckoutOrderEmail } from "@/lib/checkout/email";
import { CheckoutError, getCheckoutErrorPayload } from "@/lib/checkout/errors";

type Params = Promise<{ orderId: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { orderId } = await params;
    const id = Number(orderId);
    const body = await request.json() as {
      checkoutToken?: string;
      bankName?: string;
      receiptLast4?: string;
    };

    if (!Number.isInteger(id) || !body.bankName || !/^\d{4}$/.test(body.receiptLast4 ?? "")) {
      return NextResponse.json({ error: "Bank and receipt last 4 digits are required" }, { status: 400 });
    }

    const { order, authorized } = await getAuthorizedOrder(id, body.checkoutToken);
    if (!authorized || !order) {
      return NextResponse.json({ error: "Order not found or forbidden", code: "unauthorized" }, { status: 403 });
    }

    if (order.payment_status !== "pending_payment") {
      return NextResponse.json({ error: "Order is not pending payment" }, { status: 409 });
    }

    const reference = `SINPE last4: ${body.receiptLast4} - Bank: ${body.bankName}`;
    const providerOrderId = `sinpe:${randomUUID()}`;
    const { error: paymentError } = await supabaseServer.from("order_payments").insert({
      order_id: order.id,
      provider: "sinpe",
      provider_order_id: providerOrderId,
      amount: order.total_amount,
      currency: "USD",
      status: "pending_manual_review",
      raw_payload: {
        bankName: body.bankName,
        receiptLast4: body.receiptLast4,
      },
    });

    if (paymentError) {
      throw new CheckoutError("payment_failed", paymentError.message);
    }

    const { error: orderUpdateError } = await supabaseServer
      .from("orders")
      .update({
        payment_method: "sinpe",
        payment_status: "pending_manual_review",
        payment_reference: reference,
      })
      .eq("id", order.id);

    if (orderUpdateError) {
      throw new CheckoutError("payment_failed", orderUpdateError.message);
    }

    try {
      const emailPayload = await getOrderEmailPayload(order.id);
      if (emailPayload.customerEmail) {
        await sendCheckoutOrderEmail({
          ...emailPayload,
          paymentMethod: "sinpe",
          paymentStatus: "pending_manual_review",
        });
      }
    } catch (emailError) {
      console.error("Checkout email failed after SINPE reference:", emailError);
    }

    return NextResponse.json({ status: "PENDING_MANUAL_REVIEW", orderId: order.id });
  } catch (error) {
    console.error("Error saving SINPE reference:", error);
    const payload = getCheckoutErrorPayload(error, "Failed to save SINPE reference");
    return NextResponse.json(
      payload.body,
      { status: payload.status },
    );
  }
}
