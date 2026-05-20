"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Clock, ShoppingBag } from "lucide-react";
import { useLocale } from "next-intl";
import { formatUSD } from "@/lib/formatCurrency";

interface OrderDetails {
  id: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string | null;
  customerEmail: string | null;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
  };
}

export default function OrderConfirmationPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError(locale === "es" ? "Falta el número de orden." : "Missing order number.");
        return;
      }

      const response = await fetch(`/api/checkout/orders/${orderId}${token ? `?token=${encodeURIComponent(token)}` : ""}`);
      const data = await response.json() as OrderDetails | { error?: string };
      if (!response.ok) {
        setError("error" in data && data.error ? data.error : "Could not load order");
        return;
      }

      setOrderDetails(data as OrderDetails);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("discountInfo");
    };

    void fetchOrderDetails();
  }, [locale, orderId, token]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white border border-[#E8E4E0] rounded-lg p-6">
          <h1 className="text-xl font-semibold text-[#2D2D2D]">{locale === "es" ? "No pudimos cargar la orden" : "We could not load the order"}</h1>
          <p className="mt-2 text-[#4A4A4A]">{error}</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-semibold text-[#2D2D2D]">
          {locale === "es" ? "Cargando detalles del pedido..." : "Loading order details..."}
        </h2>
      </div>
    );
  }

  const isManualReview = orderDetails.paymentStatus === "pending_manual_review";
  const Icon = isManualReview ? Clock : CheckCircle2;

  return (
    <div className="min-h-[60vh] py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-[#E8E4E0]">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A962]/15">
              <Icon className="h-6 w-6 text-[#C9A962]" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#2D2D2D]">
              {isManualReview
                ? locale === "es" ? "Referencia recibida" : "Reference received"
                : locale === "es" ? "¡Gracias por tu compra!" : "Thank you for your purchase!"}
            </h1>
            <p className="mt-2 text-base text-[#4A4A4A]">
              {locale === "es" ? "Pedido" : "Order"} #{orderDetails.id} ·{" "}
              {isManualReview
                ? locale === "es" ? "pendiente de revisión manual" : "pending manual review"
                : locale === "es" ? "pago confirmado" : "payment confirmed"}
            </p>
          </div>

          <dl className="divide-y divide-[#E8E4E0]">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-[#4A4A4A]">{locale === "es" ? "Número de orden" : "Order number"}</dt>
              <dd className="mt-1 text-sm text-[#2D2D2D] sm:col-span-2 sm:mt-0">#{orderDetails.id}</dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-[#4A4A4A]">{locale === "es" ? "Total" : "Total"}</dt>
              <dd className="mt-1 text-sm text-[#2D2D2D] sm:col-span-2 sm:mt-0">{formatUSD(orderDetails.totalAmount)}</dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-[#4A4A4A]">{locale === "es" ? "Método de pago" : "Payment method"}</dt>
              <dd className="mt-1 text-sm text-[#2D2D2D] sm:col-span-2 sm:mt-0">
                {orderDetails.paymentMethod === "paypal" ? "PayPal" : "SINPE Móvil"}
              </dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-[#4A4A4A]">{locale === "es" ? "Dirección de envío" : "Shipping address"}</dt>
              <dd className="mt-1 text-sm text-[#2D2D2D] sm:col-span-2 sm:mt-0">
                {orderDetails.shippingAddress.name}<br />
                {orderDetails.shippingAddress.address}<br />
                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}
              </dd>
            </div>
          </dl>

          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm text-[#1A1A1A] bg-[#C9A962] hover:bg-[#D4C4A8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A962]"
            >
              <ShoppingBag className="h-4 w-4" />
              {locale === "es" ? "Continuar comprando" : "Continue shopping"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
