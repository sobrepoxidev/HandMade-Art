import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Hammer, Heart, Leaf } from 'lucide-react';
import { formatUSD } from '@/lib/formatCurrency';
import type { HomeCategory, HomeProduct } from '@/lib/home/types';

type Props = {
  locale: string;
  featuredProducts?: HomeProduct[];
  categories?: HomeCategory[];
};

type Product = HomeProduct;
type Category = HomeCategory;

const COPY = {
  es: {
    eyebrow: 'Hecho a mano en Costa Rica',
    headline: 'Cada pieza guarda horas de oficio.',
    sub:
      'Madera viva, resina y un detrás-de-escena de manos que aprenden a empezar de nuevo. Compra una pieza única y apoya la reinserción social.',
    ctaPrimary: 'Explorar catálogo',
    ctaSecondary: 'Ver espejos',
    shopTitle: 'Piezas listas para comprar',
    shopCta: 'Ver pieza',
    categoryTitle: 'Comprar por oficio',
    trust: {
      hand: 'Hecho a mano',
      eco: 'Materiales nobles',
      impact: 'Impacto social real',
    },
    imageAlt:
      'Artesano costarricense mostrando un espejo tallado en madera, fruto de oficio paciente.',
  },
  en: {
    eyebrow: 'Handmade in Costa Rica',
    headline: 'Every piece holds hours of craft.',
    sub:
      'Live wood, resin and a backstage of hands learning to start again. Take home a one-of-a-kind piece and support social reintegration.',
    ctaPrimary: 'Browse catalog',
    ctaSecondary: 'Shop mirrors',
    shopTitle: 'Pieces ready to buy',
    shopCta: 'View piece',
    categoryTitle: 'Shop by craft',
    trust: {
      hand: 'Handmade',
      eco: 'Honest materials',
      impact: 'Real social impact',
    },
    imageAlt:
      'Costa Rican artisan presenting a hand-carved wooden mirror, the result of patient craftsmanship.',
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

function getCategoryName(category: Category, locale: string) {
  return (locale === 'es' ? category.name_es : category.name_en) || category.name || '';
}

export default function HeroSection({ locale, featuredProducts = [], categories = [] }: Props) {
  const t = locale === 'es' ? COPY.es : COPY.en;
  const heroProducts = featuredProducts.slice(0, 3);
  const heroCategories = categories.slice(0, 5);

  return (
    <section className="relative isolate overflow-hidden bg-[#FAF6EF]">
      <div className="grid min-h-[calc(100vh-112px)] lg:min-h-[680px] lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]">
        <div className="relative min-h-[520px] overflow-hidden bg-[#1A1A1A]">
          <Image
            src="/home/hero.webp"
            alt={t.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-[center_30%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,26,0.88),rgba(45,45,45,0.58)_54%,rgba(26,26,26,0.18))]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(0deg,rgba(26,26,26,0.82),transparent_42%)]"
          />

          <div className="relative flex h-full min-h-[520px] flex-col justify-end px-4 pb-8 pt-16 sm:px-8 lg:px-12 lg:pb-12">
            <div className="max-w-2xl">
              <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#C9A962] mb-5">
                {t.eyebrow}
              </p>

              <h1 className="font-display text-[#F5F1EB] text-[36px] leading-[1.04] sm:text-5xl xl:text-[66px] font-medium tracking-[-0.01em]">
                {t.headline}
              </h1>

              <p className="mt-5 text-[#E8E4E0] text-[15px] sm:text-base lg:text-[17px] leading-relaxed max-w-xl">
                {t.sub}
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] text-[14px] font-semibold tracking-wide text-[#1A1A1A] bg-[#C9A962] rounded-sm hover:bg-[#A08848] hover:text-[#F5F1EB] transition-colors duration-200 shadow-[0_2px_8px_-4px_rgba(160,136,72,0.45)]"
                >
                  {t.ctaPrimary}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </Link>
                <Link
                  href="/products?category=3"
                  className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-[14px] font-medium text-[#F5F1EB] bg-transparent border border-[#F5F1EB]/30 rounded-sm hover:bg-[#F5F1EB]/10 hover:border-[#F5F1EB]/60 transition-colors duration-200"
                >
                  {t.ctaSecondary}
                </Link>
              </div>
            </div>

            <ul className="mt-9 grid grid-cols-3 gap-2 border-t border-[#F5F1EB]/15 pt-4">
              <TrustPill icon={<Hammer className="h-4 w-4" strokeWidth={1.5} />} label={t.trust.hand} />
              <TrustPill icon={<Leaf className="h-4 w-4" strokeWidth={1.5} />} label={t.trust.eco} />
              <TrustPill icon={<Heart className="h-4 w-4" strokeWidth={1.5} />} label={t.trust.impact} />
            </ul>
          </div>
        </div>

        <aside className="flex flex-col justify-between border-b border-[#E8E4E0] bg-[#FAF6EF] px-4 py-5 sm:px-8 lg:border-b-0 lg:border-l lg:px-8 lg:py-8">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#A08848]">
                  {t.shopTitle}
                </p>
                <h2 className="font-display text-2xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
                  {locale === 'es' ? 'Comprar ahora' : 'Shop now'}
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex min-h-[44px] items-center text-sm font-semibold text-[#A08848] underline decoration-[#C9A962] decoration-2 underline-offset-4 hover:text-[#2D2D2D]"
              >
                {t.ctaPrimary}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {heroProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${encodeURIComponent(product.name ?? String(product.id))}`}
                  className="group grid grid-cols-[112px_minmax(0,1fr)] gap-3 border border-[#E8E4E0]/80 bg-[#F5F1EB] p-2 transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)] sm:grid-cols-1 lg:grid-cols-[118px_minmax(0,1fr)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#FAF6EF]">
                    <Image
                      src={getProductImage(product)}
                      alt={getProductName(product, locale)}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 1024px) 30vw, 118px"
                      className="object-contain p-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div>
                      <p className="line-clamp-2 text-[14px] font-medium leading-snug text-[#2D2D2D] group-hover:text-[#A08848]">
                        {getProductName(product, locale)}
                      </p>
                      {product.dolar_price && (
                        <p className="mt-2 font-display text-xl font-semibold tabular-nums text-[#2D2D2D]">
                          {formatUSD(product.dolar_price)}
                        </p>
                      )}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#A08848]">
                      {t.shopCta}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {heroCategories.length > 0 && (
            <div className="mt-6 border-t border-[#E8E4E0] pt-5">
              <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[#6B6459]">
                {t.categoryTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {heroCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="inline-flex min-h-[40px] items-center border border-[#E8E4E0] px-3 py-2 text-sm text-[#2D2D2D] transition-colors hover:border-[#A08848] hover:text-[#A08848]"
                  >
                    {getCategoryName(category, locale)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function TrustPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center justify-center sm:justify-start gap-2 text-[#D4C4A8]">
      <span aria-hidden className="text-[#C9A962]">
        {icon}
      </span>
      <span className="text-[10px] leading-tight sm:text-[13px] font-medium tracking-wide text-[#F5F1EB]/90">
        {label}
      </span>
    </li>
  );
}
