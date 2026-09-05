import { Link } from "@/i18n/navigation";
import { GUIDES } from "@/lib/content/guides";
import { getLocaleSiteUrl } from "@/lib/metadata";

interface GuidesIndexContentProps {
  locale: "es" | "en";
}

/** Shared body for the guides index — rendered at /es/guias and /en/guides. */
export default function GuidesIndexContent({ locale }: GuidesIndexContentProps) {
  const siteUrl = getLocaleSiteUrl(locale);
  const base = locale === "es" ? "guias" : "guides";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: GUIDES.map((guide, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/${locale}/${base}/${guide.slug[locale]}`,
      name: guide.title[locale],
    })),
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
              <li aria-current="page" className="text-[#F1E7D6]">
                {locale === "es" ? "Guías" : "Guides"}
              </li>
            </ol>
          </nav>
        </div>

        <section className="mx-auto max-w-screen-xl px-4 pb-16 pt-4 sm:px-8 lg:px-12 md:pb-24">
          <h1 className="font-display text-3xl font-semibold text-[#F1E7D6] sm:text-4xl">
            {locale === "es" ? "Guías de Handmade Art" : "Handmade Art Guides"}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#C9BBA5]">
            {locale === "es"
              ? "Artículos prácticos sobre café costarricense, artesanía en madera y el programa de reinserción social detrás de cada pieza."
              : "Practical articles about Costa Rican coffee, wood craftsmanship, and the social reintegration program behind every piece."}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug[locale]}
                href={`/${base}/${guide.slug[locale]}`}
                className="flex flex-col rounded-sm border border-[#3A2E24] bg-[#1E1813] p-6 transition-colors hover:border-[#E0A83A]"
              >
                <h2 className="font-display text-lg font-semibold text-[#F1E7D6]">
                  {guide.title[locale]}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#C9BBA5]">
                  {guide.excerpt[locale]}
                </p>
                <span className="mt-4 text-sm font-medium text-[#E0A83A]">
                  {locale === "es" ? "Leer guía →" : "Read guide →"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
