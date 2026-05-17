import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { supabase } from "@/lib/supabaseClient";
import ProductDetail from '@/components/products/ProductDetail';
import RelatedProducts from '@/components/products/RelatedProducts';
import RelatedProductsSkeleton from '@/components/products/RelatedProductsSkeleton';
import ProductJsonLd from '@/components/products/ProductJsonLd';
import BreadcrumbJsonLd from '@/components/products/BreadcrumbJsonLd';
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Database } from "@/lib/database.types";

type tParams = Promise<{ slug: string, locale: string }>;
type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

type MediaItem = { url: string; alt?: string };

/** Site URL for absolute links based on the current host. */
async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'handmadeart.store';
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

function pickName(product: Pick<Product, 'name_es' | 'name_en' | 'name'>, locale: string) {
  if (locale === 'es') return product.name_es || product.name_en || product.name || '';
  return product.name_en || product.name_es || product.name || '';
}

function pickDescription(
  product: Pick<Product, 'description' | 'description_en'>,
  locale: string
) {
  if (locale === 'es') return product.description || product.description_en || '';
  return product.description_en || product.description || '';
}

function firstImage(media: Product['media']): MediaItem | null {
  if (!Array.isArray(media) || media.length === 0) return null;
  const first = media[0] as MediaItem;
  if (typeof first?.url === 'string') return first;
  return null;
}

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { slug, locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  const { data: product } = await supabase
    .from('products')
    .select('name, name_es, name_en, description, description_en, dolar_price, discount_percentage, media, brand, weight_kg, length_cm, width_cm, height_cm, tags')
    .eq('name', slug)
    .single();

  if (!product) {
    return await buildMetadata({
      locale: currentLocale,
      pathname: `/${locale}/product/${slug}`,
      title: currentLocale === "es" ? "Producto" : "Product",
    });
  }

  const displayName = pickName(product, currentLocale) || slug;
  const baseDescription = pickDescription(product, currentLocale);

  const dims: string[] = [];
  if (product.length_cm) dims.push(`${product.length_cm}cm L`);
  if (product.width_cm) dims.push(`${product.width_cm}cm W`);
  if (product.height_cm) dims.push(`${product.height_cm}cm H`);

  const specParts: string[] = [];
  if (dims.length) specParts.push(dims.join(' x '));
  if (product.weight_kg) specParts.push(`${product.weight_kg}kg`);
  if (product.brand) specParts.push(product.brand);

  const finalPrice =
    product.dolar_price != null && (product.discount_percentage ?? 0) > 0
      ? product.dolar_price * (1 - (product.discount_percentage ?? 0) / 100)
      : product.dolar_price;

  // Title includes price for higher CTR in SERP
  const priceSegment = finalPrice != null ? ` — $${finalPrice.toFixed(2)} USD` : '';
  const title = `${displayName}${priceSegment}`;

  // Description: real product description + key specs to expose them to crawlers/LLMs
  const trimmedDesc = baseDescription
    ? baseDescription.replace(/\s+/g, ' ').trim().slice(0, 140)
    : (currentLocale === 'es'
        ? 'Pieza artesanal hecha a mano en Costa Rica.'
        : 'Handmade artisanal piece from Costa Rica.');
  const specSegment = specParts.length ? ` · ${specParts.join(' · ')}` : '';
  const description = `${trimmedDesc}${specSegment}`.slice(0, 320);

  const img = firstImage(product.media);
  const imageMeta = img
    ? {
        url: img.url,
        width: 1200,
        height: 1200,
        alt: img.alt || displayName,
      }
    : undefined;

  const md = await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/product/${slug}`,
    title,
    description,
    image: imageMeta,
  });

  // OG product extensions (Facebook OG Products spec)
  if (finalPrice != null) {
    md.openGraph = {
      ...md.openGraph,
      type: 'website',
    };
    // Custom OG product tags as `other` meta tags
    md.other = {
      ...(md.other || {}),
      'product:price:amount': finalPrice.toFixed(2),
      'product:price:currency': 'USD',
      'og:price:amount': finalPrice.toFixed(2),
      'og:price:currency': 'USD',
    };
  }

  // Append product-specific keywords (brand, tags)
  const productKeywords: string[] = [];
  if (product.brand) productKeywords.push(product.brand);
  if (Array.isArray(product.tags)) productKeywords.push(...product.tags);
  if (productKeywords.length) {
    const existing = Array.isArray(md.keywords) ? md.keywords : md.keywords ? [String(md.keywords)] : [];
    md.keywords = [...productKeywords, ...existing];
  }

  return md;
}

export default async function ProductPage({ params }: { params: tParams }) {
  const { slug, locale } = await params;
  const currentLocale: 'es' | 'en' = locale === 'es' ? 'es' : 'en';

  // Single SSR fetch with all fields needed for: rendering, JSON-LD, and SEO
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  // Parallel SSR fetches of related data (category, inventory, reviews stats)
  const [categoryRes, inventoryRes, reviewsRes] = await Promise.all([
    product.category_id
      ? supabase.from('categories').select('*').eq('id', product.category_id).single()
      : Promise.resolve({ data: null, error: null } as { data: Category | null; error: null }),
    supabase.from('inventory').select('quantity').eq('product_id', product.id).maybeSingle(),
    supabase.from('reviews').select('rating').eq('product_id', product.id),
  ]);

  const category = (categoryRes.data ?? null) as Category | null;
  const inventory = inventoryRes.data?.quantity ?? 0;

  const ratings = (reviewsRes.data ?? []).map((r) => r.rating).filter((n): n is number => typeof n === 'number');
  const reviewCount = ratings.length;
  const ratingAvg = reviewCount > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / reviewCount) * 10) / 10
    : null;

  const siteUrl = await getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/product/${slug}`;

  const relatedTitle = currentLocale === 'es' ? 'Otros productos' : 'Other products';

  return (
    <>
      <ProductJsonLd
        product={product}
        category={category}
        inventory={inventory}
        ratingAvg={ratingAvg}
        reviewCount={reviewCount}
        locale={currentLocale}
        url={canonicalUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: currentLocale === 'es' ? 'Inicio' : 'Home', url: `${siteUrl}/${locale}` },
          { name: currentLocale === 'es' ? 'Productos' : 'Products', url: `${siteUrl}/${locale}/products` },
          ...(category
            ? [
                {
                  name:
                    (currentLocale === 'es' ? category.name_es : category.name_en) ||
                    category.name ||
                    'Categoría',
                  url: `${siteUrl}/${locale}/products?category=${category.id}`,
                },
              ]
            : []),
          { name: pickName(product, currentLocale) || slug, url: canonicalUrl },
        ]}
      />

      <ProductDetail
        slug={slug}
        locale={locale}
        initialProduct={product as Product}
        initialCategory={category}
        initialInventory={inventory}
      >
        <Suspense fallback={<RelatedProductsSkeleton title={relatedTitle} />}>
          <RelatedProducts
            title={relatedTitle}
            locale={locale}
            categoryId={product.category_id}
            excludeIds={[product.id]}
          />
        </Suspense>
      </ProductDetail>
    </>
  );
}
