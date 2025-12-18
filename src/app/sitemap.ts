// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Create a Supabase client for edge runtime
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
  const localeTag = locale === "es" ? "es-cr" : "en-us";
  const altLocaleTag = altLocale === "es" ? "es-cr" : "en-us";

  // → Dominio alterno fijo
  const altDomain = altLocale === "es" ? "artehechoamano.com" : "handmadeart.store";

  const now = new Date();

  // Helper con tipo correcto
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

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
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
    make("/search"),
    make("/reinsercion-sociolaboral"),
  ];

  // Fetch active products for dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: products, error } = await supabase
      .from("products")
      .select("name, modified_at")
      .eq("is_active", true)
      .not("name", "is", null);

    if (!error && products) {
      productPages = products.map((product) => ({
        url: `https://${host}/${locale}/product/${product.name}`,
        lastModified: product.modified_at ? new Date(product.modified_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            [localeTag]: `https://${host}/${locale}/product/${product.name}`,
            [altLocaleTag]: `https://${altDomain}/${altLocale}/product/${product.name}`,
          },
        },
      }));
    }
  } catch (err) {
    console.error("Error fetching products for sitemap:", err);
  }

  return [...staticPages, ...productPages];
}
