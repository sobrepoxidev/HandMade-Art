'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function GraciasPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isEs = locale === 'es';
  const requestId = searchParams.get('solicitud');

  return (
    <main className="min-h-[72vh] bg-[#161210] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-screen-sm">
        <section className="border border-[#3A2E24] bg-[#1E1813] p-6 text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] sm:p-10">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#3C9A70]/12 text-[#3C9A70]">
            <CheckCircle className="h-8 w-8" strokeWidth={1.75} aria-hidden />
          </div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F3C56B]">
            {isEs ? 'Solicitud recibida' : 'Request received'}
          </p>
          <h1 className="font-display text-3xl font-medium leading-tight tracking-[-0.005em] text-[#F1E7D6]">
            {isEs ? 'Tu solicitud fue enviada.' : 'Your request was sent.'}
          </h1>

          <div className="mx-auto mt-5 max-w-md space-y-4 text-sm leading-relaxed text-[#C9BBA5]">
            <p>
              {isEs
                ? 'Recibimos tu solicitud de cotización. Nuestro equipo revisará la pieza y te responderá con una propuesta personalizada.'
                : 'We received your quote request. Our team will review the piece and reply with a personalized proposal.'}
            </p>

            {requestId && (
              <div className="border border-[#3A2E24] bg-[#161210] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8C7F6E]">
                  {isEs ? 'Número de solicitud' : 'Request number'}
                </p>
                <p className="mt-2 font-mono text-xl font-semibold text-[#F3C56B]">
                  #{requestId}
                </p>
              </div>
            )}

            <p>
              {isEs
                ? 'Te contactaremos en las próximas 24 a 48 horas. Revisa también spam o correo no deseado si no ves nuestra respuesta.'
                : 'We will contact you within 24 to 48 hours. Also check spam or junk mail if you do not see our reply.'}
            </p>
          </div>

          <div className="my-7 border-y border-[#3A2E24] py-5">
            <h2 className="font-display text-xl font-medium tracking-[-0.005em] text-[#F1E7D6]">
              {isEs ? '¿Tienes alguna pregunta?' : 'Have a question?'}
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-[#C9BBA5] sm:grid-cols-2">
              <a href="mailto:info@handmadeart.store" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#3A2E24] px-3 transition-colors hover:border-[#F3C56B] hover:text-[#F3C56B]">
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                info@handmadeart.store
              </a>
              <a href="tel:+50685850000" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#3A2E24] px-3 transition-colors hover:border-[#F3C56B] hover:text-[#F3C56B]">
                <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                +506 8585 0000
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/catalog"
              locale={locale}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#E0A83A] px-5 py-3 text-sm font-bold tracking-wide text-[#161210] transition-colors hover:bg-[#F3C56B]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {isEs ? 'Volver al catálogo' : 'Back to catalog'}
            </Link>

            <Link
              href="/"
              locale={locale}
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#F3C56B] px-5 py-3 text-sm font-semibold tracking-wide text-[#F3C56B] transition-colors hover:bg-[#F3C56B] hover:text-[#161210]"
            >
              {isEs ? 'Ir al inicio' : 'Go home'}
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-[#8C7F6E]">
          {isEs
            ? 'Handmade Art, artesanía costarricense hecha con oficio y propósito.'
            : 'Handmade Art, Costa Rican craft made with skill and purpose.'}
        </p>
      </div>
    </main>
  );
}
