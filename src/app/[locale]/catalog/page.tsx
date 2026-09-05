import { permanentRedirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

// The standalone quote catalog merged into the public shop: all browsing
// and quote-list building happens on /products now. Permanent (308) since
// this merge is final, not a temporary reroute.
export default async function CatalogRedirectPage({ params }: { params: tParams }) {
  const { locale } = await params;

  permanentRedirect(`/${locale}/products`);
}
