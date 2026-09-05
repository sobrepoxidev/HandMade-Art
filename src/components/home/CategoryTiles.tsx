import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getCategoryById } from '@/lib/content/categories';
import { formatUSD } from '@/lib/formatCurrency';

// Six workshop "tables" featured on the home page, matched to a real photo
// shot for this category in public/taller/. Order and photo come from the
// approved artboard; counts and starting prices below are live Supabase data.
const TILE_CATEGORIES: { id: number; photo: string }[] = [
  { id: 1, photo: '/taller/cat-chorreadores.webp' },
  { id: 3, photo: '/taller/cat-espejos.webp' },
  { id: 6, photo: '/taller/cat-esculturas.webp' },
  { id: 5, photo: '/taller/cat-pinturas.webp' },
  { id: 10, photo: '/taller/cat-jarras.webp' },
  { id: 2, photo: '/taller/cat-cocina.webp' },
];

export default async function CategoryTiles({ locale }: { locale: string }) {
  const localeKey: 'es' | 'en' = locale === 'es' ? 'es' : 'en';
  const supabase = await createClient();

  const stats = await Promise.all(
    TILE_CATEGORIES.map(async ({ id }) => {
      const [{ count }, { data: cheapest }] = await Promise.all([
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', id)
          .eq('is_active', true),
        supabase
          .from('products')
          .select('dolar_price')
          .eq('category_id', id)
          .eq('is_active', true)
          .not('dolar_price', 'is', null)
          .order('dolar_price', { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);
      return { id, count: count ?? 0, minPrice: cheapest?.dolar_price ?? null };
    })
  );

  const { count: totalCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true });

  const t = {
    eyebrow: locale === 'es' ? 'Comprar por oficio' : 'Shop by craft',
    heading: locale === 'es' ? 'Seis mesas, un mismo taller.' : 'Six tables, one workshop.',
    viewAll: locale === 'es' ? `Ver las ${totalCount ?? 11} categorías` : `See all ${totalCount ?? 11} categories`,
    pieces: locale === 'es' ? 'piezas' : 'pieces',
    from: locale === 'es' ? 'desde' : 'from',
  };

  return (
    <section className="flex flex-col gap-9 px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pb-10 lg:pt-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0A83A]">
            {t.eyebrow}
          </span>
          <h2 className="font-display text-[32px] leading-[1.04] text-[#F1E7D6] sm:text-[44px] lg:text-[52px]">
            {t.heading}
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm font-bold tracking-wide text-[#E0A83A] underline decoration-2 underline-offset-[7px] hover:text-[#F3C56B]"
        >
          {t.viewAll}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
        {TILE_CATEGORIES.map(({ id, photo }) => {
          const cat = getCategoryById(id);
          if (!cat) return null;
          const stat = stats.find((s) => s.id === id);
          return (
            <Link
              key={id}
              href={`/c/${cat.slugs[localeKey]}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-[#1E1813]"
            >
              <Image
                src={photo}
                alt={cat.dbName[localeKey]}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(180deg,rgba(22,18,16,0)_0%,rgba(22,18,16,0.92)_100%)] p-5"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-display text-[26px] leading-none text-[#F1E7D6] sm:text-[30px]">
                    {cat.dbName[localeKey]}
                  </span>
                  <span className="text-xs text-[#C9BBA5]">
                    {stat?.count ?? 0} {t.pieces}
                    {stat?.minPrice != null && ` · ${t.from} ${formatUSD(stat.minPrice)}`}
                  </span>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#E0A83A] text-[#E0A83A]">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
