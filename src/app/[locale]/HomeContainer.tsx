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
    <div className="bg-white min-h-screen" role="main">
      <main className="max-w-screen-2xl mx-auto">
        <Suspense fallback={<LoadingState />}>
          <HomePageData locale={locale} />
        </Suspense>
        
        {/* Botones flotantes agrupados */}
        <div className="fixed bottom-10 right-8 z-50 flex flex-col items-end gap-2">
          <Link 
            href="/contact"
            className="bg-teal-600 text-white px-2 py-1 rounded-full shadow-lg hover:bg-teal-700 transition hidden md:block animate-fade-in"
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
    <div className="max-w-[1500px] mx-auto relative z-0 h-full bg-gradient-to-b from-[#b3d5c3] via-gray-100 to-gray-200">
      {/* Skeleton para el banner */}
      <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-b-lg"></div>
      
      {/* Skeleton para secciones de productos */}
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
        
        <div className="h-8 w-56 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[260px] h-[300px] bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
