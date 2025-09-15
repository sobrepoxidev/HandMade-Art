'use client';

import { useState } from 'react';
import { X, Percent, DollarSign, Tag, Send, Loader2, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string | null;
  name_es: string | null;
  name_en: string | null;
  dolar_price: number | null;
  discount_percentage: number | null;
  quantity: number;
  media: { url: string; type: string; caption?: string }[] | null;
  sku: string | null;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  requiresShippingAddress?: boolean;
}

interface QuoteData {
  id: string;
  requester_name: string;
  email: string;
  phone?: string;
  quote_slug: string;
  total_amount: number;
  final_amount: number;
  discount_type?: string;
  discount_value?: number;
  shipping_cost?: number;
  manager_notes?: string;
  interest_request_items?: {
    quantity: number;
    unit_price_usd: number;
    product_snapshot?: {
      name: string;
    };
  }[];
}

interface DirectPaymentDiscountModalProps {
  locale: string;
  onClose: () => void;
  cart: CartItem[];
  customerInfo: CustomerInfo;
}

type DiscountType = 'percentage' | 'fixed_amount' | 'total_override' | null;

export default function DirectPaymentDiscountModal({
  locale,
  onClose,
  cart,
  customerInfo
}: DirectPaymentDiscountModalProps) {
  const [discountType, setDiscountType] = useState<DiscountType>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [managerNotes, setManagerNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [linkGenerated, setLinkGenerated] = useState<boolean>(false);

  // Calculate original total
  const originalTotal = cart.reduce((total, item) => {
    const discountPrice = item.discount_percentage ? 
      (item.dolar_price || 0) * (1 - (item.discount_percentage / 100)) : 
      null;
    const price = discountPrice || item.dolar_price || 0;
    return total + price * item.quantity;
  }, 0);

  // Calculate final total based on discount
  const calculateFinalTotal = () => {
    let finalTotal = originalTotal;

    if (discountType === 'percentage' && discountValue > 0) {
      finalTotal = originalTotal * (1 - discountValue / 100);
    } else if (discountType === 'fixed_amount' && discountValue > 0) {
      finalTotal = Math.max(0, originalTotal - discountValue);
    } else if (discountType === 'total_override' && discountValue >= 0) {
      finalTotal = discountValue;
    }

    // Add shipping cost
    return finalTotal + shippingCost;
  };

  const finalTotal = calculateFinalTotal();

  // Generate payment link
  const generatePaymentLink = async () => {
    // Prevent multiple calls if already loading or link already generated
    if (isLoading || linkGenerated) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare discount info if any discount is applied
      const discountInfo = discountType
        ? {
            type: discountType,
            value: discountValue
          }
        : null;

      // Create the direct payment order
      const response = await fetch('/api/generate-direct-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems: cart,
          customerInfo,
          discountInfo,
          shippingCost,
          totalAmount: originalTotal,
          finalAmount: finalTotal,
          managerNotes,
          requiresShippingAddress: customerInfo.requiresShippingAddress || false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error generating payment link');
      }

      // Set the payment link and WhatsApp link
      setPaymentLink(data.paymentLink);
      if (data.whatsappLink) {
        setWhatsappLink(data.whatsappLink);
      }
      setLinkGenerated(true);

      toast.success(
        locale === 'es'
          ? 'Link de pago generado exitosamente'
          : 'Payment link generated successfully'
      );

      // Send email with payment link
      await sendPaymentEmail(data.quote, data.quoteId);
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error(
        locale === 'es'
          ? 'Error al generar el link de pago'
          : 'Error generating payment link'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send payment email
  const sendPaymentEmail = async (quote: QuoteData, quoteId: string) => {
    try {
      const response = await fetch('/api/send-direct-payment-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quote,
          quoteId,
          locale
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error sending email');
      }

      toast.success(
        locale === 'es'
          ? 'Correo enviado exitosamente'
          : 'Email sent successfully'
      );
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(
        locale === 'es' ? 'Error al enviar el correo' : 'Error sending email'
      );
    }
  };

  // Copy link to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(
      locale === 'es' ? 'Link copiado al portapapeles' : 'Link copied to clipboard'
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {locale === 'es' ? 'Generar Link de Pago' : 'Generate Payment Link'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {!linkGenerated ? (
            <>
              {/* Discount Options */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">
                  {locale === 'es' ? 'Opciones de Descuento' : 'Discount Options'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setDiscountType('percentage')}
                    className={`p-3 border rounded-md flex items-center ${discountType === 'percentage' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Percent className="w-5 h-5 mr-2 text-indigo-600" />
                    <span>
                      {locale === 'es' ? 'Porcentaje' : 'Percentage'}
                    </span>
                  </button>
                  <button
                    onClick={() => setDiscountType('fixed_amount')}
                    className={`p-3 border rounded-md flex items-center ${discountType === 'fixed_amount' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                    <span>
                      {locale === 'es' ? 'Monto Fijo' : 'Fixed Amount'}
                    </span>
                  </button>
                  <button
                    onClick={() => setDiscountType('total_override')}
                    className={`p-3 border rounded-md flex items-center ${discountType === 'total_override' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Tag className="w-5 h-5 mr-2 text-indigo-600" />
                    <span>
                      {locale === 'es' ? 'Precio Final' : 'Final Price'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              {discountType && (
                <div className="mb-6">
                  <label className="block font-medium mb-2">
                    {discountType === 'percentage'
                      ? locale === 'es'
                        ? 'Porcentaje de Descuento'
                        : 'Discount Percentage'
                      : discountType === 'fixed_amount'
                      ? locale === 'es'
                        ? 'Monto de Descuento (USD)'
                        : 'Discount Amount (USD)'
                      : locale === 'es'
                      ? 'Precio Final (USD)'
                      : 'Final Price (USD)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step={discountType === 'percentage' ? '1' : '0.01'}
                    max={discountType === 'percentage' ? '100' : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Shipping Cost */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  {locale === 'es' ? 'Costo de Envío (USD)' : 'Shipping Cost (USD)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Manager Notes */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  {locale === 'es' ? 'Notas del Gestor' : 'Manager Notes'}
                </label>
                <textarea
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-24"
                  placeholder={locale === 'es' ? 'Notas adicionales para el cliente...' : 'Additional notes for the customer...'}
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-3">
                  {locale === 'es' ? 'Resumen' : 'Summary'}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{locale === 'es' ? 'Subtotal:' : 'Subtotal:'}</span>
                    <span>${originalTotal ? originalTotal.toFixed(2) : '0.00'}</span>
                  </div>
                  {discountType && (
                    <div className="flex justify-between text-red-600">
                      <span>
                        {locale === 'es' ? 'Descuento:' : 'Discount:'}
                        {discountType === 'percentage' && ` (${discountValue || 0}%)`}
                      </span>
                      <span>
                        {discountType === 'total_override'
                          ? `-${originalTotal && discountValue ? (originalTotal - discountValue).toFixed(2) : '0.00'}`
                          : discountType === 'fixed_amount'
                          ? `-${discountValue ? discountValue.toFixed(2) : '0.00'}`
                          : `-${originalTotal && discountValue ? (originalTotal * discountValue / 100).toFixed(2) : '0.00'}`}
                      </span>
                    </div>
                  )}
                  {shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>{locale === 'es' ? 'Envío:' : 'Shipping:'}</span>
                      <span>${shippingCost ? shippingCost.toFixed(2) : '0.00'}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>{locale === 'es' ? 'Total:' : 'Total:'}</span>
                    <span>${finalTotal ? finalTotal.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Generate Link Button */}
              <div className="flex justify-end">
                <button
                  onClick={generatePaymentLink}
                  disabled={isLoading || linkGenerated}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {locale === 'es' ? 'Generando...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {locale === 'es' ? 'Generar Link de Pago' : 'Generate Payment Link'}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Payment Link Generated */}
              <div className="text-center mb-6">
                <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
                  {locale === 'es'
                    ? 'Link de pago generado exitosamente'
                    : 'Payment link generated successfully'}
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    {locale === 'es' ? 'Link de Pago' : 'Payment Link'}
                  </h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={paymentLink}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={() => copyToClipboard(paymentLink)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-r-md transition-colors"
                    >
                      {locale === 'es' ? 'Copiar' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Email Button */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {locale === 'es' ? 'Correo Enviado' : 'Email Sent'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {locale === 'es'
                        ? `Se ha enviado un correo a ${customerInfo.email} con el link de pago.`
                        : `An email has been sent to ${customerInfo.email} with the payment link.`}
                    </p>
                  </div>

                  {/* WhatsApp Button */}
                  {whatsappLink && (
                    <div>
                     
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
                      >
                        {locale === 'es' ? 'Enviar por WhatsApp' : 'Send via WhatsApp'}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {locale === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}