import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import ShippingClient from './ShippingClient';

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === 'es' ? 'es' : 'en';

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/shipping`,
    title:
      currentLocale === 'es'
        ? 'Envíos a todo Costa Rica — tarifas y tiempos'
        : 'Shipping across Costa Rica — rates & times',
    description:
      currentLocale === 'es'
        ? 'Enviamos tus piezas con Correos de Costa Rica (EMS). Tarifas desde ₡2.100 + IVA. Calculá tu envío.'
        : 'We ship with Correos de Costa Rica (EMS). Rates from ₡2,100 + tax. Calculate your shipping.',
    image: {
      url: '/home/mapa-cr.webp',
      width: 1200,
      height: 800,
      alt:
        currentLocale === 'es'
          ? 'Mapa de Costa Rica con cobertura de envíos Handmade Art'
          : 'Map of Costa Rica with Handmade Art shipping coverage',
    },
  });
}

export default function ShippingPage() {
  return <ShippingClient />;
}
