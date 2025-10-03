"use client";
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { useCart, CartItem } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { useLocale } from 'next-intl';

// TEMPORAL: Usando sandbox en producción debido a cuenta restringida
// TODO: Revertir cuando se resuelva el problema con PayPal Live
const PAYPAL_CLIENT_ID: string =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SB ?? 'sb' // Usando sandbox temporalmente
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb';

if(PAYPAL_CLIENT_ID === 'sb') {
    console.error('PayPal client ID not found');
    
}

interface PayPalCardMethodProps {
    createdOrderId: number;
    onPaymentSuccess: () => void;
    onPaymentError: (msg: string) => void;
}

export default function PayPalCardMethod({
    createdOrderId,
    onPaymentSuccess,
    onPaymentError,
}: PayPalCardMethodProps) {
    const [loading, setLoading] = useState(false);
    // Estado para controlar la pantalla de carga durante la redirección
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const locale = useLocale();

     const [session, setSession] = useState<Session | null>(null);
    const userId = session?.user?.id || 'guest-user';

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
        // Limpieza
        return () => {
          listener?.subscription.unsubscribe();
        };
      }, [supabase]);

    // Tasa de conversión fija de PayPal
    useEffect(() => {
        console.log("PayPal client ID: ", PAYPAL_CLIENT_ID);
    }, []);

    // Efecto para prevenir la navegación mientras se está redirigiendo
    useEffect(() => {
        if (redirecting) {
            // Crear un elemento de pantalla completa para bloquear la interfaz
            const blockingDiv = document.createElement('div');
            blockingDiv.id = 'payment-processing-overlay';
            blockingDiv.style.position = 'fixed';
            blockingDiv.style.top = '0';
            blockingDiv.style.left = '0';
            blockingDiv.style.width = '100%';
            blockingDiv.style.height = '100%';
            blockingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            blockingDiv.style.zIndex = '9999';
            blockingDiv.style.display = 'flex';
            blockingDiv.style.flexDirection = 'column';
            blockingDiv.style.alignItems = 'center';
            blockingDiv.style.justifyContent = 'center';
            
            // Contenido del overlay
            blockingDiv.innerHTML = `
                <div style="text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
                            <path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
                            <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: #4B5563; margin-bottom: 0.5rem;">Procesando su pago</h3>
                    <p style="color: #6B7280;">${locale == "es" ? "Por favor espere mientras completamos su compra..." : "Please wait while we complete your purchase..."}</p>
                </div>
            `;
            
            document.body.appendChild(blockingDiv);
            
            return () => {
                // Limpiar el overlay cuando el componente se desmonte
                if (document.body.contains(blockingDiv)) {
                    document.body.removeChild(blockingDiv);
                }
            };
        }
    }, [redirecting]);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="mb-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p>Nota: {locale == "es" ? "Paypal aplica una tasa de conversión de 1 CRC = 0.0019128 USD" : "Paypal applies a conversion rate of 1 CRC = 0.0019128 USD"}</p>
                <p className="text-center mt-1 text-xs">{locale == "es" ? "Podrás elegir pagar en CRC o USD" : "You can choose to pay in CRC or USD"}</p>
            </div>

            {loading && !redirecting && (
                <div className="flex items-center justify-center py-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <p>{locale == "es" ? "Procesando..." : "Processing..."}</p>
                </div>
            )}
            <div className="App">
                <PayPalScriptProvider
                options={{
                    clientId: PAYPAL_CLIENT_ID,
                    enableFunding: "paylater,venmo",
                    dataSdkIntegrationSource: "integrationbuilder_sc",
                    environment: process.env.NODE_ENV.toString() === 'production'.toString() ? 'production' : 'sandbox',
                    
                }}

                   
                >
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={async () => {
                            // Llamar a tu API para crear la orden en PayPal
                            setLoading(true);
                            const res = await fetch("/api/paypal/create-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderId: createdOrderId })
                            });
                            const data = await res.json();
                            setLoading(false);

                            if (data.error) {
                                onPaymentError(data.error);
                                throw new Error(data.error);
                            }
                            return data.paypalOrderId; // Devuelves el ID de la orden generada en PayPal
                        }}
                        onApprove={async (data) => {
                            // PayPal devolvió: data.orderID
                            const paypalOrderId = data.orderID;
                            setLoading(true);

                            // Capturar la orden en PayPal
                            const res = await fetch("/api/paypal/capture-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    paypalOrderId: paypalOrderId,
                                    orderId: createdOrderId
                                })
                            });
                            const result = await res.json();
                            setLoading(false);

                            if (result.status === "COMPLETED") {
                                // Clear cart items from cart_items table if logged in
                                if (userId && userId !== 'guest-user') {
                                    try {
                                        await supabase
                                            .from("cart_items")
                                            .delete()
                                            .eq("user_id", userId);
                                    } catch (error) {
                                        console.error("Error clearing cart items from database:", error);
                                    }
                                }

                                // Activar pantalla de carga para la redirección
                                setRedirecting(true);
                                
                                // Clear local cart
                                clearCart();

                                // Call the success callback
                                // Obtener detalles de la orden para el correo
                                const { data: orderDetails } = await supabase
                                    .from('orders')
                                    .select('*, order_items(*)')
                                    .eq('id', createdOrderId)
                                    .single();

                                // Type guard para shipping_address Json
                                const isAddressObj = (addr: unknown): addr is { name?: string } => {
                                    return !!addr && typeof addr === 'object' && !Array.isArray(addr);
                                };

                                const shippingAddress = orderDetails?.shipping_address ?? null;
                                const customerName = isAddressObj(shippingAddress) && typeof shippingAddress.name === 'string'
                                  ? shippingAddress.name
                                  : (session?.user?.email ?? '');

                                if (orderDetails && session?.user?.email) {
                                    // Enviar correo de confirmación a través de la API
                                    await fetch('/api/send-order-email', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            orderId: createdOrderId,
                                            customerName,
                                            shippingAddress,
                                            items: cart,
                                            subtotal: cart.reduce((acc: number, item: CartItem) => acc + (item.product.dolar_price || 0) * item.quantity, 0),
                                            shipping: 7,
                                            total: orderDetails.total_amount,
                                            paymentMethod: 'paypal',
                                            discountInfo: null,
                                            userEmail: session.user.email
                                        })
                                    });
                                }

                                // Limpiar localStorage
                                localStorage.removeItem('cartItems');
                                localStorage.removeItem('checkoutData');
                                localStorage.removeItem('discountInfo');

                                // Notificar éxito y redirigir
                                onPaymentSuccess();

                                // Pequeño retraso para asegurar que el overlay esté visible
                                setTimeout(() => {
                                    // Redirigir a la página de confirmación
                                    router.push(`/order-confirmation?order_id=${createdOrderId}`);
                                }, 500);
                            } else {
                                onPaymentError(locale == "es" ? "La transacción no pudo completarse." : "The transaction could not be completed.");
                            }
                        }}
                        onCancel={async () => {

                            console.log("PayPal Order Canceled");

                        }}
                        onError={(err) => {
                            console.error("PayPal Error:", err);
                            onPaymentError(locale == "es" ? "Ocurrió un error con PayPal." : "An error occurred with PayPal.");
                        }}
                    />
                </PayPalScriptProvider>
            </div>


        </div>
    );
}