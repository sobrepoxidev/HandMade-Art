'use client'

import { useRouter } from 'next/navigation'
import { useCart, CartItem } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import StepOne from "@/components/checkout/StepOne";
import StepTwo from "@/components/checkout/StepTwo";  
import { Database, Json } from "@/lib/database.types";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { useLocale } from 'next-intl';


type PaymentMethod = "sinpe" | "paypal" | "transfer" | "card";
type Banco = {
    nombre: string;
    sms?: string;
    permiteSMS: boolean;
};

interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
}

// Removed unused Product and CartItem types

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

export default function CheckoutWizardPage() {
    const router = useRouter();
    const {
      cart,
      removeFromCart,
      clearCart
      // Removed unused cartSubtotal
    } = useCart();
    
    const supabase = createClientComponentClient<Database>();
    const typedSupabase: SupabaseClient<Database> = supabase;
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      // Limpieza
      return () => {
        listener?.subscription.unsubscribe();
      };
    }, [supabase]);

    const locale = useLocale();
    
    
    
    // Estado para la información de descuento
    const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  
    // SINPE
    const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
    const [ultimos4, setUltimos4] = useState("");
  
    const userId = session?.user?.id || 'guest-user';
    // Obtener el locale de la URL


    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    // Using _ prefix to indicate these state setters are needed but the values aren't directly used
    const [, setIsProcessing] = useState(false);
    const [, setOrderComplete] = useState(false);
    
    // Cargar información de descuento desde localStorage
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const discountInfoStr = localStorage.getItem('discountInfo');
        if (discountInfoStr) {
          try {
            const discountData: DiscountInfo = JSON.parse(discountInfoStr);
            setDiscountInfo(discountData);
            
            // Actualizar el orderData con la información del descuento
          } catch (e) {
            console.error('Error parsing discount info:', e);
          }
        }
      }
    }, []);
  
    // -------------- Steps --------------
    const goNext = () => setCurrentStep((s) => s + 1);
    const goBack = () => setCurrentStep((s) => s - 1);
  
    const validateStep1 = (address: ShippingAddress) => {
      setShippingAddress(address);
      goNext();
    };
  


    // -------------- createOrder() y resto --------------
    const createOrder = async (paymentMethodAux?: string): Promise<number | undefined> => {
      setIsProcessing(true);
      try {
        // Check if we have shipping address
        if (!shippingAddress) {
          alert('Se requiere dirección de envío');
          return;
        }
        
        // Verify user is logged in or use guest approach
        if (!userId) {
          alert('Error: No se pudo identificar al usuario. Por favor inicia sesión antes de continuar.');
          router.push('/login?redirect=checkout');
          return;
        }
        
        // Calculate total with discounts
        const subtotal = cart.reduce((acc, item) => {
          if (!item.product.colon_price) return acc;
          
          const price = item.product.colon_price;
          const discount = item.product.discount_percentage || 0;
          const finalPrice = price * (1 - (discount / 100));
          
          return acc + finalPrice * item.quantity;
        }, 0);
        
        // Shipping cost fijo en 3200
        const shipping = cart.length ? 3200 : 0;
        const totalAmount = subtotal + shipping;

        // Si hay un descuento, usar el total con descuento, de lo contrario calcular normalmente
        const total = discountInfo ? discountInfo.finalTotal : totalAmount;

        // Create order with shipping address and pending status
        const { data: orderInsert, error: orderError } = await typedSupabase
          .from("orders")
          .insert({
            user_id: userId === 'guest-user' ? null : (userId || null),
            payment_method: paymentMethodAux || paymentMethod || 'card',
            payment_status: "pending",
            shipping_status: "pending",
            total_amount: total,
            shipping_address: shippingAddress as unknown as Json,
            currency: "CRC",
            shipping_amount: 0,
            discount_amount: discountInfo ? discountInfo.discountAmount : 0,
            shipping_cost: 0,
            shipping_currency: "CRC",
            notes: discountInfo ? `Descuento aplicado: ${discountInfo.code} - Monto: ${discountInfo.discountAmount}` : "",
          })
          .select()
          .single();
    
        if (orderError || !orderInsert) {
          alert(`Error creando la orden en la BD: ${orderError?.message}`);
          setIsProcessing(false);
          return;
        }
    
        // Save orderId in state
        setCreatedOrderId(orderInsert.id);
        
        // Add order items
        for (const item of cart) {
          const { error: itemError } = await supabase
            .from("order_items")
            .insert({
              order_id: orderInsert.id,
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.colon_price || 0
            });
            
          if (itemError) {
            console.error("Error al crear elementos de orden:", itemError);
          }
        }
        
        // IMPORTANT: We don't clear the cart here anymore
        // This will be done after successful payment completion
        
        return orderInsert.id;
      } catch (error) {
        console.error("Error al procesar la orden:", error);
        alert("Error al procesar la orden. Inténtalo de nuevo.");
      } finally {
        setIsProcessing(false);
      }
    };
  
    const validateStep2 = async () => {
      if (!paymentMethod) {
        alert("Debes seleccionar un método de pago");
        return;
      }
      
      // Additional validations
      if (paymentMethod === "sinpe") {
        if (!bancoSeleccionado) {
          alert("Selecciona un banco para SINPE");
          return;
        }
        if (ultimos4.length !== 4) {
          alert("Faltan los últimos 4 dígitos del recibo");
          return;
        }
      }
      
      // Create the order
      const orderId = await createOrder();
      
      if (orderId) {
        // If the payment is SINPE, update the reference
        if (paymentMethod === "sinpe" && bancoSeleccionado) {
          const paymentReference = `4 ultimos digitos: ${ultimos4} - Banco: ${bancoSeleccionado.nombre}`;
          
          await supabase
            .from("orders")
            .update({ payment_reference: paymentReference })
            .eq("id", orderId);
            
          // For SINPE, we can clear the cart and redirect immediately
          // Clear cart items from cart_items table if logged in
          if (userId) {
            await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", userId);
          }
          
          // Set order as complete
          setOrderComplete(true);
          
          // Enviar correo de confirmación
          if (session?.user?.email && shippingAddress) {
            await fetch('/api/send-order-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                customerName: shippingAddress.name,
                shippingAddress: shippingAddress,
                items: cart,
                subtotal: cart.reduce((acc: number, item: CartItem) => acc + (item.product.colon_price || 0) * item.quantity, 0),
                shipping: 3200,
                total: discountInfo ? discountInfo.finalTotal : (cart.reduce((acc, item) => acc + (item.product.colon_price || 0) * item.quantity, 0) + 3200),
                paymentMethod: 'sinpe',
                discountInfo: discountInfo ? {
                  code: discountInfo.code,
                  discountAmount: discountInfo.discountAmount,
                  description: discountInfo.description
                } : null,
                userEmail: session.user.email
              })
            });
          }

          // Clear local cart
          clearCart();
          
          // Redirect to confirmation page
          router.push(`/order-confirmation?order_id=${orderId}`);
        }
        // For PayPal, we'll let the PayPalCardMethod component handle the redirect
        // after successful payment
      }
    };
  
    // Función para finalizar el pedido
    // Función para finalizar el pedido - se usará en una futura implementación
  // const _finalizeOrder = async () => {
  //     try {
  //       // Limpiar el carrito
  //       await clearCart();
        
  //       // Limpiar datos de localStorage
  //       if (typeof window !== 'undefined') {
  //         localStorage.removeItem('cartItems');
  //         localStorage.removeItem('checkoutData');
  //         localStorage.removeItem('discountInfo'); // Limpiar información de descuento
  //       }

  //       // Redirigir a la página de confirmación
  //       router.push(`/${locale}/order-confirmation?order_id=${createdOrderId}`);
  //     } catch (error) {
  //       console.error('Error in finalizeOrder:', error);
  //       alert('Error al finalizar el pedido');
  //     }
  //   };

    // -------------- Render principal --------------
    if (cart.length === 0) {
      return (
        <main className="w-full mx-auto px-6 py-14 flex flex-row gap-4">
          <button onClick={() => router.back()} className="bg-teal-600 p-2 rounded-md text-gray-800 hover:bg-teal-700 transition">
            &larr; Regresar
          </button>
          <h1 className="text-2xl font-bold mt-4 text-gray-900">Carrito vacío</h1>
        </main>
      );
    }
  
    return (
      <main className="w-full flex flex-col min-h-[67vh] py-2 px-4 md:px-12 lg:px-24">
        {/* Encabezado */}
        <header className="flex items-center gap-4 mb-6">
          {currentStep > 1 && currentStep <= 3 && (
            <button
              onClick={goBack}
              className="bg-teal-600 text-gray-800 p-1 rounded-md hover:bg-teal-700 transition "
            >
              &larr; Paso anterior
            </button>
          )}
          {currentStep === 1 && (
            <button
              onClick={() => router.back()}
              className="bg-teal-600 text-gray-800 p-1 rounded-md hover:bg-teal-700 transition "
            >
              &larr; Regresar
            </button>
          )}
          {currentStep >= 1 && currentStep <= 3 ? (
            <h1 className="text-base sm:text-2xl font-bold text-gray-900">{currentStep==1?"Información de entrega":currentStep==2?"Pago":currentStep==3?"Pago":"Confirmación"} (Paso {currentStep} de 3)</h1>
          ) : (
            <h1 className="text-base sm:text-2xl font-bold">¡Compra realizada con éxito!</h1>
          )}
        </header>
  
        {/* Steps */}
         {currentStep === 1 && (
          <StepOne
            cart={cart}
            onContinue={validateStep1}
            initialData={shippingAddress}
            locale={locale}
          />
        )}
        {
          currentStep === 2 && (
            <StepTwo
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              cart={cart}
              removeFromCart={removeFromCart}
              bancoSeleccionado={bancoSeleccionado}
              setBancoSeleccionado={setBancoSeleccionado}
              ultimos4={ultimos4}
              setUltimos4={setUltimos4}
              total={discountInfo ? discountInfo.finalTotal : (cart.reduce((acc, item) => acc + (item.product.colon_price ?? 0) * item.quantity, 0) + 3200)}
              onFinalize={validateStep2}
              createdOrderId={createdOrderId}
              createOrder={createOrder}
              locale={locale}
            />
          ) 
        }
        
        {/* El resumen del pedido ya se muestra en los componentes StepOne y StepTwo */}
      </main>
    );
  }


  