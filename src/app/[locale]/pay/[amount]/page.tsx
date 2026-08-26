import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function PayAmountPage({ params }: { params: Params }) {
  const { locale } = await params;
  redirect(`/${locale}/products`);
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;

  return {
    title: locale === "es" ? "Pago actualizado - Handmade Art" : "Payment updated - Handmade Art",
    robots: {
      index: false,
      follow: false,
    },
  };
}
