'use client';

import { useState } from 'react';
import { Database, ProductSnapshot } from '@/types-db';
import Image from 'next/image';
import { ShoppingBag, Calendar, User, Mail, Phone, Calculator, CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
 

type InterestRequest = Database['interest_requests'] & {
  interest_request_items: (Database['interest_request_items'] & {
    product_snapshot: ProductSnapshot;
  })[];
};

interface QuotePaymentPageProps {
  quote: InterestRequest;
  locale: string;
}

const PAYPAL_CLIENT_ID: string =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID ?? 'sb'
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb';

export default function QuotePaymentPage({ quote, locale }: QuotePaymentPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: quote.requester_name,
    email: quote.email,
    phone: quote.phone,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Costa Rica'
  });
  const [showShippingForm, setShowShippingForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDiscountInfo = () => {
    if (!quote.discount_type || !quote.discount_value) return null;

    try {
      const discountValue = quote.discount_value;
      const originalTotal = quote.total_amount || 0;
      const finalTotal = quote.final_amount || originalTotal;
      const shippingCost = quote.shipping_cost || 0;
      
      // Para total_override, el descuento es la diferencia entre el total original y el final_amount sin shipping
      let discountAmount;
      if (quote.discount_type === 'total_override') {
        // final_amount ya incluye shipping, así que restamos shipping para obtener el precio base
        const finalAmountWithoutShipping = finalTotal - shippingCost;
        discountAmount = originalTotal - finalAmountWithoutShipping;
      } else {
        // Para otros tipos, el descuento es la diferencia directa
        discountAmount = originalTotal - finalTotal;
      }

      let discountText = '';
      switch (quote.discount_type) {
        case 'percentage':
          discountText = `${discountValue}% ${locale === 'es' ? 'descuento en el total' : 'discount on total'}`;
          break;
        case 'fixed_amount':
          discountText = `${formatCurrency(discountValue)} ${locale === 'es' ? 'descuento fijo en el total' : 'fixed discount on total'}`;
          break;
        case 'total_override':
          discountText = locale === 'es' ? 'Precio especial' : 'Special price';
          break;
        default:
          discountText = locale === 'es' ? 'Descuento aplicado' : 'Discount applied';
      }

      return {
        text: discountText,
        amount: discountAmount
      };
    } catch (error) {
      console.error('Error parsing discount data:', error);
      return null;
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentCompleted(true);
    toast.success(locale === 'es' ? 'Pago completado exitosamente' : 'Payment completed successfully');
    
    // Enviar correo de confirmación
    try {
      await fetch('/api/send-quote-payment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: quote.id,
          shippingInfo
        })
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const discountInfo = getDiscountInfo();

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-gray-800">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'es' ? '¡Pago Exitoso!' : 'Payment Successful!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'es' 
              ? 'Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación pronto.'
              : 'Your payment has been processed successfully. You will receive a confirmation email soon.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3 text-gray-800">
      <div className="max-w-6xl mx-auto px-2">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-green-600" />
                {locale === 'es' ? 'Tu Cotización Personalizada' : 'Your Custom Quote'}
              </h1>
              <p className="text-gray-600 mt-1">
                {quote.status === 'closed_won' 
                  ? (locale === 'es' ? 'Esta cotización ya ha sido vendida' : 'This quote has already been sold')
                  : (locale === 'es' ? 'Revisa los detalles y procede con el pago' : 'Review details and proceed with payment')
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {locale === 'es' ? 'Fecha de cotización' : 'Quote date'}
              </p>
              <p className="font-medium">
                {new Date(quote.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Información del cliente */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-800" />
                {locale === 'es' ? 'Información del Cliente' : 'Customer Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-600" />
                  <span>{quote.requester_name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-600" />
                  <span>{quote.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-600" />
                  <span>{quote.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                  <span>{new Date(quote.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}</span>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="bg-white rounded-lg shadow-sm p-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {locale === 'es' ? 'Productos Incluidos' : 'Included Products'}
              </h2>
              <div className="space-y-4">
                {quote.interest_request_items.map((item) => {
                  const itemTotal = (item.product_snapshot.dolar_price || 0) * item.quantity;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.product_snapshot.image_url && item.product_snapshot.image_url != null ? (
                          <div className="w-14 h-14 relative rounded-md overflow-hidden">
                            <Image
                              src={item.product_snapshot.image_url || '/placeholder-image.jpg'}
                              alt={item.product_snapshot.name || 'Product'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{item.product_snapshot.name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.product_snapshot.dolar_price || 0)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(itemTotal)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumen y pago */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sticky top-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-gray-600" />
                {locale === 'es' ? 'Resumen de Cotización' : 'Quote Summary'}
              </h2>
              
              <div className="space-y-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span>{locale === 'es' ? 'Subtotal' : 'Subtotal'}</span>
                  <span>{formatCurrency(quote.total_amount || 0)}</span>
                </div>
                
                {discountInfo && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{discountInfo.text}</span>
                    <span>-{formatCurrency(discountInfo.amount)}</span>
                  </div>
                )}
                
                {(quote.shipping_cost || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{locale === 'es' ? 'Envío' : 'Shipping'}</span>
                    <span>{formatCurrency(quote.shipping_cost || 0)}</span>
                  </div>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>{locale === 'es' ? 'Total' : 'Total'}</span>
                  <span>{formatCurrency(quote.final_amount || quote.total_amount || 0)}</span>
                </div>
              </div>

              {quote.status === 'closed_won' ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                  <p className="text-green-800 font-medium">
                    {locale === 'es' ? '✓ Cotización Vendida' : '✓ Quote Sold'}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    {locale === 'es' ? 'Esta cotización ya ha sido procesada y vendida.' : 'This quote has already been processed and sold.'}
                  </p>
                </div>
              ) : !showShippingForm ? (
                <button
                  onClick={() => setShowShippingForm(true)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  {locale === 'es' ? 'Proceder al Pago' : 'Proceed to Payment'}
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-gray-900 font-semibold">
                    {locale === 'es' ? 'Información de Envío' : 'Shipping Information'}
                  </h3>
                  
                  <div className="space-y-2 text-gray-800 ">
                    <input
                      type="text"
                      placeholder={locale === 'es' ? 'Dirección' : 'Address'}
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={locale === 'es' ? 'Ciudad' : 'City'}
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="px-3 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder={locale === 'es' ? 'Provincia' : 'State'}
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        className="px-3 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder={locale === 'es' ? 'Código Postal' : 'Zip Code'}
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {shippingInfo.address && shippingInfo.city && shippingInfo.state && (
                    <div className="mt-6">
                      <PayPalScriptProvider
                        options={{
                          clientId: PAYPAL_CLIENT_ID,
                          enableFunding: "paylater,venmo",
                          dataSdkIntegrationSource: "integrationbuilder_sc",
                          environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
                        }}
                      >
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          disabled={loading}
                          createOrder={async () => {
                            setLoading(true);
                            try {
                              const res = await fetch("/api/paypal/create-quote-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                  quoteId: quote.id,
                                  shippingInfo 
                                })
                              });
                              const data = await res.json();
                              
                              if (data.error) {
                                toast.error(data.error);
                                throw new Error(data.error);
                              }
                              
                              return data.paypalOrderId;
                            } catch (error) {
                              console.error('Error creating PayPal order:', error);
                              throw error;
                            } finally {
                              setLoading(false);
                            }
                          }}
                          onApprove={async (data) => {
                            setLoading(true);
                            try {
                              const res = await fetch("/api/paypal/capture-quote-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  paypalOrderId: data.orderID,
                                  quoteId: quote.id,
                                  shippingInfo
                                })
                              });
                              const result = await res.json();
                              
                              if (result.status === "COMPLETED") {
                                await handlePaymentSuccess();
                              } else {
                                toast.error(locale === 'es' ? 'Error al procesar el pago' : 'Error processing payment');
                              }
                            } catch (error) {
                              console.error('Error capturing payment:', error);
                              toast.error(locale === 'es' ? 'Error al procesar el pago' : 'Error processing payment');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          onError={(err) => {
                            console.error("PayPal Error:", err);
                            toast.error(locale === 'es' ? 'Error con PayPal' : 'PayPal error');
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}