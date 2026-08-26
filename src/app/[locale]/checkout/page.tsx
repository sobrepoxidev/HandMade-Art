import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

// The direct-purchase flow was retired: checkout lives on the per-quote
// payment page (/quote/[slug]) and the shop points back to /products.
export default async function CheckoutRedirectPage({ params }: { params: tParams }) {
  const { locale } = await params;

  redirect(`/${locale}/products`);
}
