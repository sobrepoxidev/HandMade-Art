// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const runtime = "edge";

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
  const make = (path: string, isProduct = false): MetadataRoute.Sitemap[number] => ({
    url: `https://${host}/${locale}${path}`,
    lastModified: now,
    changeFrequency: isProduct ? "weekly" : "monthly",
    priority: isProduct ? 0.8 : 0.6,
    alternates: {
      languages: {
        [localeTag]:    `https://${host}/${locale}${path}`,
        [altLocaleTag]: `https://${altDomain}/${altLocale}${path}`,
      },
    },
  });

  return [
    make(""),
    make("/about"),
    make("/products"),
    //make("/product/[id]", true),
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
  ];
}
