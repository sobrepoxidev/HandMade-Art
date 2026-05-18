import type { Metadata } from 'next';
import FeriaClient from './FeriaClient';

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
        ? 'Sorteo Día de la Madre 2025 (finalizado)'
        : 'Mother\'s Day Giveaway 2025 (ended)',
    description:
      locale === 'es'
        ? 'Evento puntual finalizado. Volvé a la tienda Handmade Art.'
        : 'One-off event already ended. Head back to the Handmade Art store.',
    // Event ended — keep URL alive for legacy links but exclude from index.
    robots: { index: false, follow: true },
  };
}

export default function FeriaArtesaniasPage() {
  return <FeriaClient />;
}
