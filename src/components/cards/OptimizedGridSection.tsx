'use client';

import React, { useMemo } from "react";
import Card from "./Card";
import Link from "next/link";
import Image from "next/image";
import { useProductsContext } from "@/context/ProductsContext";
import CarrucelSectionA from "./CarrucelSectionA";
import { useLocale } from "next-intl";


interface GridSectionProps {
  // Props simplificados
  mobileActive?: boolean;
  /** Identificador único para este componente, usado para la distribución de productos */
  sectionId?: string;
}

const OptimizedGridSection: React.FC<GridSectionProps> = ({
  mobileActive = true,
}) => {
  const locale = useLocale();
  const { categories, sectionProducts, loading, error } = useProductsContext();
  
  // Definimos internamente qué categorías mostrar (0-6 por defecto)
  const indexStart = 0;
  const indexEnd = 6;
  
  // Usamos useMemo para evitar cálculos repetidos en cada renderizado
  const desktopCards = useMemo(() => {
    return categories.slice(indexStart, indexEnd).map(category => {
      const categoryProducts = sectionProducts.gridByCategory[category.id] || [];
      const displayProducts = categoryProducts.slice(0, 4); // Mostrar hasta 4 productos por categoría

      return {
        title: locale === 'es' ? category.name_es : category.name_en || category.name,
        link: `/products?category=${category.id}`,
        content: (
          <div className="p-3">
            {displayProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 bg-[#303030]">
                  {displayProducts.map((product, idx) => (
                    <Link key={`${product.id}-${idx}`} href={`/product/${product.id}`} className="block group">
                      <div className="flex flex-col items-center bg-white rounded p-2 hover:shadow-sm transition-shadow">
                        <div className="h-44 flex items-center justify-center mb-1">
                          <Image
                            src={product.media && product.media.length > 0 ?
                              (typeof product.media[0]["url"] === 'string' ? product.media[0]["url"] : '/placeholder.jpg') :
                              '/placeholder.jpg'}
                            alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                            width={100}
                            height={100}
                            style={{ objectFit: 'contain', maxHeight: '100%' }}
                            className="group-hover:scale-105 transition-transform"
                            priority={idx < 2} // Solo priorizar las primeras imágenes
                          />
                        </div>
                        <span className="text-[10px] text-center line-clamp-1 font-medium text-gray-800">
                          {locale === 'es' ? product.name_es : product.name_en}
                        </span>
                        {product.price && (
                          <span className="text-[10px] font-bold text-teal-700 mt-0.5">
                            ₡{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-xs text-teal-600 hover:underline text-center">
                  <Link href={`/products?category=${category.id}`} className="inline-flex items-center">
                    <span>{locale === 'es' ? 'Ver todo en '+ category.name_es: 'View all in '+ category.name_en}</span>
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
                    src={'/placeholder.jpg'}
                    alt={category.name || 'Categoría'}
                    width={180}
                    height={180}
                    style={{ objectFit: 'contain', maxHeight: '100%' }}
                    className="transition-transform hover:scale-105"
                  />
                </div>
                <div className="mt-3 text-xs text-teal-600 hover:underline text-center">
                  <Link href={`/products?category=${category.id}`} className="inline-flex items-center">
                    <span>{locale === 'es' ? 'Ver todo en '+ category.name_es: 'View all in '+ category.name_en}</span>
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
  }, [categories, sectionProducts, indexStart, indexEnd, locale]);



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
    <div className="w-full">
      {/* Versión de escritorio - Muestra categorías en grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 px-4 gap-4 mb-4 mt-4 max-lg:hidden">
        {desktopCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      {/* Versión móvil - Usa CarrucelSectionA para mostrar tarjetas en carrusel horizontal */}
      {mobileActive && (
        <div className="lg:hidden">
          <CarrucelSectionA
            items={
              // Ordenamos las categorías dando prioridad a Paintings y Napkin Holders
              [...categories.slice(indexStart, indexEnd-2)]
                .sort((a, b) => {
                  // Obtener nombres de categorías para comparación (case insensitive)
                  const aName = (a.name || '').toLowerCase();
                  const bName = (b.name || '').toLowerCase();

                  // Priorizar Paintings y Napkin Holders
                  const isPrioritizedA = aName.includes('painting') || aName.includes('napkin holder');
                  const isPrioritizedB = bName.includes('painting') || bName.includes('napkin holder');

                  // Si a es prioritario y b no, a va primero
                  if (isPrioritizedA && !isPrioritizedB) return -1;
                  // Si b es prioritario y a no, b va primero
                  if (!isPrioritizedA && isPrioritizedB) return 1;

                  // Si ambos son prioritarios o ninguno lo es, priorizamos por cantidad de productos
                  const aProducts = (sectionProducts.gridByCategory[a.id] || []).length;
                  const bProducts = (sectionProducts.gridByCategory[b.id] || []).length;

                  // Priorizar categorías con 4 o más productos
                  if (aProducts >= 4 && bProducts < 4) return -1;
                  if (aProducts < 4 && bProducts >= 4) return 1;

                  // Si ambas tienen 4+ o ambas tienen menos de 4, ordenar por cantidad
                  return bProducts - aProducts; // Ordenar de mayor a menor
                })
                .map((category, index) => {
                  // Convertir la categoría a formato esperado por CarrucelSectionA
                  const categoryProducts = sectionProducts.gridByCategory[category.id] || [];

                  // Colores para las tarjetas
                  const cardColors = [
                    'bg-[#303030]',   // Azul
                    'bg-teal-500',  // Verde
                    'bg-[#303030]',   // Rosa
                    'bg-teal-500'     // Rojo
                  ];

                  // Seleccionar color
                  const cardColor = cardColors[index % cardColors.length];
                  
                  return {
                    title: `${locale === 'es' ? category.name_es : category.name_en || category.name}`,
                    content: (
                      <div className="grid grid-cols-2 gap-2 w-full h-full px-1 pt-4">
                        {categoryProducts.slice(0, 4).map((product, idx) => (
                          <Link key={idx} href={`/product/${product.id}`} className="block text-center">
                            <div className="h-44 flex items-center justify-center bg-white rounded-lg shadow-sm">
                              <Image
                                src={product.media && product.media.length > 0 ? product.media[0].url : '/placeholder-image.png'}
                                alt={product.name || ''}
                                width={100}
                                height={100}
                                style={{ objectFit: 'contain', maxHeight: '100%' }}
                                className="p-0.5"
                                priority={idx < 7} // Solo priorizar las primeras imágenes
                              />
                            
                        
                            </div>
                              {/*precio*/}
                              
                          </Link>
                        ))}
                      </div>
                    ),
                    link: `/products?category=${category.id}`,
                    className: `${cardColor} rounded-xl px-3 pt-2 pb-3 shadow-sm`
                  };
                })
            }
          />
        </div>
      )}
    </div>
  );
};

export default OptimizedGridSection;
