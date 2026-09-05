"use client";

import { Mail, MessageCircle, Phone } from 'lucide-react';
import FormMail from '@/components/general/FormMail';
import { useLocale } from 'next-intl';

export default function ContactClient() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <main className="min-h-screen bg-[#161210] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Header */}
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F3C56B]">
            {isEn ? 'Questions, orders and custom pieces' : 'Consultas, pedidos y piezas a medida'}
          </p>
          <h1 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#F1E7D6] md:text-4xl">
            {isEn ? 'Contact us' : 'Contáctanos'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#C9BBA5]">
            {isEn
              ? 'We\'d love to hear from you. Reach us through any of the channels below.'
              : 'Nos encantaría saber de vos. Escribinos por cualquiera de los siguientes canales.'}
          </p>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <section className="h-full border border-[#3A2E24] bg-[#1E1813] p-6 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] md:p-8">
            <h2 className="mb-6 font-display text-xl font-medium tracking-[-0.005em] text-[#F1E7D6] md:text-2xl">
              {isEn ? 'Contact information' : 'Información de contacto'}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-sm border border-[#3A2E24] bg-[#1E1813] p-4 transition-colors hover:border-[#E0A83A]/50">
                <div className="mt-1 rounded-full bg-[#E0A83A]/12 p-3 text-[#F3C56B]" aria-hidden>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#F1E7D6]">{isEn ? 'Phone' : 'Teléfono'}</h3>
                  <p className="text-[#C9BBA5] text-sm md:text-base tabular-nums">+506 8585-0000</p>
                  <p className="text-[#8C7F6E] text-xs md:text-sm mt-1">
                    {isEn
                      ? 'Available Monday to Friday, 7 AM to 5:30 PM'
                      : 'Disponible lunes a viernes, 7 AM a 5:30 PM'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-sm border border-[#3A2E24] bg-[#1E1813] p-4 transition-colors hover:border-[#E0A83A]/50">
                <div className="mt-1 rounded-full bg-[#3C9A70]/12 p-3 text-[#3C9A70]" aria-hidden>
                  <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#F1E7D6]">WhatsApp</h3>
                  <p className="text-[#C9BBA5] text-sm md:text-base tabular-nums">+506 8585-0000</p>
                  <a
                    href="https://wa.me/50685850000"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isEn ? 'Chat on WhatsApp (opens new window)' : 'Chatear en WhatsApp (abre en nueva ventana)'}
                    className="mt-2 inline-flex min-h-[40px] items-center justify-center rounded-sm bg-[#3C9A70] px-4 py-2 text-sm font-medium text-[#F1E7D6] transition-colors hover:bg-[#3F6A4C] md:text-base"
                  >
                    {isEn ? 'Chat on WhatsApp' : 'Chatear en WhatsApp'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-sm border border-[#3A2E24] bg-[#1E1813] p-4 transition-colors hover:border-[#E0A83A]/50">
                <div className="mt-1 rounded-full bg-[#E0A83A]/12 p-3 text-[#E0A83A]" aria-hidden>
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#F1E7D6]">{isEn ? 'Email' : 'Correo electrónico'}</h3>
                  <p className="text-[#C9BBA5] text-sm md:text-base">info@handmadeart.store</p>
                  <p className="text-[#8C7F6E] text-xs md:text-sm mt-1">
                    {isEn ? 'We reply within 24 to 48 hours' : 'Te respondemos en 24 a 48 horas'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="h-full border border-[#3A2E24] bg-[#1E1813] p-6 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] md:p-8">
            <h2 className="mb-6 font-display text-xl font-medium tracking-[-0.005em] text-[#F1E7D6] md:text-2xl">
              {isEn ? 'Send us a message' : 'Escribinos un mensaje'}
            </h2>
            <FormMail />
          </section>
        </div>
      </div>
    </main>
  );
}
