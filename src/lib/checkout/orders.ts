import { supabaseServer } from "@/lib/supabaseServer";
import { Json } from "@/lib/database.types";
import {
  CheckoutCustomer,
  CheckoutOrderResponse,
  CheckoutPaymentMethod,
  CheckoutShippingAddress,
} from "@/lib/checkout/types";
import { createCheckoutToken } from "@/lib/checkout/security";
import { CheckoutError } from "@/lib/checkout/errors";

const ORDER_EXPIRATION_MINUTES = 30;

interface CreateQuoteOrderInput {
  quoteId: number;
  quoteSlug: string;
  paymentMethod: CheckoutPaymentMethod;
  shippingAddress: CheckoutShippingAddress;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function assertShippingAddress(address: CheckoutShippingAddress) {
  const required = [address.name, address.address, address.city, address.state, address.country, address.phone];
  if (required.some((value) => !value?.trim())) {
    throw new Error("Shipping address is incomplete");
  }

  return {
    name: address.name.trim(),
    address: address.address.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    country: address.country.trim(),
    postal_code: address.postal_code?.trim() ?? "",
    phone: address.phone.trim(),
  };
}

function assertCustomer(customer: CheckoutCustomer) {
  if (!customer.name.trim() || !customer.phone.trim()) {
    throw new Error("Customer name and phone are required");
  }

  return {
    name: customer.name.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
  };
}async function reserveInventory(
  orderId: number,
  items: { productId: number; quantity: number }[],
  expiresAt: string,
) {
  const reserved: number[] = [];
  try {
    for (const item of items) {
      const { error } = await supabaseServer.rpc("reserve_inventory_item", {
        p_order_id: orderId,
        p_product_id: item.productId,
        p_quantity: item.quantity,
        p_expires_at: expiresAt,
      });

      if (error) {
        throw new Error(error.message);
      }

      reserved.push(item.productId);
    }
  } catch (error) {
    if (reserved.length > 0) {
      await supabaseServer.rpc("release_order_inventory", { p_order_id: orderId });
    }
    throw error;
  }
}

export async function createQuoteCheckoutOrder(input: CreateQuoteOrderInput): Promise<CheckoutOrderResponse> {
  const shippingAddress = assertShippingAddress(input.shippingAddress);
  const quoteSlug = input.quoteSlug.trim();
  if (!quoteSlug) {
    throw new CheckoutError("unauthorized", "Quote checkout token is required");
  }

  const { data: quote, error: quoteError } = await supabaseServer
    .from("interest_requests")
    .select("*, interest_request_items(*)")
    .eq("id", input.quoteId)
    .eq("quote_slug", quoteSlug)
    .eq("status", "sent_to_client")
    .single();

  if (quoteError || !quote) {
    throw new CheckoutError("unauthorized", "Quote is not available for payment");
  }

  const customer = assertCustomer({
    name: quote.requester_name,
    email: quote.email ?? "",
    phone: quote.phone ?? shippingAddress.phone,
  });

  const quoteItems = quote.interest_request_items as Array<{
    product_id: number;
    quantity: number;
    unit_price_usd: number | null;
    product_snapshot: Json;
  }>;

  if (quoteItems.length === 0) {
    throw new Error("Quote has no payable items");
  }

  const subtotal = roundMoney(quote.total_amount ?? quoteItems.reduce((total, item) => {
    const snapshot = item.product_snapshot as { dolar_price?: number; price?: number };
    return total + (item.unit_price_usd ?? snapshot.dolar_price ?? snapshot.price ?? 0) * item.quantity;
  }, 0));

  const shipping = quote.shipping_cost ?? 0;
  const total = roundMoney(quote.final_amount ?? subtotal + shipping);
  const discount = roundMoney(Math.max(0, subtotal + shipping - total));
  const { token, hash } = createCheckoutToken();
  const expiresAt = new Date(Date.now() + ORDER_EXPIRATION_MINUTES * 60_000).toISOString();

  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .insert({
      user_id: null,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      source_type: "quote",
      source_quote_id: quote.id,
      payment_method: input.paymentMethod,
      payment_status: "pending_payment",
      shipping_status: "pending",
      total_amount: total,
      currency: "USD",
      discount_amount: discount,
      shipping_amount: shipping,
      shipping_cost: shipping,
      shipping_currency: "USD",
      shipping_address: shippingAddress as unknown as Json,
      checkout_token_hash: hash,
      checkout_token_expires_at: expiresAt,
      expires_at: expiresAt,
      notes: `Quote ID: ${quote.id}`,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to create quote checkout order");
  }

  try {
    await reserveInventory(
      order.id,
      quoteItems.map((item) => ({ productId: item.product_id, quantity: item.quantity })),
      expiresAt,
    );

    const { error: itemsError } = await supabaseServer.from("order_items").insert(
      quoteItems.map((item) => {
        const snapshot = item.product_snapshot as {
          name?: string;
          sku?: string;
          dolar_price?: number;
          price?: number;
          weight_kg?: number;
          length_cm?: number;
          width_cm?: number;
          height_cm?: number;
        };
        const unitPrice = item.unit_price_usd ?? snapshot.dolar_price ?? snapshot.price ?? 0;
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: unitPrice,
          product_name_snapshot: snapshot.name ?? `Product #${item.product_id}`,
          sku_snapshot: snapshot.sku ?? null,
          unit_weight_kg_snapshot: snapshot.weight_kg ?? null,
          dims_snapshot: {
            length_cm: snapshot.length_cm ?? null,
            width_cm: snapshot.width_cm ?? null,
            height_cm: snapshot.height_cm ?? null,
          },
        };
      }),
    );

    if (itemsError) {
      throw new Error(itemsError.message);
    }
  } catch (error) {
    await supabaseServer.rpc("release_order_inventory", { p_order_id: order.id });
    await supabaseServer.from("orders").update({ payment_status: "cancelled" }).eq("id", order.id);
    throw error;
  }

  return {
    orderId: order.id,
    checkoutToken: token,
    totalAmount: total,
    currency: "USD",
    paymentStatus: "pending",
    expiresAt,
  };
}

export function normalizeShippingAddressJson(value: Json | null): CheckoutShippingAddress {
  const address = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return {
    name: String(address.name ?? ""),
    address: String(address.address ?? ""),
    city: String(address.city ?? ""),
    state: String(address.state ?? ""),
    country: String(address.country ?? "Costa Rica"),
    postal_code: String(address.postal_code ?? ""),
    phone: String(address.phone ?? ""),
  };
}

export async function getOrderEmailPayload(orderId: number) {
  const { data: order, error } = await supabaseServer
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    throw new Error("Order not found for email");
  }

  const orderRows = order.order_items as Array<{
    product_name_snapshot: string | null;
    quantity: number;
    price: number;
  }>;
  const items = orderRows.map((item) => ({
    name: item.product_name_snapshot ?? "Product",
    quantity: item.quantity,
    unitPrice: item.price,
    lineTotal: roundMoney(item.price * item.quantity),
  }));
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const shipping = Number(order.shipping_amount ?? order.shipping_cost ?? 0);

  return {
    orderId: order.id,
    customerEmail: String(order.customer_email ?? ""),
    customerName: String(order.customer_name ?? ""),
    shippingAddress: normalizeShippingAddressJson(order.shipping_address),
    items,
    subtotal,
    shipping,
    discount: Number(order.discount_amount ?? 0),
    total: Number(order.total_amount),
  };
}
