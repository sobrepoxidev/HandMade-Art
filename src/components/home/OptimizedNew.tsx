'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel, BannerTemplate } from "@/components/home/Banner";
import { BadgeCheck, Handshake, Sprout } from 'lucide-react';
import { HomeProductsProvider } from '@/context/HomeProductsContext';
import OptimizedGridSection from '@/components/cards/OptimizedGridSection';
import FeaturedProductsSection from '../cards/FeaturedProductsSection';
import GiftsCarouselSection from '@/components/cards/GiftsCarouselSection';
import ProgressiveCategorySection from '@/components/cards/ProgressiveCategorySection';
import type { Database } from '@/lib/database.types';
import type { HomeSections } from '@/lib/home/computeSections';

// Tipos para los datos pre-cargados desde el servidor
type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

/**
 * Componente principal de la página de inicio optimizado
 * - Utiliza un proveedor centralizado para los datos
 * - Aprovecha los datos pre-cargados desde el servidor
 * - Evita solicitudes duplicadas a Supabase
 * - Optimiza la carga de imágenes
 */
interface OptimizedNewHomeProps {
  initialCategories?: Category[];
  initialProducts?: Product[];
  initialSections?: HomeSections;
  priorityCategoryIds?: number[]; // IDs de categorías en orden de prioridad
  locale?: string;
}

export default function OptimizedNewHome({
  initialCategories = [],
  initialProducts = [],
  initialSections,
  priorityCategoryIds = [],
  locale 
}: OptimizedNewHomeProps) {
  return (
    <HomeProductsProvider 
      initialCategories={initialCategories} 
      initialProducts={initialProducts}
      initialSections={initialSections}
      priorityCategoryIds={priorityCategoryIds}
    >
      <div className="max-w-[1500px] mx-auto relative z-0 bg-gradient-to-b from-teal-300/10 via-teal-500/10 to-white">
        <Carousel>
          {/* Banner principal: Reinserción Sociolaboral - Proyecto de Ley 24870 */}
          <BannerTemplate
            linkHref="/reinsercion-sociolaboral"
            bgColor="bg-gradient-to-r from-[#0B0B0B] via-[#121212] to-[#1A1A1A]">

            <div className="h-full flex items-start justify-between py-8 sm:py-20 px-4 lg:px-8">
              {/* Sección izquierda - Información principal */}
              <div className="flex items-center gap-1 lg:gap-2 lg:mx-12">
                <div className="text-xl lg:text-2xl text-white">⚖️</div>
                <div>
                  <h1 className="text-sm lg:text-lg font-bold text-white leading-tight">
                    {locale === 'es' ? 'Reinserción sociolaboral' : 'Social and labor reintegration'}
                  </h1>
                  <p className="text-xs lg:text-sm font-medium text-gray-300">
                    {locale === 'es' ? 'Proyecto de Ley 24870' : 'Law Project 24870'}
                  </p>
                  {/* CTA breve - visible en móvil */}
                  <p className="text-[10px] lg:hidden text-gray-300 mt-0.5 leading-tight">
                    {locale === 'es' ? '📜 Conoce el proyecto' : '📜 Learn about the project'}
                  </p>
                </div>
              </div>

              {/* Sección central - Título (solo desktop) */}
              <div className="hidden lg:flex flex-col items-center text-center">
                <div className="text-xl mb-1 text-white">🏛️</div>
                <p className="text-lg text-white font-medium leading-tight">
                  {locale === 'es' ? 'Reinserción sociolaboral' : 'Social and labor reintegration'}
                </p>
                <p className="text-xs text-gray-300 mt-0.5">
                  {locale === 'es' ? 'Proyecto de Ley 24870' : 'Law Project 24870'}
                </p>
              </div>

              {/* Sección derecha - Botón */}
              <div className="text-center">
                <button className="bg-white hover:bg-gray-100 text-neutral-900 text-xs lg:text-sm px-2.5 lg:px-6 mx-6 lg:mx-12 py-1 lg:py-1.5 rounded-md lg:rounded-lg font-semibold transition-all shadow-sm hover:shadow-md">
                  {locale === 'es' ? 'Leer más' : 'Read more'}
                </button>
                <p className="text-[8px] lg:text-xs text-gray-300 mt-1 leading-tight font-medium">
                  {locale === 'es' ? 'Reinserción con oportunidades reales' : 'Reintegration with real opportunities'}
                </p>
              </div>
            </div>
          </BannerTemplate>
          {/* Banner 1: Envío a Costa Rica (ahora primero) */}
          <BannerTemplate linkHref="/shipping">
            <div className="relative h-full flex flex-col md:flex-row justify-center items-center md:gap-10 px-4 md:px-24 py-2 md:py-6">
              <div className="max-w-full text-center md:text-left mt-0.5 md:mt-0 ">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold tracking-wider text-gray-800">
                  <span className="mr-1">{locale === 'es' ? 'Envíos a todo Costa Rica' : 'Shipping to all Costa Rica'}</span>
                </h2>
                <div className="flex flex-col">
                  <div>
                    <p className="text-xs lg:text-lg font-light  text-gray-800">
                      <span className="font-bold">{locale === 'es' ? 'Con tarifas desde $6.99' : 'With rates from $6.99'}</span>
                    </p>
                    <p className="text-gray-600 text-[0.60rem] lg:text-xs mt-1 lg:mt-2">
                      {locale === 'es' ? '*Costo variable dependiendo del peso. Pulsa para más información' : '*Variable cost depending on weight. Click for more information'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:gap-8 px-2 md:px-4 h-auto">
                <div className="relative h-[35px] w-[55px] md:h-[110px] md:w-[110px]">
                  <Image
                    src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/home/mapa-cr-DZ7GK5iuwsfpfwJ2Udbhz8Rxd1bUBF.webp"
                    alt={locale === 'es' ? 'Mapa de Costa Rica' : 'Map of Costa Rica'}
                    fill
                    sizes="(max-width: 768px) 40px, 110px"
                    style={{ objectFit: 'contain' }}
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </BannerTemplate>

          {/* Banner 2: Artesanías (segundo lugar) */}
          <BannerTemplate linkHref="/impact">
            <div className="absolute bg-gradient-to-r  top-0 left-0 right-0 flex flex-col items-center lg:justify-center ">
              <div className="text-center z-20 mt-2 lg:mt-4 px-4">
                <h1 className="text-lg lg:text-xl text-gray-800 font-bold lg:mb-2 hidden sm:block">
                  {locale === 'es' ? 'Artesanía única hecha a mano' : 'Unique handmade crafts'}
                </h1>
                <h1 className="text-md lg:text- text-gray-800 font-bold lg:mb-2 sm:hidden">
                  {locale === 'es' ? 'Artesanía hecha a mano' : 'Handmade crafts'}
                </h1>

                <p className="text-gray-800 text-xs mx-auto max-w-xl">
                  {locale === 'es' ? 'Por residentes en rehabilitación de centros penales' : 'By residents in rehabilitation centers'}
                </p>

                <div className="flex items-center justify-center space-x-4 md:space-x-12 my-0.5  lg:mt-5">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8">
                      <Handshake className="w-6 h-6 text-gray-700" />
                    </div>
                    <span className="text-gray-800 font-medium text-xs hidden sm:block">{locale === 'es' ? 'Impacto Social' : 'Social Impact'}</span>
                    <span className="text-gray-800 font-medium text-[0.65rem] lg:text-xs sm:hidden">{locale === 'es' ? 'Impacto' : 'Impact'}</span>
                    <span className="text-[0.65rem] text-gray-800 hidden sm:block">{locale === 'es' ? 'Apoyando la reinserción' : 'Supporting reintegration'}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8">
                      <Sprout className="w-6 h-6 text-gray-700" />
                    </div>
                    <span className="text-gray-800 font-medium text-[0.65rem] lg:text-xs">{locale === 'es' ? 'Sostenibilidad' : 'Sustainability'}</span>
                    <span className="text-[0.65rem] text-gray-800 hidden sm:block">{locale === 'es' ? 'Materiales ecológicos' : 'Eco-friendly materials'}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="rounded-full flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8">
                      <BadgeCheck className="w-6 h-6 text-gray-700" />
                    </div>
                    <span className="text-gray-800 font-medium text-[0.65rem] lg:text-xs">{locale === 'es' ? 'Calidad' : 'Quality'}</span>
                    <span className="text-[0.65rem] text-gray-800 hidden sm:block">{locale === 'es' ? 'Detalles artesanales' : 'Artisanal details'}</span>
                  </div>
                </div>
              </div>
            </div>
          </BannerTemplate>

          
        </Carousel>

        {/* Secciones de productos optimizadas */}
        <OptimizedGridSection  />
        <GiftsCarouselSection />
        {/* Nueva sección de productos destacados con mayor visibilidad */}
        <FeaturedProductsSection />
        {/* Sección progresiva categorizada con scroll infinito y sin duplicados */}
        <ProgressiveCategorySection />
        

        
        {/* <SecondaryGridSection /> */}
        
        {/* <DetailsCarouselSection /> */}
      </div>
    </HomeProductsProvider>
  );
}
