'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface QuotePayPalButtonProps {
  orderId: number;
  locale: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

export default function QuotePayPalButton({ orderId, locale, onSuccess, onError }: QuotePayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          source: 'quote'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order');
      }

      return data.paypalOrderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          orderId: orderId,
          source: 'quote'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      // Actualizar el estado de la cotización a 'vendido'
      await fetch('/api/update-quote-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          status: 'vendido'
        }),
      });

      onSuccess();
    } catch (error) {
      console.error('Error capturing payment:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onCancel = () => {
    toast.error(locale === 'es' ? 'Pago cancelado' : 'Payment cancelled');
  };

  const onErrorHandler = (err: any) => {
    console.error('PayPal error:', err);
    onError(err);
  };

  return (
    <div className="w-full">
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <div className="relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">
                  {locale === 'es' ? 'Procesando...' : 'Processing...'}
                </span>
              </div>
            </div>
          )}
          
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal',
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
            onError={onErrorHandler}
            disabled={isProcessing}
          />
        </div>
      </PayPalScriptProvider>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {locale === 'es' 
            ? 'Pago seguro procesado por PayPal' 
            : 'Secure payment processed by PayPal'
          }
        </p>
        <div className="flex justify-center items-center mt-2 space-x-4">
          <span className="text-xs text-gray-400">
            {locale === 'es' ? 'Aceptamos:' : 'We accept:'}
          </span>
          <div className="flex space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visa</span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Mastercard</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
}