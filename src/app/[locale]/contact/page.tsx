"use client";

import React from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FormMail from '@/components/general/FormMail';
import { useLocale } from 'next-intl';

export default function ContactPage() {
  const locale = useLocale();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F1EB] py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
            {locale === 'en' ? 'Contact Us' : 'Contáctanos'}
          </h1>
          <div className="h-1 w-24 bg-[#C9A962] mx-auto rounded-full"></div>
          <p className="mt-4 text-[#4A4A4A] max-w-2xl mx-auto">
            {locale === 'en'
              ? 'We\'d love to hear from you. Get in touch with us through any of the following channels.'
              : 'Nos encantaría saber de ti. Contáctanos a través de cualquiera de los siguientes canales.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#FAF8F5] p-6 md:p-8 rounded-xl shadow-sm border border-[#E8E4E0] h-full"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#2D2D2D] border-l-4 border-[#C9A962] pl-3">
              {locale === 'en' ? 'Contact Information' : 'Información de Contacto'}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#E8E4E0] hover:border-[#C9A962]/30 hover:shadow-sm transition-all">
                <div className="bg-[#C9A962]/10 p-3 rounded-full text-[#C9A962] mt-1">
                  <FaPhone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">{locale === 'en' ? 'Phone' : 'Teléfono'}</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base">+506 8585-0000</p>
                  <p className="text-[#9C9589] text-xs md:text-sm mt-1">
                    {locale === 'en' ? 'Available Monday to Friday, 7AM - 5:30PM' : 'Disponible de Lunes a Viernes, 7AM - 5:30PM'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#E8E4E0] hover:border-[#C9A962]/30 hover:shadow-sm transition-all">
                <div className="bg-[#4A7C59]/10 p-3 rounded-full text-[#4A7C59] mt-1">
                  <FaWhatsapp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">WhatsApp</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base">+506 8585-0000</p>
                  <a
                    href="https://wa.me/50685850000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm md:text-base text-white bg-[#4A7C59] hover:bg-[#3d6b4a] py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    {locale === 'en' ? 'Chat on WhatsApp' : 'Chatear en WhatsApp'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#E8E4E0] hover:border-[#C9A962]/30 hover:shadow-sm transition-all">
                <div className="bg-[#B55327]/10 p-3 rounded-full text-[#B55327] mt-1">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#2D2D2D]">{locale === 'en' ? 'Email' : 'Correo Electrónico'}</h3>
                  <p className="text-[#4A4A4A] text-sm md:text-base">info@handmadeart.store</p>
                  <p className="text-[#9C9589] text-xs md:text-sm mt-1">
                    {locale === 'en' ? 'We\'ll reply within 24-48 hours' : 'Te responderemos en 24-48 horas'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#FAF8F5] p-6 md:p-8 rounded-xl shadow-sm border border-[#E8E4E0] h-full"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#2D2D2D] border-l-4 border-[#C9A962] pl-3">
              {locale === 'en' ? 'Send us a Message' : 'Envíanos un Mensaje'}
            </h2>
            <FormMail />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
