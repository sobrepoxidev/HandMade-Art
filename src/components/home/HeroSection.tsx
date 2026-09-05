import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import type { HomeProduct } from '@/lib/home/types';

type Props = {
  locale: string;
  featuredProducts?: HomeProduct[];
};

type Product = HomeProduct;

const COPY = {
  es: {
    eyebrow: 'Hecho a mano en Costa Rica · programa de reinserción social',
    eyebrowMobile: 'Hecho a mano en Costa Rica',
    headline: 'Del banco del taller a tu casa.',
    sub: 'Chorreadores, espejos y esculturas talladas en cedro por artesanos que aprenden un oficio para empezar de nuevo. Cada pieza es única. Cada compra paga formación real.',
    subMobile: 'Chorreadores, espejos y esculturas en cedro, tallados por artesanos que aprenden un oficio para empezar de nuevo.',
    ctaPrimary: 'Explorar el catálogo',
    ctaSecondary: 'Conocer el taller',
    trust: ['Cedro y madera recuperada', 'Pintado a pincel', 'Envío asegurado'],
    weekly: 'En el taller esta semana',
  },
  en: {
    eyebrow: 'Handmade in Costa Rica · social reintegration program',
    eyebrowMobile: 'Handmade in Costa Rica',
    headline: 'From the workshop bench to your home.',
    sub: 'Coffee drippers, mirrors and sculptures carved in cedar by artisans learning a trade to start again. Every piece is one of a kind. Every purchase pays for real training.',
    subMobile: 'Coffee drippers, mirrors and sculptures in cedar, carved by artisans learning a trade to start again.',
    ctaPrimary: 'Browse the catalog',
    ctaSecondary: 'Meet the workshop',
    trust: ['Cedar and reclaimed wood', 'Brush-painted', 'Insured shipping'],
    weekly: 'In the workshop this week',
  },
} as const;

function getProductImage(product: Product) {
  if (
    product.media
    && Array.isArray(product.media)
    && product.media.length > 0
    && typeof product.media[0] === 'object'
    && product.media[0] !== null
    && 'url' in product.media[0]
    && typeof (product.media[0] as { url: string }).url === 'string'
  ) {
    return (product.media[0] as { url: string }).url;
  }

  return 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp';
}

function getProductName(product: Product, locale: string) {
  return (locale === 'es' ? product.name_es : product.name_en) || product.name || 'Handmade Art';
}

export default function HeroSection({ locale, featuredProducts = [] }: Props) {
  const t = locale === 'es' ? COPY.es : COPY.en;
  const weeklyProducts = featuredProducts.slice(0, 3);

  return (
    <>
      {/* Desktop hero */}
      {/*
        The hero height must follow the viewport, not a fixed number: above it sit
        the announcement strip, the header and the category row (~200px), so a
        fixed 780px pushed the primary CTA below the fold on a normal laptop
        (a 1536x704 CSS viewport cut it off). Clamp keeps it cinematic on tall
        screens and always leaves the buttons visible on short ones.
      */}
      <section className="relative hidden overflow-hidden bg-[#0F0C0A] lg:block lg:min-h-[clamp(440px,calc(100svh-200px),780px)]">
        <Image
          src="/taller/hero-taller.webp"
          alt={locale === 'es' ? 'Artesano tallando un marco de espejo en el taller' : 'Artisan carving a mirror frame in the workshop'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,18,16,0.96)_0%,rgba(22,18,16,0.78)_38%,rgba(22,18,16,0.25)_68%,rgba(22,18,16,0.05)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[200px] bg-[linear-gradient(180deg,rgba(22,18,16,0)_0%,rgba(22,18,16,0.95)_100%)]"
        />

        <div className="relative flex min-h-[inherit] flex-col justify-between gap-8 px-8 py-8 xl:px-16 xl:py-10">
          <div className="flex max-w-[760px] flex-col gap-5 xl:gap-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0A83A]">
              {t.eyebrow}
            </span>
            {/* Scales with BOTH viewport axes. Width alone is not enough: on a
                short laptop screen (1536x704) a 88px headline pushed the primary
                CTA below the fold, so height caps it too. */}
            <h1 className="font-display text-[clamp(40px,min(6.2vw,9.5vh),88px)] leading-[0.96] text-[#F1E7D6] text-wrap-pretty">
              {t.headline}
            </h1>
            <p className="max-w-[540px] text-[17px] leading-relaxed text-[#C9BBA5] xl:text-[19px]">
              {t.sub}
            </p>
            <div className="flex items-center gap-3.5 pt-1">
              <Link
                href="/products"
                className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-sm bg-[#E0A83A] px-7 text-sm font-bold tracking-wide text-[#161210] transition-colors hover:bg-[#F3C56B]"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href="/reinsercion-sociolaboral"
                className="inline-flex min-h-[54px] items-center justify-center rounded-sm border border-[#F1E7D6]/45 px-7 text-sm font-bold text-[#F1E7D6] transition-colors hover:border-[#F1E7D6]"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="flex items-end justify-between gap-10">
            <div className="flex gap-9 border-t border-[#F1E7D6]/18 pt-4 text-[13px] text-[#C9BBA5]">
              {t.trust.map((label) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-[#E0A83A]" />
                  {label}
                </span>
              ))}
            </div>

            {weeklyProducts.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-right text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C7F6E]">
                  {t.weekly}
                </span>
                <div className="flex gap-3">
                  {weeklyProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${encodeURIComponent(product.name ?? String(product.id))}`}
                      className="block h-40 w-32 overflow-hidden bg-[#F1E7D6]"
                    >
                      <Image
                        src={getProductImage(product)}
                        alt={getProductName(product, locale)}
                        width={128}
                        height={160}
                        className="h-full w-full object-contain p-2"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile hero */}
      {/* Height = viewport minus the header stack above (~232px) minus the sticky
          quote bar below (74px), so the bottom-aligned copy and CTA land just
          above the bar instead of behind it. */}
      <section className="relative min-h-[clamp(380px,calc(100svh-306px),620px)] overflow-hidden bg-[#0F0C0A] lg:hidden">
        <Image
          src="/taller/hero-taller-movil.webp"
          alt={locale === 'es' ? 'Artesano tallando un marco de espejo en el taller' : 'Artisan carving a mirror frame in the workshop'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,18,16,0.15)_0%,rgba(22,18,16,0.2)_35%,rgba(22,18,16,0.92)_68%,rgba(22,18,16,1)_100%)]"
        />
        <div className="relative flex min-h-[inherit] flex-col justify-end gap-4 px-5 pt-16 pb-[86px]">
          {/* pb clears the sticky quote bar (74px) so the hero CTAs are not
              hidden behind it on a phone. */}
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E0A83A]">
            {t.eyebrowMobile}
          </span>
          <h1 className="font-display text-[clamp(30px,min(11vw,7.5vh),42px)] leading-[0.98] text-[#F1E7D6] text-wrap-pretty">
            {t.headline}
          </h1>
          <p className="text-[15px] leading-[1.5] text-[#C9BBA5]">
            {t.subMobile}
          </p>
          {/* One button only on a phone: the sticky bar below already carries the
              conversion action, and a second full-width button was landing behind
              it. The workshop link stays as an inline link, still 44px tall. */}
          <Link
            href="/products"
            className="flex min-h-[54px] items-center justify-center rounded-sm bg-[#E0A83A] px-5 text-sm font-bold text-[#161210]"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href="/reinsercion-sociolaboral"
            className="flex min-h-[44px] items-center text-sm font-bold text-[#F1E7D6] underline decoration-[#E0A83A] decoration-2 underline-offset-[6px]"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>
    </>
  );
}
