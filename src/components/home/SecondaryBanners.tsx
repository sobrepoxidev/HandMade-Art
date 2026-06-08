'use client';

import Image from 'next/image';
import { ArrowRight, Truck } from 'lucide-react';
import { Carousel, BannerTemplate } from '@/components/home/Banner';

interface SecondaryBannersProps {
  locale: string;
}

export default function SecondaryBanners({ locale }: SecondaryBannersProps) {
  return (
    <div className="mx-auto max-w-[1500px]">
      <h2 className="sr-only">
        {locale === 'es' ? 'Avisos y propuesta de valor' : 'Notices and value props'}
      </h2>
      <Carousel>
        <BannerTemplate linkHref="/products" bgColor="bg-[#1A1A1A]">
          <Image
            src="/home/hombre-haciendo-dispensador-en-forma-de-molinillo.webp"
            alt=""
            fill
            sizes="(max-width: 1500px) 100vw, 1500px"
            className="object-cover object-[center_35%]"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.85),rgba(26,26,26,0.55)_54%,rgba(26,26,26,0.15))]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(0deg,rgba(26,26,26,0.6),transparent_45%)]"
          />

          <div className="relative flex h-full items-center px-6 sm:px-10 lg:px-16">
            <div className="max-w-xl">
              <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-[#C9A962] sm:text-[11px]">
                {locale === 'es' ? 'Hecho a mano - Costa Rica' : 'Handmade - Costa Rica'}
              </p>
              <h3 className="font-display text-2xl font-medium leading-[1.1] tracking-[-0.005em] text-[#F5F1EB] sm:text-3xl lg:text-[40px]">
                {locale === 'es'
                  ? 'Cada pieza, una historia tallada en madera.'
                  : 'Every piece, a story carved in wood.'}
              </h3>
              <p className="mt-3 hidden max-w-md text-[13px] leading-relaxed text-[#E8E4E0] sm:block lg:mt-4 lg:text-[14.5px]">
                {locale === 'es'
                  ? 'Espejos, chorreadores y esculturas únicas de madera y resina.'
                  : 'Mirrors, coffee drippers and one-of-a-kind sculptures in wood and resin.'}
              </p>
              <span
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#C9A962] px-5 py-2.5 text-[13px] font-semibold tracking-wide text-[#1A1A1A] transition-colors duration-200 lg:mt-6"
                aria-hidden
              >
                {locale === 'es' ? 'Ver catálogo' : 'Browse catalog'}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </BannerTemplate>

        <BannerTemplate linkHref="/shipping" bgColor="bg-[#FAF6EF]">
          <div className="relative flex h-full items-center justify-between gap-6 px-6 sm:px-10 lg:gap-12 lg:px-16">
            <div className="max-w-xl flex-1">
              <p className="mb-3 inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#A08848] sm:text-[11px]">
                <Truck className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                {locale === 'es' ? 'Envíos en todo el país' : 'Nationwide shipping'}
              </p>
              <h3 className="font-display text-2xl font-medium leading-[1.15] tracking-[-0.005em] text-[#2D2D2D] sm:text-3xl lg:text-[36px]">
                {locale === 'es'
                  ? 'Llevamos tu pieza a cualquier parte de Costa Rica.'
                  : 'We ship every piece anywhere in Costa Rica.'}
              </h3>
              <p className="mt-2 text-[14px] text-[#4A4A4A] lg:mt-3 lg:text-base">
                {locale === 'es' ? (
                  <>
                    <span className="font-display text-lg font-semibold text-[#A08848] lg:text-xl">Desde $6.99 USD</span>
                    <span className="hidden sm:inline">{' - '}variable según peso</span>
                  </>
                ) : (
                  <>
                    <span className="font-display text-lg font-semibold text-[#A08848] lg:text-xl">From $6.99 USD</span>
                    <span className="hidden sm:inline">{' - '}weight-based</span>
                  </>
                )}
              </p>
              <span
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-[13px] font-semibold tracking-wide text-[#F5F1EB] transition-colors duration-200 hover:bg-[#1A1A1A] lg:mt-5"
                aria-hidden
              >
                {locale === 'es' ? 'Calcular envío' : 'Calculate shipping'}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </div>

            <div className="relative hidden h-[140px] w-[140px] shrink-0 sm:block sm:h-[180px] sm:w-[180px] lg:h-[240px] lg:w-[240px]">
              <Image
                src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/home/mapa-cr-DZ7GK5iuwsfpfwJ2Udbhz8Rxd1bUBF.webp"
                alt={locale === 'es' ? 'Mapa de Costa Rica con rutas de envío' : 'Map of Costa Rica with shipping routes'}
                fill
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 240px"
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </BannerTemplate>

        <BannerTemplate linkHref="/reinsercion-sociolaboral" bgColor="bg-[#1A1A1A]">
          <Image
            src="/reinsercion-sociolaboral/banner.webp"
            alt=""
            fill
            sizes="(max-width: 1500px) 100vw, 1500px"
            className="object-cover object-[center_40%]"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.9),rgba(26,26,26,0.7)_54%,rgba(26,26,26,0.4))]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(0deg,rgba(26,26,26,0.8),transparent_45%)]"
          />

          <div className="relative flex h-full items-center px-6 sm:px-10 lg:px-16">
            <div className="max-w-xl">
              <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-[#C9A962] sm:text-[11px]">
                {locale === 'es' ? 'Proyecto de Ley 24870' : 'Law Project 24870'}
              </p>
              <h3 className="font-display text-2xl font-medium leading-[1.1] tracking-[-0.005em] text-[#F5F1EB] sm:text-3xl lg:text-[40px]">
                {locale === 'es'
                  ? 'Cada compra paga horas de oficio reales.'
                  : 'Every purchase pays real hours of craft.'}
              </h3>
              <p className="mt-3 hidden max-w-md text-[13px] leading-relaxed text-[#E8E4E0] sm:block lg:mt-4 lg:text-[14.5px]">
                {locale === 'es'
                  ? 'El programa de reinserción sociolaboral detrás de cada pieza.'
                  : 'The social-and-labor reintegration program behind every piece.'}
              </p>
              <span
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-[#F5F1EB]/40 bg-transparent px-5 py-2.5 text-[13px] font-semibold tracking-wide text-[#F5F1EB] transition-colors duration-200 lg:mt-6"
                aria-hidden
              >
                {locale === 'es' ? 'Conocer la historia' : 'Read the story'}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </BannerTemplate>
      </Carousel>
    </div>
  );
}
