// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getResolvedCategories } from "@/lib/content/categoryResolver";
import { GUIDES } from "@/lib/content/guides";
import { PILLARS } from "@/lib/content/pillars";

export const runtime = "edge";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const DOMAIN: { es: string; en: string } = {
  es: "artehechoamano.com",
  en: "handmadeart.store",
};

/**
 * Filesystem alias routes that resolve to different public paths per
 * locale. Each entry maps an internal "concept" to its public URL per
 * locale. The matching files live as separate route folders under
 * app/[locale]/ (one canonical, one alias that redirects when visited
 * with the wrong locale).
 */
const LOCALIZED_ROUTES: Record<string, { es: string; en: string }> = {
  reintegration: {
    es: "/reinsercion-sociolaboral",
    en: "/social-reintegration",
  },
  guidesIndex: {
    es: "/guias",
    en: "/guides",
  },
};

/**
 * Static routes that are identical across both locales.
 *
 * `/feria-artesanias` is deliberately excluded: its page sets
 * `robots: { index: false, follow: true }` (see
 * src/app/[locale]/feria-artesanias/page.tsx), so listing it here would
 * contradict that noindex directive. `/feria-artesanias-terminos` and
 * `/fiestas-patronales-de-san-ramon` don't set index:false and stay listed.
 */
const STATIC_ROUTES: string[] = [
  "",
  "/about",
  "/products",
  "/shipping",
  "/contact",
  "/privacy-policies",
  "/conditions-service",
  "/feria-artesanias-terminos",
  "/fiestas-patronales-de-san-ramon",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    (await headers()).get("host") ??
    "";

  const locale: "es" | "en" = host.includes("artehechoamano") ? "es" : "en";

  const now = new Date();

  /**
   * Full hreflang set for a URL pair: es-CR + en-US + x-default. x-default
   * always points at the ES URL (the site's default locale), consistent
   * across every entry in the sitemap.
   */
  const hreflangs = (esUrl: string, enUrl: string) => ({
    languages: {
      "es-CR": esUrl,
      "en-US": enUrl,
      "x-default": esUrl,
    },
  });

  // Same path on both locales (e.g. "/about", "/products").
  const make = (
    path: string,
    opts: { changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number } = {}
  ): MetadataRoute.Sitemap[number] => {
    const esUrl = `https://${DOMAIN.es}/es${path}`;
    const enUrl = `https://${DOMAIN.en}/en${path}`;
    return {
      url: `https://${host}/${locale}${path}`,
      changeFrequency: opts.changeFrequency ?? "monthly",
      priority: opts.priority ?? 0.6,
      alternates: hreflangs(esUrl, enUrl),
    };
  };

  // Different (localized) path per locale, e.g. category and guide slugs.
  const makeLocalized = (
    paths: { es: string; en: string },
    opts: {
      changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority?: number;
      lastModified?: Date;
    } = {}
  ): MetadataRoute.Sitemap[number] => {
    const esUrl = `https://${DOMAIN.es}/es${paths.es}`;
    const enUrl = `https://${DOMAIN.en}/en${paths.en}`;
    return {
      url: `https://${host}/${locale}${paths[locale]}`,
      changeFrequency: opts.changeFrequency ?? "monthly",
      priority: opts.priority ?? 0.7,
      ...(opts.lastModified ? { lastModified: opts.lastModified } : {}),
      alternates: hreflangs(esUrl, enUrl),
    };
  };

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((p) =>
    make(p, { changeFrequency: p === "" ? "weekly" : "monthly", priority: p === "" ? 1.0 : p === "/products" ? 0.9 : 0.6 })
  );

  // Localized alias routes (reintegration page, guides index).
  const localizedPages: MetadataRoute.Sitemap = Object.values(LOCALIZED_ROUTES).map(
    (paths) => makeLocalized(paths, { changeFrequency: "monthly", priority: 0.7 })
  );

  // Category landing pages — one entry per category with active products,
  // localized slug per locale. Sourced live from the DB (via the resolver)
  // so categories created in the admin enter the sitemap automatically.
  const resolvedCategories = await getResolvedCategories();
  const categoryPages: MetadataRoute.Sitemap = resolvedCategories.map((cat) =>
    makeLocalized(
      { es: `/c/${cat.slugs.es}`, en: `/c/${cat.slugs.en}` },
      { changeFrequency: "weekly", priority: 0.8 }
    )
  );

  // Guides — one entry per guide, localized slug + real lastModified.
  const guidePages: MetadataRoute.Sitemap = GUIDES.map((guide) =>
    makeLocalized(
      { es: `/guias/${guide.slug.es}`, en: `/guides/${guide.slug.en}` },
      {
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: new Date(guide.updatedAt),
      }
    )
  );

  // Pillar pages — one entry per pillar, localized slug per locale.
  const pillarPages: MetadataRoute.Sitemap = PILLARS.map((pillar) =>
    makeLocalized(
      { es: `/${pillar.slug.es}`, en: `/${pillar.slug.en}` },
      { changeFrequency: "monthly", priority: 0.8 }
    )
  );

  // Products
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: products, error } = await supabase
      .from("products")
      .select("name, modified_at, media")
      .eq("is_active", true)
      .not("name", "is", null)
      .order("modified_at", { ascending: false })
      .limit(5000);

    if (!error && products) {
      productPages = products.map((product) => {
        const media = Array.isArray(product.media) ? product.media : [];
        const images = media
          .map((m) => (m as { url?: string })?.url)
          .filter((u): u is string => typeof u === "string" && u.length > 0)
          .slice(0, 5);

        const slug = encodeURIComponent(product.name ?? "");
        const url = `https://${host}/${locale}/product/${slug}`;
        const esUrl = `https://${DOMAIN.es}/es/product/${slug}`;
        const enUrl = `https://${DOMAIN.en}/en/product/${slug}`;

        return {
          url,
          lastModified: product.modified_at ? new Date(product.modified_at) : now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: hreflangs(esUrl, enUrl),
          ...(images.length ? { images } : {}),
        };
      });
    }
  } catch (err) {
    console.error("Error fetching products for sitemap:", err);
  }

  return [
    ...staticPages,
    ...localizedPages,
    ...categoryPages,
    ...guidePages,
    ...pillarPages,
    ...productPages,
  ];
}
