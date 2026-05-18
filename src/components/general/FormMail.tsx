"use client";
import { useActionState } from 'react';
import { handleVacationForm } from "../../actions";
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function FormMail() {
  const [state, formAction, isPending] = useActionState(handleVacationForm, null);
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const inputClass =
    'w-full p-3 border border-[#E8E4E0] rounded-sm bg-white text-[#2D2D2D] placeholder:text-[#9C9589] ' +
    'focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25 ' +
    'transition-colors text-sm md:text-base disabled:opacity-60';

  return (
    <div>
      <motion.form
        action={formAction}
        className="space-y-4"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-4 text-start">
          <div>
            <label htmlFor="contact-name" className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
              {locale === "es" ? "Nombre" : "Name"}
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              placeholder={locale === "es" ? "Tu nombre" : "Your name"}
              className={inputClass}
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
              {locale === "es" ? "Correo electrónico" : "Email"}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className={inputClass}
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
              {locale === "es" ? "Teléfono" : "Phone"}
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              placeholder="+506 8888 8888"
              className={inputClass}
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
              {locale === "es" ? "Mensaje" : "Message"}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              placeholder={
                locale === "es" ? "¿Cómo podemos ayudarte?" : "How can we help you?"
              }
              className={`${inputClass} resize-y min-h-24`}
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className={`inline-flex items-center justify-center w-full min-h-[48px] px-5 py-3 rounded-sm
                       text-sm md:text-base font-semibold tracking-wide
                       transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                       ${state?.success
                         ? 'bg-[#4A7C59] hover:bg-[#3F6A4C] text-[#F5F1EB]'
                         : 'bg-[#2D2D2D] hover:bg-[#1A1A1A] text-[#F5F1EB]'}`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" strokeWidth={2} aria-hidden />
                <span>{locale === "es" ? "Enviando…" : "Sending…"}</span>
              </>
            ) : state?.success ? (
              <>
                <Check className="h-4 w-4 mr-2" strokeWidth={2.5} aria-hidden />
                <span>{locale === "es" ? "Enviado correctamente" : "Sent successfully"}</span>
              </>
            ) : (
              <span>{locale === "es" ? "Enviar mensaje" : "Send message"}</span>
            )}
          </button>

          {state && !state?.success && (
            <div
              role="alert"
              className="flex items-start gap-2 bg-[#C44536]/8 border border-[#C44536]/30 text-[#9F2D24] px-3 py-2.5 rounded-sm text-sm"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} aria-hidden />
              <span>{state?.message}</span>
            </div>
          )}
        </div>
      </motion.form>
    </div>
  );
}
