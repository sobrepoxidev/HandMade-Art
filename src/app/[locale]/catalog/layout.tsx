import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

type tParams = {
  locale: string;
};

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const catalogMetadata = {
    es: {
      title: "Catálogo de Productos",
      description: "Explora nuestro catálogo completo, encuentre productos únicos y solicite cotizaciones personalizadas.",
      image: {
        url: "/home/catalog.webp",
        width: 1024,
        height: 1024,
        alt: "Catálogo de artesanías costarricenses - Handmade Art"
      }
    },
    en: {
      title: "Product Catalog",
      description: "Explore our full catalog, find unique products, and request personalized quotes.",
      image: {
        url: "/home/catalog.webp",
        width: 1024,
        height: 1024,
        alt: "Costa Rican handmade crafts catalog - Handmade Art"
      }
    }
  };

  const metadata = catalogMetadata[currentLocale];
  
  return buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/catalog`,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image
  });
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}