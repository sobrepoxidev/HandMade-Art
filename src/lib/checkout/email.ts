import { sendMail } from "@/lib/email";
import { generateOrderConfirmationEmail } from "@/lib/orderConfirmationEmail";
import { CheckoutOrderItemEmail, CheckoutShippingAddress } from "@/lib/checkout/types";

const COMPANY_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || "sobrepoxidev@gmail.com";

interface SendCheckoutEmailInput {
  orderId: number;
  customerEmail: string;
  customerName: string;
  shippingAddress: CheckoutShippingAddress;
  items: CheckoutOrderItemEmail[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: "paypal" | "sinpe";
  paymentStatus: "paid" | "pending_manual_review";
}

export async function sendCheckoutOrderEmail(input: SendCheckoutEmailInput) {
  const emailHtml = generateOrderConfirmationEmail({
    orderId: input.orderId,
    customerName: input.customerName,
    shippingAddress: input.shippingAddress,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    currency: "USD",
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    discountInfo: input.discount > 0
      ? {
          code: "SERVER_DISCOUNT",
          discountAmount: input.discount,
        }
      : null,
  });

  const subject = input.paymentStatus === "paid"
    ? "Tu pago fue confirmado - HANDMADE ART"
    : "Recibimos tu referencia SINPE - HANDMADE ART";

  await sendMail(subject, emailHtml, input.customerEmail);
  await sendMail(`Pedido #${input.orderId} - ${input.paymentStatus}`, emailHtml, COMPANY_EMAIL);
}
