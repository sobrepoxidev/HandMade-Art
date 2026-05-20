import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function PayAmountPage({ params }: { params: Params }) {
  const { locale } = await params;
  redirect(`/${locale}/cart`);
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;

  return {
    title: locale === "es" ? "Pago actualizado - Handmade Art" : "Payment updated - Handmade Art",
    description: locale === "es"
      ? "Los pagos ahora se procesan desde una orden o cotización segura."
      : "Payments are now processed from a secure order or quote.",
  };
}
