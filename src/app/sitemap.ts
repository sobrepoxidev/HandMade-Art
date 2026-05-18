// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getPathname } from "@/i18n/navigation";
import type { routing } from "@/i18n/routing";

export const runtime = "edge";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Internal route names — these are the keys in routing.pathnames.
// getPathname() resolves each to the localized URL per locale.
type InternalPathname = keyof typeof routing.pathnames;

const STATIC_ROUTES: InternalPathname[] = [
  "/",
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
  "/reinsercion-sociolaboral",
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

  // Resolve an internal pathname to the localized public URL.
  // For "/" we want "/${locale}" without trailing slash; for others
  // we want "/${locale}${localizedPath}".
  const buildUrl = (
    domain: string,
    targetLocale: "es" | "en",
    internal: InternalPathname
  ): string => {
    const localized = getPathname({ href: internal, locale: targetLocale });
    return `https://${domain}${localized}`;
  };

  const make = (
    internal: InternalPathname,
    isProduct = false
  ): MetadataRoute.Sitemap[number] => ({
    url: buildUrl(host, locale, internal),
    lastModified: now,
    changeFrequency: isProduct ? "weekly" : "monthly",
    priority: isProduct ? 0.8 : 0.6,
    alternates: {
      languages: {
        [localeTag]: buildUrl(host, locale, internal),
        [altLocaleTag]: buildUrl(altDomain, altLocale, internal),
      },
    },
  });

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => make(route));

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

  return [...staticPages, ...productPages];
}
