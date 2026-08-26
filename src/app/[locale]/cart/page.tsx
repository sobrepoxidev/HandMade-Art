import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

// The direct-purchase flow was retired: every piece now goes through the
// quote-request flow, so the cart simply points back at the shop.
export default async function CartRedirectPage({ params }: { params: tParams }) {
  const { locale } = await params;

  redirect(`/${locale}/products`);
}
