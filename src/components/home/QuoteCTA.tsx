import { Link } from '@/i18n/navigation';
import { MessageCircle } from 'lucide-react';

const COPY = {
  es: {
    eyebrow: 'Compra sin fricción',
    heading: 'Arma tu lista y te cotizamos con envío en menos de 24 horas.',
    body: 'SINPE, transferencia o tarjeta. Las piezas grandes viajan con seguro incluido.',
    cta: 'Pedir cotización',
    whatsapp: 'Escribir por WhatsApp',
  },
  en: {
    eyebrow: 'Frictionless shopping',
    heading: 'Build your list and get a shipping quote in under 24 hours.',
    body: 'SINPE, bank transfer or card. Larger pieces ship fully insured.',
    cta: 'Request a quote',
    whatsapp: 'Message us on WhatsApp',
  },
} as const;

export default function QuoteCTA({ locale }: { locale: string }) {
  const t = locale === 'es' ? COPY.es : COPY.en;
  const whatsappMessage = locale === 'es'
    ? 'Hola, quisiera una cotización de piezas de Handmade Art.'
    : "Hi, I'd like a quote for some Handmade Art pieces.";

  return (
    <section className="mx-5 mb-16 grid grid-cols-1 gap-6 bg-[#E0A83A] px-6 py-10 sm:mx-8 sm:px-10 lg:mx-12 lg:mb-24 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-10 lg:px-16 lg:py-16">
      <div className="flex flex-col gap-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#161210]/70">
          {t.eyebrow}
        </span>
        <h2 className="font-display text-[26px] leading-[1.1] text-[#161210] sm:text-[34px] lg:text-[44px]">
          {t.heading}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-[1.6] text-[#161210]/85 lg:text-base">
          {t.body}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/products"
          className="flex min-h-[54px] items-center justify-center rounded-sm bg-[#161210] px-6 text-sm font-bold text-[#F1E7D6] transition-colors hover:bg-[#0F0C0A]"
        >
          {t.cta}
        </Link>
        <a
          href={`https://wa.me/50685850000?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[54px] items-center justify-center gap-2.5 rounded-sm border border-[#161210] px-6 text-sm font-bold text-[#161210] transition-colors hover:bg-[#161210]/10"
        >
          <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden />
          {t.whatsapp}
        </a>
      </div>
    </section>
  );
}
