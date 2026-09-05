import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, getLocaleSiteUrl } from "@/lib/metadata";
import { createClient } from "@/utils/supabase/server";
import { Link } from "@/i18n/navigation";
import CategoryProductGrid from "@/components/content/CategoryProductGrid";
import {
  getResolvedCategoryBySlug,
  getResolvedCategoryById,
  getAllCategorySlugParams,
  type ResolvedCategory,
} from "@/lib/content/categoryResolver";
import { getCategoryById as getEditorialCategoryById } from "@/lib/content/categories";
import { formatUSD } from "@/lib/formatCurrency";
import type { Database } from "@/lib/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type tParams = Promise<{ locale: string; slug: string }>;

// New categories created in the admin render on demand (dynamicParams true)
// and get cached for `revalidate` seconds — they don't need a redeploy to
// get a landing page, a sitemap entry, or a spot in llms.txt.
export const dynamicParams = true;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getAllCategorySlugParams();
}

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const category = await getResolvedCategoryBySlug(currentLocale, slug);

  if (!category) {
    return await buildMetadata({
      locale: currentLocale,
      pathname: `/${locale}/c/${slug}`,
      title: currentLocale === "es" ? "Categoría" : "Category",
    });
  }

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/c/${slug}`,
    title: category.metaTitle[currentLocale],
    description: category.metaDescription[currentLocale],
    alternatePathname: {
      es: `/c/${category.slugs.es}`,
      en: `/c/${category.slugs.en}`,
    },
  });
}

export default async function CategoryPage({ params }: { params: tParams }) {
  const { locale, slug } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const category = await getResolvedCategoryBySlug(currentLocale, slug);

  if (!category) {
    notFound();
  }

  const siteUrl = getLocaleSiteUrl(currentLocale);
  const canonicalUrl = `${siteUrl}/${locale}/c/${slug}`;

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })
    .limit(48);

  const productList = (products as Product[] | null) ?? [];
  const categoryLabel =
    (currentLocale === "es" ? category.nameEs : category.nameEn) ||
    category.h1[currentLocale];

  // Related-category cross-links only exist for editorial entries (the
  // curated `relatedIds` list lives in categories.ts); synthesized
  // categories simply skip that section further down.
  const editorialRelatedIds = getEditorialCategoryById(category.id)?.relatedIds ?? [];
  const relatedCategories = (
    await Promise.all(editorialRelatedIds.map((id) => getResolvedCategoryById(id)))
  ).filter((c): c is ResolvedCategory => Boolean(c));

  // ── JSON-LD ─────────────────────────────────────────────────────
  const itemList = productList.map((p, i) => {
    type MediaItem = { url: string; alt?: string };
    const displayName =
      (currentLocale === "es" ? p.name_es : p.name_en) || p.name || "";
    const productUrl = `${siteUrl}/${locale}/product/${encodeURIComponent(p.name || "")}`;
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
        "@id": `${productUrl}#product`,
        name: displayName,
        url: productUrl,
        image,
        offers:
          finalPrice != null
            ? {
                "@type": "Offer",
                priceCurrency: "USD",
                price: finalPrice.toFixed(2),
                availability: "https://schema.org/InStock",
                url: productUrl,
              }
            : undefined,
      },
    };
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: category.h1[currentLocale],
    description: category.metaDescription[currentLocale],
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
      {
        "@type": "ListItem",
        position: 3,
        name: category.h1[currentLocale],
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[currentLocale],
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer[currentLocale],
      },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-[#161210] text-[#F1E7D6]">
        <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" className="text-sm text-[#8C7F6E]">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-[#E0A83A]">
                  {currentLocale === "es" ? "Inicio" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-[#E0A83A]">
                  {currentLocale === "es" ? "Productos" : "Products"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#F1E7D6]">
                {category.h1[currentLocale]}
              </li>
            </ol>
          </nav>
        </div>

        <section className="mx-auto max-w-screen-xl px-4 pb-12 pt-4 sm:px-8 lg:px-12">
          <h1 className="font-display text-3xl font-semibold text-[#F1E7D6] sm:text-4xl">
            {category.h1[currentLocale]}
          </h1>

          <p className="mt-3 text-sm font-medium text-[#E0A83A]">
            {currentLocale === "es"
              ? `${category.productCount} ${category.productCount === 1 ? "pieza activa" : "piezas activas"}`
              : `${category.productCount} active ${category.productCount === 1 ? "piece" : "pieces"}`}
            {category.minPrice != null &&
              ` · ${currentLocale === "es" ? "desde" : "from"} ${formatUSD(category.minPrice)}`}
          </p>

          <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-relaxed text-[#C9BBA5]">
            {category.intro.map((paragraph, i) => (
              <p key={i}>{paragraph[currentLocale]}</p>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-screen-xl px-4 pb-16 sm:px-8 lg:px-12 md:pb-24">
          {productList.length > 0 ? (
            <CategoryProductGrid
              products={productList}
              categoryName={categoryLabel}
            />
          ) : (
            <p className="text-[#8C7F6E]">
              {currentLocale === "es"
                ? "Pronto vamos a tener piezas disponibles en esta categoría."
                : "We'll have pieces available in this category soon."}
            </p>
          )}
        </section>

        <section className="border-t border-[#3A2E24]">
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
            <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
              {currentLocale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>

            <div className="mt-6 divide-y divide-[#3A2E24] border-y border-[#3A2E24]">
              {category.faqs.map((faq) => (
                <details key={faq.question[currentLocale]} className="group py-4">
                  <summary className="cursor-pointer list-none text-[15px] font-medium text-[#F1E7D6] marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question[currentLocale]}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[#E0A83A] transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#C9BBA5]">
                    {faq.answer[currentLocale]}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {relatedCategories.length > 0 && (
          <section className="border-t border-[#3A2E24]">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
              <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
                {currentLocale === "es" ? "Categorías relacionadas" : "Related categories"}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {relatedCategories.map((rc) => (
                  <li key={rc.id}>
                    <Link
                      href={`/c/${rc.slugs[currentLocale]}`}
                      className="inline-flex items-center rounded-sm border border-[#3A2E24] bg-[#1E1813] px-4 py-2.5 text-sm font-medium text-[#F1E7D6] transition-colors hover:border-[#E0A83A] hover:text-[#E0A83A]"
                    >
                      {rc.h1[currentLocale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
