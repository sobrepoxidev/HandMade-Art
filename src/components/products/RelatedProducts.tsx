import { createClient } from '@/utils/supabase/server';
import { Database } from '@/lib/database.types';
import RelatedProductCard, { RelatedProductCardData } from './RelatedProductCard';

type Product = Database['public']['Tables']['products']['Row'];
type CategoryEmbed = Pick<
  Database['public']['Tables']['categories']['Row'],
  'id' | 'name_es' | 'name_en'
> | null;
type InventoryEmbed = Pick<
  Database['public']['Tables']['inventory']['Row'],
  'quantity'
>[];

type RelatedProductRow = Product & {
  categories: CategoryEmbed;
  inventory: InventoryEmbed;
};

type Props = {
  title: string;
  locale: string;
  categoryId?: number | null;
  excludeIds?: number[];
  limit?: number;
};

export default async function RelatedProducts({
  title,
  locale,
  categoryId,
  excludeIds = [],
  limit = 8,
}: Props) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(
      `id, name, name_es, name_en, colon_price, dolar_price,
       discount_percentage, is_featured, media, category_id, is_active,
       brand, country_of_origin, created_at, customs_description_en,
       dangerous_goods, description, description_en, height_cm, hs_code,
       length_cm, modified_at, sku, specifications, tags, weight_kg, width_cm,
       categories ( id, name_es, name_en ),
       inventory ( quantity )`
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (categoryId != null) {
    query = query.eq('category_id', categoryId);
  }
  if (excludeIds.length) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('RelatedProducts query error:', error);
    return null;
  }

  const rows = (data ?? []) as unknown as RelatedProductRow[];
  if (rows.length === 0) return null;

  const { data: { user } } = await supabase.auth.getUser();
  let favoriteIds = new Set<number>();

  if (user) {
    const productIds = rows.map((r) => r.id);
    const { data: favs } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id)
      .in('product_id', productIds);
    if (favs) favoriteIds = new Set(favs.map((f) => f.product_id));
  }

  const cards: RelatedProductCardData[] = rows.map((row) => {
    const { categories, inventory, ...product } = row;
    return {
      product: product as Product,
      category: categories,
      inventory: inventory?.[0]?.quantity ?? 0,
      isFavorite: favoriteIds.has(row.id),
    };
  });

  return (
    <section className="mt-12 overflow-hidden rounded-sm border border-[#3A2E24] bg-[#1E1813]">
      <header className="px-5 py-3 bg-[#161210] text-[#E0A83A] text-sm font-semibold tracking-wide border-b border-[#E0A83A]/20">
        {title}
      </header>
      <div className="grid grid-cols-2 gap-4 bg-[#1E1813] p-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <RelatedProductCard key={card.product.id} {...card} locale={locale} />
        ))}
      </div>
    </section>
  );
}
