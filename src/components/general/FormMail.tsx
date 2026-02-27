"use client";
import { useActionState } from "react";
import { handleVacationForm } from "../../actions";
import { motion } from "framer-motion";
import { FaSpinner, FaCheck, FaPaperPlane } from "react-icons/fa";
import { useLocale } from "next-intl";

export default function FormMail() {
  const [state, formAction, isPending] = useActionState(
    handleVacationForm,
    null
  );
  const locale = useLocale();
  const t = locale === "en";

  return (
    <motion.form
      action={formAction}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
            {t ? "Name" : "Nombre"} <span className="text-[#C9A962]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder={t ? "Your name" : "Tu nombre"}
            className="input text-sm"
            disabled={isPending}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
            {t ? "Email" : "Correo electrónico"}{" "}
            <span className="text-[#C9A962]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder={t ? "you@email.com" : "tu@email.com"}
            className="input text-sm"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
          {t ? "Phone" : "Teléfono"}{" "}
          <span className="text-[#9C9589] text-xs font-normal">
            ({t ? "optional" : "opcional"})
          </span>
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="+506 XXXX XXXX"
          className="input text-sm"
          disabled={isPending}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">
          {t ? "Message" : "Mensaje"}{" "}
          <span className="text-[#C9A962]">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={
            t ? "How can we help you?" : "¿Cómo podemos ayudarte?"
          }
          className="input text-sm resize-y min-h-[120px]"
          disabled={isPending}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
          ${
            state?.success
              ? "bg-[#4A7C59] text-white"
              : "bg-[#2D2D2D] text-[#F5F1EB] hover:bg-[#3A3A3A] border border-[#C9A962]/30 hover:border-[#C9A962] hover:shadow-md"
          }
          disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isPending ? (
          <>
            <FaSpinner className="animate-spin w-4 h-4" />
            <span>{t ? "Sending..." : "Enviando..."}</span>
          </>
        ) : state?.success ? (
          <>
            <FaCheck className="w-4 h-4" />
            <span>{t ? "Message sent!" : "¡Mensaje enviado!"}</span>
          </>
        ) : (
          <>
            <FaPaperPlane className="w-3.5 h-3.5" />
            <span>{t ? "Send Message" : "Enviar Mensaje"}</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {state && !state.success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-medium p-3 rounded-lg text-[#C44536] bg-[#C44536]/5 border border-[#C44536]/10"
        >
          {state.message}
        </motion.div>
      )}
    </motion.form>
  );
}
