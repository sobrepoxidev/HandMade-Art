'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel, BannerTemplate } from "@/components/home/Banner";
import { BadgeCheck, Handshake, Sprout, Scale } from 'lucide-react';
import { HomeProductsProvider } from '@/context/HomeProductsContext';
import OptimizedGridSection from '@/components/cards/OptimizedGridSection';
import FeaturedProductsSection from '../cards/FeaturedProductsSection';
import GiftsCarouselSection from '@/components/cards/GiftsCarouselSection';
import ProgressiveCategorySection from '@/components/cards/ProgressiveCategorySection';
import type { Database } from '@/lib/database.types';
import type { HomeSections } from '@/lib/home/computeSections';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface OptimizedNewHomeProps {
  initialCategories?: Category[];
  initialProducts?: Product[];
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
      <div className="max-w-[1500px] mx-auto relative z-0 bg-[#FAF6EF]">
        <h2 className="sr-only">
          {locale === 'es' ? 'Avisos y propuesta de valor' : 'Notices and value props'}
        </h2>
        <Carousel>
          {/* Banner 1: Artesanía (oficio primero) */}
          <BannerTemplate linkHref="/about" bgColor="bg-gradient-to-r from-[#F5F1EB] to-[#FAF8F5]">
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <h3 className="font-display text-[#2D2D2D] text-xl lg:text-2xl font-medium tracking-[-0.005em] text-center">
                {locale === 'es' ? 'Artesanía única hecha a mano' : 'One-of-a-kind handmade craft'}
              </h3>
              <p className="text-[#9C9589] text-xs sm:text-sm mt-1 text-center max-w-xl">
                {locale === 'es'
                  ? 'Por residentes en rehabilitación de centros penales'
                  : 'By residents in rehabilitation centers'}
              </p>

              <div className="flex items-center justify-center gap-6 sm:gap-12 mt-3 lg:mt-4">
                <ValueProp
                  icon={<Handshake className="w-5 h-5 lg:w-6 lg:h-6 text-[#A08848]" strokeWidth={1.75} />}
                  title={locale === 'es' ? 'Impacto social' : 'Social impact'}
                  subtitle={locale === 'es' ? 'Apoyando la reinserción' : 'Supporting reintegration'}
                />
                <ValueProp
                  icon={<Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-[#A08848]" strokeWidth={1.75} />}
                  title={locale === 'es' ? 'Sostenibilidad' : 'Sustainability'}
                  subtitle={locale === 'es' ? 'Materiales ecológicos' : 'Eco-friendly materials'}
                />
                <ValueProp
                  icon={<BadgeCheck className="w-5 h-5 lg:w-6 lg:h-6 text-[#A08848]" strokeWidth={1.75} />}
                  title={locale === 'es' ? 'Calidad' : 'Quality'}
                  subtitle={locale === 'es' ? 'Detalles artesanales' : 'Artisanal details'}
                />
              </div>
            </div>
          </BannerTemplate>

          {/* Banner 2: Envíos a Costa Rica */}
          <BannerTemplate linkHref="/shipping" bgColor="bg-gradient-to-r from-[#FAF8F5] to-[#F5F1EB]">
            <div className="relative h-full flex flex-col md:flex-row justify-center items-center md:gap-10 px-4 md:px-24 py-4 md:py-6">
              <div className="max-w-full text-center md:text-left">
                <h3 className="font-display text-[#2D2D2D] text-xl sm:text-2xl font-medium tracking-[-0.005em]">
                  {locale === 'es' ? 'Envíos a todo Costa Rica' : 'Shipping across Costa Rica'}
                </h3>
                <p className="text-sm sm:text-base font-light text-[#2D2D2D] mt-1">
                  <span className="font-semibold text-[#A08848]">
                    {locale === 'es' ? 'Tarifas desde $6.99' : 'Rates from $6.99'}
                  </span>
                </p>
                <p className="text-[#9C9589] text-[11px] sm:text-xs mt-1">
                  {locale === 'es'
                    ? '*Costo variable según el peso. Pulsa para más información'
                    : '*Variable cost depending on weight. Click for more info'}
                </p>
              </div>

              <div className="relative h-[60px] w-[60px] md:h-[110px] md:w-[110px] shrink-0 mt-2 md:mt-0">
                <Image
                  src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/home/mapa-cr-DZ7GK5iuwsfpfwJ2Udbhz8Rxd1bUBF.webp"
                  alt={locale === 'es' ? 'Mapa de Costa Rica' : 'Map of Costa Rica'}
                  fill
                  sizes="(max-width: 768px) 60px, 110px"
                  className="object-contain"
                />
              </div>
            </div>
          </BannerTemplate>

          {/* Banner 3: Reinserción Sociolaboral */}
          <BannerTemplate
            linkHref="/reinsercion-sociolaboral"
            bgColor="bg-gradient-to-r from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]"
          >
            <div className="h-full flex items-center justify-between gap-3 py-4 px-4 sm:px-8 lg:px-16">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="grid place-items-center w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-[#C9A962]/15 shrink-0">
                  <Scale className="w-4 h-4 lg:w-5 lg:h-5 text-[#C9A962]" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-medium text-[#F5F1EB] leading-tight tracking-wide">
                    {locale === 'es' ? 'Reinserción sociolaboral' : 'Social and labor reintegration'}
                  </h3>
                  <p className="text-[11px] lg:text-sm font-light text-[#A08848] mt-0.5">
                    {locale === 'es' ? 'Proyecto de Ley 24870' : 'Law Project 24870'}
                  </p>
                </div>
              </div>

              <span
                className="hidden sm:inline-flex items-center px-4 lg:px-5 py-2 lg:py-2.5 rounded-sm
                           text-xs lg:text-sm font-semibold tracking-wide text-[#1A1A1A] bg-[#C9A962]
                           transition-colors duration-200 hover:bg-[#D4C4A8]"
                aria-hidden
              >
                {locale === 'es' ? 'Leer más' : 'Read more'}
              </span>
            </div>
          </BannerTemplate>
        </Carousel>

        {/* Secciones de productos */}
        <OptimizedGridSection />
        <GiftsCarouselSection />
        <FeaturedProductsSection />
        <ProgressiveCategorySection />
      </div>
    </HomeProductsProvider>
  );
}

function ValueProp({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center text-center max-w-[110px]">
      <div className="grid place-items-center w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#C9A962]/10 mb-1.5">
        {icon}
      </div>
      <span className="text-[#2D2D2D] font-medium text-[11px] sm:text-xs leading-tight">
        {title}
      </span>
      <span className="hidden sm:block text-[10px] text-[#9C9589] mt-0.5 leading-tight">
        {subtitle}
      </span>
    </div>
  );
}
