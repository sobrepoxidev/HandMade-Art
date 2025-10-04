import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Loading from "@/components/products/LoadingGallery";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import { createClient } from "@/utils/supabase/server";

/**
 * Página de productos que muestra todos los productos disponibles.
 * La implementación principal ha sido movida al componente ProductsPageContent.
 */

type tParams = Promise<{ id: string, locale: string }>;
export async function generateMetadata({
  params
}: {
  params: tParams;
}): Promise<Metadata> {
  const { locale, id } = await params;

  // Fetch product data from Supabase
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('id, name, name_es, name_en, media')
    .eq('id', id)
    .single();

  if (!product) { 
    return await buildMetadata({
      locale: locale === "es" ? "es" : "en",
      pathname: `/products`,
      title: locale === "es" ? "Productos" : "Products"
    });
  }

  // Get localized name based on locale
  const productName = locale === 'es' 
    ? (product.name_es || product.name)
    : (product.name_en || product.name);
    
  // Get the first media item if available
  const firstMedia = Array.isArray(product.media) && product.media.length > 0 
    ? product.media[0]
    : null;

  return await buildMetadata({
    locale: locale === "es" ? "es" : "en",
    pathname: `/product/${id}`,
    title: productName || (locale === "es" ? "Producto" : "Product"),
    image: firstMedia && {
      url: firstMedia.url,
      width: 800,
      height: 800,
      alt: productName || ''
    }
  });
}

export default async function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsPageContent />
    </Suspense>
  );
}