'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

interface PaymentSuccessMessageProps {
  locale: string;
  orderId: string;
}

export default function PaymentSuccessMessage({ locale, orderId }: PaymentSuccessMessageProps) {
  const router = useRouter();
  
  const translations = {
    title: locale === 'es' ? '¡Pago completado con éxito!' : 'Payment completed successfully!',
    subtitle: locale === 'es' 
      ? 'Gracias por tu compra. Hemos enviado un correo de confirmación.' 
      : 'Thank you for your purchase. We have sent a confirmation email.',
    orderNumber: locale === 'es' ? 'Número de orden:' : 'Order number:',
    backToHome: locale === 'es' ? 'Volver al inicio' : 'Back to home',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 text-green-500">
        <CheckCircle size={64} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">{translations.title}</h2>
      <p className="text-gray-600 mb-4">{translations.subtitle}</p>
      
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <p className="text-sm">
          <span className="font-medium">{translations.orderNumber}</span> {orderId}
        </p>
      </div>
      
      <button 
        onClick={() => router.push(`/${locale}`)}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {translations.backToHome}
      </button>
    </div>
  );
}