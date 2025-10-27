"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onClick: (index: number) => void;
}

interface CarouselProps {
  children: React.ReactNode;
}

interface BannerTemplateProps {
  children: React.ReactNode;
  linkHref?: string;
  bgColor?: string;
}

const CarouselArrow: React.FC<CarouselArrowProps> = ({ direction, onClick }) => (
  <button 
    onClick={onClick}
    className={`absolute top-1/2 transform -translate-y-1/2 z-50 bg-white/30 hover:bg-white/50 rounded-full p-2 
    ${direction === 'left' ? 'left-2' : 'right-2'} transition-all duration-200 hidden md:block`}
    aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-gray-800"
    >
      {direction === 'left' 
        ? <polyline points="15 18 9 12 15 6"></polyline>
        : <polyline points="9 18 15 12 9 6"></polyline>
      }
    </svg>
  </button>
);

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({ total, current, onClick }) => (
  <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-2 z-50">
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={`indicator-${index}`}
        onClick={() => onClick(index)}
        className={`h-2 rounded-full transition-all 
        ${current === index ? 'w-6 bg-teal-600' : 'w-2 bg-gray-300'}`}
        aria-label={`Ir al banner ${index + 1}`}
      />
    ))}
  </div>
);

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const bannerCount = Array.isArray(children) ? children.length : 1;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentBanner((prev) => (prev + 1) % bannerCount);
      }
    }, 4500);
  };
  const locale = useLocale();

  useEffect(() => {
    startAutoPlay();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, bannerCount]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const goToPrevious = () => {
    setCurrentBanner((prev) => (prev === 0 ? bannerCount - 1 : prev - 1));
    startAutoPlay();
  };

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % bannerCount);
    startAutoPlay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div 
      className="relative h-[130] lg:h-[160px] xl:h-[215px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CarouselArrow direction="left" onClick={goToPrevious} />
      <CarouselArrow direction="right" onClick={goToNext} />

      <div className="absolute top-0.5 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2 z-40 text-white/50 pointer-events-none md:hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-20"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-20"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>

      <button 
        onClick={togglePause}
        className="absolute bottom-3 left-3 z-50 bg-white/30 hover:bg-white/50 rounded-full p-1.5 transition-all duration-200"
        aria-label={isPaused ? "Reproducir" : "Pausar"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-gray-800"
        >
          {isPaused ? (
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          ) : (
            <>
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </>
          )}
        </svg>
      </button>

      <CarouselIndicators
        total={bannerCount}
        current={currentBanner}
        onClick={(index) => {
          setCurrentBanner(index);
          startAutoPlay();
        }}
      />

      {React.Children.map(children, (child, index) => (
        <div 
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ${
            index === currentBanner ? 'translate-x-0 z-10' : 'translate-x-full z-0'
          }`}
        >
          {child}
        </div>
      ))}

      <div className="absolute bottom-0.5 right-3 text-[0.5rem] text-[#303030] bg-black/10 px-0.5 py-0.5 rounded md:hidden">
        {locale === 'es' ? 'Desliza para navegar' : 'Swipe to navigate'}
      </div>
    </div>
  );
};

const BannerTemplate: React.FC<BannerTemplateProps> = ({ children, linkHref = '#', bgColor = '' }) => (
  <div className={`relative h-full w-full ${bgColor}`}>
    {children}
    <Link href={linkHref} className="absolute top-0 left-0 right-0 h-full z-30" />
  </div>
);

export { Carousel, BannerTemplate };