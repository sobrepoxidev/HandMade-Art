import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import PillarPageContent from "@/components/content/PillarPageContent";
import { getPillarById } from "@/lib/content/pillars";

type tParams = Promise<{ locale: string }>;

const pillar = getPillarById("souvenirs")!;

/**
 * Canonical for the Spanish-locale "buyer intent" souvenir pillar page.
 *
 * - /es/souvenirs-de-costa-rica -> renders content (canonical for ES)
 * - /en/souvenirs-de-costa-rica -> 308 redirect to /en/costa-rica-souvenirs
 *
 * The matching English canonical lives at app/[locale]/costa-rica-souvenirs/.
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

export default async function SouvenirsDeCostaRicaPage({ params }: { params: tParams }) {
  const { locale } = await params;
  if (locale === "en") {
    redirect(`/en/${pillar.slug.en}`);
  }
  return <PillarPageContent locale="es" pillar={pillar} />;
}
