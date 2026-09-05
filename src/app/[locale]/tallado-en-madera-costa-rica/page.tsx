import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import PillarPageContent from "@/components/content/PillarPageContent";
import { getPillarById } from "@/lib/content/pillars";

type tParams = Promise<{ locale: string }>;

const pillar = getPillarById("wood-carvings")!;

/**
 * Canonical for the Spanish-locale "craft / technique" pillar page.
 *
 * - /es/tallado-en-madera-costa-rica -> renders content (canonical for ES)
 * - /en/tallado-en-madera-costa-rica -> 308 redirect to /en/costa-rica-wood-carvings
 *
 * The matching English canonical lives at app/[locale]/costa-rica-wood-carvings/.
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

export default async function TalladoEnMaderaCostaRicaPage({ params }: { params: tParams }) {
  const { locale } = await params;
  if (locale === "en") {
    redirect(`/en/${pillar.slug.en}`);
  }
  return <PillarPageContent locale="es" pillar={pillar} />;
}
