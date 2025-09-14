import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

type PageParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: locale === 'es' ? 'Pago Exitoso | Hands Made Art' : 'Payment Success | Hands Made Art',
    description: locale === 'es' 
      ? 'Su pago ha sido procesado exitosamente' 
      : 'Your payment has been successfully processed',
  };
}

export default async function PaymentSuccessPage({ params }: { params: PageParams }) {
  const { locale } = await params;
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {locale === 'es' ? '¡Pago Exitoso!' : 'Payment Successful!'}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {locale === 'es' 
            ? 'Su pago ha sido procesado exitosamente. Gracias por su compra.' 
            : 'Your payment has been successfully processed. Thank you for your purchase.'}
        </p>
        
        <p className="text-gray-600 mb-8">
          {locale === 'es' 
            ? 'Recibirá un correo electrónico con los detalles de su compra.' 
            : 'You will receive an email with the details of your purchase.'}
        </p>
        
        <Link 
          href={`/${locale}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          {locale === 'es' ? 'Volver al Inicio' : 'Return to Home'}
        </Link>
      </div>
    </div>
  );
}