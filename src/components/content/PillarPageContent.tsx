import { Link } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/server";
import { getLocaleSiteUrl } from "@/lib/metadata";
import { CATEGORIES } from "@/lib/content/categories";
import { GUIDES } from "@/lib/content/guides";
import CategoryProductGrid from "@/components/content/CategoryProductGrid";
import type { PillarContent } from "@/lib/content/pillars";
import type { Database } from "@/lib/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type MediaItem = { url: string; alt?: string };

interface PillarPageContentProps {
  locale: "es" | "en";
  pillar: PillarContent;
}

/**
 * Known-ranking product slugs (the `name` column, see project gotchas) that
 * already pull impressions in Search Console. Every pillar strip tries to
 * surface whichever of these are relevant to it, on top of the pillar's own
 * query, so the strip never omits a page Google already partially ranks.
 */
const KNOWN_RANKING_SLUGS = [
  "welcome-to-costa-rica-mirror-frame",
  "green-iguana-pitcher",
  "tropical-sloth-napkin-holder",
];

const STRIP_LIMIT = 8;

/** Pick STRIP_LIMIT items evenly spaced across a price-sorted list, so the
 * strip shows a real spread (cheap mug -> mid-range -> statement piece)
 * instead of just the N cheapest rows. */
function pickPriceSpread(sorted: Product[], count: number): Product[] {
  if (sorted.length <= count) return sorted;
  const picks: Product[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i * (sorted.length - 1)) / (count - 1));
    const item = sorted[idx];
    if (!seen.has(item.id)) {
      seen.add(item.id);
      picks.push(item);
    }
  }
  return picks;
}

async function fetchPillarProducts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pillarId: PillarContent["id"]
): Promise<Product[]> {
  let products: Product[] = [];

  if (pillarId === "handicrafts") {
    // Brand+country pillar: lead with the featured catalog.
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(STRIP_LIMIT);
    products = (data as Product[] | null) ?? [];
  } else if (pillarId === "wood-carvings") {
    // Craft/technique pillar: mirrors, sculptures, coffee drippers — the
    // most heavily carved categories.
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .in("category_id", [3, 6, 1])
      .order("created_at", { ascending: false })
      .limit(STRIP_LIMIT);
    products = (data as Product[] | null) ?? [];
  } else {
    // Buyer-intent souvenir pillar: a genuine price spread — from the
    // cheapest mugs to the statement mirrors — not just the N cheapest rows.
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("dolar_price", { ascending: true });
    products = pickPriceSpread((data as Product[] | null) ?? [], STRIP_LIMIT);
  }

  const missingSlugs = KNOWN_RANKING_SLUGS.filter(
    (slug) => !products.some((p) => p.name === slug)
  );

  if (missingSlugs.length > 0) {
    const { data: extra } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .in("name", missingSlugs);

    if (extra && extra.length > 0) {
      const merged = [...(extra as Product[]), ...products];
      const seen = new Set<number>();
      products = merged.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    }
  }

  return products.slice(0, STRIP_LIMIT);
}

/**
 * Shared body for the three SEO pillar pages, rendered by both the
 * ES-canonical and EN-canonical route folders for each pillar (see
 * src/lib/content/pillars.ts for the slug pairs). Follows the same
 * structure as the category landing page (app/[locale]/c/[slug]/page.tsx):
 * breadcrumb, h1, long-form sections, product strip, FAQ, cross-links.
 */
export default async function PillarPageContent({
  locale,
  pillar,
}: PillarPageContentProps) {
  const siteUrl = getLocaleSiteUrl(locale);
  const canonicalPath = `/${pillar.slug[locale]}`;
  const canonicalUrl = `${siteUrl}/${locale}${canonicalPath}`;
  const guideBase = locale === "es" ? "guias" : "guides";

  const supabase = await createClient();
  const products = await fetchPillarProducts(supabase, pillar.id);

  // ── JSON-LD ─────────────────────────────────────────────────────
  const itemList = products.map((p, i) => {
    const displayName =
      (locale === "es" ? p.name_es : p.name_en) || p.name || "";
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pillar.h1[locale],
    description: pillar.metaDescription[locale],
    inLanguage: locale === "es" ? "es-CR" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Handmade Art",
      url: siteUrl,
    },
    ...(itemList.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: itemList.length,
            itemListElement: itemList,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "es" ? "Inicio" : "Home",
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "es" ? "Productos" : "Products",
        item: `${siteUrl}/${locale}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pillar.h1[locale],
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pillar.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer[locale],
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
                  {locale === "es" ? "Inicio" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-[#E0A83A]">
                  {locale === "es" ? "Productos" : "Products"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#F1E7D6]">
                {pillar.h1[locale]}
              </li>
            </ol>
          </nav>
        </div>

        <section className="mx-auto max-w-screen-xl px-4 pb-12 pt-4 sm:px-8 lg:px-12">
          <h1 className="font-display max-w-4xl text-3xl font-semibold text-[#F1E7D6] sm:text-4xl">
            {pillar.h1[locale]}
          </h1>

          <div className="mt-10 max-w-[68ch] space-y-10">
            {pillar.sections.map((section) => (
              <section key={section.h2[locale]}>
                <h2 className="font-display text-xl font-semibold text-[#F1E7D6] sm:text-2xl">
                  {section.h2[locale]}
                </h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-[#C9BBA5]">
                  {section.paragraphs[locale].map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {products.length > 0 && (
          <section className="border-t border-[#3A2E24]">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
              <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
                {locale === "es" ? "Piezas relacionadas" : "Related pieces"}
              </h2>
              <div className="mt-8">
                <CategoryProductGrid products={products} categoryName={pillar.h1[locale]} />
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-[#3A2E24]">
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
            <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
              {locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>

            <div className="mt-6 max-w-3xl divide-y divide-[#3A2E24] border-y border-[#3A2E24]">
              {pillar.faqs.map((faq) => (
                <details key={faq.question[locale]} className="group py-4">
                  <summary className="cursor-pointer list-none text-[15px] font-medium text-[#F1E7D6] marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question[locale]}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[#E0A83A] transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#C9BBA5]">
                    {faq.answer[locale]}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#3A2E24]">
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
            <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
              {locale === "es" ? "Explorá por categoría" : "Browse by category"}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/c/${cat.slugs[locale]}`}
                    className="inline-flex items-center rounded-sm border border-[#3A2E24] bg-[#1E1813] px-4 py-2.5 text-sm font-medium text-[#F1E7D6] transition-colors hover:border-[#E0A83A] hover:text-[#E0A83A]"
                  >
                    {cat.h1[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[#3A2E24]">
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
            <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
              {locale === "es" ? "Guías relacionadas" : "Related guides"}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GUIDES.map((guide) => (
                <li key={guide.slug[locale]}>
                  <Link
                    href={`/${guideBase}/${guide.slug[locale]}`}
                    className="block rounded-sm border border-[#3A2E24] bg-[#1E1813] p-4 text-sm font-medium text-[#F1E7D6] transition-colors hover:border-[#E0A83A] hover:text-[#E0A83A]"
                  >
                    {guide.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
