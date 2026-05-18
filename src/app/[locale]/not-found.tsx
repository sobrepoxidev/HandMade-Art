'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <Suspense fallback={null}>
      <NotFoundContent />
    </Suspense>
  );
}

function NotFoundContent() {
  const router = useRouter();
  const locale = useLocale();
  const isEs = locale === 'es';

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16">
      <div className="text-center max-w-lg">
        <p className="font-display text-[120px] sm:text-[160px] font-medium text-[#2D2D2D] leading-none tracking-tight">
          404
        </p>

        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#A08848] font-semibold">
          {isEs ? 'Página no encontrada' : 'Page not found'}
        </p>

        <h1 className="font-display text-2xl sm:text-3xl text-[#2D2D2D] mt-3 leading-snug">
          {isEs
            ? 'Esta página no está aquí — pero hay piezas únicas esperándote.'
            : 'This page isn’t here — but one-of-a-kind pieces are.'}
        </h1>

        <p className="text-[#6B6459] mt-4 leading-relaxed max-w-md mx-auto">
          {isEs
            ? 'Es posible que el enlace haya cambiado o el producto ya no esté disponible. Volvé al inicio o seguí explorando el catálogo artesanal.'
            : 'The link may have changed or the product is no longer available. Go back home or keep exploring the artisan catalog.'}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 bg-[#2D2D2D] text-[#F5F1EB] text-sm font-semibold tracking-wide rounded-sm hover:bg-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={2} aria-hidden />
            {isEs ? 'Ir al inicio' : 'Go home'}
          </Link>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 bg-transparent border border-[#E8E4E0] text-[#2D2D2D] text-sm font-medium rounded-sm hover:border-[#A08848] hover:bg-white transition-colors"
          >
            <Compass className="h-4 w-4 mr-2 text-[#A08848]" strokeWidth={2} aria-hidden />
            {isEs ? 'Explorar catálogo' : 'Browse catalog'}
          </button>
        </div>
      </div>
    </main>
  );
}
