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
  // Props simplificados
  mobileActive?: boolean;
  /** Número máximo de categorías a mostrar */
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
    error 
  } = useHomeProductsContext();
  
  // Usamos useMemo para evitar cálculos repetidos en cada renderizado
  const desktopCards = useMemo(() => {
    // Obtener las categorías en el orden de prioridad definido
    const orderedCategories = sections.grid.priorityOrder
      .slice(0, maxCategories)
      .map(categoryId => categories.find(c => c.id === categoryId))
      .filter(Boolean);
    
    return orderedCategories.map(category => {
      const categoryProducts = sections.grid.products[category!.id] || [];
      const displayProducts = categoryProducts.slice(0, 4); // Mostrar hasta 4 productos por categoría

      return {
        title: locale === 'es' ? category!.name_es : category!.name_en || category!.name,
        link: `/products?category=${category!.id}`,
        content: (
          <div className="p-3">
            {displayProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 bg-[#303030]">
                  {displayProducts.map((product, idx) => (
                    <Link key={`${product.id}-${idx}`} href={`/product/${product.id}`} target="_self" className="block group">
                      <div className="flex flex-col items-center bg-white rounded p-2 hover:shadow-sm transition-shadow">
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
                            priority // Solo priorizar las primeras imágenes
                            
                          />
                        </div>
                        <span className="text-[10px] text-center line-clamp-1 font-medium text-gray-800">
                          {locale === 'es' ? product.name_es : product.name_en}
                        </span>
                        {product.dolar_price && (
                          <span className="text-[10px] font-bold text-teal-700 mt-0.5">
                            {formatUSD(product.dolar_price)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-xs text-teal-600 hover:underline text-center">
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
                <div className="mt-3 text-xs text-teal-600 hover:underline text-center">
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



  if (loading) {
    return (
      <>
        {/* Skeleton para desktop */}
        <div className="max-lg:hidden grid grid-cols-3 gap-5 mt-4 mb-4 mx-4 pb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>

        {/* Skeleton para móvil */}
        <div className="lg:hidden grid grid-rows-3 gap-4 mt-4 mb-4 mx-4 pb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{locale === 'es' ? 'Error al cargar categorías': 'Error loading categories'}</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-h-full h-full">
      {/* Versión de escritorio - Muestra categorías en grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 px-4 gap-4 mb-4 mt-4 max-lg:hidden">
        {desktopCards.map((card, index) => (
          <Card key={index} {...{...card, title: card.title || ''}} />
        ))}
      </div>
      
      {/* Versión móvil - Usa CarrucelSectionA para mostrar tarjetas en carrusel horizontal */}
      {mobileActive && (
        <div className="lg:hidden h-full py-0.5">
          {
            // Precomputar categorías móviles para conocer el último índice
          }
          {(() => {
            const mobileCategories = sections.grid.priorityOrder
              .slice(0, maxCategories - 2)
              .map(categoryId => categories.find(c => c.id === categoryId))
              .filter(Boolean);

            return (
              <CarrucelSectionA
                items={mobileCategories.map((category, index) => {
                  const categoryProducts = sections.grid.products[category!.id] || [];

                  // Colores para las tarjetas
                  const cardColors = [
                    'bg-[#303030]',   // Azul
                    'bg-teal-500',  // Verde
                    'bg-[#303030]',   // Rosa
                    'bg-teal-500'     // Rojo
                  ];

                  // Seleccionar color
                  const cardColor = cardColors[index % cardColors.length];
                  const isFirst = index === 0;
                  const isLast = index === mobileCategories.length - 1;
                  return {
                    title: `${locale === 'es' ? category!.name_es : category!.name_en || category!.name}`,
                    content: (
                      <div className="grid grid-cols-2 gap-2 w-full h-full px-1 pt-2.5">
                        {categoryProducts.slice(0, 4).map((product, idx) => (
                          <Link key={idx} href={`/product/${product.id}`} className="block text-center">
                            <div className="h-44 flex items-center justify-center bg-white rounded-lg shadow-sm">
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
                              <div className="mt-1 text-white text-xs font-medium">
                                {formatUSD(product.dolar_price)}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    ),
                    link: `/products?category=${category!.id}`,
                    className: `${cardColor} rounded-xl px-3 pt-2 pb-3 shadow-sm `,
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
