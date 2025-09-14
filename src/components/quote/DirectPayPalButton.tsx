'use client';

import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

interface DirectPayPalButtonProps {
  quoteId: string;
  amount: number;
  onSuccess: (details: any) => void;
  disabled?: boolean;
}

export default function DirectPayPalButton({
  quoteId,
  amount,
  onSuccess,
  disabled = false
}: DirectPayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          amount,
        }),
      });

      const orderData = await response.json();
      if (orderData.error) {
        toast.error('Error al crear la orden de PayPal');
        setIsProcessing(false);
        return null;
      }
      
      return orderData.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Error al crear la orden de PayPal');
      setIsProcessing(false);
      return null;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch('/api/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          quoteId,
        }),
      });

      const captureData = await response.json();
      
      if (captureData.error) {
        toast.error('Error al procesar el pago');
        setIsProcessing(false);
        return;
      }

      // Llamar al callback de éxito con los detalles de la captura
      onSuccess(captureData);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      toast.error('Error al procesar el pago');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
        }}
        disabled={disabled || isProcessing}
        forceReRender={[amount, quoteId]}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={() => {
          toast.error('Error en el proceso de pago con PayPal');
          setIsProcessing(false);
        }}
        onCancel={() => {
          toast('Proceso de pago cancelado');
          setIsProcessing(false);
        }}
      />
    </div>
  );
}