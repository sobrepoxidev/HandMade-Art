"use client";

import { Mail, MessageCircle, Phone } from 'lucide-react';
import FormMail from '@/components/general/FormMail';
import { useLocale } from 'next-intl';

export default function ContactClient() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Header */}
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            {isEn ? 'Questions, orders and custom pieces' : 'Consultas, pedidos y piezas a medida'}
          </p>
          <h1 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D] md:text-4xl">
            {isEn ? 'Contact us' : 'Contáctanos'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#4A4A4A]">
            {isEn
              ? 'We\'d love to hear from you. Reach us through any of the channels below.'
              : 'Nos encantaría saber de vos. Escribinos por cualquiera de los siguientes canales.'}
          </p>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <section className="h-full border border-[#E8E4E0] bg-[#F5F1EB] p-6 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] md:p-8">
            <h2 className="mb-6 font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D] md:text-2xl">
              {isEn ? 'Contact information' : 'Información de contacto'}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] p-4 transition-colors hover:border-[#C9A962]/50">
                <div className="mt-1 rounded-full bg-[#C9A962]/12 p-3 text-[#A08848]" aria-hidden>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">{isEn ? 'Phone' : 'Teléfono'}</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base tabular-nums">+506 8585-0000</p>
                  <p className="text-[#6B6459] text-xs md:text-sm mt-1">
                    {isEn
                      ? 'Available Monday to Friday, 7 AM to 5:30 PM'
                      : 'Disponible lunes a viernes, 7 AM a 5:30 PM'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] p-4 transition-colors hover:border-[#C9A962]/50">
                <div className="mt-1 rounded-full bg-[#4A7C59]/12 p-3 text-[#2F5F3E]" aria-hidden>
                  <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">WhatsApp</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base tabular-nums">+506 8585-0000</p>
                  <a
                    href="https://wa.me/50685850000"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isEn ? 'Chat on WhatsApp (opens new window)' : 'Chatear en WhatsApp (abre en nueva ventana)'}
                    className="mt-2 inline-flex min-h-[40px] items-center justify-center rounded-sm bg-[#4A7C59] px-4 py-2 text-sm font-medium text-[#F5F1EB] transition-colors hover:bg-[#3F6A4C] md:text-base"
                  >
                    {isEn ? 'Chat on WhatsApp' : 'Chatear en WhatsApp'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] p-4 transition-colors hover:border-[#C9A962]/50">
                <div className="mt-1 rounded-full bg-[#B55327]/12 p-3 text-[#B55327]" aria-hidden>
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">{isEn ? 'Email' : 'Correo electrónico'}</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base">info@handmadeart.store</p>
                  <p className="text-[#6B6459] text-xs md:text-sm mt-1">
                    {isEn ? 'We reply within 24 to 48 hours' : 'Te respondemos en 24 a 48 horas'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="h-full border border-[#E8E4E0] bg-[#F5F1EB] p-6 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] md:p-8">
            <h2 className="mb-6 font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D] md:text-2xl">
              {isEn ? 'Send us a message' : 'Escribinos un mensaje'}
            </h2>
            <FormMail />
          </section>
        </div>
      </div>
    </main>
  );
}
