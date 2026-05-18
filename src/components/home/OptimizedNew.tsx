'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel, BannerTemplate } from "@/components/home/Banner";
import { ArrowRight, Truck } from 'lucide-react';
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
          {/* Banner 1 — The craft (rich image, editorial overlay) */}
          <BannerTemplate
            linkHref="/products"
            bgColor="bg-[#1A1A1A]"
          >
            <Image
              src="/home/hombre-haciendo-dispensador-en-forma-de-molinillo.webp"
              alt=""
              fill
              sizes="(max-width: 1500px) 100vw, 1500px"
              className="object-cover object-[center_35%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/85 via-[#1A1A1A]/55 to-[#1A1A1A]/15" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />

            <div className="relative h-full flex items-center px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl">
                <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C9A962] mb-3">
                  {locale === 'es' ? 'Hecho a mano · Costa Rica' : 'Handmade · Costa Rica'}
                </p>
                <h3 className="font-display text-[#F5F1EB] text-2xl sm:text-3xl lg:text-[40px] leading-[1.1] font-medium tracking-[-0.005em]">
                  {locale === 'es'
                    ? 'Cada pieza, una historia tallada en madera.'
                    : 'Every piece, a story carved in wood.'}
                </h3>
                <p className="hidden sm:block mt-3 lg:mt-4 text-[#E8E4E0] text-[13px] lg:text-[14.5px] leading-relaxed max-w-md">
                  {locale === 'es'
                    ? 'Espejos, chorreadores y esculturas únicas de madera y resina.'
                    : 'Mirrors, coffee drippers and one-of-a-kind sculptures in wood and resin.'}
                </p>
                <span
                  className="inline-flex items-center gap-2 mt-4 lg:mt-6 px-5 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-wide text-[#1A1A1A] bg-[#C9A962] rounded-sm transition-colors duration-200"
                  aria-hidden
                >
                  {locale === 'es' ? 'Ver catálogo' : 'Browse catalog'}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
            </div>
          </BannerTemplate>

          {/* Banner 2 — Shipping (cream surface, map illustration) */}
          <BannerTemplate
            linkHref="/shipping"
            bgColor="bg-[#FAF6EF]"
          >
            <div className="relative h-full flex items-center justify-between gap-6 lg:gap-12 px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl flex-1">
                <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#A08848] mb-3 inline-flex items-center gap-1.5">
                  <Truck className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                  {locale === 'es' ? 'Envíos en todo el país' : 'Nationwide shipping'}
                </p>
                <h3 className="font-display text-[#2D2D2D] text-2xl sm:text-3xl lg:text-[36px] leading-[1.15] font-medium tracking-[-0.005em]">
                  {locale === 'es' ? 'Llevamos tu pieza a cualquier parte de Costa Rica.' : 'We ship every piece anywhere in Costa Rica.'}
                </h3>
                <p className="mt-2 lg:mt-3 text-[#4A4A4A] text-[14px] lg:text-base">
                  {locale === 'es' ? (
                    <>
                      <span className="font-display font-semibold text-[#A08848] text-lg lg:text-xl">Desde $6.99 USD</span>
                      <span className="hidden sm:inline">{' · '}variable según peso</span>
                    </>
                  ) : (
                    <>
                      <span className="font-display font-semibold text-[#A08848] text-lg lg:text-xl">From $6.99 USD</span>
                      <span className="hidden sm:inline">{' · '}weight-based</span>
                    </>
                  )}
                </p>
                <span
                  className="inline-flex items-center gap-2 mt-4 lg:mt-5 px-5 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-wide text-[#F5F1EB] bg-[#2D2D2D] hover:bg-[#1A1A1A] rounded-sm transition-colors duration-200"
                  aria-hidden
                >
                  {locale === 'es' ? 'Calcular envío' : 'Calculate shipping'}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>

              <div className="relative h-[140px] w-[140px] sm:h-[180px] sm:w-[180px] lg:h-[240px] lg:w-[240px] shrink-0 hidden sm:block">
                <Image
                  src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/home/mapa-cr-DZ7GK5iuwsfpfwJ2Udbhz8Rxd1bUBF.webp"
                  alt={locale === 'es' ? 'Mapa de Costa Rica con rutas de envío' : 'Map of Costa Rica with shipping routes'}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 240px"
                  className="object-contain"
                />
              </div>
            </div>
          </BannerTemplate>

          {/* Banner 3 — Social reintegration (dark, image background, gold accent) */}
          <BannerTemplate
            linkHref="/reinsercion-sociolaboral"
            bgColor="bg-[#1A1A1A]"
          >
            <Image
              src="/reinsercion-sociolaboral/banner.webp"
              alt=""
              fill
              sizes="(max-width: 1500px) 100vw, 1500px"
              className="object-cover object-[center_40%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-[#1A1A1A]/40" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />

            <div className="relative h-full flex items-center px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl">
                <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C9A962] mb-3">
                  {locale === 'es' ? 'Proyecto de Ley 24870' : 'Law Project 24870'}
                </p>
                <h3 className="font-display text-[#F5F1EB] text-2xl sm:text-3xl lg:text-[40px] leading-[1.1] font-medium tracking-[-0.005em]">
                  {locale === 'es'
                    ? 'Cada compra paga horas de oficio reales.'
                    : 'Every purchase pays real hours of craft.'}
                </h3>
                <p className="hidden sm:block mt-3 lg:mt-4 text-[#E8E4E0] text-[13px] lg:text-[14.5px] leading-relaxed max-w-md">
                  {locale === 'es'
                    ? 'El programa de reinserción sociolaboral detrás de cada pieza.'
                    : 'The social-and-labor reintegration program behind every piece.'}
                </p>
                <span
                  className="inline-flex items-center gap-2 mt-4 lg:mt-6 px-5 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-wide text-[#F5F1EB] border border-[#F5F1EB]/40 rounded-sm bg-transparent transition-colors duration-200"
                  aria-hidden
                >
                  {locale === 'es' ? 'Conocer la historia' : 'Read the story'}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
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

