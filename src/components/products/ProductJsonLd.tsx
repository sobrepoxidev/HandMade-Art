import Script from 'next/script';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

type MediaItem = { url: string; alt?: string };

type Props = {
  product: Product;
  category: Category | null;
  inventory: number;
  ratingAvg: number | null;
  reviewCount: number;
  locale: 'es' | 'en';
  url: string;
};

/**
 * Server-side schema.org Product JSON-LD.
 * Rendered into the static HTML so crawlers and LLMs can extract the full
 * product datasheet (name, brand, sku, dimensions, weight, offer, rating)
 * without executing JavaScript.
 */
export default function ProductJsonLd({
  product,
  category,
  inventory,
  ratingAvg,
  reviewCount,
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
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'HS Code',
      value: product.hs_code,
    });
  }
  if (product.customs_description_en) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Customs Description',
      value: product.customs_description_en,
    });
  }

  // Flatten product.specifications JSON (if object) into PropertyValue entries.
  if (
    product.specifications &&
    typeof product.specifications === 'object' &&
    !Array.isArray(product.specifications)
  ) {
    for (const [key, value] of Object.entries(product.specifications)) {
      if (value == null) continue;
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
    name,
    description,
    sku: product.sku || undefined,
    mpn: product.sku || undefined,
    url,
    image: images.length ? images : undefined,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Handmade Art',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Handmade Art',
      url: 'https://handmadeart.store',
    },
    category: category
      ? (locale === 'es' ? category.name_es : category.name_en) || category.name || undefined
      : undefined,
    countryOfOrigin: product.country_of_origin || 'CR',
    isFamilyFriendly: true,
    inLanguage: locale === 'es' ? 'es-CR' : 'en-US',
    keywords: Array.isArray(product.tags) ? product.tags.join(', ') : undefined,
    additionalProperty: additionalProperty.length ? additionalProperty : undefined,
  };

  // Width/height/weight as Quantitative properties too — some crawlers look here.
  if (product.weight_kg) {
    schema.weight = {
      '@type': 'QuantitativeValue',
      value: product.weight_kg,
      unitCode: 'KGM',
    };
  }
  if (product.width_cm) {
    schema.width = {
      '@type': 'QuantitativeValue',
      value: product.width_cm,
      unitCode: 'CMT',
    };
  }
  if (product.height_cm) {
    schema.height = {
      '@type': 'QuantitativeValue',
      value: product.height_cm,
      unitCode: 'CMT',
    };
  }
  if (product.length_cm) {
    schema.depth = {
      '@type': 'QuantitativeValue',
      value: product.length_cm,
      unitCode: 'CMT',
    };
  }

  if (finalPrice != null) {
    // Validity ~1 year from now (required by Google for rich results)
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
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '6.99',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
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

  return (
    <Script
      id={`product-jsonld-${product.id}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
