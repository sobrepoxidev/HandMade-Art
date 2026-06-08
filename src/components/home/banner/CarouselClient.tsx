"use client";

import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  TouchEvent,
  memo,
} from "react";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────
interface CarouselArrowProps {
  direction: "left" | "right";
  onClick: () => void;
}

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onClick: (index: number) => void;
}

interface CarouselProps {
  children: ReactNode;
}

// ────────────────────────────────────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────────────────────────────────────
const CarouselArrow = ({ direction, onClick }: CarouselArrowProps) => (
  <button
    onClick={onClick}
    aria-label={direction === "left" ? "Previous" : "Next"}
    className={`absolute top-1/2 -translate-y-1/2 z-50 bg-[#FAF6EF]/70 hover:bg-[#FAF6EF] rounded-sm p-2 text-[#2D2D2D] shadow-sm transition-all duration-200 hidden md:block ${
      direction === "left" ? "left-2" : "right-2"
    }`}
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
      className="text-[#2D2D2D]"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  </button>
);

const CarouselIndicators = ({
  total,
  current,
  onClick,
}: CarouselIndicatorsProps) => (
  <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-2 z-40">
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={`indicator-${index}`}
        onClick={() => onClick(index)}
        aria-label={`Go to slide ${index + 1}`}
        className={`h-2 rounded-full transition-all ${
          current === index ? "w-6 bg-[#C9A962]" : "w-2 bg-[#F5F1EB]/70"
        }`}
      />
    ))}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Fully interactive carousel component.
 * Handles autoplay, touch gestures and manual navigation.
 */
const CarouselClient = ({ children }: CarouselProps) => {
  const bannerCount = Array.isArray(children) ? children.length : 1;

  // ────────── State
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ────────── Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ────────── Effects
  useEffect(() => {
    startAutoPlay();
    return () => clearAutoPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, bannerCount]);

  // ────────── Autoplay helpers
  const clearAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startAutoPlay = () => {
    clearAutoPlay();
    intervalRef.current = setInterval(() => {
      if (!isPaused) setCurrentBanner((prev) => (prev + 1) % bannerCount);
    }, 4500);
  };

  // ────────── Navigation helpers
  const goToPrevious = () => {
    setCurrentBanner((prev) => (prev === 0 ? bannerCount - 1 : prev - 1));
    startAutoPlay();
  };

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % bannerCount);
    startAutoPlay();
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  // ────────── Touch events
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
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

  // ────────── Render
  return (
    <div 
      className="relative h-[255px] overflow-hidden" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation arrows */}
      <CarouselArrow direction="left" onClick={goToPrevious} />
      <CarouselArrow direction="right" onClick={goToNext} />

      {/* Muted arrows hint for touch devices */}
      <div className="absolute top-1/2 inset-x-0 flex justify-between px-4 -translate-y-1/2 z-40 text-white/50 pointer-events-none md:hidden">
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
          <polyline points="15 18 9 12 15 6" />
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
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* Play / pause button */}
      <button
        onClick={togglePause}
        aria-label={isPaused ? "Play" : "Pause"}
        className="absolute bottom-3 left-3 z-48 bg-[#FAF6EF]/70 hover:bg-[#FAF6EF] rounded-sm p-1 sm:p-2 text-[#2D2D2D] shadow-sm transition-all duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14"
          className="text-[#2D2D2D] sm:w-20 sm:h-20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          
        >
          {isPaused ? (
            <polygon points="5 3 19 12 5 21 5 3" />
          ) : (
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          )}
        </svg>
      </button>

      {/* Indicators */}
      <CarouselIndicators
        total={bannerCount}
        current={currentBanner}
        onClick={(index) => {
          setCurrentBanner(index);
          startAutoPlay();
        }}
      />

      {/* Slides */}
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {child}
            </div>
          ))
        : children}

      {/* Swipe hint */}
      <div className="absolute bottom-1.5 right-3 text-xs text-[#F5F1EB]/80 bg-[#2D2D2D]/30 px-2 py-0.5 rounded-sm md:hidden">
        Swipe to navigate
      </div>
    </div>
  );
};

export default memo(CarouselClient);
