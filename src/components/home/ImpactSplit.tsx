import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const COPY = {
  es: {
    eyebrow: 'Por qué existimos',
    heading: 'Un espejo tallado es también un oficio aprendido.',
    body: 'Los artesanos son residentes de un programa de reinserción social y laboral en Costa Rica. Aprenden tallado, pintura y acabado en un taller avalado por el Ministerio de Justicia y Paz y el INA. El precio de cada pieza sostiene esa formación.',
    stats: [
      'Artesanos en formación',
      'Talleres avalados por el Ministerio de Justicia y Paz y el INA',
      'Cada compra sostiene el programa',
    ],
    cta: 'Leer la historia del taller',
    quote: '"Cuando termino una pieza y alguien la compra, sé que hice algo que vale."',
    quoteAttr: 'Taller de tallado',
    alt: 'Artesanos trabajando en las mesas del taller',
  },
  en: {
    eyebrow: 'Why we exist',
    heading: 'A carved mirror is also a trade learned.',
    body: 'The artisans are residents of a social and labor reintegration program in Costa Rica. They learn carving, painting and finishing in a workshop backed by the Ministry of Justice and Peace and the INA. The price of every piece funds that training.',
    stats: [
      'Artisans in training',
      'Workshops backed by the Ministry of Justice and Peace and the INA',
      'Every purchase sustains the program',
    ],
    cta: 'Read the workshop story',
    quote: '"When I finish a piece and someone buys it, I know I made something worthwhile."',
    quoteAttr: 'Carving workshop',
    alt: 'Artisans working at the workshop benches',
  },
} as const;

export default function ImpactSplit({ locale }: { locale: string }) {
  const t = locale === 'es' ? COPY.es : COPY.en;

  return (
    <section className="grid grid-cols-1 border-y border-[#3A2E24] bg-[#1E1813] lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 px-5 py-14 sm:px-8 lg:gap-7 lg:px-16 lg:py-24">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0A83A]">
          {t.eyebrow}
        </span>
        <h2 className="font-display text-[32px] leading-[1.05] text-[#F1E7D6] text-wrap-pretty sm:text-[42px] lg:text-[52px] lg:leading-[1.0]">
          {t.heading}
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[1.7] text-[#C9BBA5] lg:text-[17px]">
          {t.body}
        </p>
        <ul className="grid grid-cols-1 gap-4 border-t border-[#3A2E24] pt-6 sm:grid-cols-3">
          {t.stats.map((stat) => (
            <li key={stat} className="flex flex-col gap-2">
              <span aria-hidden className="h-1.5 w-8 bg-[#E0A83A]" />
              <span className="text-[13px] leading-snug text-[#C9BBA5]">{stat}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/reinsercion-sociolaboral"
          className="inline-flex min-h-[50px] w-fit items-center justify-center rounded-sm border border-[#E0A83A] px-6 text-sm font-bold text-[#E0A83A] transition-colors hover:bg-[#E0A83A] hover:text-[#161210]"
        >
          {t.cta}
        </Link>
      </div>
      <div className="relative min-h-[280px] overflow-hidden lg:min-h-[640px]">
        <Image
          src="/taller/taller-amplio.webp"
          alt={t.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute bottom-4 left-4 right-4 flex max-w-[380px] flex-col gap-1.5 border-l-4 border-[#E0A83A] bg-[#161210] px-5 py-4 sm:bottom-8 sm:left-8 sm:right-auto">
          <span className="font-display text-[16px] italic leading-[1.5] text-[#F1E7D6] sm:text-[17px]">
            {t.quote}
          </span>
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#8C7F6E] sm:text-[12px]">
            {t.quoteAttr}
          </span>
        </div>
      </div>
    </section>
  );
}
