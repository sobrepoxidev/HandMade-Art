import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import ContactClient from './ContactClient';

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
    pathname: `/${locale}/contact`,
    title:
      currentLocale === 'es'
        ? 'Contacto — escribinos o llamanos'
        : 'Contact us — write or call',
    description:
      currentLocale === 'es'
        ? 'Hablá con Handmade Art: WhatsApp, teléfono o formulario. Te respondemos en 24–48 horas.'
        : "Reach Handmade Art via WhatsApp, phone or contact form. We reply within 24–48 hours.",
    image: {
      url: '/home/artesano.webp',
      width: 1200,
      height: 800,
      alt:
        currentLocale === 'es'
          ? 'Artesano de Handmade Art trabajando en una pieza única'
          : 'A Handmade Art artisan working on a one-of-a-kind piece',
    },
  });
}

export default function ContactPage() {
  return <ContactClient />;
}
