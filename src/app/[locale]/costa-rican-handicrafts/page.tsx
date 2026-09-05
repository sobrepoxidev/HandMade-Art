import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import PillarPageContent from "@/components/content/PillarPageContent";
import { getPillarById } from "@/lib/content/pillars";

type tParams = Promise<{ locale: string }>;

const pillar = getPillarById("handicrafts")!;

/**
 * Canonical for the English-locale "brand + country" pillar page.
 *
 * - /en/costa-rican-handicrafts -> renders content (canonical for EN)
 * - /es/costa-rican-handicrafts -> 308 redirect to /es/artesania-costarricense
 *
 * The matching Spanish canonical lives at app/[locale]/artesania-costarricense/.
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

export default async function CostaRicanHandicraftsPage({ params }: { params: tParams }) {
  const { locale } = await params;
  if (locale === "es") {
    redirect(`/es/${pillar.slug.es}`);
  }
  return <PillarPageContent locale="en" pillar={pillar} />;
}
