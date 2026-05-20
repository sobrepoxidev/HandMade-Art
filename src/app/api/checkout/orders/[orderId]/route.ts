import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedOrder, getBearerOrQueryToken } from "@/lib/checkout/security";
import { normalizeShippingAddressJson } from "@/lib/checkout/orders";

type Params = Promise<{ orderId: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { orderId } = await params;
  const id = Number(orderId);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const token = getBearerOrQueryToken(request);
  const { order, authorized, reason } = await getAuthorizedOrder(id, token);
  if (!authorized || !order) {
    return NextResponse.json({ error: reason === "not_found" ? "Order not found" : "Forbidden" }, { status: reason === "not_found" ? 404 : 403 });
  }

  return NextResponse.json({
    id: order.id,
    totalAmount: order.total_amount,
    currency: order.currency,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    shippingAddress: normalizeShippingAddressJson(order.shipping_address),
    createdAt: order.created_at,
  });
}
