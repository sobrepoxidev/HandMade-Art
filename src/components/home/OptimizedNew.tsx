'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HomeProductsProvider } from '@/context/HomeProductsContext';
import OptimizedGridSection from '@/components/cards/OptimizedGridSection';
import FeaturedProductsSection from '../cards/FeaturedProductsSection';
import type { HomeSections } from '@/lib/home/computeSections';
import type { HomeCategory, HomeProduct } from '@/lib/home/types';

const SecondaryBanners = dynamic(() => import('@/components/home/SecondaryBanners'), {
  ssr: false,
  loading: () => <div className="mx-auto h-[280px] max-w-[1500px] bg-[#F5F1EB]" />,
});

const GiftsCarouselSection = dynamic(() => import('@/components/cards/GiftsCarouselSection'), {
  ssr: false,
  loading: () => <div className="h-48 bg-[#FAF6EF]" />,
});

const ProgressiveCategorySection = dynamic(() => import('@/components/cards/ProgressiveCategorySection'), {
  ssr: false,
  loading: () => <div className="h-48 bg-[#FAF6EF]" />,
});

interface OptimizedNewHomeProps {
  initialCategories?: HomeCategory[];
  initialProducts?: HomeProduct[];
  initialSections?: HomeSections;
  priorityCategoryIds?: number[];
  locale?: string;
}

export default function OptimizedNewHome({
  initialCategories = [],
  initialProducts = [],
  initialSections,
  priorityCategoryIds = [],
  locale = 'es',
}: OptimizedNewHomeProps) {
  return (
    <HomeProductsProvider
      initialCategories={initialCategories}
      initialProducts={initialProducts}
      initialSections={initialSections}
      priorityCategoryIds={priorityCategoryIds}
    >
      <div className="relative z-0 bg-[#FAF6EF]">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-8 lg:px-12">
          <FeaturedProductsSection />
          <OptimizedGridSection />
        </div>

        <SecondaryBanners locale={locale} />
        <GiftsCarouselSection />
        <ProgressiveCategorySection />
      </div>
    </HomeProductsProvider>
  );
}
