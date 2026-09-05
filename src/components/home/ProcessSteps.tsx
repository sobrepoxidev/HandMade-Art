import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const STEPS = [
  {
    photo: '/taller/cat-esculturas.webp',
    es: { title: 'Selección del cedro', body: 'Madera recuperada, secada meses hasta que deja de moverse.' },
    en: { title: 'Selecting the cedar', body: 'Reclaimed wood, air-dried for months until it stops moving.' },
  },
  {
    photo: '/taller/manos-tallando.webp',
    es: { title: 'Tallado a gubia', body: 'Tucanes, ranas y colibríes a mano; sin moldes ni fresadora.' },
    en: { title: 'Hand-gouge carving', body: 'Toucans, frogs and hummingbirds by hand — no molds, no router.' },
  },
  {
    photo: '/taller/pintura-detalle.webp',
    es: { title: 'Pintura y barniz', body: 'Acrílicos a pincel y tres capas de barniz apto para alimentos.' },
    en: { title: 'Paint and varnish', body: 'Brush-applied acrylics and three coats of food-safe varnish.' },
  },
  {
    photo: '/taller/empaque.webp',
    es: { title: 'Empaque y envío', body: 'Caja rígida, seguro incluido y seguimiento por WhatsApp.' },
    en: { title: 'Packing and shipping', body: 'Rigid box, insurance included and tracking over WhatsApp.' },
  },
] as const;

const COPY = {
  es: {
    eyebrow: 'Del tronco a tu mesa',
    heading: 'Cómo nace un chorreador',
    body: 'Tres semanas de trabajo por pieza. Ninguna sale igual a otra, y esa es la garantía.',
    cta: 'Leer la guía completa',
  },
  en: {
    eyebrow: 'From log to table',
    heading: 'How a coffee dripper is born',
    body: 'Three weeks of work per piece. No two come out the same — that is the guarantee.',
    cta: 'Read the full guide',
  },
} as const;

export default function ProcessSteps({ locale }: { locale: string }) {
  const t = locale === 'es' ? COPY.es : COPY.en;
  const localeKey: 'es' | 'en' = locale === 'es' ? 'es' : 'en';

  return (
    <section className="grid grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12 lg:py-24">
      <div className="flex flex-col items-start gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0A83A]">
          {t.eyebrow}
        </span>
        <h2 className="font-display text-[32px] leading-[1.04] text-[#F1E7D6] sm:text-[44px] lg:text-[52px]">
          {t.heading}
        </h2>
        <p className="max-w-[400px] text-[15px] leading-[1.7] text-[#C9BBA5] lg:text-base">
          {t.body}
        </p>
        <Link
          href={locale === 'es' ? '/guias' : '/guides'}
          className="text-sm font-bold text-[#E0A83A] underline decoration-2 underline-offset-[7px] hover:text-[#F3C56B]"
        >
          {t.cta}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-[18px]">
        {STEPS.map((step, index) => (
          <div key={step.photo} className="flex flex-col gap-3.5 border border-[#3A2E24] bg-[#1E1813] p-4">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={step.photo}
                alt={step[localeKey].title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="font-display text-[28px] leading-none text-[#E0A83A]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-display text-lg text-[#F1E7D6] sm:text-xl">{step[localeKey].title}</span>
                <span className="text-sm leading-[1.55] text-[#C9BBA5]">{step[localeKey].body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
