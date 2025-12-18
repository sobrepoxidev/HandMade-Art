import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { supabase } from "@/lib/supabaseClient";
import ProductDetail from '@/components/products/ProductDetail';
import { notFound } from "next/navigation";

type tParams = Promise<{ slug: string, locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { slug, locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  // Fetch product to get the actual name for metadata
  const { data: product } = await supabase
    .from('products')
    .select('name_es, name_en, description, description_en')
    .eq('name', slug)
    .single();

  const title = product
    ? (currentLocale === "es" ? product.name_es : product.name_en) || slug
    : (currentLocale === "es" ? "Producto" : "Product");

  const description = product
    ? (currentLocale === "es" ? product.description : product.description_en) || undefined
    : undefined;

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/product/${slug}`,
    title,
    description,
  });
}

export default async function ProductPage({ params }: { params: tParams }) {
  const { slug, locale } = await params;

  // Verify the product exists
  const { data: product, error } = await supabase
    .from('products')
    .select('id')
    .eq('name', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetail slug={slug} locale={locale} />;
}
