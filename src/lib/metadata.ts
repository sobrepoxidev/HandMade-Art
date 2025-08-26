// src/lib/metadata.ts
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://handmadeart.store';

const seoConfig = {
  es: {
    title: {
      default: "Handmade Art | Arte Costarricense Hecho a Mano",
      template: "%s | Handmade Art Costa Rica",
    },
    description: "Descubre arte 100% hecho a mano en Costa Rica: pinturas, esculturas y piezas únicas. Envíos a todo el país.",
    keywords: "arte hecho a mano, arte costarricense, arte tico, piezas únicas, esculturas, pinturas originales, handmade art Costa Rica",
  },
  en: {
    title: {
      default: "Handmade Art | Costa Rican Handmade Art",
      template: "%s | Handmade Art USA",
    },
    description: "Shop unique handmade art pieces from Costa Rica—paintings, sculptures and décor—crafted by local artisans and shipped fast to the USA.",
    keywords: "handmade art, handmade art USA, handmade art Costa Rica, Costa Rican crafts, original paintings, sculptures, unique art pieces",
  },
};

interface BuildMetadataParams {
  locale: "es" | "en";
  title?: string;
  description?: string;
  pathname: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}

export function buildMetadata(params: BuildMetadataParams): Metadata {
  const { locale, title, description, pathname, image } = params;
  const t = seoConfig[locale];

  const pageTitle = title ? `${title}` : t.title.default;
  const pageDescription = description || t.description;

  const ogImage = image || {
    url: "/og-image.jpg", // Default OG image
    width: 1200,
    height: 630,
    alt: "Handmade Art - Arte costarricense hecho a mano",
  };

  // Ensure image URL is absolute
  if (ogImage.url.startsWith('/')) {
    ogImage.url = `${SITE_URL}${ogImage.url}`;
  }

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: pageTitle,
      template: t.title.template,
    },
    description: pageDescription,
    keywords: t.keywords,
    
    alternates: {
      canonical: pathname,
      languages: {
        "es-CR": `${SITE_URL}/es${pathname.startsWith('/es') ? pathname.substring(3) : (pathname.startsWith('/en') ? pathname.substring(3) : pathname)}`,
        "en-US": `${SITE_URL}/en${pathname.startsWith('/en') ? pathname.substring(3) : (pathname.startsWith('/es') ? pathname.substring(3) : pathname)}`,
      },
    },

    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${SITE_URL}${pathname}`,
      siteName: "Handmade Art",
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
      locale: locale === "es" ? "es_CR" : "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage.url],
      creator: "@handmadeart", // Optional: Add Twitter handle
    },
  };

  return metadata;
}