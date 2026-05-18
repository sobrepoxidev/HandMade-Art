"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  label: string;
}

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onClick: (index: number) => void;
  label: (i: number) => string;
}

interface CarouselProps {
  children: React.ReactNode;
}

interface BannerTemplateProps {
  children: React.ReactNode;
  linkHref?: string;
  bgColor?: string;
}

const CarouselArrow: React.FC<CarouselArrowProps> = ({ direction, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`absolute top-1/2 -translate-y-1/2 z-50 grid place-items-center w-11 h-11 rounded-full
      bg-[#1A1A1A]/45 hover:bg-[#1A1A1A]/70 text-[#F5F1EB]
      transition-colors duration-200 hidden md:grid
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]
      ${direction === 'left' ? 'left-3' : 'right-3'}`}
  >
    {direction === 'left' ? (
      <ChevronLeft className="h-5 w-5" strokeWidth={2} />
    ) : (
      <ChevronRight className="h-5 w-5" strokeWidth={2} />
    )}
  </button>
);

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({ total, current, onClick, label }) => (
  <div
    className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5 z-50"
    role="tablist"
    aria-label="Slides"
  >
    {Array.from({ length: total }).map((_, index) => (
      <button
        type="button"
        key={`indicator-${index}`}
        onClick={() => onClick(index)}
        aria-label={label(index)}
        aria-selected={current === index}
        role="tab"
        className="group grid place-items-center w-11 h-11 -m-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962] rounded-full"
      >
        <span
          className={`h-1.5 rounded-full transition-all duration-300 ${
            current === index ? 'w-7 bg-[#C9A962]' : 'w-1.5 bg-[#F5F1EB]/55 group-hover:bg-[#F5F1EB]/80'
          }`}
        />
      </button>
    ))}
  </div>
);

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const bannerCount = Array.isArray(children) ? children.length : 1;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const locale = useLocale();

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (prefersReducedMotion || isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerCount);
    }, 5500);
  }, [prefersReducedMotion, isPaused, bannerCount]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  const togglePause = () => setIsPaused((p) => !p);

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
      if (touchDiff > 0) goToNext();
      else goToPrevious();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const isAnimating = !prefersReducedMotion && !isPaused;
  const arrowLabel = (dir: 'left' | 'right') =>
    dir === 'left'
      ? locale === 'es' ? 'Aviso anterior' : 'Previous notice'
      : locale === 'es' ? 'Siguiente aviso' : 'Next notice';
  const indicatorLabel = (i: number) =>
    locale === 'es' ? `Ir al aviso ${i + 1}` : `Go to notice ${i + 1}`;
  const pauseLabel = isAnimating
    ? locale === 'es' ? 'Pausar avisos' : 'Pause notices'
    : locale === 'es' ? 'Reproducir avisos' : 'Play notices';

  return (
    <div
      className="relative min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] xl:min-h-[400px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label={locale === 'es' ? 'Avisos secundarios' : 'Secondary notices'}
    >
      <CarouselArrow direction="left" onClick={goToPrevious} label={arrowLabel('left')} />
      <CarouselArrow direction="right" onClick={goToNext} label={arrowLabel('right')} />

      <button
        type="button"
        onClick={togglePause}
        aria-label={pauseLabel}
        aria-pressed={!isAnimating}
        className="absolute bottom-2 left-2 z-50 grid place-items-center w-11 h-11 rounded-full
                   bg-[#1A1A1A]/40 hover:bg-[#1A1A1A]/65 text-[#F5F1EB]
                   transition-colors duration-200
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962]"
      >
        {isAnimating ? (
          <Pause className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Play className="h-4 w-4" strokeWidth={2} />
        )}
      </button>

      <CarouselIndicators
        total={bannerCount}
        current={currentBanner}
        onClick={(index) => {
          setCurrentBanner(index);
          startAutoPlay();
        }}
        label={indicatorLabel}
      />

      {React.Children.map(children, (child, index) => (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          aria-hidden={index !== currentBanner}
          role="tabpanel"
        >
          {child}
        </div>
      ))}
    </div>
  );
};

const BannerTemplate: React.FC<BannerTemplateProps> = ({ children, linkHref = '#', bgColor = '' }) => (
  <div className={`relative h-full w-full ${bgColor}`}>
    {children}
    <Link
      href={linkHref}
      className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A962]"
      aria-label="Open notice"
    />
  </div>
);

export { Carousel, BannerTemplate };
