import type { Metadata } from 'next';
import QrClient from './QrClient';

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === 'es'
        ? 'Generador de código QR'
        : 'QR code generator',
    description:
      locale === 'es'
        ? 'Herramienta interna para generar códigos QR.'
        : 'Internal tool to generate QR codes.',
    robots: { index: false, follow: false },
  };
}

export default function QrPage() {
  return <QrClient />;
}
