"use client";

import React from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, type Variants } from "framer-motion";
import FormMail from "@/components/general/FormMail";
import { useLocale } from "next-intl";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function ContactPage() {
  const locale = useLocale();
  const t = locale === "en";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#2D2D2D] text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A962] rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#B55327] rounded-full blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A962]/50 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[#C9A962] tracking-[0.2em] uppercase text-xs font-medium mb-4"
          >
            HandMade Art
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            {t ? "Get in Touch" : "Contáctanos"}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-0.5 w-16 bg-[#C9A962] mx-auto mb-5"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-[#D4C4A8] max-w-xl mx-auto text-base md:text-lg leading-relaxed"
          >
            {t
              ? "We'd love to hear from you. Reach out through any of these channels and we'll respond as soon as possible."
              : "Nos encantaría saber de ti. Comunícate por cualquiera de estos canales y te responderemos lo antes posible."}
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Phone Card */}
          <motion.a
            href="tel:+50685850000"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="group bg-white rounded-xl p-5 shadow-md border border-[#E8E4E0] hover:border-[#C9A962]/40 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C9A962]/10 text-[#C9A962] mb-3 group-hover:scale-110 transition-transform">
              <FaPhone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#2D2D2D] text-sm mb-1">
              {t ? "Phone" : "Teléfono"}
            </h3>
            <p className="text-[#4A4A4A] text-sm font-medium">
              +506 8585-0000
            </p>
          </motion.a>

          {/* WhatsApp Card */}
          <motion.a
            href="https://wa.me/50685850000"
            target="_blank"
            rel="noopener noreferrer"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="group bg-white rounded-xl p-5 shadow-md border border-[#E8E4E0] hover:border-[#4A7C59]/40 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] mb-3 group-hover:scale-110 transition-transform">
              <FaWhatsapp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#2D2D2D] text-sm mb-1">
              WhatsApp
            </h3>
            <p className="text-[#4A7C59] text-sm font-medium">
              {t ? "Chat now" : "Chatea ahora"}
            </p>
          </motion.a>

          {/* Email Card */}
          <motion.a
            href="mailto:info@handmadeart.store"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="group bg-white rounded-xl p-5 shadow-md border border-[#E8E4E0] hover:border-[#B55327]/40 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B55327]/10 text-[#B55327] mb-3 group-hover:scale-110 transition-transform">
              <FaEnvelope className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#2D2D2D] text-sm mb-1">
              {t ? "Email" : "Correo"}
            </h3>
            <p className="text-[#4A4A4A] text-sm font-medium break-all">
              info@handmadeart.store
            </p>
          </motion.a>
        </div>
      </section>

      {/* Main Content: Form + Details */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Form - takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 order-1"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E8E4E0]">
              <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-1">
                {t ? "Send us a Message" : "Envíanos un Mensaje"}
              </h2>
              <p className="text-[#9C9589] text-sm mb-6">
                {t
                  ? "Fill out the form and we'll get back to you shortly."
                  : "Completa el formulario y te responderemos a la brevedad."}
              </p>
              <FormMail />
            </div>
          </motion.div>

          {/* Sidebar details - takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 order-2 space-y-5"
          >
            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E4E0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962]">
                  <FaClock className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D]">
                  {t ? "Business Hours" : "Horario de Atención"}
                </h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">
                    {t ? "Monday - Friday" : "Lunes - Viernes"}
                  </span>
                  <span className="font-medium text-[#2D2D2D]">
                    7:00 AM – 5:30 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">
                    {t ? "Saturday" : "Sábado"}
                  </span>
                  <span className="font-medium text-[#2D2D2D]">
                    8:00 AM – 12:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">
                    {t ? "Sunday" : "Domingo"}
                  </span>
                  <span className="text-[#9C9589]">
                    {t ? "Closed" : "Cerrado"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E4E0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#B55327]/10 flex items-center justify-center text-[#B55327]">
                  <FaMapMarkerAlt className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D]">
                  {t ? "Location" : "Ubicación"}
                </h3>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                Costa Rica
              </p>
            </div>

            {/* Response Time */}
            <div className="bg-[#2D2D2D] rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-[#C9A962] text-sm tracking-wide uppercase mb-2">
                {t ? "Response Time" : "Tiempo de Respuesta"}
              </h3>
              <p className="text-[#D4C4A8] text-sm leading-relaxed">
                {t
                  ? "We typically reply within 24-48 hours during business days. For urgent inquiries, please reach out via WhatsApp."
                  : "Normalmente respondemos en 24-48 horas en días hábiles. Para consultas urgentes, comunícate por WhatsApp."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
