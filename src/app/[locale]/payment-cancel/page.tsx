import { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

type PageParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: locale === 'es' ? 'Pago Cancelado | Hands Made Art' : 'Payment Cancelled | Hands Made Art',
    description: locale === 'es' 
      ? 'Su proceso de pago ha sido cancelado' 
      : 'Your payment process has been cancelled',
  };
}

export default async function PaymentCancelPage({ params }: { params: PageParams }) {
  const { locale } = await params;
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {locale === 'es' ? 'Pago Cancelado' : 'Payment Cancelled'}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {locale === 'es' 
            ? 'Su proceso de pago ha sido cancelado. No se ha realizado ningún cargo.' 
            : 'Your payment process has been cancelled. No charges have been made.'}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href={`/${locale}`}
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            {locale === 'es' ? 'Volver al Inicio' : 'Return to Home'}
          </Link>
          
          <Link 
            href={`/${locale}/admin/direct-payment`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            {locale === 'es' ? 'Intentar Nuevamente' : 'Try Again'}
          </Link>
        </div>
      </div>
    </div>
  );
}