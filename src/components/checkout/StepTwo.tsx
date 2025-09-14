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
      <section className="text-gray-900 w-full">
        <h2 className="text-xl font-semibold mb-4 ">{locale == "es" ? "Seleccione un método de pago" : "Select a payment method"}</h2>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium mb-3">{locale == "es" ? "Resumen del pedido" : "Order summary"}</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-700">
              <span>{locale == "es" ? "Subtotal" : "Subtotal"}</span>
              <span>${(cart.reduce((sum, item) => sum + ((item.product.dolar_price || 0) * item.quantity), 0) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-700">
              <span>{locale == "es" ? "Envío" : "Shipping"}</span>
              <span>$7(₡3.200)</span>
            </div>
            {discountInfo && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>{locale == "es" ? "Descuento" : "Discount"} ({discountInfo.code})</span>
                <span>- $ {discountInfo.discountAmount ? discountInfo.discountAmount.toFixed(2) : '0.00'}</span>
              </div>
            )}
            <hr className="border-slate-300 my-2" />
            <div className="flex justify-between font-semibold text-base text-slate-800">
              <span>{locale == "es" ? "Total del pedido" : "Order total"}</span>
              <span>$ {total ? total.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
  
        {/* <button
          onClick={onContinue}
          className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
        >
          Continuar &rarr;
        </button> */}
      </section>
    );
  }
  /** Botón estilo */
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
        className={`cursor-pointer flex flex-col p-1 border-2 rounded-lg text-center justify-end transition ${selected ? "border-teal-300 bg-teal-50 "  : "border-gray-300 hover:border-gray-400 "}`}
      >
        <div className="flex items-center justify-center gap-2 ">
          <Image
            src={img[0]}
            alt={label}
            width={56}
            height={56}
            layout="fixed"
            className="object-contain"
          />
          {img.length > 1 && (
            <Image
              src={img[1]}
              alt={label}
              width={56}
              height={56}
              layout="fixed"
              className="object-contain"
            />
          )}
        </div>
        <div className="flex flex-col-reverse mb-2 font-semibold ">{label}</div>
      </div>
    );
  }