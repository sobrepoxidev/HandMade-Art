import { Link } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/server";
import { getLocaleSiteUrl } from "@/lib/metadata";
import { getCategoryById, getCategoryPath } from "@/lib/content/categories";
import type { GuideContent } from "@/lib/content/guides";
import type { Database } from "@/lib/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type MediaItem = { url: string; alt?: string };

interface GuideDetailContentProps {
  locale: "es" | "en";
  guide: GuideContent;
}

/** Shared body for a single guide — rendered at /es/guias/[slug] and /en/guides/[slug]. */
export default async function GuideDetailContent({
  locale,
  guide,
}: GuideDetailContentProps) {
  const siteUrl = getLocaleSiteUrl(locale);
  const base = locale === "es" ? "guias" : "guides";
  const canonicalUrl = `${siteUrl}/${locale}/${base}/${guide.slug[locale]}`;

  const relatedCategory = getCategoryById(guide.relatedCategoryId);

  let relatedProducts: Product[] = [];
  if (relatedCategory) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, name_es, name_en, dolar_price, discount_percentage, media")
      .eq("is_active", true)
      .eq("category_id", relatedCategory.id)
      .order("created_at", { ascending: false })
      .limit(4);
    relatedProducts = (data as Product[] | null) ?? [];
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: guide.title[locale],
    description: guide.metaDescription[locale],
    inLanguage: locale === "es" ? "es-CR" : "en-US",
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: "Handmade Art",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Handmade Art",
      url: siteUrl,
    },
    mainEntityOfPage: canonicalUrl,
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
        name: locale === "es" ? "Guías" : "Guides",
        item: `${siteUrl}/${locale}/${base}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title[locale],
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
                <Link href={`/${base}`} className="hover:text-[#E0A83A]">
                  {locale === "es" ? "Guías" : "Guides"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#F1E7D6]">
                {guide.title[locale]}
              </li>
            </ol>
          </nav>
        </div>

        <article className="mx-auto max-w-screen-xl px-4 pb-12 pt-4 sm:px-8 lg:px-12">
          <h1 className="font-display max-w-3xl text-3xl font-semibold text-[#F1E7D6] sm:text-4xl">
            {guide.title[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#C9BBA5]">
            {guide.excerpt[locale]}
          </p>

          <div className="mt-10 max-w-3xl space-y-10">
            {guide.sections.map((section) => (
              <section key={section.h2[locale]}>
                <h2 className="font-display text-xl font-semibold text-[#F1E7D6]">
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
        </article>

        <section className="border-t border-[#3A2E24]">
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
            <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
              {locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>
            <div className="mt-6 max-w-3xl divide-y divide-[#3A2E24] border-y border-[#3A2E24]">
              {guide.faqs.map((faq) => (
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

        {relatedCategory && (
          <section className="border-t border-[#3A2E24]">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 lg:px-12 md:py-24">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-semibold text-[#F1E7D6]">
                  {relatedCategory.h1[locale]}
                </h2>
                <Link
                  href={getCategoryPath(relatedCategory.id, locale)}
                  className="text-sm font-medium text-[#E0A83A] hover:underline"
                >
                  {locale === "es" ? "Ver categoría →" : "View category →"}
                </Link>
              </div>

              {relatedProducts.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {relatedProducts.map((p) => {
                    const media = p.media as MediaItem[] | null;
                    const name =
                      (locale === "es" ? p.name_es : p.name_en) || p.name || "";
                    const finalPrice =
                      p.dolar_price != null && (p.discount_percentage ?? 0) > 0
                        ? p.dolar_price * (1 - (p.discount_percentage ?? 0) / 100)
                        : p.dolar_price;
                    return (
                      <Link
                        key={p.id}
                        href={`/product/${encodeURIComponent(p.name || String(p.id))}`}
                        className="group block overflow-hidden rounded-sm border border-[#3A2E24] bg-[#1E1813]"
                      >
                        <div className="relative aspect-square bg-[#F1E7D6]">
                          {media?.[0]?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={media[0].url}
                              alt={name}
                              className="h-full w-full object-contain p-3"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-sm font-medium text-[#F1E7D6]">
                            {name}
                          </p>
                          {finalPrice != null && (
                            <p className="mt-1 text-sm font-semibold text-[#E0A83A]">
                              ${finalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
