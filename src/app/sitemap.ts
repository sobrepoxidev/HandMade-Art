// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
};

/** Static routes that are identical across both locales. */
const STATIC_ROUTES: string[] = [
  "",
  "/about",
  "/products",
  "/shipping",
  "/contact",
  "/privacy-policies",
  "/conditions-service",
  "/qr",
  "/account",
  "/feria-artesanias",
  "/feria-artesanias-terminos",
  "/fiestas-patronales-de-san-ramon",
  "/search",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    (await headers()).get("host") ??
    "";

  const locale: "es" | "en" = host.includes("artehechoamano") ? "es" : "en";
  const altLocale: "es" | "en" = locale === "es" ? "en" : "es";

  const localeTag = locale === "es" ? "es-cr" : "en-us";
  const altLocaleTag = altLocale === "es" ? "es-cr" : "en-us";

  const altDomain = altLocale === "es" ? "artehechoamano.com" : "handmadeart.store";

  const now = new Date();

  const make = (path: string, isProduct = false): MetadataRoute.Sitemap[number] => ({
    url: `https://${host}/${locale}${path}`,
    lastModified: now,
    changeFrequency: isProduct ? "weekly" : "monthly",
    priority: isProduct ? 0.8 : 0.6,
    alternates: {
      languages: {
        [localeTag]: `https://${host}/${locale}${path}`,
        [altLocaleTag]: `https://${altDomain}/${altLocale}${path}`,
      },
    },
  });

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((p) => make(p));

  // Localized routes: each locale gets its own URL, hreflang points
  // at the other locale's URL.
  const localizedPages: MetadataRoute.Sitemap = Object.values(LOCALIZED_ROUTES).map(
    (paths) => ({
      url: `https://${host}/${locale}${paths[locale]}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          [localeTag]: `https://${host}/${locale}${paths[locale]}`,
          [altLocaleTag]: `https://${altDomain}/${altLocale}${paths[altLocale]}`,
        },
      },
    })
  );

  // Products
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: products, error } = await supabase
      .from("products")
      .select("name, modified_at, media")
      .eq("is_active", true)
      .not("name", "is", null);

    if (!error && products) {
      productPages = products.map((product) => {
        const media = Array.isArray(product.media) ? product.media : [];
        const images = media
          .map((m) => (m as { url?: string })?.url)
          .filter((u): u is string => typeof u === "string" && u.length > 0)
          .slice(0, 5);

        const url = `https://${host}/${locale}/product/${product.name}`;
        const altUrl = `https://${altDomain}/${altLocale}/product/${product.name}`;

        return {
          url,
          lastModified: product.modified_at ? new Date(product.modified_at) : now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              [localeTag]: url,
              [altLocaleTag]: altUrl,
            },
          },
          ...(images.length ? { images } : {}),
        };
      });
    }
  } catch (err) {
    console.error("Error fetching products for sitemap:", err);
  }

  return [...staticPages, ...localizedPages, ...productPages];
}
