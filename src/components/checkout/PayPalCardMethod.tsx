"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CheckoutErrorCode } from "@/lib/checkout/errors";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_ENV === "live"
    ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "sb"
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "sb";

const PAYPAL_ENVIRONMENT = process.env.NEXT_PUBLIC_PAYPAL_ENV === "live" ? "production" : "sandbox";

interface CheckoutOrderRef {
  orderId: number;
  checkoutToken: string;
}

interface PayPalCardMethodProps {
  checkoutOrderId: number | null;
  checkoutToken: string | null;
  createCheckoutOrder: (paymentMethod: "paypal") => Promise<CheckoutOrderRef | null>;
  onPaymentError: (msg: string) => void;
}

interface CheckoutApiError {
  error?: string;
  code?: CheckoutErrorCode;
}

const CHECKOUT_ERROR_CODES = new Set<string>([
  "discount_exhausted",
  "out_of_stock",
  "payment_failed",
  "unauthorized",
]);

function isCheckoutErrorCode(code: string | undefined): code is CheckoutErrorCode {
  return Boolean(code && CHECKOUT_ERROR_CODES.has(code));
}

export default function PayPalCardMethod({
  checkoutOrderId,
  checkoutToken,
  createCheckoutOrder,
  onPaymentError,
}: PayPalCardMethodProps) {
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [activeOrder, setActiveOrder] = useState<CheckoutOrderRef | null>(
    checkoutOrderId && checkoutToken ? { orderId: checkoutOrderId, checkoutToken } : null,
  );
  const router = useRouter();
  const locale = useLocale();
  const tCheckoutError = useTranslations("checkout.error");
  const { clearCart } = useCart();

  const ensureOrder = async () => {
    if (activeOrder) {
      return activeOrder;
    }

    const order = await createCheckoutOrder("paypal");
    if (!order) {
      throw new Error(locale === "es" ? "No se pudo crear la orden." : "Could not create the order.");
    }

    setActiveOrder(order);
    return order;
  };

  const getCheckoutErrorMessage = (data: CheckoutApiError, fallback: string) => {
    if (isCheckoutErrorCode(data.code)) {
      return tCheckoutError(data.code);
    }

    return data.error || fallback;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-3 p-3 bg-[#F5F1EB] rounded-sm text-xs text-[#4A4A4A]">
        <p>
          {locale === "es"
            ? "El total se procesa en USD. PayPal puede mostrar opciones de conversión según tu cuenta."
            : "The total is processed in USD. PayPal may show conversion options based on your account."}
        </p>
      </div>

      {(loading || redirecting) && (
        <div className="flex items-center justify-center py-2 text-[#4A4A4A]">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <p>{redirecting ? (locale === "es" ? "Redirigiendo..." : "Redirecting...") : (locale === "es" ? "Procesando..." : "Processing...")}</p>
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "USD",
          enableFunding: "paylater,venmo",
          dataSdkIntegrationSource: "integrationbuilder_sc",
          environment: PAYPAL_ENVIRONMENT,
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical" }}
          disabled={loading || redirecting}
          createOrder={async () => {
            setLoading(true);
            try {
              const order = await ensureOrder();
              const response = await fetch(`/api/checkout/orders/${order.orderId}/paypal/create?token=${encodeURIComponent(order.checkoutToken)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              const data = await response.json() as { paypalOrderId?: string } & CheckoutApiError;
              if (!response.ok || !data.paypalOrderId) {
                throw new Error(getCheckoutErrorMessage(data, "Failed to create PayPal order"));
              }
              return data.paypalOrderId;
            } catch (error) {
              const message = error instanceof Error ? error.message : "PayPal create order failed";
              onPaymentError(message);
              throw error;
            } finally {
              setLoading(false);
            }
          }}
          onApprove={async (data) => {
            setLoading(true);
            try {
              const order = await ensureOrder();
              const response = await fetch(`/api/checkout/orders/${order.orderId}/paypal/capture`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paypalOrderId: data.orderID,
                  checkoutToken: order.checkoutToken,
                }),
              });
              const result = await response.json() as { status?: string } & CheckoutApiError;
              if (!response.ok || result.status !== "COMPLETED") {
                throw new Error(getCheckoutErrorMessage(result, "PayPal capture failed"));
              }

              setRedirecting(true);
              clearCart();
              router.push(`/${locale}/order-confirmation?order_id=${order.orderId}&token=${encodeURIComponent(order.checkoutToken)}`);
            } catch (error) {
              const message = error instanceof Error ? error.message : "PayPal capture failed";
              onPaymentError(message);
            } finally {
              setLoading(false);
            }
          }}
          onError={(error) => {
            console.error("PayPal error:", error);
            onPaymentError(locale === "es" ? "Ocurrió un error con PayPal." : "An error occurred with PayPal.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
