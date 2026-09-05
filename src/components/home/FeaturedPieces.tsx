import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/utils/supabase/server';
import { getCategoryById } from '@/lib/content/categories';
import { formatUSD } from '@/lib/formatCurrency';

type MediaItem = { url: string; alt?: string };

// Seal color per category id — matches the artboard's status-dot legend
// (selva = in-production staple, cobalto = mirrors, barro = one-of-a-kind wall art).
const SEAL_BY_CATEGORY: Record<number, string> = {
  1: '#3C9A70', // chorreadores
  2: '#E0A83A', // cocina
  3: '#4C7BD1', // espejos
  5: '#D9563B', // pinturas
  6: '#E0A83A', // esculturas
  10: '#3C9A70', // jarras
};

const NEW_WINDOW_DAYS = 30;

export default async function FeaturedPieces({ locale }: { locale: string }) {
  const localeKey: 'es' | 'en' = locale === 'es' ? 'es' : 'en';
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from('products')
    .select('id, name, name_es, name_en, dolar_price, discount_percentage, media, category_id, created_at')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4);

  let products = featured ?? [];

  if (products.length < 4) {
    const { data: filler } = await supabase
      .from('products')
      .select('id, name, name_es, name_en, dolar_price, discount_percentage, media, category_id, created_at')
      .eq('is_active', true)
      .not('id', 'in', `(${products.map((p) => p.id).join(',') || '0'})`)
      .order('created_at', { ascending: false })
      .limit(4 - products.length);
    products = [...products, ...(filler ?? [])];
  }

  if (products.length === 0) return null;

  const t = {
    eyebrow: locale === 'es' ? 'Listas para enviar en 48 h' : 'Ready to ship in 48h',
    heading: locale === 'es' ? 'Piezas disponibles' : 'Pieces available',
    all: locale === 'es' ? 'Todo' : 'All',
    underHundred: locale === 'es' ? 'Menos de $100' : 'Under $100',
    gift: locale === 'es' ? 'Para regalar' : 'To gift',
    heirloom: locale === 'es' ? 'Pieza mayor' : 'Statement piece',
    newBadge: locale === 'es' ? 'Nuevo' : 'New',
  };

  const now = Date.now();

  return (
    <section className="flex flex-col gap-8 px-5 pb-16 pt-4 sm:px-8 lg:px-12 lg:pb-20 lg:pt-6">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0A83A]">
            {t.eyebrow}
          </span>
          <h2 className="font-display text-[32px] leading-[1.04] text-[#F1E7D6] sm:text-[44px] lg:text-[52px]">
            {t.heading}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[13px] font-bold">
          <span className="rounded-sm bg-[#F1E7D6] px-4 py-3 text-[#161210]">{t.all}</span>
          <span className="rounded-sm border border-[#3A2E24] px-4 py-3 text-[#C9BBA5]">{t.underHundred}</span>
          <span className="hidden rounded-sm border border-[#3A2E24] px-4 py-3 text-[#C9BBA5] sm:inline">{t.gift}</span>
          <span className="hidden rounded-sm border border-[#3A2E24] px-4 py-3 text-[#C9BBA5] sm:inline">{t.heirloom}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-[18px]">
        {products.map((product) => {
          const media = (product.media as MediaItem[] | null) ?? [];
          const image = media[0]?.url || '/product-placeholder.png';
          const name = (locale === 'es' ? product.name_es : product.name_en) || product.name || '';
          const href = `/product/${encodeURIComponent(product.name || String(product.id))}`;
          const discount = product.discount_percentage ?? 0;
          const finalPrice = product.dolar_price != null
            ? product.dolar_price * (1 - discount / 100)
            : null;
          const category = product.category_id ? getCategoryById(product.category_id) : undefined;
          const seal = product.category_id ? SEAL_BY_CATEGORY[product.category_id] ?? '#E0A83A' : '#E0A83A';
          const isNew = product.created_at
            ? (now - new Date(product.created_at).getTime()) / 86_400_000 <= NEW_WINDOW_DAYS
            : false;

          return (
            <article key={product.id} className="flex flex-col gap-3.5">
              <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-[#F1E7D6]">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-4"
                />
                {isNew && (
                  <span className="absolute left-3 top-3 bg-[#161210] px-2.5 py-[7px] text-[10px] font-bold uppercase tracking-[0.16em] text-[#E0A83A]">
                    {t.newBadge}
                  </span>
                )}
              </Link>
              <div className="flex flex-col gap-1.5">
                {category && (
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C7F6E]">
                    <span aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ background: seal }} />
                    {category.dbName[localeKey]}
                  </span>
                )}
                <Link href={href} className="font-display text-lg leading-tight text-[#F1E7D6] hover:text-[#F3C56B] sm:text-xl">
                  {name}
                </Link>
                {finalPrice != null && (
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-lg text-[#E0A83A] tabular-nums sm:text-[19px]">
                      {formatUSD(finalPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-[#8C7F6E] line-through tabular-nums">
                        {formatUSD(product.dolar_price || 0)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
