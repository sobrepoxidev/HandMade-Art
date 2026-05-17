import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type ReviewRow = Pick<
  Database['public']['Tables']['reviews']['Row'],
  'id' | 'rating' | 'comment' | 'created_at'
>;

type MediaItem = { url: string; alt?: string };

type Props = {
  product: Product;
  category: Category | null;
  inventory: number;
  ratingAvg: number | null;
  reviewCount: number;
  reviews?: ReviewRow[];
  locale: 'es' | 'en';
  url: string;
};

// Specification keys we try to surface as first-class schema fields so
// crawlers and LLMs can pick them up without scanning the additionalProperty list.
const MATERIAL_KEYS = ['material', 'materials', 'wood', 'madera', 'finish', 'acabado'];
const COLOR_KEYS = ['color', 'colour', 'tone', 'tono'];

function pickSpecValue(
  specs: Record<string, unknown> | null,
  keys: string[]
): string | undefined {
  if (!specs) return undefined;
  for (const k of Object.keys(specs)) {
    if (keys.includes(k.toLowerCase().trim())) {
      const v = specs[k];
      if (v != null && String(v).trim()) return String(v).trim();
    }
  }
  return undefined;
}

/**
 * Server-side schema.org Product JSON-LD.
 * Rendered into the static HTML via plain <script> tag so crawlers and LLMs
 * can extract the full product datasheet without executing JavaScript.
 *
 * Per Next.js docs, JSON-LD should be emitted as a raw <script> tag inside
 * page or layout components (not next/script's <Script>).
 */
export default function ProductJsonLd({
  product,
  category,
  inventory,
  ratingAvg,
  reviewCount,
  reviews,
  locale,
  url,
}: Props) {
  const name = (locale === 'es' ? product.name_es : product.name_en) || product.name || '';
  const description =
    (locale === 'es' ? product.description : product.description_en) ||
    product.description ||
    product.description_en ||
    '';

  const media = (product.media as MediaItem[] | null) || [];
  const images = media
    .map((m) => m?.url)
    .filter((u): u is string => typeof u === 'string' && u.length > 0)
    .slice(0, 10);

  const discount = product.discount_percentage ?? 0;
  const basePrice = product.dolar_price ?? null;
  const finalPrice =
    basePrice != null && discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

  const inStock = inventory > 0;

  const specs =
    product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications)
      ? (product.specifications as Record<string, unknown>)
      : null;

  const material = pickSpecValue(specs, MATERIAL_KEYS);
  const color = pickSpecValue(specs, COLOR_KEYS);

  const additionalProperty: Array<{
    '@type': 'PropertyValue';
    name: string;
    value: string | number;
    unitCode?: string;
  }> = [];

  if (product.weight_kg) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: locale === 'es' ? 'Peso' : 'Weight',
      value: product.weight_kg,
      unitCode: 'KGM',
    });
  }
  if (product.length_cm) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: locale === 'es' ? 'Largo' : 'Length',
      value: product.length_cm,
      unitCode: 'CMT',
    });
  }
  if (product.width_cm) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: locale === 'es' ? 'Ancho' : 'Width',
      value: product.width_cm,
      unitCode: 'CMT',
    });
  }
  if (product.height_cm) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: locale === 'es' ? 'Alto' : 'Height',
      value: product.height_cm,
      unitCode: 'CMT',
    });
  }
  if (product.hs_code) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'HS Code', value: product.hs_code });
  }
  if (product.customs_description_en) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Customs Description',
      value: product.customs_description_en,
    });
  }

  // Flatten remaining specifications JSON into PropertyValue entries.
  if (specs) {
    for (const [key, value] of Object.entries(specs)) {
      if (value == null) continue;
      const lower = key.toLowerCase().trim();
      // Skip ones already promoted to first-class fields
      if (MATERIAL_KEYS.includes(lower) || COLOR_KEYS.includes(lower)) continue;
      additionalProperty.push({
        '@type': 'PropertyValue',
        name: key,
        value: String(value),
      });
    }
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    productID: `handmade-art-${product.id}`,
    identifier: product.sku || `handmade-art-${product.id}`,
    name,
    description,
    sku: product.sku || undefined,
    mpn: product.sku || undefined,
    url,
    image: images.length ? images : undefined,
    isAccessibleForFree: false,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Handmade Art',
    },
    manufacturer: {
      '@type': 'Organization',
      '@id': 'https://handmadeart.store/#organization',
      name: 'Handmade Art',
      url: 'https://handmadeart.store',
    },
    category: category
      ? (locale === 'es' ? category.name_es : category.name_en) || category.name || undefined
      : undefined,
    countryOfOrigin: {
      '@type': 'Country',
      name: product.country_of_origin || 'Costa Rica',
    },
    material: material,
    color: color,
    isFamilyFriendly: true,
    inLanguage: locale === 'es' ? 'es-CR' : 'en-US',
    keywords: Array.isArray(product.tags) ? product.tags.join(', ') : undefined,
    additionalProperty: additionalProperty.length ? additionalProperty : undefined,
  };

  if (product.weight_kg) {
    schema.weight = { '@type': 'QuantitativeValue', value: product.weight_kg, unitCode: 'KGM' };
  }
  if (product.width_cm) {
    schema.width = { '@type': 'QuantitativeValue', value: product.width_cm, unitCode: 'CMT' };
  }
  if (product.height_cm) {
    schema.height = { '@type': 'QuantitativeValue', value: product.height_cm, unitCode: 'CMT' };
  }
  if (product.length_cm) {
    schema.depth = { '@type': 'QuantitativeValue', value: product.length_cm, unitCode: 'CMT' };
  }

  if (finalPrice != null) {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    schema.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: finalPrice.toFixed(2),
      priceValidUntil: validUntil.toISOString().slice(0, 10),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        '@id': 'https://handmadeart.store/#organization',
        name: 'Handmade Art',
        url: 'https://handmadeart.store',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '6.99', currency: 'USD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CR' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 5, unitCode: 'DAY' },
        },
      },
    };
  }

  if (ratingAvg != null && reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingAvg,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Embed up to 5 most recent reviews with text — multiplies the rich snippet.
  if (Array.isArray(reviews) && reviews.length) {
    const reviewEntries = reviews
      .filter((r) => r.comment && r.comment.trim().length > 0)
      .slice(0, 5)
      .map((r) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          '@type': 'Person',
          name: locale === 'es' ? 'Cliente verificado' : 'Verified customer',
        },
        datePublished: r.created_at?.slice(0, 10),
        reviewBody: r.comment,
      }));
    if (reviewEntries.length) {
      schema.review = reviewEntries;
    }
  }

  // Strip undefined leaves so the emitted JSON is minimal.
  const json = JSON.stringify(schema, (_k, v) => (v === undefined ? undefined : v));

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
