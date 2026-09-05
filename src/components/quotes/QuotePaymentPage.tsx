'use client';

import { useState } from 'react';
import { Database, ProductSnapshot } from '@/lib/database.types';
import Image from 'next/image';
import { ShoppingBag, Calendar, User, Mail, Phone, Calculator, CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
 

type InterestRequest = Database['public']['Tables']['interest_requests']['Row'] & {
  interest_request_items: (Database['public']['Tables']['interest_request_items']['Row'] & {
    product_snapshot: ProductSnapshot;
  })[];
};

interface QuotePaymentPageProps {
  quote: InterestRequest;
  locale: string;
}

type Banco = {
  nombre: string;
  sms?: string;
  permiteSMS: boolean;
};

// SINPE Móvil bank list (canonical — PaymentForm that used to host this is gone).
const bancos: Banco[] = [
  { nombre: 'Banco Nacional de Costa Rica (BNCR)', sms: '+2627', permiteSMS: true },
  { nombre: 'Banco de Costa Rica (BCR)', sms: '+2276 (Solo Kolbi)', permiteSMS: true },
  { nombre: 'BAC Credomatic', sms: '+7070-1222', permiteSMS: true },
  { nombre: 'Banco Popular', permiteSMS: false },
  { nombre: 'Davivienda', sms: '+7070 o +7474', permiteSMS: true },
  { nombre: 'Scotiabank', permiteSMS: false },
  { nombre: 'Banco Promerica', sms: '+6223 o +2450', permiteSMS: true },
  { nombre: 'Banco Lafise', sms: '+9091', permiteSMS: true },
];

const SINPE_NUMBER = '85850000';
const SINPE_RECIPIENT_ALIAS = 'HM-ART';

// TEMPORAL: Usando sandbox en producción debido a cuenta restringida
// TODO: Revertir cuando se resuelva el problema con PayPal Live
const PAYPAL_CLIENT_ID: string =
  process.env.NEXT_PUBLIC_PAYPAL_ENV === 'live'
    ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb'
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb';
const PAYPAL_ENVIRONMENT = process.env.NEXT_PUBLIC_PAYPAL_ENV === 'live' ? 'production' : 'sandbox';

export default function QuotePaymentPage({ quote, locale }: QuotePaymentPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<{ orderId: number; checkoutToken: string; method: 'paypal' | 'sinpe' } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'sinpe'>('paypal');
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
  const [ultimos4, setUltimos4] = useState('');
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

  const handlePaymentSuccess = async (orderId: number, checkoutToken: string) => {
    setPaymentCompleted(true);
    toast.success(locale === 'es' ? 'Pago completado exitosamente' : 'Payment completed successfully');
    router.push(`/${locale}/order-confirmation?order_id=${orderId}&token=${encodeURIComponent(checkoutToken)}`);
  };

  const createQuoteCheckoutOrder = async (method: 'paypal' | 'sinpe' = 'paypal') => {
    if (checkoutOrder && checkoutOrder.method === method) return checkoutOrder;
    if (checkoutOrder && checkoutOrder.method !== method) {
      // Method changed; drop stale order so backend creates one for the new method.
      setCheckoutOrder(null);
    }

    const response = await fetch(`/api/checkout/quotes/${quote.id}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteSlug: quote.quote_slug ?? '',
        paymentMethod: method,
        shippingAddress: {
          name: shippingInfo.name || quote.requester_name,
          address: shippingInfo.address || 'No shipping address required',
          city: shippingInfo.city || 'N/A',
          state: shippingInfo.state || 'N/A',
          country: shippingInfo.country || 'Costa Rica',
          postal_code: shippingInfo.zipCode || '',
          phone: shippingInfo.phone || quote.phone || '',
        },
      }),
    });
    const data = await response.json() as { orderId?: number; checkoutToken?: string; error?: string };
    if (!response.ok || !data.orderId || !data.checkoutToken) {
      throw new Error(data.error || 'Could not create quote checkout order');
    }

    const order = { orderId: data.orderId, checkoutToken: data.checkoutToken, method };
    setCheckoutOrder(order);
    return order;
  };

  const handleMethodChange = (method: 'paypal' | 'sinpe') => {
    if (method === paymentMethod) return;
    setPaymentMethod(method);
    setCheckoutOrder(null);
    setBancoSeleccionado(null);
    setUltimos4('');
  };

  const handleSinpePayment = async () => {
    if (!bancoSeleccionado) {
      toast.error(locale === 'es' ? 'Selecciona un banco para SINPE.' : 'Pick a SINPE bank.');
      return;
    }
    if (!/^\d{4}$/.test(ultimos4)) {
      toast.error(
        locale === 'es'
          ? 'Ingresa los últimos 4 dígitos del recibo.'
          : 'Enter the last 4 digits of the receipt.'
      );
      return;
    }

    setLoading(true);
    try {
      const order = await createQuoteCheckoutOrder('sinpe');
      const res = await fetch(
        `/api/checkout/orders/${order.orderId}/sinpe/reference`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkoutToken: order.checkoutToken,
            bankName: bancoSeleccionado.nombre,
            receiptLast4: ultimos4,
          }),
        }
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Could not save SINPE reference');
      }
      toast.success(
        locale === 'es'
          ? 'Recibimos tu referencia. Te confirmaremos tras verificar el pago.'
          : 'We received your reference. We will confirm after verifying the payment.'
      );
      await handlePaymentSuccess(order.orderId, order.checkoutToken);
    } catch (error) {
      console.error('Error submitting SINPE reference:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : locale === 'es'
          ? 'Error al registrar la referencia SINPE.'
          : 'Could not save the SINPE reference.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copySinpeSmsMessage = () => {
    if (!bancoSeleccionado?.permiteSMS) return;
    const total =
      Number(quote.final_amount ?? quote.total_amount ?? 0) || 0;
    const mensaje = `PASE ${total.toFixed(2)} ${SINPE_NUMBER} ${SINPE_RECIPIENT_ALIAS}`;
    navigator.clipboard.writeText(mensaje).catch(() => {});
    toast.success(
      locale === 'es' ? 'Mensaje SINPE copiado al portapapeles' : 'SINPE message copied'
    );
  };

  const discountInfo = getDiscountInfo();

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-[#161210] flex items-center justify-center p-4 text-[#F1E7D6]">
        <div className="bg-[#1E1813] border border-[#3A2E24] rounded-sm shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#3C9A70]/12 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-[#3C9A70]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#F1E7D6] mb-2">
            {locale === 'es' ? '¡Pago Exitoso!' : 'Payment Successful!'}
          </h2>
          <p className="text-[#C9BBA5] mb-6">
            {locale === 'es'
              ? 'Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación pronto.'
              : 'Your payment has been processed successfully. You will receive a confirmation email soon.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full min-h-[50px] bg-[#E0A83A] text-[#161210] py-2 px-4 rounded-sm font-bold hover:bg-[#F3C56B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C56B]"
          >
            {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161210] py-3 text-[#F1E7D6]">
      <div className="max-w-6xl mx-auto px-2">
        {/* Header */}
        <div className="bg-[#1E1813] border border-[#3A2E24] rounded-sm shadow-sm p-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-[#F1E7D6] flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-[#E0A83A]" />
                {locale === 'es' ? 'Tu Cotización Personalizada' : 'Your Custom Quote'}
              </h1>
              <p className="text-[#C9BBA5] mt-1">
                {quote.status === 'closed_won'
                  ? (locale === 'es' ? 'Esta cotización ya ha sido vendida' : 'This quote has already been sold')
                  : (locale === 'es' ? 'Revisa los detalles y procede con el pago' : 'Review details and proceed with payment')
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#8C7F6E]">
                {locale === 'es' ? 'Fecha de cotización' : 'Quote date'}
              </p>
              <p className="font-medium text-[#F1E7D6]">
                {new Date(quote.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Información del cliente */}
          <div className="lg:col-span-2">
            <div className="bg-[#1E1813] border border-[#3A2E24] rounded-sm shadow-sm p-3 mb-2">
              <h2 className="font-display text-lg font-semibold text-[#F1E7D6] mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#E0A83A]" />
                {locale === 'es' ? 'Información del Cliente' : 'Customer Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-[#8C7F6E]" />
                  <span>{quote.requester_name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-[#8C7F6E]" />
                  <span>{quote.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-[#8C7F6E]" />
                  <span>{quote.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#8C7F6E]" />
                  <span>{new Date(quote.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}</span>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="bg-[#1E1813] border border-[#3A2E24] rounded-sm shadow-sm p-2">
              <h2 className="font-display text-lg font-semibold text-[#F1E7D6] mb-3">
                {locale === 'es' ? 'Productos Incluidos' : 'Included Products'}
              </h2>
              <div className="space-y-4">
                {quote.interest_request_items.map((item) => {
                  const unitPrice = item.unit_price_usd || item.product_snapshot.dolar_price || 0;
                  const itemTotal = unitPrice * item.quantity;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-[#3A2E24] rounded-sm">
                      <div className="flex items-center space-x-4">
                        {item.product_snapshot.image_url && item.product_snapshot.image_url != null ? (
                          <div className="w-14 h-14 relative rounded-sm overflow-hidden bg-[#F1E7D6]">
                            <Image
                              src={item.product_snapshot.image_url || '/placeholder-image.jpg'}
                              alt={item.product_snapshot.name || 'Product'}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-[#0F0C0A] border border-[#3A2E24] rounded-sm flex items-center justify-center">
                            <span className="text-[#8C7F6E] text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-[#F1E7D6]">{item.product_snapshot.name}</h3>
                          <p className="text-sm text-[#C9BBA5]">
                            {formatCurrency(unitPrice)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#F1E7D6]">{formatCurrency(itemTotal)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumen y pago */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E1813] border border-[#3A2E24] rounded-sm shadow-sm p-3 sticky top-3">
              <h2 className="font-display text-lg font-semibold text-[#F1E7D6] mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-[#E0A83A]" />
                {locale === 'es' ? 'Resumen de Cotización' : 'Quote Summary'}
              </h2>

              <div className="space-y-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span>{locale === 'es' ? 'Subtotal' : 'Subtotal'}</span>
                  <span>{formatCurrency(quote.total_amount || 0)}</span>
                </div>

                {discountInfo && (
                  <div className="flex justify-between text-sm text-[#3C9A70]">
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

                <hr className="border-[#2A2119]" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{locale === 'es' ? 'Total' : 'Total'}</span>
                  <span>{formatCurrency(quote.final_amount || quote.total_amount || 0)}</span>
                </div>
              </div>

              {quote.status === 'closed_won' ? (
                <div className="bg-[#3C9A70]/10 border border-[#3C9A70]/30 rounded-sm p-4 text-center">
                  <p className="text-[#3C9A70] font-medium">
                    {locale === 'es' ? '✓ Cotización Vendida' : '✓ Quote Sold'}
                  </p>
                  <p className="text-[#3C9A70] text-sm mt-1">
                    {locale === 'es' ? 'Esta cotización ya ha sido procesada y vendida.' : 'This quote has already been processed and sold.'}
                  </p>
                </div>
              ) : !showShippingForm ? (
                <button
                  onClick={() => {
                    if (quote.requires_shipping_address) {
                      setShowShippingForm(true);
                    } else {
                      // Si no se requiere dirección, mostrar directamente el botón de PayPal
                      setShowShippingForm(true);
                    }
                  }}
                  className="w-full min-h-[50px] bg-[#E0A83A] text-[#161210] py-3 px-4 rounded-sm hover:bg-[#F3C56B] transition-colors font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C56B]"
                >
                  {quote.requires_shipping_address
                    ? (locale === 'es' ? 'Ingresar Dirección de Envío' : 'Enter Shipping Address')
                    : (locale === 'es' ? 'Proceder al Pago' : 'Proceed to Payment')
                  }
                </button>
              ) : (
                <div className="space-y-4">
                  {quote.requires_shipping_address && (
                    <>
                      <h3 className="font-display text-[#F1E7D6] font-semibold">
                        {locale === 'es' ? 'Información de Envío' : 'Shipping Information'}
                      </h3>

                      <div className="space-y-2 text-[#F1E7D6]">
                        <input
                          type="text"
                          placeholder={locale === 'es' ? 'Dirección' : 'Address'}
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] placeholder:text-[#8C7F6E] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E0A83A]/25 focus:border-[#E0A83A]"
                          required
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder={locale === 'es' ? 'Ciudad' : 'City'}
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                            className="px-3 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] placeholder:text-[#8C7F6E] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E0A83A]/25 focus:border-[#E0A83A]"
                            required
                          />
                          <input
                            type="text"
                            placeholder={locale === 'es' ? 'Provincia' : 'State'}
                            value={shippingInfo.state}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                            className="px-3 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] placeholder:text-[#8C7F6E] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E0A83A]/25 focus:border-[#E0A83A]"
                            required
                          />
                        </div>

                        <input
                          type="text"
                          placeholder={locale === 'es' ? 'Código Postal' : 'Zip Code'}
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="w-full px-3 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] placeholder:text-[#8C7F6E] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E0A83A]/25 focus:border-[#E0A83A]"
                        />
                      </div>
                    </>
                  )}

                  {(!quote.requires_shipping_address || (shippingInfo.address && shippingInfo.city && shippingInfo.state)) && (
                    <div className="mt-6">
                      <h3 className="font-display text-[#F1E7D6] font-semibold mb-2">
                        {locale === 'es' ? 'Método de pago' : 'Payment method'}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => handleMethodChange('paypal')}
                          aria-pressed={paymentMethod === 'paypal'}
                          className={`min-h-[44px] rounded-sm border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A83A] ${
                            paymentMethod === 'paypal'
                              ? 'bg-[#E0A83A] text-[#161210] border-[#E0A83A]'
                              : 'bg-[#1E1813] text-[#C9BBA5] border-[#3A2E24] hover:border-[#E0A83A]'
                          }`}
                        >
                          {locale === 'es' ? 'PayPal / Tarjeta' : 'PayPal / Card'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMethodChange('sinpe')}
                          aria-pressed={paymentMethod === 'sinpe'}
                          className={`min-h-[44px] rounded-sm border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A83A] ${
                            paymentMethod === 'sinpe'
                              ? 'bg-[#E0A83A] text-[#161210] border-[#E0A83A]'
                              : 'bg-[#1E1813] text-[#C9BBA5] border-[#3A2E24] hover:border-[#E0A83A]'
                          }`}
                        >
                          {locale === 'es' ? 'SINPE Móvil' : 'SINPE Mobile'}
                        </button>
                      </div>

                      {paymentMethod === 'paypal' ? (
                        <PayPalScriptProvider
                          options={{
                            clientId: PAYPAL_CLIENT_ID,
                            currency: 'USD',
                            enableFunding: 'paylater,venmo',
                            dataSdkIntegrationSource: 'integrationbuilder_sc',
                            environment: PAYPAL_ENVIRONMENT,
                          }}
                        >
                          <PayPalButtons
                            style={{ layout: 'vertical' }}
                            disabled={loading}
                            createOrder={async () => {
                              setLoading(true);
                              try {
                                const order = await createQuoteCheckoutOrder('paypal');
                                const res = await fetch(`/api/checkout/orders/${order.orderId}/paypal/create?token=${encodeURIComponent(order.checkoutToken)}`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
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
                                const order = await createQuoteCheckoutOrder('paypal');
                                const res = await fetch(`/api/checkout/orders/${order.orderId}/paypal/capture`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    paypalOrderId: data.orderID,
                                    checkoutToken: order.checkoutToken,
                                  })
                                });
                                const result = await res.json();

                                if (result.status === 'COMPLETED') {
                                  await handlePaymentSuccess(order.orderId, order.checkoutToken);
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
                              console.error('PayPal Error:', err);
                              toast.error(locale === 'es' ? 'Error con PayPal' : 'PayPal error');
                            }}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <div className="bg-[#161210] border border-[#3A2E24] rounded-sm p-4 space-y-3">
                          <p className="text-sm text-[#C9BBA5]">
                            {locale === 'es'
                              ? 'Total a enviar vía SINPE:'
                              : 'Total to send via SINPE:'}{' '}
                            <b className="text-[#3C9A70]">
                              ${(Number(quote.final_amount ?? quote.total_amount ?? 0) || 0).toFixed(2)} USD
                            </b>
                          </p>

                          <label className="block text-sm font-medium text-[#F1E7D6]">
                            {locale === 'es' ? 'Selecciona banco' : 'Select bank'}
                          </label>
                          <select
                            value={bancoSeleccionado?.nombre || ''}
                            onChange={(e) =>
                              setBancoSeleccionado(bancos.find((b) => b.nombre === e.target.value) || null)
                            }
                            className="w-full px-3 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E0A83A]/25 focus:border-[#E0A83A]"
                          >
                            <option value="">
                              -- {locale === 'es' ? 'Selecciona banco' : 'Select bank'} --
                            </option>
                            {bancos.map((b) => (
                              <option key={b.nombre} value={b.nombre}>
                                {b.nombre}
                              </option>
                            ))}
                          </select>

                          {bancoSeleccionado && (
                            <div className="p-3 border border-[#E0A83A]/30 bg-[#E0A83A]/10 rounded-sm text-sm text-[#C9BBA5]">
                              {bancoSeleccionado.permiteSMS ? (
                                <div className="space-y-1">
                                  <p>
                                    {locale === 'es' ? 'Enviar SMS a:' : 'Send SMS to:'}{' '}
                                    <b className="text-[#F1E7D6]">{bancoSeleccionado.sms}</b>
                                  </p>
                                  <p>
                                    {locale === 'es' ? 'Mensaje:' : 'Message:'}{' '}
                                    <b className="text-[#F1E7D6]">
                                      PASE {(Number(quote.final_amount ?? quote.total_amount ?? 0) || 0).toFixed(2)}{' '}
                                      {SINPE_NUMBER} {SINPE_RECIPIENT_ALIAS}
                                    </b>
                                  </p>
                                  <button
                                    type="button"
                                    onClick={copySinpeSmsMessage}
                                    className="mt-2 min-h-[40px] text-sm border border-[#F1E7D6]/45 text-[#F1E7D6] font-medium px-4 py-2 rounded-sm hover:bg-[#1E1813] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A83A]"
                                  >
                                    {locale === 'es' ? 'Copiar mensaje' : 'Copy message'}
                                  </button>
                                </div>
                              ) : (
                                <p>
                                  {locale === 'es'
                                    ? 'Realiza la transferencia desde la app o banca en línea de '
                                    : 'Make the transfer from the app or online bank of '}
                                  <b className="text-[#F1E7D6]">{bancoSeleccionado.nombre}</b>.
                                </p>
                              )}
                            </div>
                          )}

                          <label className="block text-sm font-medium text-[#F1E7D6]">
                            {locale === 'es'
                              ? 'Últimos 4 dígitos del recibo'
                              : 'Last 4 digits of the receipt'}
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="\\d{4}"
                            placeholder="1234"
                            value={ultimos4}
                            onChange={(e) => setUltimos4(e.target.value.replace(/\\D/g, '').slice(0, 4))}
                            className="w-full px-3 py-2 bg-[#1E1813] border border-[#3A2E24] text-[#F1E7D6] placeholder:text-[#8C7F6E] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E0A83A]/25 focus:border-[#E0A83A]"
                          />

                          <button
                            type="button"
                            onClick={handleSinpePayment}
                            disabled={loading}
                            aria-busy={loading}
                            className="w-full min-h-[50px] bg-[#E0A83A] hover:bg-[#F3C56B] text-[#161210] font-bold py-3 px-4 rounded-sm transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C56B]"
                          >
                            {loading
                              ? locale === 'es' ? 'Enviando…' : 'Sending…'
                              : locale === 'es'
                                ? 'Confirmar y finalizar'
                                : 'Confirm and finalize'}
                          </button>
                        </div>
                      )}
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
