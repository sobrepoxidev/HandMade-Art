'use client';

import React, { useMemo } from 'react';
import { useHomeProductsContext } from '@/context/HomeProductsContext';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';

/**
 * Componente para mostrar productos destacados en un formato más visual y amplio
 * - Ocupa más espacio vertical que otros componentes
 * - Muestra productos en un grid 2x2 en móvil y 3x2 en desktop
 * - Exclusivo para productos marcados como is_featured
 */
const FeaturedProductsSection: React.FC = () => {
  const locale = useLocale();
  const { sections, categories = [] } = useHomeProductsContext();
  
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
    <section className="bg-[#FAF6EF] pb-8">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-end gap-4 mb-4">
          <h2 className="font-display text-2xl font-medium text-[#2D2D2D] tracking-[-0.005em] flex items-center gap-3">
            <span aria-hidden className="block w-1 h-6 bg-[#C9A962]" />
            {title}
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center min-h-[44px] px-2 py-2 text-sm font-medium text-[#A08848] hover:text-[#2D2D2D] transition-colors"
          >
            {locale === 'es' ? 'Ver todos' : 'View all'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {featuredOnly.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {featuredOnly.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.name}`}
                className="group"
              >
              <div className="flex flex-col bg-[#FAF6EF] border border-[#E8E4E0] rounded-sm overflow-hidden h-full hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)] hover:border-[#C9A962]/45 transition-[box-shadow,border-color,transform] duration-300 group-hover:-translate-y-0.5">
                  {/* Imagen del producto */}
                  <div className="relative bg-[#F5F1EB] aspect-square">
                    <Image
                      src={product.media && Array.isArray(product.media) && product.media.length > 0 ? (product.media[0] as { url: string }).url : 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp'}
                      alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      loading="lazy"
                    />
                    {product.is_featured && (
                      <div className="absolute top-2 left-2 bg-[#C9A962] text-[#1A1A1A] text-[10px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm">
                        {locale === 'es' ? 'Destacado' : 'Featured'}
                      </div>
                    )}
                    {product.dolar_price && (
                      <div className="absolute bottom-2 right-2 bg-[#2D2D2D] text-[#C9A962] text-sm font-semibold tabular-nums px-2.5 py-0.5 rounded-sm">
                        {formatUSD(product.dolar_price)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-[#2D2D2D] font-medium text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#A08848] transition-colors">
                      {locale === 'es' ? product.name_es : product.name_en || product.name}
                    </h3>
                    {product.category_id && (
                      <div className="mt-auto">
                        <span className="text-[10px] uppercase tracking-[0.08em] font-medium text-[#F5F1EB] bg-[#2D2D2D] px-2 py-0.5 rounded-sm">
                          {locale === 'es' ? categories.find(c => c.id === product.category_id)?.name_es : categories.find(c => c.id === product.category_id)?.name_en || ''}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 text-[#A08848] text-xs font-medium flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {locale === 'es' ? 'Ver detalles' : 'View details'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-10 text-[#6B6459] bg-[#F5F1EB] border border-[#E8E4E0] rounded-sm">
            {locale === 'es' ? 'No hay productos destacados disponibles.' : 'No featured products available.'}
          </div>
        )}
        
      </div>
    </section>
  );
};

export default React.memo(FeaturedProductsSection);
