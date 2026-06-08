"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/database.types";
import RelatedProductCard, { RelatedProductCardData } from "./RelatedProductCard";
import RelatedProductsSkeleton from "./RelatedProductsSkeleton";

type Product = Database["public"]["Tables"]["products"]["Row"];
type CategoryEmbed = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "name_es" | "name_en"
> | null;
type InventoryEmbed = Pick<
  Database["public"]["Tables"]["inventory"]["Row"],
  "quantity"
>[];

type RelatedProductRow = Product & {
  categories: CategoryEmbed;
  inventory: InventoryEmbed;
};

interface Props {
  title: string;
  locale: string;
  categoryId?: number | null;
  excludeIds?: number[];
  limit?: number;
}

export default function RelatedProductsClient({
  title,
  locale,
  categoryId,
  excludeIds = [],
  limit = 8,
}: Props) {
  const [cards, setCards] = useState<RelatedProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  const excludeIdsKey = excludeIds.join(",");
  const prevExcludeIdsKey = useRef(excludeIdsKey);

  useEffect(() => {
    if (!inView || (hasFetched && prevExcludeIdsKey.current === excludeIdsKey)) return;
    prevExcludeIdsKey.current = excludeIdsKey;

    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase
        .from("products")
        .select(
          `id, name, name_es, name_en, colon_price, dolar_price,
           discount_percentage, is_featured, media, category_id, is_active,
           brand, country_of_origin, created_at, customs_description_en,
           dangerous_goods, description, description_en, height_cm, hs_code,
           length_cm, modified_at, sku, specifications, tags, weight_kg, width_cm,
           categories ( id, name_es, name_en ),
           inventory ( quantity )`
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (categoryId != null) query = query.eq("category_id", categoryId);
      if (excludeIds.length) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data, error } = await query;
      if (error || !data) {
        if (error) console.error("RelatedProductsClient query error:", error);
        setLoading(false);
        setHasFetched(true);
        return;
      }

      const rows = data as unknown as RelatedProductRow[];
      const productIds = rows.map((r) => r.id);

      let favoriteIds = new Set<number>();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && productIds.length) {
        const { data: favs } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", session.user.id)
          .in("product_id", productIds);
        if (favs) favoriteIds = new Set(favs.map((f) => f.product_id));
      }

      const next: RelatedProductCardData[] = rows.map((row) => {
        const { categories, inventory, ...product } = row;
        return {
          product: product as Product,
          category: categories,
          inventory: inventory?.[0]?.quantity ?? 0,
          isFavorite: favoriteIds.has(row.id),
        };
      });

      setCards(next);
      setLoading(false);
      setHasFetched(true);
    };

    fetchProducts();
  }, [inView, categoryId, excludeIdsKey, limit, hasFetched, excludeIds]);

  if (!inView) {
    return <div ref={ref} className="min-h-[100px]" />;
  }

  if (loading || !hasFetched) {
    return (
      <div ref={ref}>
        <RelatedProductsSkeleton title={title} />
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <section
      ref={ref}
      className="mt-12 overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#FAF6EF]"
    >
      <header className="px-5 py-3 bg-[#2D2D2D] text-[#C9A962] text-sm font-semibold tracking-wide border-b border-[#C9A962]/20">
        {title}
      </header>
      <div className="grid grid-cols-2 gap-4 bg-[#FAF6EF] p-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <RelatedProductCard key={card.product.id} {...card} locale={locale} />
        ))}
      </div>
    </section>
  );
}
