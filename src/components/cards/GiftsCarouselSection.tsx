'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useProductsContext } from '@/context/ProductsContext';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';

interface GiftsCarouselSectionProps {
  /** Identificador único para este componente, usado para la distribución de productos */
  sectionId?: string;
}

/**
 * Componente específico para la sección de carrusel "Regalos con significado"
 * - En móvil: Muestra tarjetas con grid 2x2 (4 productos por tarjeta)
 * - En desktop: Muestra una fila horizontal de productos individuales
 */

const GiftsCarouselSection: React.FC<GiftsCarouselSectionProps> = ({ 
}) => {
  const locale = useLocale();
  const { sectionProducts } = useProductsContext();
  
  // Referencia al contenedor del carrusel para controlar el scroll
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar la posición del scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollPosition, setMaxScrollPosition] = useState(0);
  
  // Obtenemos el título localizado
  const title = useMemo(() => {
    return locale === 'es' ? 'Regalos con significado' : 'Meaningful Gifts';
  }, [locale]);
  
  /**
   * Sistema inteligente para seleccionar productos sin duplicación
   * Estrategia mejorada:
   * 1. Evitamos productos que ya se muestran en OptimizedGridSection y FeaturedProductsSection
   * 2. Filtramos por categorías diferentes a las que muestra el grid principal
   * 3. Limitamos a 12 productos como máximo
   * 4. Priorizamos productos con imágenes y destacados
   */
  const displayProducts = sectionProducts.gifts;
  
  // Función para obtener el color de la tarjeta basado en el índice
  const getCardColor = (index: number) => {
    return index % 2 === 0 ? 'bg-teal-500' : 'bg-[#303030]';
  };
  
  // Función para actualizar la información de scroll
  const updateScrollInfo = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setScrollPosition(scrollLeft);
    setMaxScrollPosition(scrollWidth - clientWidth - 10); // -10 como margen
  };
  
  // Función para hacer scroll al elemento anterior
  const scrollToPrev = () => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 300; // Pixels a desplazar
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };
  
  // Función para hacer scroll al siguiente elemento
  const scrollToNext = () => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 300; // Pixels a desplazar
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  // Manejador para el evento de scroll
  const handleScroll = () => {
    updateScrollInfo();
  };
  
  // Configuramos el observador de scroll al montar el componente
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Inicializamos la información de scroll
      updateScrollInfo();
      
      return () => {
        carousel.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  // Actualizamos la información de scroll cuando cambian los productos
  useEffect(() => {
    updateScrollInfo();
    
    // También actualizamos cuando cambia el tamaño de la ventana
    window.addEventListener('resize', updateScrollInfo);
    return () => {
      window.removeEventListener('resize', updateScrollInfo);
    };
  }, [displayProducts]);
  
  // Preparar los grupos de productos para móvil (4 productos por tarjeta)
  const productGroups = useMemo(() => {
    const groups = [];
    // Aseguramos que todos los grupos tengan exactamente 4 productos
    for (let i = 0; i < displayProducts.length; i += 4) {
      // Obtenemos hasta 4 productos para este grupo
      const group = displayProducts.slice(i, i + 4);
      // Solo incluimos grupos completos de 4 productos
      if (group.length === 4) {
        groups.push(group);
      }
    }
    return groups;
  }, [displayProducts]);

  return (
    <section className="py-6 px-4 relative overflow-hidden bg-gradient-to-br from-teal-50/30 via-white to-amber-50/30">
     
      
      {/* Encabezado con título y enlace Ver más */}
      <div className="flex justify-between items-center mb-1 z-10 relative">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-teal-500 mr-2"></div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        
        <Link href="/products" className="px-1 py-0 text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors flex items-center">
          {locale === 'es' ? 'Ver más' : 'View more'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      {/* Controles de navegación en una fila separada */}
      <div className="flex justify-end mb-1 z-10 relative">
        <div className="flex items-center space-x-2">
          <button 
            onClick={scrollToPrev}
            disabled={scrollPosition <= 0}
            className={`p-0.5 rounded-full border border-teal-500 transition-colors ${scrollPosition <= 0 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-teal-500 hover:bg-teal-50'}`}
            aria-label="Anterior"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button 
            onClick={scrollToNext}
            disabled={scrollPosition >= maxScrollPosition}
            className={`p-0.5 rounded-full border border-teal-500 transition-colors ${scrollPosition >= maxScrollPosition ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-teal-500 hover:bg-teal-50'}`}
            aria-label="Siguiente"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Carrusel de productos */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
        onScroll={handleScroll}
      >
        {displayProducts.length > 0 ? (
          <>
            {/* Versión para móvil: Tarjetas con grid 2x2 (4 productos por tarjeta) */}
            <div className="lg:hidden flex w-full">
              {productGroups.map((groupProducts, groupIndex) => (
                <div 
                  key={`group-${groupIndex}`} 
                  className="min-w-[260px] flex-shrink-0 snap-start mr-4 last:mr-0 rounded-lg overflow-hidden shadow-sm"
                >
                  <div className={`${getCardColor(groupIndex)} p-3 h-full flex flex-col rounded-t-lg`}>
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                        <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                      </svg>
                      <div className="h-0.5 w-10 bg-white/40 rounded mr-2"></div>

                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full h-full">
                      {groupProducts.map((product, idx) => (
                        <Link key={`${product.id}-${idx}`} href={`/product/${product.id}`} className="block text-center">
                          <div className="h-32 flex items-center justify-center bg-white rounded-lg shadow-sm p-1">
                            <Image
                              src={product.media && Array.isArray(product.media) && product.media.length > 0 ? (product.media[0] as { url: string }).url : '/placeholder-image.png'}
                              alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                              width={90}
                              height={90}
                              style={{ objectFit: 'contain', maxHeight: '100%' }}
                              className="object-contain max-h-full"
                              unoptimized
                              loading="lazy"
                            />
                          </div>
                          <div className="mt-1 text-white text-xs font-medium line-clamp-1">
                            {product.dolar_price && (
                              <>{formatUSD(product.dolar_price)}</>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Versión para desktop: Fila horizontal de productos individuales */}
            <div className="hidden lg:flex w-full">
              {displayProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="min-w-[200px] flex-shrink-0 snap-start mr-4 last:mr-0 group"
                >
                  <Link href={`/product/${product.id}`} className="block h-full">
                    <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-all duration-300 h-full flex flex-col transform group-hover:-translate-y-1">
                      <div className="relative overflow-hidden rounded-md mb-3">
                        <div className="h-40 flex items-center justify-center p-2 bg-gray-50 rounded-md">
                          <Image
                            src={product.media && Array.isArray(product.media) && product.media.length > 0 ? (product.media[0] as { url: string }).url : '/placeholder-image.png'}
                            alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                            width={140}
                            height={140}
                            style={{ objectFit: 'contain', maxHeight: '100%' }}
                            loading="lazy"
                            unoptimized
                            className="transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {product.is_featured && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">
                            {locale === 'es' ? 'Destacado' : 'Featured'}
                          </div>
                        )}
                      </div>
                      <h3 className="text-gray-800 text-sm font-medium line-clamp-2 flex-grow">
                        {locale === 'es' ? product.name_es : product.name_en || product.name}
                      </h3>
                      {product.colon_price && (
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-teal-600 font-bold text-sm">
                            {formatUSD(product.colon_price)}
                          </div>
                          <div className="text-xs text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            {locale === 'es' ? 'Ver detalles' : 'View details'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full text-center py-10 text-gray-500">
            {locale === 'es' ? 'No hay productos disponibles en este momento.' : 'No products available at the moment.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default GiftsCarouselSection;
