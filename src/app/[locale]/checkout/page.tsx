'use client'

import { useRouter } from 'next/navigation'
import { useCart, CartItem } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import StepOne from "@/components/checkout/StepOne";
import StepTwo from "@/components/checkout/StepTwo";  
import { Database, Json } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";
import {  Session } from '@supabase/supabase-js';
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
    
    // const supabase = createClientComponentClient<Database>(); // removed: now using central client
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      // Limpieza
      return () => {
        listener?.subscription.unsubscribe();
      };
    }, []);

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

        // Calculate subtotal in USD (using dolar_price for consistency)
        const subtotal = cart.reduce((acc, item) => {
          if (!item.product.dolar_price) return acc;

          const price = item.product.dolar_price;
          const discount = item.product.discount_percentage || 0;
          const finalPrice = price * (1 - (discount / 100));

          return acc + finalPrice * item.quantity;
        }, 0);

        // Shipping cost in USD ($7)
        const shipping = cart.length ? 7 : 0;
        const totalAmount = subtotal + shipping;

        // Si hay un descuento, usar el total con descuento, de lo contrario calcular normalmente
        const total = discountInfo ? discountInfo.finalTotal + shipping : totalAmount;

        // Preparar valores tipados para la inserción
        const dbUserId: string | null = userId === 'guest-user' ? null : userId ?? null;
        const shippingAddressJson: Json = {
          name: shippingAddress.name,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country,
          postal_code: shippingAddress.postal_code,
          phone: shippingAddress.phone,
        };

        const orderPayload: Database['public']['Tables']['orders']['Insert'] = {
          user_id: dbUserId,
          payment_method: (paymentMethodAux || paymentMethod || 'card'),
          payment_status: 'pending',
          shipping_status: 'pending',
          total_amount: total,
          shipping_address: shippingAddressJson,
          currency: 'USD',
          shipping_amount: shipping,
          discount_amount: discountInfo ? discountInfo.discountAmount : 0,
          shipping_cost: shipping,
          shipping_currency: 'USD',
          notes: discountInfo ? `Descuento aplicado: ${discountInfo.code} - Monto: $${discountInfo.discountAmount.toFixed(2)}` : '',
        };

        // Create order with shipping address and pending status
        const { data: orderInsert, error: orderError } = await supabase
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();
    
        if (orderError || !orderInsert) {
          alert(`Error creando la orden en la BD: ${orderError?.message}`);
          setIsProcessing(false);
          return;
        }
    
        // Save orderId in state
        setCreatedOrderId(orderInsert.id);
        
        // Add order items (using dolar_price for USD consistency)
        for (const item of cart) {
          const { error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: orderInsert.id,
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.dolar_price || 0,
            });

          if (itemError) {
            console.error('Error al crear elementos de orden:', itemError);
          }
        }
        
        // IMPORTANT: We don't clear the cart here anymore
        // This will be done after successful payment completion
        
        return orderInsert.id;
      } catch (error) {
        console.error('Error al procesar la orden:', error);
        alert('Error al procesar la orden. Inténtalo de nuevo.');
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
          
          // Enviar correo de confirmación (using USD amounts)
          if (session?.user?.email && shippingAddress) {
            const emailSubtotal = cart.reduce((acc: number, item: CartItem) => acc + (item.product.dolar_price || 0) * item.quantity, 0);
            const emailShipping = 7; // USD
            const emailTotal = discountInfo ? discountInfo.finalTotal + emailShipping : emailSubtotal + emailShipping;

            await fetch('/api/send-order-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                customerName: shippingAddress.name,
                shippingAddress: shippingAddress,
                items: cart,
                subtotal: emailSubtotal,
                shipping: emailShipping,
                total: emailTotal,
                currency: 'USD',
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
        <main className="w-full mx-auto px-6 py-14 flex flex-row gap-4 bg-gradient-to-b from-[#FAF8F5] to-white min-h-screen">
          <button onClick={() => router.back()} className="bg-gradient-to-r from-[#C9A962] to-[#A08848] p-2 px-4 rounded-lg text-[#1A1A1A] font-medium hover:from-[#D4C4A8] hover:to-[#C9A962] transition-all shadow-md">
            &larr; {locale === 'es' ? 'Regresar' : 'Go back'}
          </button>
          <h1 className="text-2xl font-bold mt-4 text-[#2D2D2D]">{locale === 'es' ? 'Carrito vacío' : 'Empty cart'}</h1>
        </main>
      );
    }

    return (
      <main className="w-full flex flex-col min-h-[67vh] py-4 px-4 md:px-12 lg:px-24 bg-gradient-to-b from-[#FAF8F5] to-white">
        {/* Encabezado */}
        <header className="flex items-center gap-4 mb-6">
          {currentStep > 1 && currentStep <= 3 && (
            <button
              onClick={goBack}
              className="bg-[#2D2D2D] text-[#F5F1EB] px-3 py-1.5 rounded-lg hover:bg-[#3A3A3A] transition-colors font-medium text-sm"
            >
              &larr; {locale === 'es' ? 'Paso anterior' : 'Previous step'}
            </button>
          )}
          {currentStep === 1 && (
            <button
              onClick={() => router.back()}
              className="bg-[#2D2D2D] text-[#F5F1EB] px-3 py-1.5 rounded-lg hover:bg-[#3A3A3A] transition-colors font-medium text-sm"
            >
              &larr; {locale === 'es' ? 'Regresar' : 'Go back'}
            </button>
          )}
          {currentStep >= 1 && currentStep <= 3 ? (
            <h1 className="text-base sm:text-2xl font-bold text-[#2D2D2D]">
              {currentStep === 1 ? (locale === 'es' ? 'Información de entrega' : 'Shipping information') : currentStep === 2 ? (locale === 'es' ? 'Pago' : 'Payment') : (locale === 'es' ? 'Pago' : 'Payment')}
              <span className="text-[#C9A962] ml-2">({locale === 'es' ? 'Paso' : 'Step'} {currentStep} {locale === 'es' ? 'de' : 'of'} 3)</span>
            </h1>
          ) : (
            <h1 className="text-base sm:text-2xl font-bold text-[#4A7C59]">{locale === 'es' ? '¡Compra realizada con éxito!' : 'Purchase completed successfully!'}</h1>
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
              total={
                discountInfo
                  ? discountInfo.finalTotal + 7 // finalTotal (USD) + shipping ($7)
                  : cart.reduce((acc, item) => acc + (item.product.dolar_price ?? 0) * item.quantity, 0) + 7
              }
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


  