'use client';

import React, { useMemo } from "react";
import Card from "./Card";
import { Link } from '@/i18n/navigation';
import Image from "next/image";
import { useHomeProductsContext } from "@/context/HomeProductsContext";
import CarrucelSectionA from "./CarrucelSectionA";
import { useLocale } from "next-intl";
import { formatUSD } from "@/lib/formatCurrency";


interface GridSectionProps {
  mobileActive?: boolean;
  maxCategories?: number;
}

const OptimizedGridSection: React.FC<GridSectionProps> = ({
  mobileActive = true,
  maxCategories = 6
}) => {
  const locale = useLocale();
  const {
    categories,
    sections,
    loading,
    error,
    usingSnapshot
  } = useHomeProductsContext();

  const desktopCards = useMemo(() => {
    const orderedCategories = sections.grid.priorityOrder
      .slice(0, maxCategories)
      .map(categoryId => categories.find(c => c.id === categoryId))
      .filter(Boolean);

    return orderedCategories.map(category => {
      const categoryProducts = sections.grid.products[category!.id] || [];
      const displayProducts = categoryProducts.slice(0, 4);

      return {
        title: locale === 'es' ? category!.name_es : category!.name_en || category!.name,
        link: `/products?category=${category!.id}`,
        content: (
          <div className="p-3">
            {displayProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 bg-[#2D2D2D]">
                  {displayProducts.map((product, idx) => (
                    <Link key={`${product.id}-${idx}`} href={`/product/${product.name}`} target="_self" className="block group">
                      <div className="flex flex-col items-center bg-[#FAF8F5] rounded-lg p-2 hover:shadow-md transition-all border border-[#E8E4E0] hover:border-[#C9A962]/30">
                        <div className="h-44 flex items-center justify-center mb-1">
                          <Image
                            src={product.media && Array.isArray(product.media) && product.media.length > 0 ?
                              (typeof (product.media[0] as { url: string }).url === 'string' ? (product.media[0] as { url: string }).url : 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp') :
                              'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp'}
                            alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                            width={100}
                            height={100}
                            style={{ objectFit: 'contain', maxHeight: '100%' }}
                            className="group-hover:scale-105 transition-transform"
                            priority

                          />
                        </div>
                        <span className="text-[10px] text-center line-clamp-1 font-medium text-[#2D2D2D]">
                          {locale === 'es' ? product.name_es : product.name_en}
                        </span>
                        {product.dolar_price && (
                          <span className="text-[10px] font-bold text-[#C9A962] mt-0.5">
                            {formatUSD(product.dolar_price)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-xs text-[#C9A962] hover:text-[#D4C4A8] text-center transition-colors">
                  <Link href={`/products?category=${category!.id}`} target="_self" className="inline-flex items-center">
                    <span>{locale === 'es' ? 'Ver todo en '+ category!.name_es: 'View all in '+ category!.name_en}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center h-48">
                  <Image
                    src={'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp'}
                    alt={category!.name || 'Categoría'}
                    width={180}
                    height={180}
                    style={{ objectFit: 'contain', maxHeight: '100%' }}
                    className="transition-transform hover:scale-105"

                  />
                </div>
                <div className="mt-3 text-xs text-[#C9A962] hover:text-[#D4C4A8] text-center transition-colors">
                  <Link href={`/products?category=${category!.id}`} target="_self" className="inline-flex items-center">
                    <span>{locale === 'es' ? 'Ver todo en '+ category!.name_es: 'View all in '+ category!.name_en}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        ),
      };
    });
  }, [categories, sections.grid, maxCategories, locale]);

  const showSkeleton = loading && !usingSnapshot && (sections.grid.priorityOrder?.length ?? 0) === 0;

  if (showSkeleton) {
    return (
      <>
        {/* Desktop Skeleton */}
        <div className="max-lg:hidden grid grid-cols-3 gap-5 mt-4 mb-4 mx-4 pb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#F5F1EB] animate-pulse h-64 rounded-xl"></div>
          ))}
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden grid grid-rows-3 gap-4 mt-4 mb-4 mx-4 pb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#F5F1EB] animate-pulse h-64 rounded-xl"></div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-[#C44536] text-center p-4 bg-[#C44536]/10 rounded-xl mx-4 my-4">
        <p>{locale === 'es' ? 'Error al cargar categorías': 'Error loading categories'}</p>
        <p className="text-sm opacity-70">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-h-full h-full">
      {/* Desktop Version */}
      <div className="grid grid-cols-2 md:grid-cols-3 px-4 gap-4 mb-4 mt-4 max-lg:hidden">
        {desktopCards.map((card, index) => (
          <Card key={index} {...{...card, title: card.title || ''}} />
        ))}
      </div>

      {/* Mobile Version */}
      {mobileActive && (
        <div className="lg:hidden h-full py-0.5">
          {(() => {
            const mobileCategories = sections.grid.priorityOrder
              .slice(0, maxCategories - 2)
              .map(categoryId => categories.find(c => c.id === categoryId))
              .filter(Boolean);

            return (
              <CarrucelSectionA
                items={mobileCategories.map((category, index) => {
                  const categoryProducts = sections.grid.products[category!.id] || [];

                  const cardColors = [
                    'bg-[#2D2D2D]',
                    'bg-[#3A3A3A]',
                    'bg-[#2D2D2D]',
                    'bg-[#3A3A3A]'
                  ];

                  const cardColor = cardColors[index % cardColors.length];
                  const isFirst = index === 0;
                  const isLast = index === mobileCategories.length - 1;
                  return {
                    title: `${locale === 'es' ? category!.name_es : category!.name_en || category!.name}`,
                    content: (
                      <div className="grid grid-cols-2 gap-2 w-full h-full px-1 pt-2.5">
                        {categoryProducts.slice(0, 4).map((product, idx) => (
                          <Link key={idx} href={`/product/${product.name}`} className="block text-center">
                            <div className="h-44 flex items-center justify-center bg-[#FAF8F5] rounded-lg shadow-sm border border-[#E8E4E0]">
                              <Image
                                src={product.media && Array.isArray(product.media) && product.media.length > 0 ? (product.media[0] as { url: string }).url : 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp'}
                                alt={product.name || ''}
                                width={100}
                                height={100}
                                style={{ objectFit: 'contain', maxHeight: '100%' }}
                                className="p-0.5"
                              />
                            </div>
                            {product.dolar_price && (
                              <div className="mt-1 text-[#C9A962] text-xs font-semibold">
                                {formatUSD(product.dolar_price)}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    ),
                    link: `/products?category=${category!.id}`,
                    className: `${cardColor} rounded-xl px-3 pt-2 pb-3 shadow-sm border border-[#C9A962]/10`,
                    start: isFirst,
                    end: isLast
                  };
                })}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedGridSection);
