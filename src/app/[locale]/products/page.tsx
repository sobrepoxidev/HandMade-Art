import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildMetadata } from "@/lib/metadata";
import Loading from "@/components/products/LoadingGallery";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import { createClient } from "@/utils/supabase/server";

/**
 * Catálogo principal. Renderiza JSON-LD (CollectionPage + ItemList + Breadcrumb)
 * en el HTML estático para que crawlers y LLMs lean la lista sin ejecutar JS.
 */

type tParams = Promise<{ locale: string }>;

type MediaItem = { url: string; alt?: string };

async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "handmadeart.store";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

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

  // Try to pull a representative image from the first featured product.
  let ogImage:
    | { url: string; width: number; height: number; alt: string }
    | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("media")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(1)
      .maybeSingle();
    const media = (data?.media as MediaItem[] | null) || [];
    const first = media[0];
    if (first?.url) {
      ogImage = {
        url: first.url,
        width: 1200,
        height: 1200,
        alt:
          currentLocale === "es"
            ? "Catálogo de artesanía hecha a mano en Costa Rica"
            : "Costa Rican handmade art catalog",
      };
    }
  } catch (err) {
    console.warn("Catalog OG image lookup failed:", err);
  }

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/products`,
    title,
    description,
    image: ogImage,
  });
}

export default async function ProductsPage({ params }: { params: tParams }) {
  const { locale } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const siteUrl = await getSiteUrl();

  // Lightweight server-side fetch ONLY for JSON-LD listing.
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
    const slug = encodeURIComponent(p.name || "");
    const url = `${siteUrl}/${locale}/product/${slug}`;
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

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/${locale}/products#collection`,
    url: `${siteUrl}/${locale}/products`,
    name:
      currentLocale === "es"
        ? "Catálogo de artesanía costarricense hecha a mano"
        : "Costa Rican handmade art catalog",
    inLanguage: currentLocale === "es" ? "es-CR" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Handmade Art",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: itemList.length,
      itemListElement: itemList,
    },
  };

  const breadcrumbSchema = {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Suspense fallback={<Loading />}>
        <ProductsPageContent />
      </Suspense>
    </>
  );
}
