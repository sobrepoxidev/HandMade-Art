import { Suspense } from 'react';
import HomePageData from './HomePageData';
import { Link } from '@/i18n/navigation';
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { MessageCircle } from 'lucide-react';

/**
 * Componente contenedor para la página de inicio
 * Implementa Suspense para mejorar la carga progresiva
 */
export default function HomeContainer({locale}: {locale: string}) {
  const whatsappMessage = locale === 'es'
    ? 'Hola, quisiera una cotización de piezas de Handmade Art.'
    : "Hi, I'd like a quote for some Handmade Art pieces.";

  return (
    <div className="bg-[#161210] min-h-screen">
      <main className="mx-auto">
        <Suspense fallback={<LoadingState />}>
          <HomePageData locale={locale} />
        </Suspense>

        {/* Botones flotantes agrupados (desktop) */}
        <div className="fixed bottom-10 right-8 z-50 hidden md:flex flex-col items-end gap-2">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-sm font-medium
                       bg-[#1E1813] text-[#F1E7D6] border border-[#F1E7D6]/15 shadow-lg
                       hover:bg-[#0F0C0A] hover:border-[#E0A83A]/50
                       transition-colors duration-200 animate-fade-in"
            aria-label={locale === 'es' ? 'Contacto Handmade Art' : 'Contact Handmade Art'}
          >
            {locale === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
          </Link>

          <ScrollToTopButton />
        </div>

        {/* Sticky bottom bar (mobile) — quote + WhatsApp, always reachable while shopping */}
        <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2.5 border-t border-[#3A2E24] bg-[#161210] px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 md:hidden">
          <Link
            href="/products"
            className="flex min-h-[50px] items-center justify-center rounded-sm bg-[#E0A83A] px-4 text-sm font-bold text-[#161210]"
          >
            {locale === 'es' ? 'Pedir cotización' : 'Request a quote'}
          </Link>
          <a
            href={`https://wa.me/50684237555?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[50px] items-center justify-center gap-2 rounded-sm border border-[#3C9A70] px-4 text-sm font-bold text-[#F1E7D6]"
          >
            <MessageCircle className="h-[18px] w-[18px] text-[#3C9A70]" strokeWidth={1.8} aria-hidden />
            WhatsApp
          </a>
        </div>
        {/* Spacer so the sticky bar never covers the footer on mobile */}
        <div className="h-[74px] md:hidden" aria-hidden />
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
    <div className="max-w-[1500px] mx-auto relative z-0 bg-[#161210]">
      {/* Skeleton del banner secundario */}
      <div className="w-full h-[220px] bg-[#1E1813] animate-pulse" />

      {/* Skeleton de secciones de productos */}
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1E1813] animate-pulse h-64 rounded-md border border-[#3A2E24]" />
          ))}
        </div>

        <div className="h-8 w-56 bg-[#3A2E24] animate-pulse rounded mb-4" />
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[260px] h-[300px] bg-[#1E1813] animate-pulse rounded-md border border-[#3A2E24]" />
          ))}
        </div>
      </div>
    </div>
  );
}
