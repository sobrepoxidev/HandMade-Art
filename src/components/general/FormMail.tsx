"use client";
import { useActionState } from 'react';
import { handleVacationForm } from "../../actions";
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function FormMail() {
  const [state, formAction, isPending] = useActionState(handleVacationForm, null);
  const locale = useLocale();

  const inputClass =
    'w-full p-3 border border-[#3A2E24] rounded-sm bg-[#1E1813] text-[#F1E7D6] placeholder:text-[#8C7F6E] ' +
    'focus:outline-none focus:border-[#F3C56B] focus:ring-2 focus:ring-[#F3C56B]/25 ' +
    'transition-colors text-sm md:text-base disabled:opacity-60';

  return (
    <div>
      <form
        action={formAction}
        className="space-y-4"
      >
        <div className="space-y-4 text-start">
          <div>
            <label htmlFor="contact-name" className="block mb-1.5 text-sm font-medium text-[#F1E7D6]">
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
            <label htmlFor="contact-email" className="block mb-1.5 text-sm font-medium text-[#F1E7D6]">
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
            <label htmlFor="contact-phone" className="block mb-1.5 text-sm font-medium text-[#F1E7D6]">
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
            <label htmlFor="contact-message" className="block mb-1.5 text-sm font-medium text-[#F1E7D6]">
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
                       text-sm md:text-base font-bold tracking-wide
                       transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                       ${state?.success
                         ? 'bg-[#3C9A70] hover:bg-[#3F6A4C] text-[#161210]'
                         : 'bg-[#E0A83A] hover:bg-[#F3C56B] text-[#161210]'}`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" strokeWidth={2} aria-hidden />
                <span>{locale === "es" ? "Enviando..." : "Sending..."}</span>
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
              className="flex items-start gap-2 bg-[#D9563B]/8 border border-[#D9563B]/30 text-[#D9563B] px-3 py-2.5 rounded-sm text-sm"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} aria-hidden />
              <span>{state?.message}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
