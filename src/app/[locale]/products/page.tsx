import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { buildMetadata } from "@/lib/metadata";
import Loading from "@/components/products/LoadingGallery";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import { createClient } from "@/utils/supabase/server";

/**
 * Página principal de catálogo. Renderiza un ItemList JSON-LD con los
 * productos activos para que crawlers y LLMs entiendan la lista sin
 * ejecutar JavaScript.
 */

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  const title =
    currentLocale === "es"
      ? "Catálogo de artesanía costarricense hecha a mano"
      : "Costa Rican handmade art catalog";

  const description =
    currentLocale === "es"
      ? "Explora todas las piezas únicas: espejos, chorreadores, esculturas y decoración hecha a mano en Costa Rica. Envíos a todo el país."
      : "Browse every one-of-a-kind piece: mirrors, coffee drippers, sculptures and décor handmade in Costa Rica. Shipping nationwide.";

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/products`,
    title,
    description,
  });
}

async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "handmadeart.store";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

type MediaItem = { url: string; alt?: string };

export default async function ProductsPage({ params }: { params: tParams }) {
  const { locale } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const siteUrl = await getSiteUrl();

  // Lightweight server-side fetch ONLY for the JSON-LD listing.
  // The interactive catalog UI is still rendered by ProductsPageContent (client).
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, name_es, name_en, dolar_price, discount_percentage, media")
    .eq("is_active", true)
    .not("name", "is", null)
    .order("created_at", { ascending: false })
    .limit(60);

  const itemList = (products ?? []).map((p, i) => {
    const displayName =
      (currentLocale === "es" ? p.name_es : p.name_en) || p.name || "";
    const url = `${siteUrl}/${locale}/product/${p.name}`;
    const media = (p.media as MediaItem[] | null) ?? [];
    const image = media[0]?.url;
    const discount = p.discount_percentage ?? 0;
    const finalPrice =
      p.dolar_price != null && discount > 0
        ? p.dolar_price * (1 - discount / 100)
        : p.dolar_price;

    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": `${url}#product`,
        name: displayName,
        url,
        image,
        offers:
          finalPrice != null
            ? {
                "@type": "Offer",
                priceCurrency: "USD",
                price: finalPrice.toFixed(2),
                availability: "https://schema.org/InStock",
                url,
              }
            : undefined,
      },
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/${locale}/products#collection`,
    url: `${siteUrl}/${locale}/products`,
    name:
      currentLocale === "es"
        ? "Catálogo de artesanía costarricense hecha a mano"
        : "Costa Rican handmade art catalog",
    inLanguage: currentLocale === "es" ? "es-CR" : "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: itemList.length,
      itemListElement: itemList,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: currentLocale === "es" ? "Inicio" : "Home",
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentLocale === "es" ? "Productos" : "Products",
        item: `${siteUrl}/${locale}/products`,
      },
    ],
  };

  return (
    <>
      <Script
        id="products-collection-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="products-breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Suspense fallback={<Loading />}>
        <ProductsPageContent />
      </Suspense>
    </>
  );
}
