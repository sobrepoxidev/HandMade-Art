// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Initialize Supabase client for server-side sitemap generation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    (await headers()).get("host") ??
    "";

  // → Idioma principal según dominio
  const locale: "es" | "en" = host.includes("artehechoamano") ? "es" : "en";
  const altLocale: "es" | "en" = locale === "es" ? "en" : "es";

  // → Códigos hreflang
  const localeTag    = locale    === "es" ? "es-cr" : "en-us";
  const altLocaleTag = altLocale === "es" ? "es-cr" : "en-us";

  // → Dominio alterno fijo
  const altDomain = altLocale === "es" ? "artehechoamano.com" : "handmadeart.store";

  const now = new Date();

  // Helper con tipo correcto
  const make = (path: string, isProduct = false, lastMod?: Date): MetadataRoute.Sitemap[number] => ({
    url: `https://${host}/${locale}${path}`,
    lastModified: lastMod || now,
    changeFrequency: isProduct ? "weekly" : "monthly",
    priority: isProduct ? 0.8 : 0.6,
    alternates: {
      languages: {
        [localeTag]:    `https://${host}/${locale}${path}`,
        [altLocaleTag]: `https://${altDomain}/${altLocale}${path}`,
      },
    },
  });

  // Fetch all active products for sitemap
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: products, error } = await supabase
      .from("products")
      .select("name, modified_at")
      .eq("is_active", true)
      .not("name", "is", null);

    if (!error && products) {
      productEntries = products
        .filter((p) => p.name) // Ensure name (slug) exists
        .map((product) =>
          make(
            `/product/${product.name}`,
            true,
            product.modified_at ? new Date(product.modified_at) : now
          )
        );
    }
  } catch (e) {
    console.error("Error fetching products for sitemap:", e);
  }

  return [
    make(""),
    make("/about"),
    make("/products"),
    make("/shipping"),
    make("/contact"),
    make("/privacy-policies"),
    make("/conditions-service"),
    make("/qr"),
    make("/account"),
    make("/feria-artesanias"),
    make("/feria-artesanias-terminos"),
    make("/fiestas-patronales-de-san-ramon"),
    make("/impact"),
    make("/search"),
    // Product pages with SEO-friendly slugs
    ...productEntries,
  ];
}
