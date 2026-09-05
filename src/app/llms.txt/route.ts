// src/app/llms.txt/route.ts
//
// llms.txt (see llmstxt.org): a compact, plain-text map of the site for LLM
// crawlers and AI assistants — brand summary + links to the key sections.
// Locale is derived from the request host, same as robots.ts / sitemap.ts.
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getLocaleSiteUrl } from "@/lib/metadata";
import { getResolvedCategories } from "@/lib/content/categoryResolver";
import { GUIDES } from "@/lib/content/guides";
import { PILLARS } from "@/lib/content/pillars";

export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const locale: "es" | "en" = host.includes("handmadeart") ? "en" : "es";
  const siteUrl = getLocaleSiteUrl(locale);
  const guideBase = locale === "es" ? "guias" : "guides";
  const impactPath = locale === "es" ? "reinsercion-sociolaboral" : "social-reintegration";
  const categories = await getResolvedCategories();

  const lines: string[] = [];

  if (locale === "es") {
    lines.push("# Handmade Art");
    lines.push("");
    lines.push(
      "> Arte y artesanía costarricense hecha a mano en San Ramón, Alajuela, Costa Rica. Espejos, chorreadores de café, esculturas y decoración talladas en madera por artesanos de un programa de reinserción social. Cada compra remunera directamente el trabajo de un artesano y apoya su proceso de reinserción."
    );
    lines.push("");
    lines.push(
      "Envíos a todo Costa Rica y al extranjero. Pagos por SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito."
    );
    lines.push("");
    lines.push("## Páginas principales");
    lines.push(`- [Inicio](${siteUrl}/${locale})`);
    lines.push(`- [Catálogo completo](${siteUrl}/${locale}/products)`);
    lines.push(`- [Programa de reinserción social](${siteUrl}/${locale}/${impactPath})`);
    lines.push(`- [Contacto](${siteUrl}/${locale}/contact)`);
    lines.push("");
    lines.push("## Categorías");
    for (const cat of categories) {
      lines.push(`- [${cat.h1.es}](${siteUrl}/${locale}/c/${cat.slugs.es})`);
    }
    lines.push("");
    lines.push("## Guías");
    for (const guide of GUIDES) {
      lines.push(`- [${guide.title.es}](${siteUrl}/${locale}/${guideBase}/${guide.slug.es})`);
    }
    lines.push("");
    lines.push("## Páginas pilares");
    for (const pillar of PILLARS) {
      lines.push(`- [${pillar.h1.es}](${siteUrl}/${locale}/${pillar.slug.es})`);
    }
    lines.push("");
    lines.push("## Otros recursos");
    lines.push(`- [Mapa del sitio (sitemap.xml)](${siteUrl}/sitemap.xml)`);
    lines.push(`- [Listado completo de productos activos (llms-full.txt)](${siteUrl}/llms-full.txt)`);
  } else {
    lines.push("# Handmade Art");
    lines.push("");
    lines.push(
      "> Handmade Costa Rican art and crafts made in San Ramón, Alajuela, Costa Rica. Mirrors, coffee drippers, sculptures and décor carved in wood by artisans in a social reintegration program. Every purchase directly pays an artisan and supports their reintegration process."
    );
    lines.push("");
    lines.push(
      "Shipping nationwide within Costa Rica and internationally. Payment via SINPE Móvil, bank transfer, and credit or debit card."
    );
    lines.push("");
    lines.push("## Main pages");
    lines.push(`- [Home](${siteUrl}/${locale})`);
    lines.push(`- [Full catalog](${siteUrl}/${locale}/products)`);
    lines.push(`- [Social reintegration program](${siteUrl}/${locale}/${impactPath})`);
    lines.push(`- [Contact](${siteUrl}/${locale}/contact)`);
    lines.push("");
    lines.push("## Categories");
    for (const cat of categories) {
      lines.push(`- [${cat.h1.en}](${siteUrl}/${locale}/c/${cat.slugs.en})`);
    }
    lines.push("");
    lines.push("## Guides");
    for (const guide of GUIDES) {
      lines.push(`- [${guide.title.en}](${siteUrl}/${locale}/${guideBase}/${guide.slug.en})`);
    }
    lines.push("");
    lines.push("## Pillar pages");
    for (const pillar of PILLARS) {
      lines.push(`- [${pillar.h1.en}](${siteUrl}/${locale}/${pillar.slug.en})`);
    }
    lines.push("");
    lines.push("## Other resources");
    lines.push(`- [Sitemap (sitemap.xml)](${siteUrl}/sitemap.xml)`);
    lines.push(`- [Full active product listing (llms-full.txt)](${siteUrl}/llms-full.txt)`);
  }

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
