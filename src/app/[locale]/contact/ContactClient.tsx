"use client";

import React from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import FormMail from '@/components/general/FormMail';
import { useLocale } from 'next-intl';

export default function ContactClient() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F1EB] py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-medium tracking-[-0.005em] text-[#2D2D2D] mb-3">
            {isEn ? 'Contact us' : 'Contáctanos'}
          </h1>
          <div className="h-px w-16 bg-[#C9A962] mx-auto" aria-hidden />
          <p className="mt-4 text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'We\'d love to hear from you. Reach us through any of the channels below.'
              : 'Nos encantaría saber de vos. Escribinos por cualquiera de los siguientes canales.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
            animate={prefersReducedMotion ? false : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#FAF8F5] p-6 md:p-8 rounded-md shadow-sm border border-[#E8E4E0] h-full"
          >
            <h2 className="font-display text-xl md:text-2xl font-medium tracking-[-0.005em] mb-6 text-[#2D2D2D] border-l-2 border-[#C9A962] pl-3">
              {isEn ? 'Contact information' : 'Información de contacto'}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-sm border border-[#E8E4E0] hover:border-[#C9A962]/40 hover:shadow-sm transition-all">
                <div className="bg-[#C9A962]/12 p-3 rounded-full text-[#A08848] mt-1" aria-hidden>
                  <FaPhone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">{isEn ? 'Phone' : 'Teléfono'}</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base tabular-nums">+506 8585-0000</p>
                  <p className="text-[#6B6459] text-xs md:text-sm mt-1">
                    {isEn
                      ? 'Available Mon–Fri, 7 AM – 5:30 PM'
                      : 'Disponible lunes a viernes, 7 AM – 5:30 PM'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-sm border border-[#E8E4E0] hover:border-[#C9A962]/40 hover:shadow-sm transition-all">
                <div className="bg-[#4A7C59]/12 p-3 rounded-full text-[#2F5F3E] mt-1" aria-hidden>
                  <FaWhatsapp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">WhatsApp</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base tabular-nums">+506 8585-0000</p>
                  <a
                    href="https://wa.me/50685850000"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isEn ? 'Chat on WhatsApp (opens new window)' : 'Chatear en WhatsApp (abre en nueva ventana)'}
                    className="inline-flex items-center justify-center min-h-[40px] mt-2 text-sm md:text-base text-[#F5F1EB] bg-[#4A7C59] hover:bg-[#3F6A4C] py-2 px-4 rounded-sm transition-colors font-medium"
                  >
                    {isEn ? 'Chat on WhatsApp' : 'Chatear en WhatsApp'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-sm border border-[#E8E4E0] hover:border-[#C9A962]/40 hover:shadow-sm transition-all">
                <div className="bg-[#B55327]/12 p-3 rounded-full text-[#B55327] mt-1" aria-hidden>
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">{isEn ? 'Email' : 'Correo electrónico'}</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base">info@handmadeart.store</p>
                  <p className="text-[#6B6459] text-xs md:text-sm mt-1">
                    {isEn ? 'We reply within 24–48 hours' : 'Te respondemos en 24–48 horas'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
            animate={prefersReducedMotion ? false : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#FAF8F5] p-6 md:p-8 rounded-md shadow-sm border border-[#E8E4E0] h-full"
          >
            <h2 className="font-display text-xl md:text-2xl font-medium tracking-[-0.005em] mb-6 text-[#2D2D2D] border-l-2 border-[#C9A962] pl-3">
              {isEn ? 'Send us a message' : 'Escribinos un mensaje'}
            </h2>
            <FormMail />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
