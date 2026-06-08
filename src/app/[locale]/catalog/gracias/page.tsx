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
    <main className="min-h-[72vh] bg-[#FAF6EF] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-screen-sm">
        <section className="border border-[#E8E4E0] bg-[#F5F1EB] p-6 text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] sm:p-10">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#4A7C59]/12 text-[#4A7C59]">
            <CheckCircle className="h-8 w-8" strokeWidth={1.75} aria-hidden />
          </div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            {isEs ? 'Solicitud recibida' : 'Request received'}
          </p>
          <h1 className="font-display text-3xl font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D]">
            {isEs ? 'Tu solicitud fue enviada.' : 'Your request was sent.'}
          </h1>

          <div className="mx-auto mt-5 max-w-md space-y-4 text-sm leading-relaxed text-[#4A4A4A]">
            <p>
              {isEs
                ? 'Recibimos tu solicitud de cotización. Nuestro equipo revisará la pieza y te responderá con una propuesta personalizada.'
                : 'We received your quote request. Our team will review the piece and reply with a personalized proposal.'}
            </p>

            {requestId && (
              <div className="border border-[#E8E4E0] bg-[#FAF6EF] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B6459]">
                  {isEs ? 'Número de solicitud' : 'Request number'}
                </p>
                <p className="mt-2 font-mono text-xl font-semibold text-[#A08848]">
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

          <div className="my-7 border-y border-[#E8E4E0] py-5">
            <h2 className="font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
              {isEs ? '¿Tienes alguna pregunta?' : 'Have a question?'}
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-[#4A4A4A] sm:grid-cols-2">
              <a href="mailto:info@handmadeart.store" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-3 transition-colors hover:border-[#A08848] hover:text-[#A08848]">
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                info@handmadeart.store
              </a>
              <a href="tel:+50684237555" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-3 transition-colors hover:border-[#A08848] hover:text-[#A08848]">
                <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                +506 8423 7555
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/catalog"
              locale={locale}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {isEs ? 'Volver al catálogo' : 'Back to catalog'}
            </Link>

            <Link
              href="/"
              locale={locale}
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#A08848] px-5 py-3 text-sm font-semibold tracking-wide text-[#A08848] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
            >
              {isEs ? 'Ir al inicio' : 'Go home'}
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-[#6B6459]">
          {isEs
            ? 'Handmade Art, artesanía costarricense hecha con oficio y propósito.'
            : 'Handmade Art, Costa Rican craft made with skill and purpose.'}
        </p>
      </div>
    </main>
  );
}
