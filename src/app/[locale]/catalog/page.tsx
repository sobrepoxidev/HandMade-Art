import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

// The standalone quote catalog merged into the public shop: all browsing
// and quote-list building happens on /products now.
export default async function CatalogRedirectPage({ params }: { params: tParams }) {
  const { locale } = await params;

  redirect(`/${locale}/products`);
}
