'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useProductsContext } from '@/context/ProductsContext';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';

interface OptimizedCarrucelSectionProps {
  title: string;
  startIndex?: number;
  endIndex?: number;
  mobileInvertList?: boolean;
  colors?: string[];
}

const OptimizedCarrucelSection: React.FC<OptimizedCarrucelSectionProps> = ({
  title,
  startIndex = 0,
  endIndex = 10,
  mobileInvertList = false,
  colors = ['bg-green-500', 'bg-blue-500']
}) => {
  const locale = useLocale();
  const { products, loading, error } = useProductsContext();

  // Referencias para controlar el scroll
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filtrar productos para mostrar solo los del rango especificado usando useMemo
  const displayProducts = useMemo(() => {
    return products
      .filter(product => 
        product.media && 
        Array.isArray(product.media) && 
        product.media.length > 0 && 
        (product.media[0] as { url: string }).url
      )
      .slice(startIndex, endIndex);
  }, [products, startIndex, endIndex]);

  // Verificar si se puede hacer scroll cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    
    // Comprobar scroll inicial
    checkScroll();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [displayProducts]);

  // Función para comprobar el estado del scroll
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // Funciones para control del scroll
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.7;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.7;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Controlar el scroll para actualizar los botones
  const handleScroll = () => {
    checkScroll();
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse h-8 w-56 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{locale === 'es' ? 'Error al cargar productos' : 'Error loading products'}</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-6 px-4 relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      
      {/* Controles de navegación */}
      <div className="absolute top-6 right-4 flex space-x-2">
        <button 
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`p-1 rounded-full border border-gray-300 ${
            canScrollLeft ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`p-1 rounded-full border border-gray-300 ${
            canScrollRight ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Carrusel de productos */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
        onScroll={handleScroll}
      >
        {displayProducts.length > 0 ? (
          // Decide el orden basado en mobileInvertList
          [...displayProducts]
            .map((product, index) => {
              // Selector de color alternando entre los colores proporcionados
              // Si mobileInvertList es true, se invierte el orden de los productos en móvil
              const effectiveIndex = mobileInvertList ? displayProducts.length - 1 - index : index;
              const bgColor = colors[effectiveIndex % colors.length];
              
              return (
                <div 
                  key={product.id} 
                  className={`${mobileInvertList ? 'order-last' : ''} min-w-[260px] flex-shrink-0 snap-start mr-4 last:mr-0 rounded-lg overflow-hidden shadow-sm`}
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className={`${bgColor} p-3 h-full flex flex-col`}>
                      <h3 className="text-white font-medium text-lg mb-2 line-clamp-1">
                        {locale === 'es' ? product.name_es : product.name_en || product.name}
                      </h3>
                      <div className="bg-white rounded-lg flex-grow flex items-center justify-center p-3">
                        <Image
                          src={product.media && Array.isArray(product.media) && product.media.length > 0 ? (product.media[0] as { url: string }).url : '/placeholder-image.png'}
                          alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                          width={180}
                          height={180}
                          style={{ objectFit: 'contain', maxHeight: '200px' }}
                          priority={index < 2} // Solo priorizar las primeras imágenes
                        />
                      </div>
                      {product.dolar_price && (
                        <div className="mt-2 text-white font-bold">
                          {formatUSD(product.dolar_price)}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })
        ) : (
          <div className="w-full text-center py-10 text-gray-500">
            {locale === 'es' ? 'No hay productos disponibles en este momento.' : 'No products available at the moment.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default OptimizedCarrucelSection;
