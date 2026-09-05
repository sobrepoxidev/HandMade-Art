import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import PillarPageContent from "@/components/content/PillarPageContent";
import { getPillarById } from "@/lib/content/pillars";

type tParams = Promise<{ locale: string }>;

const pillar = getPillarById("wood-carvings")!;

/**
 * Canonical for the English-locale "craft / technique" pillar page.
 *
 * - /en/costa-rica-wood-carvings -> renders content (canonical for EN)
 * - /es/costa-rica-wood-carvings -> 308 redirect to /es/tallado-en-madera-costa-rica
 *
 * The matching Spanish canonical lives at
 * app/[locale]/tallado-en-madera-costa-rica/.
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

export default async function CostaRicaWoodCarvingsPage({ params }: { params: tParams }) {
  const { locale } = await params;
  if (locale === "es") {
    redirect(`/es/${pillar.slug.es}`);
  }
  return <PillarPageContent locale="en" pillar={pillar} />;
}
