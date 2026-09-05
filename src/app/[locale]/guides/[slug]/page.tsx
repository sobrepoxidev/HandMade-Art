import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import GuideDetailContent from "@/components/content/GuideDetailContent";
import { GUIDES } from "@/lib/content/guides";

type tParams = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

/**
 * Canonical for English guides: /en/guides/<en-slug>.
 * /es/guides/<en-slug> 308-redirects to the ES canonical at
 * /es/guias/<es-slug> (see app/[locale]/guias/[slug]/).
 */
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const guide of GUIDES) {
    params.push({ locale: "en", slug: guide.slug.en });
    params.push({ locale: "es", slug: guide.slug.en });
  }
  return params;
}

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const guide = GUIDES.find((g) => g.slug.en === slug);

  if (!guide) {
    return await buildMetadata({
      locale: currentLocale,
      pathname: `/${locale}/guides/${slug}`,
      title: currentLocale === "es" ? "Guía" : "Guide",
    });
  }

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/guides/${slug}`,
    title: guide.metaTitle[currentLocale],
    description: guide.metaDescription[currentLocale],
    alternatePathname: {
      es: `/guias/${guide.slug.es}`,
      en: `/guides/${guide.slug.en}`,
    },
  });
}

export default async function GuideDetailPage({ params }: { params: tParams }) {
  const { locale, slug } = await params;
  const guide = GUIDES.find((g) => g.slug.en === slug);

  if (!guide) {
    notFound();
  }

  if (locale === "es") {
    redirect(`/es/guias/${guide.slug.es}`);
  }

  return <GuideDetailContent locale="en" guide={guide} />;
}
