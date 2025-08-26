// lib/seoConfig.ts
import type { Metadata } from "next";



const SEO_TEXT = {
  es: {
    title: {
      default: "HandMade Art | Arte Costarricense",
      template: "%s | HandMade Art Costa Rica"
    },
    description:
      "Descubre arte 100% hecho a mano en Costa Rica: pinturas, esculturas y piezas únicas. Envíos a todo el país.",
    keywords:
      "arte hecho a mano, arte costarricense, arte tico, piezas únicas, esculturas, pinturas originales, handmade art Costa Rica"
  },
  en: {
    title: {
      default: "HandMade Art | Costa Rican Handmade Art",
      template: "%s | HandMade Art USA"
    },
    description:
      "Shop unique handmade art pieces from Costa Rica—paintings, sculptures and décor—crafted by local artisans and shipped fast to the USA.",
    keywords:
      "handmade art, handmade art USA, handmade art Costa Rica, Costa Rican crafts, original paintings, sculptures, unique art pieces"
  }
} as const;

/** Devuelve 'es-CR' / 'en-US' para `<html lang>` y og:locale */
export function mapLocale(locale: string) {
  return locale === "es" ? "es-CR" : "en-US";
}

/**
 * Construye metadatos completos.
 * @param pathname  Ruta absoluta (para canonical) – usa request.url o un slug simple.
 * @param title     Título específico (opcional).
 * @param image     Imagen OG/Twitter específica (opcional).
 */
export function buildMetadata(opts: {
  locale: "es" | "en";
  pathname: string;
  title?: string;
  description?: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
}): Metadata {
  const { locale, pathname, title, description, image } = opts;
  const t = SEO_TEXT[locale];

  const baseTitle =
    title && title !== t.title.default
      ? { default: title, template: t.title.template }
      : t.title;

  const ogImage = image ?? {
    url: "https://artehechoamano.com/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "HandMade Art – Arte costarricense hecho a mano"
  };

  return {
    title: baseTitle,
    description: description ?? t.description,
    keywords: t.keywords,
    alternates: {
      canonical: pathname,
      languages: {
        "es-CR": "/es",
        "en-US": "/en"
      }
    },
    openGraph: {
      title: baseTitle.default,
      description: description ?? t.description,
      url: `https://artehechoamano.com${pathname}`,
      siteName: "HandMade Art",
      images: [ogImage],
      locale: mapLocale(locale),
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle.default,
      description: description ?? t.description,
      images: [ogImage.url]
    }
  };
}
