'use client';

import React, { useMemo } from 'react';
import { useProductsContext } from '@/context/ProductsContext';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';

interface FeaturedProductsSectionProps {
  /** Número máximo de productos a mostrar */
  maxProducts?: number;
}

/**
 * Componente para mostrar productos destacados en un formato más visual y amplio
 * - Ocupa más espacio vertical que otros componentes
 * - Muestra productos en un grid 2x2 en móvil y 3x2 en desktop
 * - Prioriza productos que no se muestran en otros componentes
 */
const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({

}) => {
  const locale = useLocale();
  const { sectionProducts, categories = [] } = useProductsContext();
  
  // Título según el idioma
  const title = useMemo(() => {
    return locale === 'es' ? 'Productos Destacados' : 'Featured Products';
  }, [locale]);

  // Selección inteligente de productos para evitar duplicados con otros componentes
  const featuredProducts = sectionProducts.featured;
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

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {featuredProducts.map((product, index) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`} 
                className={`group ${index === featuredProducts.length - 1 ? 'hidden md:block' : ''}`}
              >
                <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden h-full hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 ">
                  {/* Sección superior con imagen - más grande que en otros componentes */}
                  <div className="relative bg-gray-50 aspect-square">
                    <Image 
                      src={product.media && product.media.length > 0 ? product.media[0].url : '/placeholder.jpg'}
                      alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      unoptimized
                    />
                    
                    {/* Insignia de destacado si corresponde */}
                    {product.is_featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                        {locale === 'es' ? 'Destacado' : 'Featured'}
                      </div>
                    )}
                    
                    {/* Precio flotante */}
                    {product.dolar_price && (
                      <div className="absolute bottom-2 right-2 bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded-md">
                        {formatUSD(product.dolar_price)}
                      </div>
                    )}
                  </div>
                  
                  {/* Información del producto */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-gray-800 font-medium text-md mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {locale === 'es' ? product.name_es : product.name_en || product.name}
                    </h3>
                    
                    {/* Categoría */}
                    {product.category_id && (
                      <div className="mt-auto">
                        <span className="text-[0.67rem] text-gray-500 bg-gray-100 px-1 py-1 rounded-full">
                          {locale === 'es' ? categories.find(c => c.id === product.category_id)?.name_es : categories.find(c => c.id === product.category_id)?.name_en || ''}
                        </span>
                      </div>
                    )}
                    
                    {/* Botón de ver detalles */}
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
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
