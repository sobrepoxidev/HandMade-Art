// src/app/robots.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const runtime = "edge";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    (await headers()).get("host") ??
    "";

  // Determine the alternate domain based on current domain
  const isSpanish = host.includes("artehechoamano");
  const altDomain = isSpanish ? "handmadeart.store" : "artehechoamano.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/auth/",
        ],
      },
    ],
    // Declare both sitemaps for bi-domain SEO
    sitemap: [
      `https://${host}/sitemap.xml`,
      `https://${altDomain}/sitemap.xml`,
    ],
  };
}
