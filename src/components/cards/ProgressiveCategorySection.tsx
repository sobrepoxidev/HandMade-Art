'use client';

import React, { useMemo } from 'react';
import { useHomeProductsContext } from '@/context/HomeProductsContext';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';
import { useInView } from 'react-intersection-observer';
import { isMediaArray } from '@/lib/home/computeSections';

interface ProgressiveCategorySectionProps {
  productsPerCategory?: number;
  maxCategories?: number;
}

/**
 * Nueva sección categorizada con carga progresiva (infinite scroll)
 * - Muestra productos NO presentados en otras secciones (featured/grid/gifts)
 * - Evita duplicados por ID
 * - UI compacta para no sentirse repetitiva
 */
const ProgressiveCategorySection: React.FC<ProgressiveCategorySectionProps> = ({
  productsPerCategory = 4,
  maxCategories = 12
}) => {
  const locale = useLocale();
  const { products, categories, sections, loadMoreProducts, hasMoreProducts, loading, usingSnapshot } = useHomeProductsContext();

  // Conjuntos de IDs ya usados en otras secciones para evitar duplicados
  const displayedIds = useMemo(() => {
    const ids = new Set<number>();
    sections.featured.forEach(p => ids.add(p.id));
    sections.gifts.forEach(p => ids.add(p.id));
    Object.values(sections.grid.products).forEach(list => list.forEach(p => ids.add(p.id)));
    return ids;
  }, [sections]);

  // Productos restantes (no mostrados aún), con imagen válida
  const remainingProducts = useMemo(() => {
    const seen = new Set<number>();
    const list = products.filter(p => !displayedIds.has(p.id) && isMediaArray(p.media));
    // Evitar duplicados si llegan repetidos desde la DB
    return list.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products, displayedIds]);

  // Indexar por categoría para evitar filtros repetidos y mejorar rendimiento
  const productsByCategory = useMemo(() => {
    const map: Record<number, any[]> = {};
    remainingProducts.forEach(p => {
      const cid = p.category_id;
      if (!cid) return;
      (map[cid] ||= []).push(p);
    });
    return map;
  }, [remainingProducts]);

  // Orden de categorías: primero las de prioridad del grid que tengan productos restantes, luego las demás
  const orderedCategories = useMemo(() => {
    const allIds = Object.keys(productsByCategory).map(Number);
    const priority = sections.grid.priorityOrder.filter(cid => (productsByCategory[cid]?.length || 0) > 0);
    const others = allIds.filter(cid => !priority.includes(cid));
    return [...priority, ...others].slice(0, maxCategories);
  }, [productsByCategory, sections.grid.priorityOrder, maxCategories]);

  // Sentinel para carga progresiva al llegar al final de la sección
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1, rootMargin: '200px', triggerOnce: false });
  React.useEffect(() => {
    if (inView && hasMoreProducts && !loading) {
      void loadMoreProducts();
    }
  }, [inView, hasMoreProducts, loading, loadMoreProducts]);

  // Skeleton condicional cuando no hay snapshot SSR y estamos cargando
  if (!usingSnapshot && loading) {
    return (
      <section className="my-4">
        <div className="w-full px-4 mx-auto animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                {[...Array(productsPerCategory)].map((_, j) => (
                  <div key={j} className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="relative bg-gray-100 aspect-square" />
                    <div className="px-2.5 py-2">
                      <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (remainingProducts.length === 0) {
    return null; // No mostramos nada si no hay más productos disponibles
  }

  return (
    <section className="my-4">
      <div className="w-full px-4 mx-auto">
        {/* Bloques por categoría con UI compacta */}
        {orderedCategories.map((categoryId) => {
          const category = categories.find(c => c.id === categoryId);
          const list = (productsByCategory[categoryId] || []).slice(0, productsPerCategory);

          if (!category || list.length === 0) return null;

          return (
            <div key={categoryId} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base lg:text-lg font-semibold text-gray-800 truncate max-w-[60%] lg:max-w-[65%]">
                  {(locale === 'es' ? category.name_es : category.name_en) || category.name || 'Categoría'}
                </h3>
                <Link
                  href={`/products?category=${categoryId}`}
                  className="text-teal-600 hover:text-teal-700 text-xs lg:text-sm inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                  aria-label={locale === 'es' ? `Ver más en ${category.name_es}` : `View more in ${category.name_en || category.name}`}
                  title={locale === 'es' ? `Ver más en ${category.name_es}` : `View more in ${category.name_en || category.name}`}
                >
                  {locale === 'es' ? `Ver más en ${category.name_es}` : `View more in ${category.name_en || category.name}`}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                {list.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                    aria-label={(locale === 'es' ? product.name_es : product.name_en) || product.name || 'Producto'}
                  >
                    <div className="bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                      <div className="relative bg-gray-50 aspect-square">
                        <Image
                          src={Array.isArray(product.media) && product.media.length > 0
                            ? (product.media[0] as { url: string }).url
                            : 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp'}
                          alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || 'Producto'}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-contain p-2 group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        {product.dolar_price && (
                          <div className="absolute bottom-2 right-2 bg-neutral-900/80 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {formatUSD(product.dolar_price)}
                          </div>
                        )}
                      </div>
                      <div className="px-2.5 py-2">
                        <div className="text-[0.70rem] lg:text-xs leading-snug text-gray-700 line-clamp-2 group-hover:text-teal-700 transition-colors min-h-[2.2rem] lg:min-h-[2.4rem]">
                          {(locale === 'es' ? product.name_es : product.name_en) || product.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Sentinel al final de la sección para carga progresiva */}
        <div ref={sentinelRef} className="flex justify-center mt-6">
          {loading && (
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {locale === 'es' ? 'Cargando más…' : 'Loading more…'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProgressiveCategorySection);