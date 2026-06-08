import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ShoppingBag, XCircle } from 'lucide-react';

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
  const isEs = locale === 'es';
  
  return (
    <main className="min-h-[72vh] bg-[#FAF6EF] px-4 py-12 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-screen-sm border border-[#E8E4E0] bg-[#F5F1EB] p-6 text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] sm:p-10">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#C44536]/12 text-[#9F2D24]">
          <XCircle className="h-8 w-8" strokeWidth={1.75} aria-hidden />
        </div>
        
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
          {isEs ? 'Pago interrumpido' : 'Payment interrupted'}
        </p>
        <h1 className="font-display text-3xl font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D]">
          {isEs ? 'El pago fue cancelado.' : 'The payment was cancelled.'}
        </h1>
        
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
          {isEs
            ? 'No se realizó ningún cargo. Puedes volver al checkout para intentarlo de nuevo o seguir revisando piezas.'
            : 'No charge was made. You can return to checkout and try again, or keep browsing pieces.'}
        </p>
        
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link 
            href="/checkout"
            locale={locale}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            {isEs ? 'Volver al checkout' : 'Return to checkout'}
          </Link>
          
          <Link 
            href="/products"
            locale={locale}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-[#A08848] px-5 py-3 text-sm font-semibold tracking-wide text-[#A08848] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            {isEs ? 'Ver productos' : 'Browse products'}
          </Link>
        </div>
      </section>
    </main>
  );
}
