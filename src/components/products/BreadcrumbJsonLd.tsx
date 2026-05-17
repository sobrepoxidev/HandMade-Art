type Item = {
  name: string;
  url: string;
};

/**
 * Server-side BreadcrumbList JSON-LD via plain <script> tag.
 * Emitted into the static HTML so Google can render the breadcrumb in SERP
 * and LLM crawlers can understand the page hierarchy.
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
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
