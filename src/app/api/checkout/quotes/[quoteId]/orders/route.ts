import { NextRequest, NextResponse } from "next/server";
import { createQuoteCheckoutOrder } from "@/lib/checkout/orders";
import { CheckoutPaymentMethod, CheckoutShippingAddress } from "@/lib/checkout/types";
import { getCheckoutErrorPayload } from "@/lib/checkout/errors";

type Params = Promise<{ quoteId: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { quoteId } = await params;
    const id = Number(quoteId);
    const body = await request.json() as {
      quoteSlug?: string;
      paymentMethod: CheckoutPaymentMethod;
      shippingAddress: CheckoutShippingAddress;
    };

    if (!Number.isInteger(id) || (body.paymentMethod !== "paypal" && body.paymentMethod !== "sinpe")) {
      return NextResponse.json({ error: "Invalid quote checkout request" }, { status: 400 });
    }

    const order = await createQuoteCheckoutOrder({
      quoteId: id,
      quoteSlug: body.quoteSlug ?? "",
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating quote checkout order:", error);
    const payload = getCheckoutErrorPayload(error, "Failed to create quote checkout order");
    return NextResponse.json(
      payload.body,
      { status: payload.status },
    );
  }
}
