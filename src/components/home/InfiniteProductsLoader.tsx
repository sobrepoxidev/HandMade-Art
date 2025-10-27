'use client';

import React from 'react';
import { useHomeProductsContext } from '@/context/HomeProductsContext';
import { useInView } from 'react-intersection-observer';
import { useLocale } from 'next-intl';

/**
 * Sentinel reutilizable para carga progresiva/infinita de productos.
 * Se coloca en la vista después de secciones clave (ej. FeaturedProductsSection)
 * y dispara `loadMoreProducts` cuando entra en viewport.
 */
const InfiniteProductsLoader: React.FC = () => {
  const locale = useLocale();
  const { loadMoreProducts, hasMoreProducts, loading } = useHomeProductsContext();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  React.useEffect(() => {
    if (inView && hasMoreProducts && !loading) {
      // Cargar siguiente página al entrar en vista
      void loadMoreProducts();
    }
  }, [inView, hasMoreProducts, loading, loadMoreProducts]);

  return (
    <div ref={ref} className={`w-full flex justify-center ${hasMoreProducts ? 'my-8' : 'my-0'}`}>
      {loading && (
        <div className="flex items-center text-gray-600 text-sm">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {locale === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      )}
      {!hasMoreProducts && (
        <div className="text-gray-400 text-xs">
          {locale === 'es' ? 'No hay más productos' : 'No more products'}
        </div>
      )}
    </div>
  );
};

export default React.memo(InfiniteProductsLoader);