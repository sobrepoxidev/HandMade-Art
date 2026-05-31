import { NextRequest, NextResponse } from "next/server";
import { createCartCheckoutOrder } from "@/lib/checkout/orders";
import { getSessionUser } from "@/lib/checkout/security";
import { getCheckoutErrorPayload } from "@/lib/checkout/errors";
import {
  CheckoutCartItemInput,
  CheckoutCustomer,
  CheckoutDiscountInput,
  CheckoutPaymentMethod,
  CheckoutShippingAddress,
} from "@/lib/checkout/types";

interface CreateCheckoutOrderBody {
  customer: CheckoutCustomer;
  shippingAddress: CheckoutShippingAddress;
  items: CheckoutCartItemInput[];
  discount?: CheckoutDiscountInput | null;
  paymentMethod: CheckoutPaymentMethod;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateCheckoutOrderBody;
    if (body.paymentMethod !== "paypal" && body.paymentMethod !== "sinpe") {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
    }

    const user = await getSessionUser();
    const order = await createCartCheckoutOrder({
      userId: user?.id ?? null,
      customer: body.customer,
      shippingAddress: body.shippingAddress,
      items: body.items,
      discount: body.discount,
      paymentMethod: body.paymentMethod,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating checkout order:", error);
    const payload = getCheckoutErrorPayload(error, "Failed to create checkout order");
    return NextResponse.json(
      payload.body,
      { status: payload.status },
    );
  }
}
