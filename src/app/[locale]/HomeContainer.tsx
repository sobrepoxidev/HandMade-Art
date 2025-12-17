import { Suspense } from 'react';
import HomePageData from './HomePageData';
import { Link } from '@/i18n/navigation';
import ScrollToTopButton from "@/components/ScrollToTopButton";

/**
 * Componente contenedor para la página de inicio
 * Implementa Suspense para mejorar la carga progresiva
 */
export default function HomeContainer({locale}: {locale: string}) {
  return (
    <div className="bg-gradient-to-b from-[#FAF8F5] to-white min-h-screen" role="main">
      <main className="max-w-screen-2xl mx-auto">
        <Suspense fallback={<LoadingState />}>
          <HomePageData locale={locale} />
        </Suspense>

        {/* Botones flotantes agrupados */}
        <div className="fixed bottom-10 right-8 z-50 flex flex-col items-end gap-2">
          <Link
            href="/contact"
            className="bg-[#2D2D2D] text-[#C9A962] px-3 py-1.5 rounded-full shadow-lg hover:bg-[#3A3A3A] border border-[#C9A962]/30 hover:border-[#C9A962] transition-all hidden md:block animate-fade-in text-sm font-medium"
            aria-label="Contacto Handmade Art"
            tabIndex={0}
          >
            {locale === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
          </Link>

          <ScrollToTopButton />
        </div>
      </main>
    </div>
  );
}

/**
 * Componente de estado de carga
 * Muestra un esqueleto de carga mientras se cargan los datos
 */
function LoadingState() {
  return (
    <div className="max-w-[1500px] mx-auto relative z-0 h-full bg-gradient-to-b from-[#FAF8F5] via-[#F5F1EB] to-white">
      {/* Skeleton para el banner */}
      <div className="w-full h-[300px] bg-gradient-to-r from-[#E8E4E0] to-[#F5F1EB] animate-pulse rounded-b-lg"></div>

      {/* Skeleton para secciones de productos */}
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#F5F1EB] animate-pulse h-64 rounded-xl border border-[#E8E4E0]"></div>
          ))}
        </div>

        <div className="h-8 w-56 bg-[#E8E4E0] animate-pulse rounded-lg mb-4"></div>
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[260px] h-[300px] bg-[#F5F1EB] animate-pulse rounded-xl border border-[#E8E4E0]"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
