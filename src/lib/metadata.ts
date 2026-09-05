// src/lib/metadata.ts
import type { Metadata } from "next";

// Dominios por idioma para SEO bi-dominio
const DOMAIN_CONFIG = {
  es: "artehechoamano.com",
  en: "handmadeart.store",
} as const;

/**
 * Canonical origin for a locale. Middleware already forces es ↔ artehechoamano.com
 * and en ↔ handmadeart.store, so the locale alone determines the canonical host.
 * Never derive canonical/hreflang from the request `host` header: www, preview
 * deployments and proxies would leak into the canonical URL.
 */
export function getLocaleSiteUrl(locale: "es" | "en"): string {
  return `https://${DOMAIN_CONFIG[locale]}`;
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
  /**
   * Override the cross-locale alternate paths (without domain/locale prefix,
   * e.g. "/c/chorreadores-de-cafe"). Needed when the ES and EN routes use
   * different localized slugs instead of sharing the same path — the default
   * `basePath` derivation (stripping "/es" or "/en") only works when both
   * locales share an identical path.
   */
  alternatePathname?: { es: string; en: string };
}

export async function buildMetadata(
  params: BuildMetadataParams
): Promise<Metadata> {
  const { locale, title, description, pathname, image, alternatePathname } = params;
  const t = seoConfig[locale];

  const siteUrl = getLocaleSiteUrl(locale);
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

  // URLs alternativas con dominios correctos para cada idioma. Cuando las
  // rutas usan slugs localizados distintos por idioma (p. ej. categorías o
  // guías), `alternatePathname` provee el path exacto de cada lado; si no,
  // se deriva quitando el prefijo /es o /en del pathname actual (asume el
  // mismo path en ambos idiomas).
  let esUrl: string;
  let enUrl: string;
  if (alternatePathname) {
    // Callers pass the route WITHOUT the locale segment (e.g.
    // "/c/chorreadores-de-cafe"), so add it here. Emitting the locale-less URL
    // would point hreflang at a 308 redirect, which Google treats as a broken
    // alternate and drops the whole cluster.
    const withLocale = (path: string, loc: "es" | "en") => {
      const clean = path.startsWith("/") ? path : `/${path}`;
      if (clean === `/${loc}` || clean.startsWith(`/${loc}/`)) return clean;
      return `/${loc}${clean === "/" ? "" : clean}`;
    };
    esUrl = `https://${DOMAIN_CONFIG.es}${withLocale(alternatePathname.es, "es")}`;
    enUrl = `https://${DOMAIN_CONFIG.en}${withLocale(alternatePathname.en, "en")}`;
  } else {
    const basePath =
      pathname.startsWith("/es") || pathname.startsWith("/en")
        ? pathname.slice(3) || "/"
        : pathname;
    esUrl = `https://${DOMAIN_CONFIG.es}/es${basePath === "/" ? "" : basePath}`;
    enUrl = `https://${DOMAIN_CONFIG.en}/en${basePath === "/" ? "" : basePath}`;
  }

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
        // x-default must be the SAME URL on both locales (Google requires
        // consistency across the hreflang cluster); ES is the default locale.
        "x-default": esUrl,
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
