import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { CheckCircle, ShoppingBag } from 'lucide-react';

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
  const isEs = locale === 'es';
  
  return (
    <main className="min-h-[72vh] bg-[#FAF6EF] px-4 py-12 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-screen-sm border border-[#E8E4E0] bg-[#F5F1EB] p-6 text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] sm:p-10">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#4A7C59]/12 text-[#4A7C59]">
          <CheckCircle className="h-8 w-8" strokeWidth={1.75} aria-hidden />
        </div>
        
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
          {isEs ? 'Pago recibido' : 'Payment received'}
        </p>
        <h1 className="font-display text-3xl font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D]">
          {isEs ? 'Tu pago fue procesado.' : 'Your payment was processed.'}
        </h1>
        
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
          {isEs
            ? 'Gracias por tu compra. Te enviaremos un correo con los detalles y el seguimiento de la orden.'
            : 'Thank you for your purchase. We will send an email with the order details and follow-up.'}
        </p>
        
        <Link
          href="/products"
          locale={locale}
          className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-6 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          {isEs ? 'Seguir comprando' : 'Continue shopping'}
        </Link>
      </section>
    </main>
  );
}
