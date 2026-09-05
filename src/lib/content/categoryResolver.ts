// src/lib/content/categoryResolver.ts
//
// Single source of truth for category SEO. `categories.ts` holds the
// hand-written editorial copy for the categories that have it; this module
// merges that copy with the live `categories` table so that EVERY category
// that exists in the database — including ones created later from the admin,
// with no editorial entry at all — gets a slug, metadata, intro copy and
// FAQs automatically. Nothing here should ever require a code change when a
// category is added, renamed or removed in the admin.
//
// Server-only: reads Supabase and is meant to be called from Server
// Components / route handlers (page.tsx, sitemap.ts, llms.txt, llms-full.txt).

import { revalidateTag, unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  CATEGORIES,
  type LocalizedText,
  type CategoryFaq,
} from "./categories";

export type { LocalizedText, CategoryFaq } from "./categories";

export interface ResolvedCategory {
  /** Matches `categories.id` in Supabase. */
  id: number;
  slugs: { es: string; en: string };
  h1: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  /** Two paragraphs. */
  intro: LocalizedText[];
  faqs: CategoryFaq[];
  /** True when this category has hand-written editorial copy in categories.ts. */
  hasEditorialCopy: boolean;
  nameEs: string;
  nameEn: string;
  /** Count of active products in this category. */
  productCount: number;
  /** Lowest active-product price in this category, discount applied. */
  minPrice: number | null;
}

interface CategoryRow {
  id: number;
  name: string;
  name_es: string | null;
  name_en: string | null;
}

interface ProductStatsRow {
  category_id: number | null;
  dolar_price: number | null;
  discount_percentage: number | null;
}

/**
 * Deterministic, stable slug for a category name: lowercase, strip accents,
 * drop "&"/"+", collapse anything else non-alphanumeric into a single dash,
 * trim leading/trailing dashes.
 *
 * "Llaveros de madera"  -> "llaveros-de-madera"
 * "Café & Té"           -> "cafe-te"
 * "Tazas + Platos"      -> "tazas-platos"
 */
export function slugifyCategoryName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining accent marks
    .replace(/[&+]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Trims a string to `max` chars without cutting mid-word when possible. */
function trimTo(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return trimmed.trim();
}

function computeFinalPrice(
  price: number | null,
  discountPercentage: number | null
): number | null {
  if (price == null) return null;
  const discount = discountPercentage ?? 0;
  return discount > 0 ? price * (1 - discount / 100) : price;
}

/** FAQs that are factually true for every category — used when a category has no editorial FAQs. */
function fallbackFaqs(): CategoryFaq[] {
  return [
    {
      question: {
        es: "¿Hacen envíos a todo el país y al extranjero?",
        en: "Do you ship nationwide and internationally?",
      },
      answer: {
        es: "Sí. Enviamos a todo Costa Rica y también hacemos envíos internacionales. El tiempo y costo de envío se calculan según tu ubicación al momento de la compra.",
        en: "Yes. We ship anywhere in Costa Rica and also internationally. Shipping time and cost are calculated based on your location at checkout.",
      },
    },
    {
      question: {
        es: "¿Qué formas de pago aceptan?",
        en: "What payment methods do you accept?",
      },
      answer: {
        es: "Aceptamos SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito. Todos los métodos son procesados de forma segura.",
        en: "We accept SINPE Móvil (Costa Rica), bank transfer, and credit or debit card. All methods are processed securely.",
      },
    },
    {
      question: {
        es: "¿Puedo pedir una pieza personalizada?",
        en: "Can I order a custom piece?",
      },
      answer: {
        es: "Sí, aceptamos pedidos personalizados en tamaño, grabado o acabado. El tiempo de producción es de aproximadamente 3 semanas.",
        en: "Yes, we take custom orders for size, engraving or finish. Production time is about 3 weeks.",
      },
    },
  ];
}

function synthesizeMetaTitle(nameEs: string, nameEn: string): LocalizedText {
  return {
    es: trimTo(`${nameEs} hechos a mano en Costa Rica`, 60),
    en: trimTo(`Handmade ${nameEn} from Costa Rica`, 60),
  };
}

function synthesizeMetaDescription(
  nameEs: string,
  nameEn: string,
  count: number,
  minPrice: number | null
): LocalizedText {
  const priceEs = minPrice != null ? ` desde $${minPrice.toFixed(2)}` : "";
  const priceEn = minPrice != null ? ` from $${minPrice.toFixed(2)}` : "";
  const es = `${count} piezas de ${nameEs.toLowerCase()} hechas a mano en Costa Rica${priceEs}. Producidas por artesanos de un programa de reinserción social. Envíos a todo el país y al extranjero.`;
  const en = `${count} handmade ${nameEn.toLowerCase()} pieces from Costa Rica${priceEn}. Made by artisans in a social reintegration program. Nationwide and international shipping.`;
  return { es: trimTo(es, 155), en: trimTo(en, 155) };
}

function synthesizeIntro(
  nameEs: string,
  nameEn: string,
  count: number,
  minPrice: number | null
): LocalizedText[] {
  const priceEs =
    minPrice != null ? `desde $${minPrice.toFixed(2)}` : "según la pieza elegida";
  const priceEn =
    minPrice != null ? `starting at $${minPrice.toFixed(2)}` : "depending on the piece";

  const p1: LocalizedText = {
    es: `Esta colección de ${nameEs.toLowerCase()} reúne ${count} ${
      count === 1 ? "pieza activa" : "piezas activas"
    }, cada una trabajada a mano en cedro amargo o laurel costarricense por artesanos del programa de reinserción social en San Isidro de Coronado, San José. Como cada pieza se hace a mano y no en serie, ninguna sale idéntica a otra: la veta de la madera y el acabado del barniz varían de una pieza a otra.`,
    en: `This ${nameEn.toLowerCase()} collection brings together ${count} active ${
      count === 1 ? "piece" : "pieces"
    }, each one hand-worked in Costa Rican cedro amargo or laurel wood by artisans in the social reintegration program in San Isidro de Coronado, San José. Since every piece is made by hand rather than mass-produced, no two are exactly alike — the wood grain and varnish finish vary piece to piece.`,
  };

  const p2: LocalizedText = {
    es: `Los precios en ${nameEs.toLowerCase()} van ${priceEs}, y cada compra remunera directamente el trabajo del artesano que la hizo y apoya su proceso de reinserción social. Hacemos envíos a todo Costa Rica y al extranjero; si buscás una pieza personalizada dentro de esta categoría, escribinos para coordinar el pedido.`,
    en: `Prices in ${nameEn.toLowerCase()} start ${priceEn}, and every purchase directly pays the artisan who made it and supports their social reintegration process. We ship nationwide within Costa Rica and internationally; if you're after a custom piece in this category, reach out to coordinate the order.`,
  };

  return [p1, p2];
}

/**
 * Builds the full resolved category list: DB categories with at least one
 * active product, merged with editorial copy where it exists and synthesized
 * SEO copy where it doesn't. Categories with 0 active products are skipped —
 * nothing to rank, and a landing page with an empty grid is a poor result.
 */
async function resolveCategoriesUncached(): Promise<ResolvedCategory[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // A plain anon-key client (not the cookie-aware `@/utils/supabase/server`
  // client) on purpose: this function runs inside `unstable_cache`, and
  // Next.js forbids calling dynamic APIs like `cookies()` inside a cached
  // function. Categories and active products are public, non-user-specific
  // data — the same anon-key pattern already used in sitemap.ts and
  // llms-full.txt for the identical reason.
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const [{ data: categoryRows, error: categoriesError }, { data: productRows, error: productsError }] =
    await Promise.all([
      supabase.from("categories").select("id, name, name_es, name_en"),
      supabase
        .from("products")
        .select("category_id, dolar_price, discount_percentage")
        .eq("is_active", true)
        .not("category_id", "is", null)
        .limit(20000),
    ]);

  if (categoriesError || !categoryRows) {
    console.error("[categoryResolver] Failed to fetch categories:", categoriesError);
    return [];
  }
  if (productsError) {
    console.error("[categoryResolver] Failed to fetch product stats:", productsError);
  }

  const stats = new Map<number, { count: number; minPrice: number | null }>();
  for (const row of (productRows as ProductStatsRow[] | null) ?? []) {
    if (row.category_id == null) continue;
    const finalPrice = computeFinalPrice(row.dolar_price, row.discount_percentage);
    const existing = stats.get(row.category_id);
    if (!existing) {
      stats.set(row.category_id, { count: 1, minPrice: finalPrice });
    } else {
      existing.count += 1;
      if (finalPrice != null && (existing.minPrice == null || finalPrice < existing.minPrice)) {
        existing.minPrice = finalPrice;
      }
    }
  }

  const editorialById = new Map(CATEGORIES.map((c) => [c.id, c]));

  const resolved: ResolvedCategory[] = [];

  for (const row of categoryRows as CategoryRow[]) {
    const stat = stats.get(row.id);
    const productCount = stat?.count ?? 0;
    if (productCount === 0) continue; // nothing to rank

    const nameEs = row.name_es || row.name;
    const nameEn = row.name_en || row.name;
    const editorial = editorialById.get(row.id);

    if (editorial) {
      resolved.push({
        id: row.id,
        slugs: { es: editorial.slugs.es, en: editorial.slugs.en },
        h1: editorial.h1,
        metaTitle: editorial.metaTitle,
        metaDescription: editorial.metaDescription,
        intro: [
          { es: editorial.intro.es[0], en: editorial.intro.en[0] },
          { es: editorial.intro.es[1], en: editorial.intro.en[1] },
        ],
        faqs: editorial.faqs,
        hasEditorialCopy: true,
        nameEs,
        nameEn,
        productCount,
        minPrice: stat?.minPrice ?? null,
      });
      continue;
    }

    // No editorial entry — synthesize a factually-grounded landing page from
    // the live DB row so the category is never missing SEO copy or a route.
    resolved.push({
      id: row.id,
      slugs: {
        es: slugifyCategoryName(nameEs),
        en: slugifyCategoryName(nameEn),
      },
      h1: { es: nameEs, en: nameEn },
      metaTitle: synthesizeMetaTitle(nameEs, nameEn),
      metaDescription: synthesizeMetaDescription(nameEs, nameEn, productCount, stat?.minPrice ?? null),
      intro: synthesizeIntro(nameEs, nameEn, productCount, stat?.minPrice ?? null),
      faqs: fallbackFaqs(),
      hasEditorialCopy: false,
      nameEs,
      nameEn,
      productCount,
      minPrice: stat?.minPrice ?? null,
    });
  }

  resolved.sort((a, b) => a.id - b.id);
  return resolved;
}

const CATEGORY_SEO_TAG = "categories-seo";

const getCachedResolvedCategories = unstable_cache(
  resolveCategoriesUncached,
  ["categories-seo-resolved"],
  { tags: [CATEGORY_SEO_TAG], revalidate: 1800 }
);

/** Every category with at least one active product, editorial or synthesized. */
export async function getResolvedCategories(): Promise<ResolvedCategory[]> {
  return getCachedResolvedCategories();
}

/**
 * Drop the cached category SEO snapshot. Call this from any admin write that can
 * change what the public SEO layer says: creating, editing or deleting a product
 * moves a category's product count and starting price, and a brand-new category
 * only gets its landing page, sitemap entry and llms.txt line once this is
 * cleared. Without it those surfaces lag by up to the 1800s revalidate window.
 */
export function revalidateCategorySeo(): void {
  revalidateTag(CATEGORY_SEO_TAG);
}

export async function getResolvedCategoryBySlug(
  locale: "es" | "en",
  slug: string
): Promise<ResolvedCategory | undefined> {
  const categories = await getResolvedCategories();
  return categories.find((c) => c.slugs[locale] === slug);
}

export async function getResolvedCategoryById(id: number): Promise<ResolvedCategory | undefined> {
  const categories = await getResolvedCategories();
  return categories.find((c) => c.id === id);
}

/** `{locale, slug}` pairs for every known category, both locales — for `generateStaticParams`. */
export async function getAllCategorySlugParams(): Promise<{ locale: string; slug: string }[]> {
  const categories = await getResolvedCategories();
  const params: { locale: string; slug: string }[] = [];
  for (const cat of categories) {
    params.push({ locale: "es", slug: cat.slugs.es });
    params.push({ locale: "en", slug: cat.slugs.en });
  }
  return params;
}
