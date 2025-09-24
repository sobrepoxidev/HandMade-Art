import { notFound } from 'next/navigation';
import { decryptAmount } from '@/lib/encryption';
import GenericPaymentPage from '@/components/payments/GenericPaymentPage';

type tParams = Promise<{ locale: string, amount: string }>;

export default async function PayPage({ params }: { params: tParams }) {
  const { amount: encryptedAmount, locale } = await params;
  
  let amount: number | null = null;
  
  // Si el parámetro amount no es "new", intentar desencriptarlo
  if (encryptedAmount !== 'new') {
    amount = decryptAmount(decodeURIComponent(encryptedAmount));
    
    // Si no se puede desencriptar, mostrar 404
    if (amount === null) {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GenericPaymentPage 
        locale={locale} 
        predefinedAmount={amount}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: tParams }) {
  const { locale } = await params;
  
  return {
    title: locale === 'es' ? 'Realizar Pago - Handmade Art' : 'Make Payment - Handmade Art',
    description: locale === 'es' 
      ? 'Realiza tu pago de forma segura con PayPal o tarjeta'
      : 'Make your payment securely with PayPal or card',
  };
}