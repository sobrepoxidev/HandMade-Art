'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel, BannerTemplate } from "@/components/home/Banner";
import { BadgeCheck, Handshake, Sprout } from 'lucide-react';
import { ProductsProvider } from '@/components/providers/ProductsProvider';
import OptimizedGridSection from '@/components/cards/OptimizedGridSection';
import FeaturedProductsSection from '../cards/FeaturedProductsSection';
import GiftsCarouselSection from '@/components/cards/GiftsCarouselSection';
import type { Database } from '@/types-db';

// Tipos para los datos pre-cargados desde el servidor
type Product = Database['products'];
type Category = Database['categories'];

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
  locale?: string;
}


export default function OptimizedNewHome({
  initialCategories = [],
  initialProducts = [],
  locale 
}: OptimizedNewHomeProps) {
  const chorreadorCategoryId = 1;
  return (
    <ProductsProvider initialCategories={initialCategories} initialProducts={initialProducts}>
      <div className="max-w-[1500px] mx-auto relative z-0 h-full bg-gradient-to-b from-teal-300/10 via-teal-500/10 to-white">
        <Carousel>
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
                {/* <div className="relative h-[80px] w-[80px] md:h-[180px] md:w-[180px]">
                  <Image
                    src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/home/avion-correos-tePadHoKKfnwSsZPNFg0asLyJyTxzy.webp"
                    alt={locale === 'es' ? 'Avión de correos' : 'Mail plane'}
                    fill
                    sizes="(max-width: 768px) 80px, 180px"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <div className="relative h-[80px] w-[80px] md:h-[180px] md:w-[180px]">
                  <Image
                    src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/home/paquet-correos-F4l2o6srReQON5HaGqnifBJBzqAhaO.webp"
                    alt={t('banner1.packageAlt')}
                    fill
                    sizes="(max-width: 768px) 80px, 180px"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div> */}
              </div>
            </div>
          </BannerTemplate>

          {/* Banner 2: Artesanías (segundo lugar) */}
          <BannerTemplate linkHref="/impact">
            {/* <Image
              src="/home/hombre-haciendo-dispensador-en-forma-de-molinillo.webp"
              alt={t('banner2.craftsman1Alt')}
              width={190}
              height={0}
              className="absolute top-14 left-0 lg:left-6 2xl:left-60 hidden sm:block rounded-lg max-lg:w-[125px]"
            /> */}
            {/* <Image
              src="/home/hombre-exhibiendo-espejo-tallado-en-madera.webp"
              alt={t('banner2.craftsman2Alt')}
              width={184}
              height={0}
              className="absolute top-12 right-2 lg:right-16 2xl:right-70 hidden sm:block rounded-lg max-lg:w-[125px]"
            /> */}

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

          {/* Banner 3: Sorteo Feria del Mueble 2025 */}
          <BannerTemplate
            linkHref="/feria-artesanias"
            bgColor="bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100">
            <div className="h-full flex items-center justify-between px-6 lg:px-12">
              {/* Sección izquierda - Información principal */}
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="text-2xl lg:text-3xl">🎉</div>
                <div>
                  <h1 className="text-base lg:text-xl font-bold text-pink-700 leading-tight">
                    {locale === 'es' ? 'FERIA DEL MUEBLE' : 'FURNITURE FAIR'}
                  </h1>
                  <p className="text-sm lg:text-base font-medium text-gray-700 mt-0.5">
                    {locale === 'es' ? 'Sarchí • 8-17 agosto' : 'Sarchí • Aug 8-17'}
                  </p>
                </div>
              </div>

              {/* Sección central - Premio */}
              <div className="hidden sm:flex items-center text-center">
                <div>
                  <div className="text-lg lg:text-xl mb-1">🎁</div>
                  <p className="text-xs lg:text-sm text-gray-600 font-medium">
                    {locale === 'es' ? 'Gana un espejo' : 'Win a mirror'}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {locale === 'es' ? 'artesanal' : 'handcrafted'}
                  </p>
                </div>
              </div>

              {/* Sección derecha - Botón */}
              <div>
                <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                  {locale === 'es' ? 'Participar' : 'Enter'}
                </button>
              </div>
            </div>
          </BannerTemplate>
        </Carousel>

        {/* Secciones de productos optimizadas */}
        <OptimizedGridSection  />
        <GiftsCarouselSection />
        {/* Nueva sección de productos destacados con mayor visibilidad */}
        <FeaturedProductsSection maxProducts={9} />
        

        
        {/* <SecondaryGridSection />
        
        <DetailsCarouselSection /> */}
      </div>
    </ProductsProvider>
  );
}
