import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
// Server component
import ProductDetail from '@/components/products/ProductDetail';

// The server component handles params extraction
type tParams = Promise<{ id: string, locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { id, locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  // Try to derive product name via query param or fallback
  const genericTitle = currentLocale === "es" ? "Producto" : "Product";
  
  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/product/${id}`,
    title: genericTitle,
  });
}

export default async function ProductPage({ params }: { params: tParams }) {
  const { id, locale } = await params;
  return <ProductDetail id={id} locale={locale} />;
}
