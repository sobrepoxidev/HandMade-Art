import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

export default async function PayRedirectPage({ params }: { params: tParams }) {
  const { locale } = await params;

  redirect(`/${locale}/products`);
}

export async function generateMetadata({ params }: { params: tParams }) {
  const { locale } = await params;

  return {
    title: locale == 'es' ? 'Realizar Pago - Handmade Art' : 'Make Payment - Handmade Art',
    robots: {
      index: false,
      follow: false,
    },
  };
}
