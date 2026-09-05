import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import PillarPageContent from "@/components/content/PillarPageContent";
import { getPillarById } from "@/lib/content/pillars";

type tParams = Promise<{ locale: string }>;

const pillar = getPillarById("handicrafts")!;

/**
 * Canonical for the Spanish-locale "brand + country" pillar page.
 *
 * - /es/artesania-costarricense -> renders content (canonical for ES)
 * - /en/artesania-costarricense -> 308 redirect to /en/costa-rican-handicrafts
 *
 * The matching English canonical lives at app/[locale]/costa-rican-handicrafts/.
 */
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/${pillar.slug[currentLocale]}`,
    title: pillar.metaTitle[currentLocale],
    description: pillar.metaDescription[currentLocale],
    alternatePathname: {
      es: `/${pillar.slug.es}`,
      en: `/${pillar.slug.en}`,
    },
  });
}

export default async function ArtesaniaCostarricensePage({ params }: { params: tParams }) {
  const { locale } = await params;
  if (locale === "en") {
    redirect(`/en/${pillar.slug.en}`);
  }
  return <PillarPageContent locale="es" pillar={pillar} />;
}
