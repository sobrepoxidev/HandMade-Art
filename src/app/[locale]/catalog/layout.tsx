import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seoConfig";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const catalogMetadata = {
    es: {
      title: "Catálogo de Productos | Handmade Art",
      description: "Explora nuestro catálogo completo, encuentre productos únicos y solicite cotizaciones personalizadas.",
      image: {
        url: "/public/home/catalog.webp",
        width: 1200,
        height: 630,
        alt: "Catálogo de artesanías costarricenses - Handmade Art"
      }
    },
    en: {
      title: "Catalog of Products | Handmade Art",
      description: "Find our complete catalog, unique products and request personalized quotes.",
      image: {
        url: "/public/home/catalog.webp",
        width: 1200,
        height: 630,
        alt: "Costa Rican handmade crafts catalog - Handmade Art"
      }
    }
  };

  const metadata = catalogMetadata[currentLocale];
  
  return {
    ...buildMetadata({
      locale: currentLocale,
      pathname: `/${locale}/catalog`,
      title: metadata.title,
      image: metadata.image
    }),
    openGraph: {
      ...buildMetadata({
        locale: currentLocale,
        pathname: `/${locale}/catalog`,
        title: metadata.title,
        image: metadata.image
      }).openGraph,
      type: "website",
      url: `https://artehechoamano.com/${locale}/catalog`,
    },
    twitter: {
      ...buildMetadata({
        locale: currentLocale,
        pathname: `/${locale}/catalog`,
        title: metadata.title,
        image: metadata.image
      }).twitter,
      card: "summary_large_image",
    }
  };
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}