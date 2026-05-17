import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Database } from '@/lib/database.types';
import { formatUSD } from '@/lib/formatCurrency';
import FavoriteButton from './FavoriteButton';
import AddToCartButton from './AddToCartButton';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Pick<
  Database['public']['Tables']['categories']['Row'],
  'id' | 'name_es' | 'name_en'
>;
type MediaItem = { url: string; alt?: string; type?: string };

export type RelatedProductCardData = {
  product: Product;
  category: Category | null;
  inventory: number;
  isFavorite: boolean;
};

type Props = RelatedProductCardData & {
  locale: string;
};

export default function RelatedProductCard({
  product,
  category,
  inventory,
  isFavorite,
  locale,
}: Props) {
  const displayName = locale === 'es' ? product.name_es : product.name_en;
  const slug = product.name ?? '';
  const href = `/${locale}/product/${encodeURIComponent(slug)}`;

  const media = (product.media as MediaItem[] | null) ?? [];
  const mainImage = media[0]?.url ?? '/product-placeholder.png';
  const imageAlt = media[0]?.alt || displayName || product.name || 'Product';

  const discount = product.discount_percentage ?? 0;
  const basePrice = product.dolar_price ?? null;
  const finalPrice =
    basePrice != null && discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  const hasDiscount = discount > 0 && basePrice != null;

  const inStock = inventory > 0;
  const lowStock = inStock && inventory <= 10;
  const stockColor = !inStock ? '#C44536' : lowStock ? '#D4A84B' : '#4A7C59';
  const stockLabel = !inStock
    ? locale === 'es' ? 'Agotado' : 'Sold out'
    : lowStock
    ? `${inventory} ${locale === 'es' ? 'disponibles' : 'left'}`
    : locale === 'es' ? 'En stock' : 'In stock';

  return (
    <article
      className="group relative flex flex-col h-full bg-white border border-[#E8E4E0]/70 rounded-md overflow-hidden
                 transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                 hover:border-[#C9A962]/45
                 hover:shadow-[0_12px_32px_-18px_rgba(45,45,45,0.28),0_2px_6px_-2px_rgba(45,45,45,0.06)]"
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start max-w-[70%]">
        {category && (
          <span className="bg-[#2D2D2D] text-[#F5F1EB] text-[10px] uppercase tracking-[0.08em] font-medium px-2 py-0.5 rounded-sm truncate">
            {locale === 'es' ? category.name_es : category.name_en}
          </span>
        )}
        {hasDiscount && (
          <span className="bg-[#C44536] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm tabular-nums">
            -{Math.round(discount)}%
          </span>
        )}
        {product.is_featured && (
          <span
            className="grid place-items-center w-5 h-5 rounded-full bg-[#C9A962] text-[#1A1A1A] shadow-sm"
            aria-label={locale === 'es' ? 'Destacado' : 'Featured'}
            title={locale === 'es' ? 'Destacado' : 'Featured'}
          >
            <Star className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
      </div>

      <Link
        href={href}
        prefetch={false}
        className="block relative aspect-square bg-[#FAF8F5] overflow-hidden ring-1 ring-inset ring-[#E8E4E0]/40"
        aria-label={displayName ?? slug}
      >
        <Image
          src={mainImage}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 sm:p-7 will-change-transform
                     transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                     group-hover:scale-[1.035]"
        />
      </Link>

      <div className="flex flex-col flex-1 px-4 pt-4 pb-4 gap-2.5">
        <Link
          href={href}
          prefetch={false}
          className="text-[#2D2D2D] text-[13.5px] font-medium leading-[1.35] line-clamp-2 min-h-[38px] hover:text-[#A08848] transition-colors duration-200"
        >
          {displayName ?? slug}
        </Link>

        <div className="flex items-center gap-1 text-[#9C9589]">
          <Star className="h-3 w-3 fill-[#C9A962] text-[#C9A962]" strokeWidth={0} />
          <span className="text-[11px] font-medium tabular-nums tracking-tight">4.0</span>
        </div>

        <div className="mt-auto pt-1">
          {basePrice != null ? (
            <div className="flex flex-col gap-0.5 mb-2">
              <span
                className={`text-[17px] font-semibold tracking-tight tabular-nums ${
                  hasDiscount ? 'text-[#A08848]' : 'text-[#2D2D2D]'
                }`}
              >
                {formatUSD(finalPrice ?? 0)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-[#9C9589] line-through tabular-nums">
                  {formatUSD(basePrice)}
                </span>
              )}
            </div>
          ) : (
            <p className="text-[13px] font-medium text-[#4A4A4A] mb-2">
              {locale === 'es' ? 'Precio a consultar' : 'Price on request'}
            </p>
          )}

          <div className="inline-flex items-center gap-1.5 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: stockColor }}
              aria-hidden
            />
            <span className="text-[11px] text-[#9C9589] font-medium">{stockLabel}</span>
          </div>

          <div className="flex items-stretch gap-2">
            <Link
              href={href}
              prefetch={false}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-[12px] font-medium text-[#F5F1EB] bg-[#2D2D2D] rounded-sm hover:bg-[#1A1A1A] transition-colors duration-200 tracking-wide"
            >
              {locale === 'es' ? 'Ver detalles' : 'View details'}
            </Link>
            <AddToCartButton product={product} disabled={!inStock} />
          </div>
        </div>
      </div>
    </article>
  );
}
