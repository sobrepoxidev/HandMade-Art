'use client';

import React, { useMemo } from 'react';
import { useHomeProductsContext } from '@/context/HomeProductsContext';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';
import { useInView } from 'react-intersection-observer';

/**
 * Componente para mostrar productos destacados en un formato más visual y amplio
 * - Ocupa más espacio vertical que otros componentes
 * - Muestra productos en un grid 2x2 en móvil y 3x2 en desktop
 * - Exclusivo para productos marcados como is_featured
 */
const FeaturedProductsSection: React.FC = () => {
  const locale = useLocale();
  const { sections, categories = [], loadMoreProducts, hasMoreProducts, loading } = useHomeProductsContext();
  
  // Referencia para detectar cuando el usuario llega al final de la sección
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Cargar más productos cuando el usuario llega al final
  React.useEffect(() => {
    if (inView && hasMoreProducts && !loading) {
      loadMoreProducts();
    }
  }, [inView, hasMoreProducts, loading, loadMoreProducts]);
  
  // Título según el idioma
  const title = useMemo(() => {
    return locale === 'es' ? 'Productos Destacados' : 'Featured Products';
  }, [locale]);

  // Obtener solo productos con is_featured=true y sin duplicados
  const featuredOnly = useMemo(() => {
    const only = sections.featured.filter(p => p.is_featured);
    const seen = new Set<number>();
    return only.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [sections.featured]);

  return (
    <section className="my-2">
      <div className="w-full px-4  mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3">
            {title}
          </h2>
          <Link href="/products" className="text-teal-600 hover:text-teal-700 text-sm px-1 font-medium flex items-center">
            {locale === 'es' ? 'Ver todos' : 'View all'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {featuredOnly.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {featuredOnly.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`} 
                className="group"
              >
                <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden h-full hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 ">
                  {/* Imagen del producto */}
                  <div className="relative bg-gray-50 aspect-square">
                    <Image 
                      src={product.media && Array.isArray(product.media) && product.media.length > 0 ? (product.media[0] as { url: string }).url : 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp'}
                      alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      unoptimized
                    />
                    {product.is_featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium sm:px-2 px-0.5 sm:py-1 py-0 rounded-md">
                        {locale === 'es' ? 'Destacado' : 'Featured'}
                      </div>
                    )}
                    {product.dolar_price && (
                      <div className="absolute bottom-2 right-2 bg-teal-500 text-white text-sm font-bold sm:px-3 px-1.5 sm:py-1 py-0.5 rounded-md">
                        {formatUSD(product.dolar_price)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-gray-800 font-medium text-md mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {locale === 'es' ? product.name_es : product.name_en || product.name}
                    </h3>
                    {product.category_id && (
                      <div className="mt-auto">
                        <span className="text-[0.67rem] text-gray-500 bg-gray-100 px-1 py-1 rounded-full">
                          {locale === 'es' ? categories.find(c => c.id === product.category_id)?.name_es : categories.find(c => c.id === product.category_id)?.name_en || ''}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 text-teal-600 text-sm font-medium flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {locale === 'es' ? 'Ver detalles' : 'View details'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
            {locale === 'es' ? 'No hay productos destacados disponibles.' : 'No featured products available.'}
          </div>
        )}
        
        {/* Referencia para carga infinita */}
        <div 
          ref={loadMoreRef} 
          className="w-full flex justify-center mt-8"
        >
          {hasMoreProducts && featuredOnly.length > 0 && (
            <button 
              onClick={() => loadMoreProducts()} 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
              disabled={loading}
            >
              {loading ? 
                (locale === 'es' ? 'Cargando...' : 'Loading...') : 
                (locale === 'es' ? 'Cargar más productos' : 'Load more products')
              }
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
