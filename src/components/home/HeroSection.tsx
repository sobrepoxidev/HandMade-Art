import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Hammer, Leaf, Heart } from 'lucide-react';

type Props = {
  locale: string;
};

const COPY = {
  es: {
    eyebrow: 'Hecho a mano en Costa Rica',
    headline: 'Cada pieza guarda horas de oficio.',
    sub:
      'Madera viva, resina y un detrás-de-escena de manos que aprenden a empezar de nuevo. Compra una pieza única y apoya la reinserción social.',
    ctaPrimary: 'Explorar catálogo',
    ctaSecondary: 'Conocer la historia',
    trust: {
      hand: 'Hecho a mano',
      eco: 'Materiales nobles',
      impact: 'Impacto social real',
    },
    imageAlt:
      'Artesano costarricense mostrando un espejo tallado en madera, fruto de oficio paciente.',
  },
  en: {
    eyebrow: 'Handmade in Costa Rica',
    headline: 'Every piece holds hours of craft.',
    sub:
      'Live wood, resin and a backstage of hands learning to start again. Take home a one-of-a-kind piece and support social reintegration.',
    ctaPrimary: 'Browse catalog',
    ctaSecondary: 'Read the story',
    trust: {
      hand: 'Handmade',
      eco: 'Honest materials',
      impact: 'Real social impact',
    },
    imageAlt:
      'Costa Rican artisan presenting a hand-carved wooden mirror, the result of patient craftsmanship.',
  },
} as const;

export default function HeroSection({ locale }: Props) {
  const t = locale === 'es' ? COPY.es : COPY.en;

  return (
    <section className="relative isolate overflow-hidden bg-[#2D2D2D]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/home/hombre-exhibiendo-espejo-tallado-en-madera.webp"
          alt={t.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/85 via-[#2D2D2D]/60 to-[#2D2D2D]/20"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent"
        />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12 pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#C9A962] mb-5">
            {t.eyebrow}
          </p>

          <h1 className="font-display text-[#F5F1EB] text-[34px] leading-[1.05] sm:text-5xl lg:text-6xl xl:text-[68px] font-medium tracking-[-0.01em]">
            {t.headline}
          </h1>

          <p className="mt-5 sm:mt-7 text-[#E8E4E0] text-[15px] sm:text-base lg:text-lg leading-relaxed max-w-xl">
            {t.sub}
          </p>

          <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-[14px] font-semibold tracking-wide text-[#1A1A1A] bg-[#C9A962] rounded-sm hover:bg-[#D4C4A8] transition-colors duration-200"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/reinsercion-sociolaboral"
              className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-[14px] font-medium text-[#F5F1EB] bg-transparent border border-[#F5F1EB]/30 rounded-sm hover:bg-[#F5F1EB]/10 hover:border-[#F5F1EB]/60 transition-colors duration-200"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      <ul className="relative border-t border-[#F5F1EB]/15 bg-[#1A1A1A]/40 backdrop-blur-[2px]">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12 py-4 grid grid-cols-3 gap-2 sm:gap-6">
          <TrustPill icon={<Hammer className="h-4 w-4" strokeWidth={1.75} />} label={t.trust.hand} />
          <TrustPill icon={<Leaf className="h-4 w-4" strokeWidth={1.75} />} label={t.trust.eco} />
          <TrustPill icon={<Heart className="h-4 w-4" strokeWidth={1.75} />} label={t.trust.impact} />
        </div>
      </ul>
    </section>
  );
}

function TrustPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center justify-center sm:justify-start gap-2 text-[#D4C4A8]">
      <span aria-hidden className="text-[#C9A962]">
        {icon}
      </span>
      <span className="text-[11px] sm:text-[13px] font-medium tracking-wide text-[#F5F1EB]/90 truncate">
        {label}
      </span>
    </li>
  );
}
