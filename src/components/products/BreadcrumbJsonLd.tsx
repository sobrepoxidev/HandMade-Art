import Script from 'next/script';

type Item = {
  name: string;
  url: string;
};

/**
 * Server-side BreadcrumbList JSON-LD.
 * Renders a structured breadcrumb in the static HTML so Google can show
 * breadcrumbs in SERP and crawlers/LLMs can understand the page hierarchy.
 */
export default function BreadcrumbJsonLd({ items }: { items: Item[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
