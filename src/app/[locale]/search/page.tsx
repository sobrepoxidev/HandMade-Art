import SearchResultsPage from "@/components/search/SearchResultsPage";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const pageTitle = currentLocale === 'es' ? 'Resultados de búsqueda' : 'Search results';

  return buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/search`,
    title: pageTitle,
  });
}

export default async function SearchPage({ params }: { params: tParams }) {
    const { locale } = await params;
    return <SearchResultsPage locale={locale} />;
}
