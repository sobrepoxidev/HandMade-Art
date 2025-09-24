'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CreditCard, DollarSign, CheckCircle, Home, RefreshCw } from 'lucide-react';

interface GenericPaymentPageProps {
  locale: string;
  predefinedAmount?: number | null;
}

interface PayPalPayer {
  name?: {
    given_name?: string;
    surname?: string;
  };
  email_address?: string;
  phone?: {
    phone_number?: {
      national_number?: string;
    };
  };
}

interface PayPalPaymentDetails {
  id?: string;
  status?: string;
  payer?: PayPalPayer;
  purchase_units?: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}

const PAYPAL_CLIENT_ID: string =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID ?? 'sb'
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb';

export default function GenericPaymentPage({ locale, predefinedAmount }: GenericPaymentPageProps) {
  const [amount, setAmount] = useState<string>(predefinedAmount?.toString() || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const router = useRouter();

  const translations = {
    title: locale == 'es' ? 'Realizar Pago' : 'Make Payment',
    subtitle: locale == 'es' ? 'Completa tu pago de forma segura' : 'Complete your payment securely',
    amountLabel: locale == 'es' ? 'Monto a pagar (USD)' : 'Amount to pay (USD)',

    paymentTitle: locale == 'es' ? 'Método de Pago' : 'Payment Method',
    enterAmount: locale == 'es' ? 'Ingresa el monto a pagar' : 'Enter the amount to pay',
    invalidAmount: locale == 'es' ? 'Monto inválido' : 'Invalid amount',
    paymentSuccess: locale == 'es' ? '¡Pago completado exitosamente!' : 'Payment completed successfully!',
    paymentError: locale == 'es' ? 'Error al procesar el pago' : 'Error processing payment',
    processing: locale == 'es' ? 'Procesando...' : 'Processing...',
    
    // Nuevas traducciones para el mensaje de agradecimiento
    thankYouTitle: locale == 'es' ? '¡Gracias por tu pago!' : 'Thank you for your payment!',
    thankYouMessage: locale == 'es' ? 'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación en breve.' : 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
    makeAnotherPayment: locale == 'es' ? 'Realizar otro pago' : 'Make another payment',
    goToHome: locale == 'es' ? 'Ir al inicio' : 'Go to home'
  };

  const finalAmount = parseFloat(amount);
  const isValidAmount = !isNaN(finalAmount) && finalAmount > 0;

  const handlePaymentSuccess = async (details: PayPalPaymentDetails) => {
    setIsProcessing(true);
    try {
      // Extraer información del cliente desde PayPal
      const customerName = details.payer?.name 
        ? `${details.payer.name.given_name || ''} ${details.payer.name.surname || ''}`.trim()
        : '';
      const customerEmail = details.payer?.email_address || '';
      const customerPhone = details.payer?.phone?.phone_number?.national_number || '';
      
      console.log('Payment successful:', {
        paymentId: details.id || 'N/A',
        status: details.status || 'unknown',
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone
        },
        amount: details.purchase_units?.[0]?.amount
      });
      
      // Enviar correo de agradecimiento si tenemos email del cliente
      if (customerEmail && details.id) {
        try {
          const response = await fetch('/api/send-payment-thank-you', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerName,
              customerEmail,
              amount: finalAmount,
              paymentId: details.id,
              locale
            }),
          });

          if (!response.ok) {
            console.error('Failed to send thank you email:', await response.text());
          } else {
            console.log('Thank you email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending thank you email:', emailError);
          // No mostramos error al usuario ya que el pago fue exitoso
        }
      }
      
      // Aquí puedes guardar la información en la base de datos si es necesario
      // await savePaymentInfo({ paymentId: details.id, customerName, customerEmail, customerPhone, amount: finalAmount });
      
      toast.success(translations.paymentSuccess);
      setPaymentCompleted(true);
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error(translations.paymentError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: Record<string, unknown>) => {
    console.error('Payment error:', error);
    toast.error(translations.paymentError);
  };

  const handleNewPayment = () => {
    setPaymentCompleted(false);
    setAmount(predefinedAmount?.toString() || '');
    setIsProcessing(false);
  };

  const handleGoHome = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white text-gray-950 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-950 text-white p-6">
          <div className="flex items-center space-x-3">
            {paymentCompleted ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <CreditCard className="h-8 w-8" />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {paymentCompleted ? translations.thankYouTitle : translations.title}
              </h1>
              <p className="text-blue-50">
                {paymentCompleted ? translations.thankYouMessage : translations.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {paymentCompleted ? (
            // Vista de agradecimiento
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  {translations.thankYouMessage}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleNewPayment}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-200"
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>{translations.makeAnotherPayment}</span>
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors duration-200"
                  >
                    <Home className="h-5 w-5" />
                    <span>{translations.goToHome}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Vista del formulario de pago
            <>
          {/* Amount Section */}
          {!predefinedAmount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.amountLabel}
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                  isValidAmount ? 'text-green-500' : 'text-gray-400'
                }`} />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {predefinedAmount && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-800">
                  ${predefinedAmount.toFixed(2)} USD
                </span>
              </div>
            </div>
          )}

          {/* Payment Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {translations.paymentTitle}
            </h3>
            
            {!isValidAmount && (
              <div className="text-center py-8 text-gray-500">
                {translations.enterAmount}
              </div>
            )}
            
            {isValidAmount && (
              <PayPalScriptProvider options={{ 
                clientId: PAYPAL_CLIENT_ID,
                currency: 'USD'
              }}>
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  disabled={isProcessing}
                  createOrder={(_data, actions) => {
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [{
                        amount: {
                          value: finalAmount.toFixed(2),
                          currency_code: 'USD'
                        },
                        description: `Generic Payment - $${finalAmount.toFixed(2)}`
                      }],
                      application_context: {
                        shipping_preference: 'NO_SHIPPING'
                      }
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      await handlePaymentSuccess({
                        id: details.id,
                        status: details.status,
                        payer: details.payer,
                        purchase_units: details.purchase_units?.map(unit => ({
                          amount: {
                            value: unit.amount?.value ?? '0',
                            currency_code: unit.amount?.currency_code ?? 'USD'
                          }
                        }))
                      });
                    }
                  }}
                  onError={handlePaymentError}
                />
              </PayPalScriptProvider>
            )}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}