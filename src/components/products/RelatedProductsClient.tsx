"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabaseClient";

import { useInView } from "react-intersection-observer";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface Props {
  title: string;
  locale: string;
  categoryId?: number | null;
  excludeIds?: number[];
  limit?: number;
}

export default function RelatedProductsClient({
  title,
  categoryId,
  excludeIds = [],
  limit = 8,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  useEffect(() => {
    if (!inView) return;

    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("id, name_es, name_en, colon_price, dolar_price, media, category_id")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (excludeIds.length) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data, error } = await query;
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    };

    fetchProducts();
  }, [inView, categoryId, excludeIds, limit]);

  if (!inView) return <div ref={ref} />; // placeholder until in view

  if (loading) {
    return (
      <div ref={ref} className="mt-6 flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div ref={ref} className="mt-6 rounded-md overflow-hidden shadow-md">
      <div className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold">
        {title}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
