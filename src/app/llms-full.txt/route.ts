// src/app/llms-full.txt/route.ts
//
// Extended llms.txt: same site map as /llms.txt plus a full listing of every
// active product (name, absolute URL, price, short description) so LLM
// crawlers can index the catalog without executing client-side JS.
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getLocaleSiteUrl } from "@/lib/metadata";
import { getResolvedCategories } from "@/lib/content/categoryResolver";
import { GUIDES } from "@/lib/content/guides";
import { PILLARS } from "@/lib/content/pillars";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ProductRow {
  name: string | null;
  name_es: string | null;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  dolar_price: number | null;
  discount_percentage: number | null;
  is_active: boolean | null;
}

async function fetchActiveProducts(): Promise<ProductRow[]> {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("products")
      .select(
        "name, name_es, name_en, description, description_en, dolar_price, discount_percentage, is_active"
      )
      .eq("is_active", true)
      .not("name", "is", null)
      .order("name_es", { ascending: true })
      .limit(2000);
    if (error || !data) return [];
    return data as ProductRow[];
  } catch {
    return [];
  }
}

function excerpt(text: string | null, max = 200): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
}

export async function GET() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const locale: "es" | "en" = host.includes("handmadeart") ? "en" : "es";
  const siteUrl = getLocaleSiteUrl(locale);
  const guideBase = locale === "es" ? "guias" : "guides";
  const impactPath = locale === "es" ? "reinsercion-sociolaboral" : "social-reintegration";

  const products = await fetchActiveProducts();
  const categories = await getResolvedCategories();

  const lines: string[] = [];

  if (locale === "es") {
    lines.push("# Handmade Art — listado completo");
    lines.push("");
    lines.push(
      "> Arte y artesanía costarricense hecha a mano en San Isidro de Coronado, San José, Costa Rica. Cada pieza la talla o pinta a mano un artesano en proceso de reinserción social. Envíos a todo Costa Rica y al extranjero. Pagos por SINPE Móvil, transferencia bancaria y tarjeta."
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
    lines.push(`## Productos activos (${products.length})`);
    for (const p of products) {
      const name = p.name_es || p.name_en || p.name || "";
      const url = `${siteUrl}/${locale}/product/${encodeURIComponent(p.name || "")}`;
      const discount = p.discount_percentage ?? 0;
      const finalPrice =
        p.dolar_price != null && discount > 0
          ? p.dolar_price * (1 - discount / 100)
          : p.dolar_price;
      const priceLabel = finalPrice != null ? `$${finalPrice.toFixed(2)}` : "consultar precio";
      const desc = excerpt(p.description || p.description_en);
      lines.push(`- [${name}](${url}) — ${priceLabel}${desc ? ` — ${desc}` : ""}`);
    }
  } else {
    lines.push("# Handmade Art — full listing");
    lines.push("");
    lines.push(
      "> Handmade Costa Rican art and crafts made in San Isidro de Coronado, San José, Costa Rica. Every piece is hand-carved or hand-painted by an artisan in a social reintegration process. Shipping nationwide and internationally. Payment via SINPE Móvil, bank transfer, and card."
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
    lines.push(`## Active products (${products.length})`);
    for (const p of products) {
      const name = p.name_en || p.name_es || p.name || "";
      const url = `${siteUrl}/${locale}/product/${encodeURIComponent(p.name || "")}`;
      const discount = p.discount_percentage ?? 0;
      const finalPrice =
        p.dolar_price != null && discount > 0
          ? p.dolar_price * (1 - discount / 100)
          : p.dolar_price;
      const priceLabel = finalPrice != null ? `$${finalPrice.toFixed(2)}` : "price on request";
      const desc = excerpt(p.description_en || p.description);
      lines.push(`- [${name}](${url}) — ${priceLabel}${desc ? ` — ${desc}` : ""}`);
    }
  }

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
    },
  });
}
