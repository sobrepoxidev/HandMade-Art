import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildMetadata, getLocaleSiteUrl } from "@/lib/metadata";
import Loading from "@/components/products/LoadingGallery";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/lib/database.types";

/**
 * Catálogo principal. Renderiza JSON-LD (CollectionPage + ItemList + Breadcrumb)
 * en el HTML estático para que crawlers y LLMs lean la lista sin ejecutar JS,
 * y precarga la primera página de resultados (misma consulta/filtros que
 * ProductsPageContent) para que esa primera página también quede en el HTML.
 */

type tParams = Promise<{ locale: string }>;
type tSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type MediaItem = { url: string; alt?: string };
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

const PRODUCTS_PER_PAGE = 12;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  return getLocaleSiteUrl(host.includes("handmadeart") ? "en" : "es");
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

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: tParams;
  searchParams: tSearchParams;
}) {
  const { locale } = await params;
  const sp = await searchParams;
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

  // --- SSR hydration data for ProductsPageContent (same query/filters the
  // client uses on first render) so crawlers get real product links in the
  // static HTML instead of an empty grid awaiting a client-side fetch.
  const page = Math.max(1, parseInt(firstParam(sp.page) || "1", 10) || 1);
  const categoryFilter = firstParam(sp.category);
  const brandFilter = firstParam(sp.brand);
  const tagFilter = firstParam(sp.tag);
  const minPrice = firstParam(sp.min_price);
  const maxPrice = firstParam(sp.max_price);
  const stockFilter = firstParam(sp.in_stock);
  const sortBy = firstParam(sp.sort) || "name_asc";
  const featuredOnly = firstParam(sp.featured) === "true";

  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  let initialQuery = supabase
    .from("products")
    .select("*, inventory(quantity)", { count: "exact" })
    .eq("is_active", true);

  if (categoryFilter) {
    initialQuery = initialQuery.eq("category_id", Number(categoryFilter));
  }
  if (brandFilter) {
    initialQuery = initialQuery.eq("brand", brandFilter);
  }
  if (tagFilter) {
    initialQuery = initialQuery.contains("tags", [tagFilter]);
  }
  if (minPrice) {
    initialQuery = initialQuery.gte("dolar_price", minPrice);
  }
  if (maxPrice) {
    initialQuery = initialQuery.lte("dolar_price", maxPrice);
  }
  if (stockFilter === "true") {
    initialQuery = initialQuery.gte("inventory.quantity", 1);
  }
  if (featuredOnly) {
    initialQuery = initialQuery.eq("is_featured", true);
  }

  if (sortBy === "price_asc") {
    initialQuery = initialQuery.order("dolar_price", { ascending: true });
  } else if (sortBy === "price_desc") {
    initialQuery = initialQuery.order("dolar_price", { ascending: false });
  } else if (sortBy === "name_desc") {
    initialQuery = initialQuery.order(currentLocale === "es" ? "name_es" : "name_en", {
      ascending: false,
    });
  } else if (sortBy === "discount") {
    initialQuery = initialQuery.order("discount_percentage", {
      ascending: false,
      nullsFirst: false,
    });
  } else if (sortBy === "newest") {
    initialQuery = initialQuery.order("created_at", { ascending: false });
  } else {
    initialQuery = initialQuery.order(currentLocale === "es" ? "name_es" : "name_en", {
      ascending: true,
    });
  }

  initialQuery = initialQuery.range(from, to);

  const [{ data: initialProductsData, count: initialTotalCount }, { data: initialCategoriesData }] =
    await Promise.all([
      initialQuery,
      supabase
        .from("categories")
        .select("id, name, name_es, name_en")
        .order(currentLocale === "es" ? "name_es" : "name_en", { ascending: true }),
    ]);

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
        <ProductsPageContent
          initialProducts={(initialProductsData as ProductRow[] | null) ?? []}
          initialTotal={initialTotalCount ?? 0}
          initialCategories={(initialCategoriesData as CategoryRow[] | null) ?? []}
        />
      </Suspense>
    </>
  );
}
