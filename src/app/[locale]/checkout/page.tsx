"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import StepOne from "@/components/checkout/StepOne";
import StepTwo from "@/components/checkout/StepTwo";
import { notify } from "@/components/ui/notify";
import { useCart } from "@/context/CartContext";
import { Database } from "@/lib/database.types";
import type { CheckoutErrorCode } from "@/lib/checkout/errors";
import { ArrowLeft, PackageOpen, ShoppingBag } from "lucide-react";

type PaymentMethod = "sinpe" | "paypal" | "transfer" | "card";

type Banco = {
  nombre: string;
  sms?: string;
  permiteSMS: boolean;
};

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

type DiscountInfo = {
  valid: boolean;
  discountAmount: number;
  finalTotal: number;
  code: string;
  description?: string;
  discount_type: Database["public"]["Tables"]["discount_codes"]["Row"]["discount_type"];
  discount_value: number;
};

interface CheckoutOrderRef {
  orderId: number;
  checkoutToken: string;
  paymentMethod: "paypal" | "sinpe";
  totalAmount: number;
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

export default function CheckoutWizardPage() {
  const router = useRouter();
  const locale = useLocale();
  const tCheckoutError = useTranslations("checkout.error");
  const { cart, removeFromCart, clearCart } = useCart();

  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
  const [ultimos4, setUltimos4] = useState("");
  const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrderRef | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const discountInfoStr = localStorage.getItem("discountInfo");
    if (discountInfoStr) {
      try {
        setDiscountInfo(JSON.parse(discountInfoStr) as DiscountInfo);
      } catch (error) {
        console.error("Error parsing discount info:", error);
      }
    }
  }, []);

  const displayTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const price = item.product.dolar_price ?? 0;
      const discount = item.product.discount_percentage ?? 0;
      return sum + price * (1 - discount / 100) * item.quantity;
    }, 0);
    return (discountInfo ? discountInfo.finalTotal : subtotal) + (cart.length ? 7 : 0);
  }, [cart, discountInfo]);

  const goBack = () => {
    if (currentStep === 2) {
      setCheckoutOrder(null);
      setPaymentMethod(null);
    }
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const validateStep1 = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCheckoutOrder(null);
    setServerError(null);
    setCurrentStep(2);
  };

  const getCheckoutErrorMessage = (data: CheckoutApiError, fallback: string) => {
    if (isCheckoutErrorCode(data.code)) {
      return tCheckoutError(data.code);
    }

    return data.error || fallback;
  };

  const showCheckoutError = (message: string) => {
    setServerError(message);
    notify.error(message);
  };

  const createCheckoutOrder = async (method: "paypal" | "sinpe") => {
    if (!shippingAddress) {
      showCheckoutError(locale === "es" ? "Se requiere información de envío." : "Shipping information is required.");
      return null;
    }

    if (checkoutOrder && checkoutOrder.paymentMethod === method) {
      return {
        orderId: checkoutOrder.orderId,
        checkoutToken: checkoutOrder.checkoutToken,
      };
    }

    setIsProcessing(true);
    setServerError(null);
    try {
      const response = await fetch("/api/checkout/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
          },
          shippingAddress: {
            name: shippingAddress.name,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
            postal_code: shippingAddress.postal_code,
            phone: shippingAddress.phone,
          },
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          discount: discountInfo?.code ? { code: discountInfo.code } : null,
          paymentMethod: method,
        }),
      });
      const data = await response.json() as {
        orderId?: number;
        checkoutToken?: string;
        totalAmount?: number;
      } & CheckoutApiError;

      if (!response.ok || !data.orderId || !data.checkoutToken) {
        throw new Error(getCheckoutErrorMessage(data, "Could not create checkout order"));
      }

      const nextOrder = {
        orderId: data.orderId,
        checkoutToken: data.checkoutToken,
        paymentMethod: method,
        totalAmount: data.totalAmount ?? displayTotal,
      };
      setCheckoutOrder(nextOrder);

      return {
        orderId: nextOrder.orderId,
        checkoutToken: nextOrder.checkoutToken,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error creating checkout order";
      showCheckoutError(message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const validateStep2 = async () => {
    if (paymentMethod !== "sinpe" && paymentMethod !== "paypal") {
      showCheckoutError(locale === "es" ? "Debes seleccionar un método de pago." : "Select a payment method.");
      return;
    }

    if (paymentMethod === "paypal") {
      showCheckoutError(locale === "es" ? "Completa el pago con el botón de PayPal." : "Complete payment with the PayPal button.");
      return;
    }

    if (!bancoSeleccionado) {
      showCheckoutError(locale === "es" ? "Selecciona un banco para SINPE." : "Select a SINPE bank.");
      return;
    }

    if (!/^\d{4}$/.test(ultimos4)) {
      showCheckoutError(locale === "es" ? "Ingresa los últimos 4 dígitos del recibo." : "Enter the receipt last 4 digits.");
      return;
    }

    const order = await createCheckoutOrder("sinpe");
    if (!order) return;

    setIsProcessing(true);
    setServerError(null);
    try {
      const response = await fetch(`/api/checkout/orders/${order.orderId}/sinpe/reference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutToken: order.checkoutToken,
          bankName: bancoSeleccionado.nombre,
          receiptLast4: ultimos4,
        }),
      });
      const data = await response.json() as CheckoutApiError;
      if (!response.ok) {
        throw new Error(getCheckoutErrorMessage(data, "Could not save SINPE reference"));
      }

      clearCart();
      localStorage.removeItem("cartItems");
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("discountInfo");
      router.push(`/${locale}/order-confirmation?order_id=${order.orderId}&token=${encodeURIComponent(order.checkoutToken)}`);
    } catch (error) {
      showCheckoutError(error instanceof Error ? error.message : "Error finalizing SINPE order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#FAF6EF] px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-screen-md border border-[#E8E4E0] bg-[#F5F1EB] p-6 sm:p-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-[#E8E4E0] px-4 py-2 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#A08848] hover:bg-[#FAF6EF]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            {locale === "es" ? "Regresar" : "Go back"}
          </button>

          <div className="mt-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#C9A962]/18 text-[#A08848]">
              <PackageOpen className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </div>
            <h1 className="mt-5 font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
              {locale === "es" ? "Tu carrito está vacío" : "Your cart is empty"}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
              {locale === "es"
                ? "El checkout se activa cuando eliges una pieza. Vuelve al catálogo y agrega una obra para continuar."
                : "Checkout starts after you choose a piece. Return to the catalog and add an artwork to continue."}
            </p>
            <Link
              href="/products"
              locale={locale}
              className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-6 py-3 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {locale === "es" ? "Ver productos" : "Browse products"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-[67vh] py-4 px-4 md:px-12 lg:px-24 bg-[#FAF8F5]">
      <header className="mb-6 grid gap-4 sm:flex sm:items-center">
        {currentStep > 1 ? (
          <button
            onClick={goBack}
            disabled={isProcessing}
            className="inline-flex min-h-[44px] w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-sm bg-[#2D2D2D] px-4 py-2 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A] disabled:opacity-60"
          >
            &larr; {locale === "es" ? "Paso anterior" : "Previous step"}
          </button>
        ) : (
          <button
            onClick={() => router.back()}
            className="inline-flex min-h-[44px] w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-sm bg-[#2D2D2D] px-4 py-2 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
          >
            &larr; {locale === "es" ? "Regresar" : "Go back"}
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D] sm:text-3xl">
            {currentStep === 1
              ? locale === "es" ? "Información de entrega" : "Shipping information"
              : locale === "es" ? "Pago" : "Payment"}
          </h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#A08848]">
            {locale === "es" ? "Paso" : "Step"} {currentStep} {locale === "es" ? "de" : "of"} 2
          </p>
        </div>
      </header>

      {currentStep === 1 && (
        <StepOne
          cart={cart}
          onContinue={validateStep1}
          initialData={shippingAddress}
          locale={locale}
        />
      )}

      {currentStep === 2 && (
        <StepTwo
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cart={cart}
          removeFromCart={removeFromCart}
          bancoSeleccionado={bancoSeleccionado}
          setBancoSeleccionado={setBancoSeleccionado}
          ultimos4={ultimos4}
          setUltimos4={setUltimos4}
          total={checkoutOrder?.totalAmount ?? displayTotal}
          onFinalize={validateStep2}
          checkoutOrderId={checkoutOrder?.orderId ?? null}
          checkoutToken={checkoutOrder?.checkoutToken ?? null}
          createCheckoutOrder={createCheckoutOrder}
          serverError={serverError}
          onPaymentError={showCheckoutError}
          locale={locale}
        />
      )}
    </main>
  );
}
