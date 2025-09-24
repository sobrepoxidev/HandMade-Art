import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

export default async function PayRedirectPage({ params }: { params: tParams }) {
  const { locale } = await params;
  
  // Redirigir automáticamente a pay/new
  redirect(`/${locale}/pay/new`);
}

export async function generateMetadata({ params }: { params: tParams }) {
  const { locale } = await params;
  
  return {
    title: locale == 'es' ? 'Realizar Pago - Handmade Art' : 'Make Payment - Handmade Art',
    description: locale == 'es' 
      ? 'Realiza tu pago de forma segura con PayPal o tarjeta'
      : 'Make your payment securely with PayPal or card',
  };
}