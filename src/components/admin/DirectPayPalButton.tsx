'use client';

import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';

interface DirectPayPalButtonProps {
  quoteId: number;
  locale: string;
  onSuccess?: () => void;
}

export default function DirectPayPalButton({ quoteId, locale, onSuccess }: DirectPayPalButtonProps) {
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/create-direct-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating order');
      }

      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error(locale === 'es' ? 'Error al crear la orden de pago' : 'Error creating payment order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error capturing payment');
      }

      const captureData = await response.json();
      
      // Verificar si el pago fue completado
      if (
        captureData.status === 'COMPLETED' ||
        captureData.purchase_units[0]?.payments?.captures?.[0]?.status === 'COMPLETED'
      ) {
        toast.success(
          locale === 'es'
            ? '¡Pago completado con éxito!'
            : 'Payment completed successfully!'
        );
        
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess();
        }
      }
      
      return captureData;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      toast.error(
        locale === 'es'
          ? 'Error al procesar el pago'
          : 'Error processing payment'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          toast.error(
            locale === 'es'
              ? 'Error en el procesamiento de PayPal'
              : 'PayPal processing error'
          );
        }}
      />
      {loading && (
        <div className="flex justify-center mt-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}