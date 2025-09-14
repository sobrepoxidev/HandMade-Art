'use client';

import { useState } from 'react';
import { Database, ProductSnapshot } from '@/types-db';
import Image from 'next/image';
import { ShoppingBag, Calendar, User, Mail, Phone, Calculator } from 'lucide-react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import DirectPayPalButton from './DirectPayPalButton';
import PaymentSuccessMessage from './PaymentSuccessMessage';
import { formatUSD } from '@/lib/formatCurrency';

// interface PaymentDetails {
//   id: string;
//   status: string;
//   payer?: {
//     name?: {
//       given_name?: string;
//       surname?: string;
//     };
//     email_address?: string;
//   };
// }

type InterestRequest = Database['interest_requests'] & {
  interest_request_items: (Database['interest_request_items'] & {
    product_snapshot: ProductSnapshot;
  })[];
};

interface DirectQuotePaymentPageProps {
  quote: InterestRequest;
  locale: string;
}

const PAYPAL_CLIENT_ID: string =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID ?? 'sb'
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb';

export default function DirectQuotePaymentPage({ quote, locale }: DirectQuotePaymentPageProps) {
  const [paymentCompleted, setPaymentCompleted] = useState(false);



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
        discountAmount = originalTotal - (finalTotal - shippingCost);
      }

      let discountText = '';
      switch (quote.discount_type) {
        case 'percentage':
          discountText = `${discountValue}% ${locale === 'es' ? 'descuento en el total' : 'discount on total'}`;
          break;
        case 'fixed_amount':
          discountText = `${formatUSD(discountValue)} ${locale === 'es' ? 'descuento fijo en el total' : 'fixed discount on total'}`;
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

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    toast.success(locale === 'es' ? 'Pago completado exitosamente' : 'Payment completed successfully');
  };

  const discountInfo = getDiscountInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-3 text-gray-800">
      <div className="max-w-6xl mx-auto px-2">
        {paymentCompleted ? (
          <div className="bg-white rounded-lg shadow-sm p-6 my-8">
            <PaymentSuccessMessage
              locale={locale}
              orderId={String(quote.id)}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center">
                    <ShoppingBag className="w-6 h-6 mr-2 text-green-600" />
                    {locale === 'es' ? 'Tu Cotización Personalizada' : 'Your Custom Quote'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {locale === 'es' ? 'Revisa los detalles y procede con el pago' : 'Review details and proceed with payment'}
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
                <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {locale === 'es' ? 'Productos Seleccionados' : 'Selected Products'}
                  </h2>
                  <div className="space-y-3">
                    {quote.interest_request_items.map((item) => {
                      const product = item.product_snapshot;
                      return (
                        <div key={item.id} className="flex items-center border-b pb-3">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name || ''}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex justify-between mt-1">
                              <div className="text-sm text-gray-600">
                                {formatUSD(item.unit_price_usd || 0)} x {item.quantity}
                              </div>
                              <div className="font-medium">
                                {formatUSD((item.unit_price_usd || 0) * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notas del gestor */}
                {quote.manager_notes && (
                  <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'es' ? 'Notas del Gestor' : 'Manager Notes'}
                    </h2>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-700">
                      {quote.manager_notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Resumen y pago */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-3 mb-2 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-gray-800" />
                    {locale === 'es' ? 'Resumen de Pago' : 'Payment Summary'}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {locale === 'es' ? 'Subtotal:' : 'Subtotal:'}
                      </span>
                      <span>{formatUSD(quote.total_amount || 0)}</span>
                    </div>

                    {discountInfo && (
                      <div className="flex justify-between text-red-600">
                        <span>{locale === 'es' ? 'Descuento:' : 'Discount:'}</span>
                        <span>-{formatUSD(discountInfo.amount)}</span>
                      </div>
                    )}

                    {(quote.shipping_cost || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'es' ? 'Envío:' : 'Shipping:'}
                        </span>
                        <span>{formatUSD(quote.shipping_cost || 0)}</span>
                      </div>
                    )}

                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>{locale === 'es' ? 'Total:' : 'Total:'}</span>
                        <span className="text-green-600">{formatUSD(quote.final_amount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de PayPal */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">
                      {locale === 'es' ? 'Realizar Pago' : 'Make Payment'}
                    </h3>
                    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                      <DirectPayPalButton
                        quoteId={String(quote.id)}
                        amount={quote.final_amount || 0}
                        onSuccess={handlePaymentSuccess}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}