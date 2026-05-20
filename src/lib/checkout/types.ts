import { Json } from "@/lib/database.types";

export type CheckoutPaymentMethod = "paypal" | "sinpe";
export type CheckoutSourceType = "cart" | "quote";

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

export interface CheckoutCartItemInput {
  productId: number;
  quantity: number;
}

export interface CheckoutDiscountInput {
  code?: string;
}

export interface CheckoutOrderItemEmail {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CheckoutOrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: "USD";
}

export interface CheckoutOrderResponse {
  orderId: number;
  checkoutToken: string;
  totalAmount: number;
  currency: "USD";
  paymentStatus: string;
  expiresAt: string;
}

export interface CheckoutOrderRow {
  id: number;
  created_at: string;
  user_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  source_type: CheckoutSourceType;
  source_quote_id: number | null;
  checkout_token_hash: string | null;
  checkout_token_expires_at: string | null;
  expires_at: string | null;
  paid_at: string | null;
  payment_method: string;
  payment_reference: string | null;
  payment_status: string;
  shipping_address: Json | null;
  shipping_status: string | null;
  total_amount: number;
  currency: string;
  discount_amount: number;
  shipping_amount: number;
  shipping_cost: number;
}
