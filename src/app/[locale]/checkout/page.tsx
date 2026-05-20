"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import StepOne from "@/components/checkout/StepOne";
import StepTwo from "@/components/checkout/StepTwo";
import { notify } from "@/components/ui/notify";
import { useCart } from "@/context/CartContext";
import { Database } from "@/lib/database.types";

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

export default function CheckoutWizardPage() {
  const router = useRouter();
  const locale = useLocale();
  const { cart, removeFromCart, clearCart } = useCart();

  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
  const [ultimos4, setUltimos4] = useState("");
  const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrderRef | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setCurrentStep(2);
  };

  const createCheckoutOrder = async (method: "paypal" | "sinpe") => {
    if (!shippingAddress) {
      notify.error(locale === "es" ? "Se requiere información de envío." : "Shipping information is required.");
      return null;
    }

    if (checkoutOrder && checkoutOrder.paymentMethod === method) {
      return {
        orderId: checkoutOrder.orderId,
        checkoutToken: checkoutOrder.checkoutToken,
      };
    }

    setIsProcessing(true);
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
        error?: string;
      };

      if (!response.ok || !data.orderId || !data.checkoutToken) {
        throw new Error(data.error || "Could not create checkout order");
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
      notify.error(message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const validateStep2 = async () => {
    if (paymentMethod !== "sinpe" && paymentMethod !== "paypal") {
      notify.error(locale === "es" ? "Debes seleccionar un método de pago." : "Select a payment method.");
      return;
    }

    if (paymentMethod === "paypal") {
      notify.error(locale === "es" ? "Completa el pago con el botón de PayPal." : "Complete payment with the PayPal button.");
      return;
    }

    if (!bancoSeleccionado) {
      notify.error(locale === "es" ? "Selecciona un banco para SINPE." : "Select a SINPE bank.");
      return;
    }

    if (!/^\d{4}$/.test(ultimos4)) {
      notify.error(locale === "es" ? "Ingresa los últimos 4 dígitos del recibo." : "Enter the receipt last 4 digits.");
      return;
    }

    const order = await createCheckoutOrder("sinpe");
    if (!order) return;

    setIsProcessing(true);
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
      const data = await response.json() as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not save SINPE reference");
      }

      clearCart();
      localStorage.removeItem("cartItems");
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("discountInfo");
      router.push(`/${locale}/order-confirmation?order_id=${order.orderId}&token=${encodeURIComponent(order.checkoutToken)}`);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Error finalizing SINPE order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="w-full mx-auto px-6 py-14 flex flex-row gap-4 bg-[#FAF8F5] min-h-screen">
        <button onClick={() => router.back()} className="bg-[#C9A962] p-2 px-4 rounded-lg text-[#1A1A1A] font-medium shadow-md">
          &larr; {locale === "es" ? "Regresar" : "Go back"}
        </button>
        <h1 className="text-2xl font-bold mt-4 text-[#2D2D2D]">{locale === "es" ? "Carrito vacío" : "Empty cart"}</h1>
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-[67vh] py-4 px-4 md:px-12 lg:px-24 bg-[#FAF8F5]">
      <header className="flex items-center gap-4 mb-6">
        {currentStep > 1 ? (
          <button
            onClick={goBack}
            disabled={isProcessing}
            className="bg-[#2D2D2D] text-[#F5F1EB] px-3 py-1.5 rounded-lg hover:bg-[#3A3A3A] transition-colors font-medium text-sm disabled:opacity-60"
          >
            &larr; {locale === "es" ? "Paso anterior" : "Previous step"}
          </button>
        ) : (
          <button
            onClick={() => router.back()}
            className="bg-[#2D2D2D] text-[#F5F1EB] px-3 py-1.5 rounded-lg hover:bg-[#3A3A3A] transition-colors font-medium text-sm"
          >
            &larr; {locale === "es" ? "Regresar" : "Go back"}
          </button>
        )}
        <h1 className="text-base sm:text-2xl font-bold text-[#2D2D2D]">
          {currentStep === 1
            ? locale === "es" ? "Información de entrega" : "Shipping information"
            : locale === "es" ? "Pago" : "Payment"}
          <span className="text-[#C9A962] ml-2">
            ({locale === "es" ? "Paso" : "Step"} {currentStep} {locale === "es" ? "de" : "of"} 2)
          </span>
        </h1>
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
          locale={locale}
        />
      )}
    </main>
  );
}
