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
    createdOrderId,
    createOrder,
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
    onFinalize: () => void;
    createdOrderId: number | null;
    createOrder: (paymentMethod?: string) => Promise<number | undefined>;
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
        <h2 className="text-xl font-semibold mb-4">{locale == "es" ? "Seleccione un método de pago" : "Select a payment method"}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <PaymentOption
            label="SINPE Móvil"
            selected={paymentMethod === "sinpe"}
            onClick={() => setPaymentMethod("sinpe")}
            img={["/sinpe.webp"]}
          />
          <PaymentOption
            label="PayPal / Tarjeta sin registro"
            selected={paymentMethod === "paypal"}
            onClick={async () => {
              setPaymentMethod("paypal");
              await createOrder("paypal");
            }}
            img={["/paypal.webp", "/tarjeta.webp"]}
          />
          <PaymentOption
            label="Transferencia bancaria"
            selected={paymentMethod === "transfer"}
            onClick={() => setPaymentMethod("transfer")}
            img={["/transfer.webp"]}
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
          createdOrderId={createdOrderId}
          locale={locale}
        />

        {/* Resumen del pedido */}
        <div className="mt-6 p-5 bg-white rounded-xl shadow-lg border border-[#E8E4E0]">
          <h3 className="text-lg font-semibold mb-4 text-[#2D2D2D]">{locale == "es" ? "Resumen del pedido" : "Order summary"}</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#4A4A4A]">
              <span>{locale == "es" ? "Subtotal" : "Subtotal"}</span>
              <span className="font-medium text-[#2D2D2D]">${(cart.reduce((sum, item) => sum + ((item.product.dolar_price || 0) * item.quantity), 0) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#4A4A4A]">
              <span>{locale == "es" ? "Envío" : "Shipping"}</span>
              <span className="text-[#9C9589]">$7 (₡3.200)</span>
            </div>
            {discountInfo && (
              <div className="flex justify-between text-sm text-[#4A7C59] font-semibold">
                <span>{locale == "es" ? "Descuento" : "Discount"} ({discountInfo.code})</span>
                <span>- ${discountInfo.discountAmount ? discountInfo.discountAmount.toFixed(2) : '0.00'}</span>
              </div>
            )}
            <hr className="border-[#E8E4E0] my-2" />
            <div className="flex justify-between font-bold text-base">
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
    label,
    selected,
    onClick,
    img,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
    img: string[];
  }) {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer flex flex-col p-3 border-2 rounded-xl text-center justify-end transition-all duration-200 min-h-[120px] ${
          selected
            ? "border-[#C9A962] bg-[#FAF8F5] shadow-md ring-2 ring-[#C9A962]/20"
            : "border-[#E8E4E0] bg-white hover:border-[#C9A962] hover:shadow-sm"
        }`}
      >
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
        <div className={`mt-2 text-sm font-semibold leading-tight ${selected ? "text-[#C9A962]" : "text-[#2D2D2D]"}`}>
          {label}
        </div>
      </div>
    );
  }