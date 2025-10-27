"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useRouter, Link } from '@/i18n/navigation';
import { CarrucelItem } from './CarrucelSectionA';

const CarouselCard: React.FC<{
  title: string;
  content: React.ReactNode;
  link: string;
  className?: string;
}> = ({ title, content, link, className = "" }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el clic se originó dentro de un <a>, permitir esa navegación en su lugar.
    const target = e.target as HTMLElement;
    if (target.closest('a')) return;
    router.push(link);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex h-full shadow-md flex-col cursor-pointer ${className}`}
    >
      <div className="flex flex-col">
        <Link href={link} className="text-2xl font-bold px-2 truncate whitespace-nowrap text-white hover:underline" aria-label={title}>
          {title}
        </Link>
        <div className="flex-grow flex items-center justify-center">{content}</div>
      </div>
    </div>
  );
};

interface CarouselClientProps {
  items: CarrucelItem[];
}

const CarouselClient: React.FC<CarouselClientProps> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    const onScroll = () => handleScroll();
    ref.addEventListener('scroll', onScroll);

    // Ajustar flechas inicialmente
    handleScroll();

    return () => {
      ref.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="relative">
      {/* Contenedor del carrusel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-3  snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {items.map((item, index) => {
          const isFirst = item.start ?? index === 0;
          const isLast = item.end ?? index === items.length - 1;
          const edgeClass = `${isFirst ? 'ml-2 pl-3' : ''} ${isLast ? 'mr-3' : ''}`.trim();
          return (
            <div key={index} className={`min-w-[85vw] snap-start ${edgeClass}`}>
              <CarouselCard {...item} />
            </div>
          );
        })}
      </div>

      {/* Flechas de navegación */}
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-black/30 bg-transparent rounded-full p-2"
          aria-label="Anterior"
          onClick={() => scrollRef.current?.scrollBy({ left: -window.innerWidth * 0.9, behavior: 'smooth' })}
        >
          {/* Icono simple */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      )}

      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-black/30 bg-transparent rounded-full p-2"
          aria-label="Siguiente"
          onClick={() => scrollRef.current?.scrollBy({ left: window.innerWidth * 0.9, behavior: 'smooth' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      )}
    </div>
  );
};

export default CarouselClient;
