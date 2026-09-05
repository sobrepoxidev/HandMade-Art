'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Check, Plus, Star } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useInterestList } from '@/lib/hooks/useInterestList';
import type { Database } from '@/lib/database.types';
import { formatUSD } from '@/lib/formatCurrency';

type Product = Database['public']['Tables']['products']['Row'];
type MediaItem = { url: string; alt?: string; type?: string };

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  /** Kept for call-site compatibility; stock no longer gates the quote CTA. */
  inventoryQuantity?: number | null;
  interestList: ReturnType<typeof useInterestList>;
}

function getProductImage(product: Product) {
  const media = product.media as MediaItem[] | null;
  return media?.[0]?.url || '/product-placeholder.png';
}

function getProductName(product: Product, locale: string) {
  return (locale === 'es' ? product.name_es : product.name_en) || product.name || 'Handmade Art';
}

export default function ProductCard({
  product,
  categoryName,
  interestList,
}: ProductCardProps) {
  const locale = useLocale();
  const productName = getProductName(product, locale);
  const href = `/product/${encodeURIComponent(product.name || String(product.id))}`;
  const finalPrice = product.dolar_price
    ? product.dolar_price * (1 - (product.discount_percentage || 0) / 100)
    : null;
  const currentItem = interestList.getItem(product.id);
  const inList = Boolean(currentItem);

  const addToList = () => {
    const media = product.media as MediaItem[] | null;
    interestList.addItem({
      product_id: product.id,
      name: productName,
      sku: product.sku || undefined,
      main_image_url: media?.[0]?.url || undefined,
      price: finalPrice ?? product.dolar_price ?? 0,
      dolar_price: product.dolar_price || 0,
      discount_percentage: product.discount_percentage || undefined,
      category_id: product.category_id || undefined,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#3A2E24] bg-[#1E1813] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#E0A83A]/45 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]">
      <Link href={href} className="relative block aspect-square bg-[#F1E7D6]">
        <Image
          src={getProductImage(product)}
          alt={productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          loading="lazy"
        />

        <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5">
          {categoryName && (
            <span className="rounded-sm bg-[#161210] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#E0A83A]">
              {categoryName}
            </span>
          )}
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-sm border border-[#E0A83A]/35 bg-[#161210] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#E0A83A]">
              <Star className="h-3 w-3 fill-[#E0A83A]" strokeWidth={1.5} aria-hidden />
              {locale === 'es' ? 'Destacado' : 'Featured'}
            </span>
          )}
        </div>

        {Number(product.discount_percentage) > 0 && (
          <span className="absolute bottom-2 right-2 rounded-sm bg-[#D9563B] px-2 py-1 text-[11px] font-semibold text-[#F1E7D6]">
            -{product.discount_percentage}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={href}
          className="line-clamp-2 min-h-[2.7rem] text-[15px] font-medium leading-snug text-[#F1E7D6] transition-colors hover:text-[#F3C56B]"
        >
          {productName}
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            {finalPrice ? (
              <>
                <p className="font-display text-xl font-semibold tabular-nums text-[#E0A83A]">
                  {formatUSD(finalPrice)}
                </p>
                {Number(product.discount_percentage) > 0 && (
                  <p className="text-xs text-[#8C7F6E] line-through tabular-nums">
                    {formatUSD(product.dolar_price || 0)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm font-medium text-[#C9BBA5]">
                {locale === 'es' ? 'Precio a consultar' : 'Price on request'}
              </p>
            )}
          </div>

          <span className="text-xs font-medium text-[#8C7F6E]">
            {locale === 'es' ? 'Por encargo' : 'Made to order'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_44px] gap-2">
          <Link
            href={href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[#3A2E24] px-4 py-2.5 text-sm font-medium text-[#F1E7D6] transition-colors hover:border-[#E0A83A] hover:text-[#E0A83A]"
          >
            {locale === 'es' ? 'Ver pieza' : 'View piece'}
          </Link>
          <button
            type="button"
            onClick={addToList}
            aria-pressed={inList}
            className={`grid h-11 w-11 place-items-center rounded-sm transition-colors ${
              inList
                ? 'bg-[#3C9A70] text-[#161210] hover:bg-[#34875f]'
                : 'bg-[#E0A83A] text-[#161210] hover:bg-[#F3C56B]'
            }`}
            aria-label={
              inList
                ? locale === 'es'
                  ? `${productName} está en tu lista de cotización`
                  : `${productName} is in your quote list`
                : locale === 'es'
                  ? `Agregar ${productName} a la lista de cotización`
                  : `Add ${productName} to the quote list`
            }
          >
            {inList ? (
              <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
