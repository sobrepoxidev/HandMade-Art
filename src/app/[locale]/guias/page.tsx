import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import GuidesIndexContent from "@/components/content/GuidesIndexContent";

type tParams = Promise<{ locale: string }>;

/**
 * Canonical for the Spanish-locale guides index.
 *
 * - /es/guias -> renders content (canonical for ES)
 * - /en/guias -> 308 redirect to /en/guides
 *
 * The matching English canonical lives at app/[locale]/guides/.
 */

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";

  const title =
    currentLocale === "es"
      ? "Guías de Handmade Art"
      : "Handmade Art Guides";
  const description =
    currentLocale === "es"
      ? "Guías sobre café costarricense, cuidado de madera tallada, regalos artesanales y el impacto social detrás de cada pieza."
      : "Guides on Costa Rican coffee, caring for carved wood, handmade gifts, and the social impact behind every piece.";

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/guias`,
    title,
    description,
    alternatePathname: { es: "/guias", en: "/guides" },
  });
}

export default async function GuiasIndexPage({ params }: { params: tParams }) {
  const { locale } = await params;
  if (locale === "en") {
    redirect("/en/guides");
  }
  return <GuidesIndexContent locale="es" />;
}
