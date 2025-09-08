// lib/seoConfig.ts
import type { Metadata } from "next";

/* -------------------------------------------------------------------------
 * Configuración SEO centralizada y optimizada
 * ---------------------------------------------------------------------- */
export const SEO_CONFIG = {
  siteName: "SobrePoxi",
  siteUrl: "https://sobrepoxi.com",
  defaultImage: {
    url: "https://sobrepoxi.com/og-image.webp",
    width: 1200,
    height: 630,
    type: "image/webp"
  },
  company: {
    name: "SobrePoxi",
    address: {
      streetAddress: "Centro Comercial Velasuma, 2da. Planta local No. 9, San Isidro Downtown",
      addressLocality: "Vásquez de Coronado",
      addressRegion: "San Isidro",
      postalCode: "11101",
      addressCountry: "CR"
    },
    phone: "+50685850000",
    email: "info@sobrepoxi.com",
    geo: {
      latitude: 9.9355431,
      longitude: -84.1545449
    }
  }
} as const;

/* -------------------------------------------------------------------------
 * Textos SEO por locale optimizados
 * ---------------------------------------------------------------------- */
export const SEO_TEXT = {
  es: {
    title: {
      default: "SobrePoxi | Muebles con resina epóxica y pisos epóxicos en Costa Rica",
      template: "%s | SobrePoxi"
    },
    description:
      "Especialistas en muebles artesanales con resina epóxica y pisos epóxicos industriales y de lujo. Proyectos en Costa Rica con garantía de calidad y durabilidad.",
    keywords:
      "muebles resina epóxica Costa Rica, pisos epóxicos industriales, pisos epóxicos lujo, mesas río resina, madera resina epóxica, pisos epóxicos Vásquez Coronado, SobrePoxi Costa Rica, arte resina epóxica",
    openGraph: {
      siteName: "SobrePoxi Costa Rica",
      locale: "es_CR"
    },
    pages: {
      about: {
        title: "Acerca de SobrePoxi | Especialistas en resina epóxica Costa Rica",
        description: "Conoce la historia de SobrePoxi, empresa líder en Costa Rica especializada en muebles con resina epóxica y pisos epóxicos industriales.",
        keywords: "SobrePoxi historia, empresa resina epóxica Costa Rica, especialistas pisos epóxicos, artesanos madera resina"
      },
      contact: {
        title: "Contacto SobrePoxi | Cotiza tu proyecto de resina epóxica",
        description: "Contáctanos para cotizar tu proyecto de muebles con resina epóxica o pisos epóxicos. Atención personalizada en Costa Rica.",
        keywords: "contacto SobrePoxi, cotizar resina epóxica, presupuesto pisos epóxicos Costa Rica, consulta muebles resina"
      },
      epoxyFloors: {
        title: "Pisos Epóxicos | Instalación profesional en Costa Rica",
        description: "Pisos epóxicos de alta calidad para uso industrial y comercial. Instalación profesional con garantía en Costa Rica.",
        keywords: "pisos epóxicos Costa Rica, instalación pisos epóxicos, pisos industriales epóxicos, pisos comerciales resina"
      },
      luxuryFlooring: {
        title: "Pisos Epóxicos de Lujo | Diseños exclusivos Costa Rica",
        description: "Pisos epóxicos decorativos y de lujo con diseños únicos. Transformamos espacios residenciales y comerciales en Costa Rica.",
        keywords: "pisos epóxicos lujo, pisos decorativos resina, diseños únicos pisos, pisos residenciales epóxicos Costa Rica"
      },
      industrialFlooring: {
        title: "Pisos Epóxicos Industriales | Alta resistencia Costa Rica",
        description: "Pisos epóxicos industriales de máxima resistencia para fábricas, bodegas y espacios de alto tráfico en Costa Rica.",
        keywords: "pisos epóxicos industriales, pisos alta resistencia, pisos fábricas Costa Rica, pisos bodegas epóxicos"
      },
      search: {
        title: "Búsqueda de productos | SobrePoxi Costa Rica",
        description: "Encuentra los mejores muebles con resina epóxica y productos para pisos epóxicos en nuestro catálogo.",
        keywords: "buscar productos SobrePoxi, catálogo resina epóxica, productos pisos epóxicos Costa Rica"
      }
    }
  },
  en: {
    title: {
      default: "SobrePoxi | Luxury epoxy resin furniture & industrial epoxy floors Costa Rica",
      template: "%s | SobrePoxi"
    },
    description:
      "Specialists in handcrafted epoxy resin furniture and industrial & luxury epoxy flooring. Projects in Costa Rica with quality and durability guarantee.",
    keywords:
      "epoxy resin furniture Costa Rica, industrial epoxy floors, luxury epoxy flooring, river tables resin, wood epoxy resin, epoxy floors Vasquez Coronado, SobrePoxi Costa Rica, epoxy resin art",
    openGraph: {
      siteName: "SobrePoxi Costa Rica",
      locale: "en_US"
    },
    pages: {
      about: {
        title: "About SobrePoxi | Epoxy resin specialists Costa Rica",
        description: "Learn about SobrePoxi's story, leading company in Costa Rica specialized in epoxy resin furniture and industrial epoxy floors.",
        keywords: "SobrePoxi history, epoxy resin company Costa Rica, epoxy flooring specialists, wood resin artisans"
      },
      contact: {
        title: "Contact SobrePoxi | Quote your epoxy resin project",
        description: "Contact us to quote your epoxy resin furniture or epoxy flooring project. Personalized service in Costa Rica.",
        keywords: "contact SobrePoxi, quote epoxy resin, epoxy flooring budget Costa Rica, resin furniture consultation"
      },
      epoxyFloors: {
        title: "Epoxy Floors | Professional installation Costa Rica",
        description: "High-quality epoxy floors for industrial and commercial use. Professional installation with warranty in Costa Rica.",
        keywords: "epoxy floors Costa Rica, epoxy flooring installation, industrial epoxy floors, commercial resin floors"
      },
      luxuryFlooring: {
        title: "Luxury Epoxy Floors | Exclusive designs Costa Rica",
        description: "Decorative and luxury epoxy floors with unique designs. We transform residential and commercial spaces in Costa Rica.",
        keywords: "luxury epoxy floors, decorative resin floors, unique floor designs, residential epoxy floors Costa Rica"
      },
      industrialFlooring: {
        title: "Industrial Epoxy Floors | High resistance Costa Rica",
        description: "Industrial epoxy floors with maximum resistance for factories, warehouses and high-traffic spaces in Costa Rica.",
        keywords: "industrial epoxy floors, high resistance floors, factory floors Costa Rica, warehouse epoxy floors"
      },
      search: {
        title: "Product search | SobrePoxi Costa Rica",
        description: "Find the best epoxy resin furniture and epoxy flooring products in our catalog.",
        keywords: "search SobrePoxi products, epoxy resin catalog, epoxy flooring products Costa Rica"
      }
    }
  }
} as const;


/**
 * Construye metadatos completos optimizados para SEO en Next.js 15
 * @param opts Opciones de configuración de metadatos
 */
export function buildMetadata(opts: {
  locale: "es" | "en";
  pathname: string;
  title?: string;
  description?: string;
  keywords?: string;
  image?: { 
    url: string; 
    width?: number; 
    height?: number; 
    alt?: string;
    type?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      "max-video-preview"?: number;
      "max-image-preview"?: "large" | "standard" | "none";
      "max-snippet"?: number;
    };
  };
  overrides?: Metadata;
}): Metadata {
  const { locale, pathname, title, description, keywords, image, robots, overrides } = opts;
  const t = SEO_TEXT[locale];
  const config = SEO_CONFIG;

  /* --------------------------------------------------------------------- */
  /* Título optimizado con plantilla                                       */
  /* --------------------------------------------------------------------- */
  const pageTitle = title || t.title.default;
  const metaTitle = title 
    ? { default: title, template: t.title.template }
    : t.title;

  /* --------------------------------------------------------------------- */
  /* Imagen OG optimizada                                                  */
  /* --------------------------------------------------------------------- */
  const ogImage = image ?? {
    url: config.defaultImage.url,
    width: config.defaultImage.width,
    height: config.defaultImage.height,
    type: config.defaultImage.type,
    alt: locale === "es"
      ? "SobrePoxi - Muebles con resina epóxica y pisos epóxicos industriales en Costa Rica"
      : "SobrePoxi - Epoxy resin furniture and industrial epoxy floors in Costa Rica"
  };

  /* --------------------------------------------------------------------- */
  /* Configuración de robots optimizada                                    */
  /* --------------------------------------------------------------------- */
  const robotsConfig = robots ?? {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  };

  /* --------------------------------------------------------------------- */
  /* URLs canónicas y alternativas                                         */
  /* --------------------------------------------------------------------- */
  const canonicalUrl = `${config.siteUrl}${pathname}`;

  /* --------------------------------------------------------------------- */
  /* Metadatos finales optimizados                                         */
  /* --------------------------------------------------------------------- */
  return {
    title: metaTitle,
    description: description || t.description,
    keywords: keywords || t.keywords,
    authors: [{ name: config.company.name, url: config.siteUrl }],
    creator: config.company.name,
    publisher: config.company.name,
    robots: robotsConfig,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "es-CR": `${config.siteUrl}/es${pathname.replace(`/${locale}`, "")}`,
        "en-US": `${config.siteUrl}/en${pathname.replace(`/${locale}`, "")}`,
        "x-default": canonicalUrl
      }
    },
    openGraph: {
      type: "website",
      locale: t.openGraph.locale,
      url: canonicalUrl,
      siteName: t.openGraph.siteName,
      title: pageTitle,
      description: description || t.description,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
          type: ogImage.type
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@sobrepoxi",
      creator: "@sobrepoxi",
      title: pageTitle,
      description: description || t.description,
      images: [ogImage.url]
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    ...overrides
  };
}

/**
 * Función de compatibilidad para migración gradual
 * @deprecated Usar buildMetadata en su lugar
 */
export function getCommonMetadata(locale: string, overrides?: Metadata): Partial<Metadata> {
  const meta = buildMetadata({
    locale: locale === "es" ? "es" : "en",
    pathname: "/"
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, alternates, twitter, ...common } = meta;

  return {
    ...common,
    ...overrides
  };
}

/**
 * Función de compatibilidad para títulos
 * @deprecated Usar buildMetadata con parámetro title en su lugar
 */
export function buildTitle(pageTitle?: string): Metadata["title"] {
  const base = SEO_CONFIG.siteName;
  if (!pageTitle) return { default: base, template: `%s | ${base}` };
  return { default: pageTitle, template: `%s | ${base}` };
}
