'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider/provider'
import { Link } from '@/i18n/navigation';
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useLocale } from 'next-intl'
import Image from 'next/image'


export default function LoginPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [confirmationMsg, setConfirmationMsg] = useState('')
  const [returnUrl, setReturnUrl] = useState('/')

  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true)

    const returnUrlParam = searchParams.get('returnUrl') || searchParams.get('redirect');
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (error.message.includes('rate limit')) {
          setErrorMsg(locale === 'es'
            ? 'Has excedido el número de intentos permitidos. Por favor, espera unos minutos antes de intentarlo nuevamente o usa el inicio de sesión con Google.'
            : 'You have exceeded the allowed number of attempts. Please wait a few minutes before trying again or use Google login.')
        } else {
          setErrorMsg(error.message)
        }
        setLoading(false)
      } else {
        setConfirmationMsg(locale === 'es' ? 'Iniciando sesión...' : 'Logging in...')
        router.replace(returnUrl)
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setErrorMsg(locale === 'es'
        ? 'Error inesperado. Intenta de nuevo o usa el inicio de sesión con Google.'
        : 'Unexpected error. Please try again or use Google login.')
      setLoading(false)
    }
  }

  const signInWithGoogle = async (url: string) => {
  setLoading(true);
  setErrorMsg("");

  try {
    // 1) Construimos callback absoluto UNA sola vez
    const redirectTo = new URL("/auth/callback", window.location.origin);

    // 2) Normalizamos la ruta de retorno para que tenga EXACTAMENTE un locale delante
    //    y no permita dominios externos (open redirect guard).
    const normalizeNext = (raw: string, locale: string) => {
      try {
        // Permite path con o sin query; si viene absoluta, la reducimos a path local
        const u = new URL(raw, window.location.origin);
        let path = u.pathname;      // e.g. "/es/producto/123" o "/"
        const qs = u.search || "";  // e.g. "?a=b"

        // Quitar un locale inicial (es|en) si existe, pero SOLO uno
        path = path.replace(/^\/(es|en)(?=\/|$)/, "");

        // Asegurar exactamente un locale al inicio
        // Caso especial: path == "" → raíz del idioma "/es" o "/en"
        path = `/${locale}${path === "" ? "" : path}`;

        // Colapsar dobles slashes por si acaso
        path = path.replace(/\/{2,}/g, "/");

        return `${path}${qs}`;
      } catch {
        // Si 'raw' venía "rara", forzamos un path seguro local con locale
        const safe = raw.startsWith("/") ? raw : `/${raw}`;
        return `/${locale}${safe}`.replace(/\/{2,}/g, "/");
      }
    };

    // OJO: 'returnUrl' puede venir como "/es", "/es?x=y", "/producto/1", etc.
    const nextPath = normalizeNext(url || "/", locale);

    // 3) NUNCA uses encodeURIComponent aquí: searchParams.set YA codifica correctamente.
    redirectTo.searchParams.set("next", nextPath);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    if (data?.url) window.location.href = data.url;
  } catch (error: unknown) {
    console.error("Error en inicio de sesión con Google:", error);
    setErrorMsg(error instanceof Error ? error.message : "Error al iniciar sesión con Google");
    setLoading(false);
  }
};

  if (!mounted) return null

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#3A3A3A] py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A962]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B55327]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#C9A962]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Card Container */}
          <div className="bg-[#2D2D2D]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 border border-[#C9A962]/20">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 bg-[#3A3A3A] rounded-2xl p-3 border border-[#C9A962]/30 shadow-lg">
                  <Image
                    src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
                    alt="Handmade Art Logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-light text-[#F5F1EB] mb-2 tracking-wide">
                {locale === 'es' ? 'Bienvenido' : 'Welcome'}
              </h1>
              <p className="text-[#9C9589] text-sm tracking-wide">
                {locale === 'es' ? 'Ingresa a tu cuenta HandMade Art' : 'Sign in to your HandMade Art account'}
              </p>
            </div>

            {confirmationMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#4A7C59]/20 text-[#7CB893] border border-[#4A7C59]/30 text-center">
                {confirmationMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#D4C4A8] mb-2 tracking-wide">
                  {locale === 'es' ? 'Correo electrónico' : 'Email'}
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300"
                    placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[#D4C4A8] tracking-wide">
                    {locale === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#C9A962] hover:text-[#D4C4A8] transition-colors"
                  >
                    {locale === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                  </Link>
                </div>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-3.5 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9C9589] hover:text-[#C9A962] focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" /> }
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="text-[#E57373] text-sm p-4 bg-[#C44536]/10 border border-[#C44536]/30 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#C9A962] to-[#A08848] hover:from-[#D4C4A8] hover:to-[#C9A962] text-[#1A1A1A] font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {locale === 'es' ? 'Iniciando...' : 'Signing in...'}
                  </span>
                ) : (
                  locale === 'es' ? 'Iniciar sesión' : 'Sign in'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A962]/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-[#9C9589] bg-[#2D2D2D]">
                  {locale === 'es' ? 'o continúa con' : 'or continue with'}
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => signInWithGoogle(returnUrl)}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] hover:bg-[#1A1A1A] hover:border-[#C9A962]/40 transition-all duration-300"
            >
              <FaGoogle className="h-5 w-5 text-[#C9A962]" />
              <span className="font-medium">
                {locale === 'es' ? 'Continuar con Google' : 'Continue with Google'}
              </span>
            </button>

            {/* Register Link */}
            <div className="text-center mt-8 pt-6 border-t border-[#C9A962]/10">
              <p className="text-[#9C9589]">
                {locale === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
                <Link
                  href={`/register${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                  className="text-[#C9A962] hover:text-[#D4C4A8] font-medium transition-colors"
                >
                  {locale === 'es' ? 'Crear cuenta' : 'Create account'}
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center mt-6 text-xs text-[#6B6B6B] tracking-wide">
            {locale === 'es' ? 'Arte costarricense hecho a mano' : 'Costa Rican handmade art'}
          </p>
        </div>
      </div>
    </section>
  )
}
