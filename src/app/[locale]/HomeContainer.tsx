import { Suspense } from 'react';
import HomePageData from './HomePageData';
import HeroSection from '@/components/home/HeroSection';
import { Link } from '@/i18n/navigation';
import ScrollToTopButton from "@/components/ScrollToTopButton";

/**
 * Componente contenedor para la página de inicio
 * Implementa Suspense para mejorar la carga progresiva
 */
export default function HomeContainer({locale}: {locale: string}) {
  return (
    <div className="bg-gradient-to-b from-[#FAF8F5] to-white min-h-screen">
      <main className="mx-auto">
        <HeroSection locale={locale} />
        <Suspense fallback={<LoadingState />}>
          <HomePageData locale={locale} />
        </Suspense>

        {/* Botones flotantes agrupados */}
        <div className="fixed bottom-10 right-8 z-50 flex flex-col items-end gap-2">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-sm font-medium
                       bg-[#2D2D2D] text-[#F5F1EB] border border-[#F5F1EB]/15 shadow-lg
                       hover:bg-[#1A1A1A] hover:border-[#C9A962]/50
                       transition-colors duration-200 animate-fade-in"
            aria-label={locale === 'es' ? 'Contacto Handmade Art' : 'Contact Handmade Art'}
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
    <div className="max-w-[1500px] mx-auto relative z-0 bg-gradient-to-b from-[#FAF8F5] via-[#F5F1EB] to-white">
      {/* Skeleton del banner secundario */}
      <div className="w-full h-[220px] bg-[#F5F1EB] animate-pulse" />

      {/* Skeleton de secciones de productos */}
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#F5F1EB] animate-pulse h-64 rounded-md border border-[#E8E4E0]" />
          ))}
        </div>

        <div className="h-8 w-56 bg-[#E8E4E0] animate-pulse rounded mb-4" />
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[260px] h-[300px] bg-[#F5F1EB] animate-pulse rounded-md border border-[#E8E4E0]" />
          ))}
        </div>
      </div>
    </div>
  );
}
