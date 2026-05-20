import { NextRequest, NextResponse } from "next/server";
import { createQuoteCheckoutOrder } from "@/lib/checkout/orders";
import { CheckoutPaymentMethod, CheckoutShippingAddress } from "@/lib/checkout/types";

type Params = Promise<{ quoteId: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { quoteId } = await params;
    const id = Number(quoteId);
    const body = await request.json() as {
      paymentMethod: CheckoutPaymentMethod;
      shippingAddress: CheckoutShippingAddress;
    };

    if (!Number.isInteger(id) || (body.paymentMethod !== "paypal" && body.paymentMethod !== "sinpe")) {
      return NextResponse.json({ error: "Invalid quote checkout request" }, { status: 400 });
    }

    const order = await createQuoteCheckoutOrder({
      quoteId: id,
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating quote checkout order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create quote checkout order" },
      { status: 400 },
    );
  }
}
