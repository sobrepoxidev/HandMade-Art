import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import GuideDetailContent from "@/components/content/GuideDetailContent";
import { GUIDES } from "@/lib/content/guides";

type tParams = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

/**
 * Canonical for Spanish guides: /es/guias/<es-slug>.
 * /en/guias/<es-slug> 308-redirects to the EN canonical at
 * /en/guides/<en-slug> (see app/[locale]/guides/[slug]/).
 */
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const guide of GUIDES) {
    params.push({ locale: "es", slug: guide.slug.es });
    params.push({ locale: "en", slug: guide.slug.es });
  }
  return params;
}

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const guide = GUIDES.find((g) => g.slug.es === slug);

  if (!guide) {
    return await buildMetadata({
      locale: currentLocale,
      pathname: `/${locale}/guias/${slug}`,
      title: currentLocale === "es" ? "Guía" : "Guide",
    });
  }

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/guias/${slug}`,
    title: guide.metaTitle[currentLocale],
    description: guide.metaDescription[currentLocale],
    alternatePathname: {
      es: `/guias/${guide.slug.es}`,
      en: `/guides/${guide.slug.en}`,
    },
  });
}

export default async function GuiaDetailPage({ params }: { params: tParams }) {
  const { locale, slug } = await params;
  const guide = GUIDES.find((g) => g.slug.es === slug);

  if (!guide) {
    notFound();
  }

  if (locale === "en") {
    redirect(`/en/guides/${guide.slug.en}`);
  }

  return <GuideDetailContent locale="es" guide={guide} />;
}
