import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductCard from "./ProductCard";
import { Database } from "@/lib/database.types";

// Server component that fetches a small set of products and renders them with ProductCard.
// It is intentionally minimal: no pagination, no modal, just links to product pages.
// This same component can be used in /cart and /product/[id] to encourage navigation.

export type MinimalProduct = Pick<Database['public']['Tables']['products']['Row'],
  | "id"
  | "name"
  | "name_es"
  | "name_en"
  | "colon_price"
  | "dolar_price"
  | "media"
  | "category_id"
  | "discount_percentage"
  | "is_featured">

interface RelatedProductsProps {
  /** Section title shown above the grid */
  title: string;
  /** Current locale (e.g. "es" | "en") so ProductCard can show the right language */
  locale: string;
  /** Category to filter by (optional) */
  categoryId?: number | null;
  /** IDs to exclude from the result (e.g. items already in cart) */
  excludeIds?: number[];
  /** Max number of products to fetch (default: 8) */
  limit?: number;
}

export default async function RelatedProducts({
  title,
  categoryId,
  excludeIds = [],
  limit = 8,
}: RelatedProductsProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Base query – only active products
  let query = supabase
    .from("products")
    .select(
      "id, name, name_es, name_en, colon_price, dolar_price, media, category_id, discount_percentage, is_featured"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (excludeIds.length) {
    // Supabase "not in" filter expects a parenthesised comma-separated list
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching related products:", error.message);
    return null;
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-6 rounded-md overflow-hidden shadow-md">
      <div className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold">
        {title}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          // ProductCard is a client component; casting here is safe because we selected matching fields.
          <ProductCard key={product.id} product={product as unknown as Database['public']['Tables']['products']['Row']} />
        ))}
      </div>
    </div>
  );
}
