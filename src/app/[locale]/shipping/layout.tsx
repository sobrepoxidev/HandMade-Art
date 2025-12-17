import { buildMetadata } from '@/lib/metadata';
import type { Metadata } from "next";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  const title = currentLocale === "es" ? "Envíos a Costa Rica" : "Shipping to Costa Rica";
  const description = currentLocale === "es"
    ? "Calculá el costo de envío de tus artesanías a cualquier parte de Costa Rica. Tarifas claras con IVA incluido."
    : "Calculate shipping costs for your crafts anywhere in Costa Rica. Clear rates with tax included.";

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/shipping`,
    title,
    description,
  });
}

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
