import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { createClient } from "@/utils/supabase/server";
// Server component
import ProductDetail from '@/components/products/ProductDetail';

// The server component handles params extraction - now uses 'name' slug instead of 'id'
type tParams = Promise<{ name: string, locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { name, locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  // Fetch product data to get localized name for metadata
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, name_es, name_en, media')
    .eq('name', name)
    .single();

  // Get localized name for title
  const productName = product
    ? (currentLocale === 'es' ? product.name_es : product.name_en) || product.name
    : (currentLocale === "es" ? "Producto" : "Product");

  // Get the first media item if available
  const firstMedia = product && Array.isArray(product.media) && product.media.length > 0
    ? product.media[0] as { url: string }
    : null;

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/product/${name}`,
    title: productName || (currentLocale === "es" ? "Producto" : "Product"),
    image: firstMedia ? {
      url: firstMedia.url,
      width: 800,
      height: 800,
      alt: productName || ''
    } : undefined
  });
}

export default async function ProductPage({ params }: { params: tParams }) {
  const { name, locale } = await params;
  return <ProductDetail name={name} locale={locale} />;
}
