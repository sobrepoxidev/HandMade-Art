// src/lib/metadata.ts
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://handmadeart.store';

const DEFAULT_IMAGE = {
  url: `${SITE_URL}/og-image.webp`,
  width: 500,
  height: 500,
  type: 'image/webp'
};

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
    type?: string;
  };
}

export function buildMetadata(params: BuildMetadataParams): Metadata {
  const { locale, title, description, pathname, image } = params;
  const t = seoConfig[locale];

  const pageTitle = title ? `${title}` : t.title.default;
  const pageDescription = description || t.description;

  const ogImage = image || {
    url: DEFAULT_IMAGE.url,
    width: DEFAULT_IMAGE.width,
    height: DEFAULT_IMAGE.height,
    alt: "Handmade Art - Arte costarricense hecho a mano",
    type: DEFAULT_IMAGE.type,
  };

  // Ensure image URL is absolute
  if (ogImage.url.startsWith('/')) {
    ogImage.url = `${SITE_URL}${ogImage.url}`;
  }
  
  // Ensure canonical URL is absolute
  const canonicalUrl = `${SITE_URL}${pathname}`;

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: pageTitle,
      template: t.title.template,
    },
    description: pageDescription,
    keywords: t.keywords,
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "es-CR": `${SITE_URL}/es${pathname.startsWith('/es') ? pathname.substring(3) : (pathname.startsWith('/en') ? pathname.substring(3) : pathname)}`,
        "en-US": `${SITE_URL}/en${pathname.startsWith('/en') ? pathname.substring(3) : (pathname.startsWith('/es') ? pathname.substring(3) : pathname)}`,
        "x-default": canonicalUrl,
      },
    },

    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: "Handmade Art",
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
          type: ogImage.type,
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