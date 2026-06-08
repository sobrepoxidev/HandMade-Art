import { Database } from "@/lib/database.types";
import Image from "next/image";
import PaymentForm from "./PaymentForm";
import { useState, useEffect } from "react";

// Tipo para la información de descuento basado en la tabla discount_codes
type DiscountInfo = {
  valid: boolean;
  discountAmount: number;
  finalTotal: number;
  code: string;
  description?: string;
  discount_type: Database['public']['Tables']['discount_codes']['Row']['discount_type'];
  discount_value: number;
};

type PaymentMethod = "sinpe" | "paypal" | "transfer" | "card";
type ProductType = Database['public']['Tables']['products']['Row'];
type CartItem = {
    product: ProductType;
    quantity: number;
    id?: number;
  };
type Banco = {
    nombre: string;
    sms?: string;
    permiteSMS: boolean;
  };

export default function StepTwo({
    paymentMethod,
    setPaymentMethod,
    bancoSeleccionado,
    setBancoSeleccionado,
    ultimos4,
    setUltimos4,
    total,
    onFinalize,
    createCheckoutOrder,
    checkoutToken,
    checkoutOrderId,
    serverError,
    onPaymentError,
    cart,
    locale,
  }: {
    paymentMethod: PaymentMethod | null;
    setPaymentMethod: (m: PaymentMethod) => void;
    cart: CartItem[];
    removeFromCart: (id: number) => void;
    bancoSeleccionado: Banco | null;
    setBancoSeleccionado: (b: Banco | null) => void;
    ultimos4: string;
    setUltimos4: (s: string) => void;
    total: number;
    onFinalize: () => Promise<void>;
    checkoutOrderId: number | null;
    checkoutToken: string | null;
    createCheckoutOrder: (paymentMethod: "paypal" | "sinpe") => Promise<{ orderId: number; checkoutToken: string } | null>;
    serverError: string | null;
    onPaymentError: (message: string) => void;
    locale: string;
  }) {
    // Estado para la información de descuento
    const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
    
    // Cargar información de descuento desde localStorage
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const discountInfoStr = localStorage.getItem('discountInfo');
        if (discountInfoStr) {
          try {
            const discountData = JSON.parse(discountInfoStr);
            setDiscountInfo(discountData);
          } catch (e) {
            console.error('Error parsing discount info:', e);
          }
        }
      }
    }, []);    
    return (
      <section className="text-[#2D2D2D] w-full">
        <h2 className="mb-4 font-display text-2xl font-medium tracking-[-0.005em]">{locale == "es" ? "Seleccione un método de pago" : "Select a payment method"}</h2>

        <div role="radiogroup" aria-label={locale == "es" ? "Método de pago" : "Payment method"} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <PaymentOption
            value="sinpe"
            name="payment-method"
            label="SINPE Móvil"
            selected={paymentMethod === "sinpe"}
            onChange={() => setPaymentMethod("sinpe")}
            img={["/sinpe.webp"]}
          />
          <PaymentOption
            value="paypal"
            name="payment-method"
            label="PayPal / Tarjeta sin registro"
            selected={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
            img={["/paypal.webp", "/tarjeta.webp"]}
          />
        </div>

        <PaymentForm
          paymentMethod={paymentMethod}
          bancoSeleccionado={bancoSeleccionado}
          setBancoSeleccionado={setBancoSeleccionado}
          ultimos4={ultimos4}
          setUltimos4={setUltimos4}
          total={total}
          onFinalize={onFinalize}
          checkoutOrderId={checkoutOrderId}
          checkoutToken={checkoutToken}
          createCheckoutOrder={createCheckoutOrder}
          serverError={serverError}
          onPaymentError={onPaymentError}
          locale={locale}
        />

        {/* Resumen del pedido */}
        <div className="mt-6 border border-[#E8E4E0] bg-[#FAF6EF] p-5 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
          <h3 className="mb-4 font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D]">{locale == "es" ? "Resumen del pedido" : "Order summary"}</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#4A4A4A]">
              <span>{locale == "es" ? "Subtotal" : "Subtotal"}</span>
              <span className="font-medium text-[#2D2D2D]">${(cart.reduce((sum, item) => sum + ((item.product.dolar_price || 0) * item.quantity), 0) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#4A4A4A]">
              <span>{locale == "es" ? "Envío" : "Shipping"}</span>
              <span className="text-[#6B6459]">$7 (₡3.200)</span>
            </div>
            {discountInfo && (
              <div className="flex justify-between text-sm text-[#4A7C59] font-semibold">
                <span>{locale == "es" ? "Descuento" : "Discount"} ({discountInfo.code})</span>
                <span>- ${discountInfo.discountAmount ? discountInfo.discountAmount.toFixed(2) : '0.00'}</span>
              </div>
            )}
            <hr className="border-[#E8E4E0] my-2" />
            <div className="flex justify-between text-base font-semibold">
              <span className="text-[#2D2D2D]">{locale == "es" ? "Total del pedido" : "Order total"}</span>
              <span className="text-[#C9A962]">${total ? total.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
/** Botón estilo - HandMade Art brand identity */
function PaymentOption({
    value,
    name,
    label,
    selected,
    onChange,
    img,
  }: {
    value: "sinpe" | "paypal";
    name: string;
    label: string;
    selected: boolean;
    onChange: () => void;
    img: string[];
  }) {
    return (
      <label
        className={`cursor-pointer flex flex-col p-3 border-2 rounded-sm text-center justify-end transition-all duration-200 min-h-[120px] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#A08848] ${
          selected
            ? "border-[#C9A962] bg-[#FAF6EF] shadow-[0_2px_8px_-4px_rgba(160,136,72,0.40)]"
            : "border-[#E8E4E0] bg-[#FAF6EF] hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]"
        }`}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={selected}
          onChange={onChange}
          className="sr-only"
        />
        <div className="flex items-center justify-center gap-2 flex-1">
          <Image
            src={img[0]}
            alt={label}
            width={56}
            height={56}
            className="object-contain"
          />
          {img.length > 1 && (
            <Image
              src={img[1]}
              alt={label}
              width={56}
              height={56}
              className="object-contain"
            />
          )}
        </div>
        <div className={`mt-2 text-sm font-semibold leading-tight ${selected ? "text-[#A08848]" : "text-[#2D2D2D]"}`}>
          {label}
        </div>
      </label>
    );
  }
