// src/lib/metadata.ts
import type { Metadata } from "next";
import { headers } from "next/headers";

// Dominios por idioma para SEO bi-dominio
const DOMAIN_CONFIG = {
  es: "artehechoamano.com",
  en: "handmadeart.store",
} as const;

// Obtiene la URL base del request actual (con fallback)
async function getSiteUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  } catch (err) {
    console.warn("No se pudo obtener la URL del request. Usando fallback.", err);
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://handmadeart.store";
}

// Detecta el locale basado en el host actual
function detectLocaleFromHost(host: string): "es" | "en" {
  return host.includes("artehechoamano") ? "es" : "en";
}

function getDefaultImage(siteUrl: string) {
  // Tu imagen 1:1 válida
  return {
    url: `${siteUrl}/web-image.jpg`,
    width: 1024,
    height: 1024,
    type: "image/jpeg",
  };
}

const seoConfig = {
  es: {
    title: {
      default:
        "Handmade Art | Arte costarricense hecho a mano que transforma vidas",
      template: "%s | Handmade Art Costa Rica",
    },
    // Copy con intención de clic (sin exagerar)
    description:
      "Compra arte hecho a mano en Costa Rica: espejos, chorreadores y piezas únicas con calidad real. Envíos a todo el país. Cada compra impulsa la reinserción social.",
    // En Next, keywords puede ser string|string[]. Preferimos string[].
    keywords: [
      "arte hecho a mano",
      "artesanía hecha a mano",
      "arte costarricense",
      "artesanía costarricense",
      "arte tico",
      "arte tica",
      "chorreadores artesanales",
      "espejos artesanales",
      "hecho en Costa Rica",
      "regalos únicos",
      "impacto social",
    ] as string[],
  },
  en: {
    title: {
      default:
        "Handmade Art | Costa Rican handmade art that changes lives",
      template: "%s | Handmade Art",
    },
    description:
      "Shop handmade art from Costa Rica—mirrors, coffee drippers and one-of-a-kind pieces with real quality. Fast nationwide delivery. Every purchase supports social reintegration.",
    keywords: [
      "handmade art",
      "costa rican crafts",
      "handmade mirrors",
      "coffee drippers handmade",
      "made in Costa Rica",
      "one of a kind",
      "social impact",
    ] as string[],
  },
} as const;

interface BuildMetadataParams {
  locale: "es" | "en";
  title?: string;
  description?: string;
  pathname: string; // Debe comenzar con "/"
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
    type?: string;
  };
}

export async function buildMetadata(
  params: BuildMetadataParams
): Promise<Metadata> {
  const { locale, title, description, pathname, image } = params;
  const t = seoConfig[locale];

  const siteUrl = await getSiteUrl();
  const defaultImage = getDefaultImage(siteUrl);

  const pageTitle = title ?? t.title.default;
  const pageDescription = description ?? t.description;

  const ogImage = {
    url: image?.url ?? defaultImage.url,
    width: image?.width ?? defaultImage.width,
    height: image?.height ?? defaultImage.height,
    alt:
      image?.alt ??
      (locale === "es"
        ? "Handmade Art - Arte costarricense hecho a mano"
        : "Handmade Art - Costa Rican handmade art"),
    type: image?.type ?? defaultImage.type,
  };

  // Asegurar URL absoluta para imagen
  if (ogImage.url.startsWith("/")) {
    ogImage.url = `${siteUrl}${ogImage.url}`;
  }

  // Canonical absoluto
  const canonicalUrl = `${siteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  // Cálculo de alternates idiomáticos con dominios separados
  const basePath =
    pathname.startsWith("/es") || pathname.startsWith("/en")
      ? pathname.slice(3) || "/"
      : pathname;

  // URLs alternativas con dominios correctos para cada idioma
  const esUrl = `https://${DOMAIN_CONFIG.es}/es${basePath === "/" ? "" : basePath}`;
  const enUrl = `https://${DOMAIN_CONFIG.en}/en${basePath === "/" ? "" : basePath}`;

  const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: pageTitle,
      template: t.title.template,
    },
    description: pageDescription,
    keywords: t.keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: {
        "es-CR": esUrl,
        "en-US": enUrl,
        "x-default": locale === "es" ? esUrl : enUrl,
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
      creator: "@handmadeart",
    },

    robots: {
      index: true,
      follow: true,
      // Para que Google permita previews grandes
      "max-image-preview": "large",
    },
  };

  return metadata;
}
