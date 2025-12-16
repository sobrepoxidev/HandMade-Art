'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider/provider'
import { useLocale } from 'next-intl'
import { FaEnvelope, FaLock, FaUser, FaPhone, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import Image from 'next/image'

export default function RegisterPage() {
  const { supabase } = useSupabase()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [confirmationMsg, setConfirmationMsg] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [receivePromotions, setReceivePromotions] = useState(true)
  const [returnUrl, setReturnUrl] = useState('/')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const locale = useLocale()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (password !== confirmPass) {
      setErrorMsg(locale === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.')
      return
    }
    if (!acceptTerms) {
      setErrorMsg(locale === 'es' ? 'Debes aceptar los términos para continuar.' : 'You must accept the terms to continue.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            receive_promotions: receivePromotions
          },
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
        },
      })
      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
      } else {
        setConfirmationMsg(locale === 'es'
          ? 'Registro exitoso. Revisa tu correo y confirma tu cuenta antes de iniciar sesión.'
          : 'Registration successful. Check your email and confirm your account before logging in.')
        setLoading(false)
      }
    } catch {
      setErrorMsg(locale === 'es' ? 'Error inesperado. Intenta de nuevo.' : 'Unexpected error. Please try again.')
      setLoading(false)
    }
  }

  const signInWithGoogle = async (returnUrl: string) => {
    setLoading(true);
    setErrorMsg("");

    // 1. Armamos la ruta de callback UNA sola vez
    const redirectTo =
      `${window.location.origin}/auth/callback` +
      (returnUrl && returnUrl !== "/"
        ? `?next=${encodeURIComponent(returnUrl)}`
        : "");

    // 2. Llamamos a Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    // 3. Manejamos posibles errores
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // 4. Forzamos la redirección (por si el SDK no lo hace)
    if (data?.url) window.location.href = data.url;
  };

  // Usar los hooks de Next.js
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true)

    // Extraer returnUrl del query string usando Next.js searchParams
    const returnUrlParam = searchParams.get('returnUrl');
    console.log("Return URL Param:", returnUrlParam);
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
  }, [searchParams])

  if (!mounted) return null

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#3A3A3A] py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A962]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B55327]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#C9A962]/3 rounded-full blur-2xl"></div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-lg animate-fade-in-up">
          {/* Card Container */}
          <div className="bg-[#2D2D2D]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#C9A962]/20">
            {/* Logo & Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 bg-[#3A3A3A] rounded-2xl p-2 border border-[#C9A962]/30 shadow-lg">
                  <Image
                    src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
                    alt="Handmade Art Logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-[#F5F1EB] mb-1 tracking-wide">
                {locale === 'es' ? 'Crear cuenta' : 'Create account'}
              </h1>
              <p className="text-[#9C9589] text-sm tracking-wide">
                {locale === 'es' ? 'Únete a la comunidad HandMade Art' : 'Join the HandMade Art community'}
              </p>
            </div>

            {confirmationMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#4A7C59]/20 text-[#7CB893] border border-[#4A7C59]/30 text-center text-sm">
                {confirmationMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name and Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#D4C4A8] mb-1.5 tracking-wide">
                    {locale === 'es' ? 'Nombre completo' : 'Full name'}
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors text-sm" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300 text-sm"
                      placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'}
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#D4C4A8] mb-1.5 tracking-wide">
                    {locale === 'es' ? 'Teléfono' : 'Phone'}
                  </label>
                  <div className="relative group">
                    <FaPhone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors text-sm" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300 text-sm"
                      placeholder="+506 8888 8888"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#D4C4A8] mb-1.5 tracking-wide">
                  {locale === 'es' ? 'Correo electrónico' : 'Email'}
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors text-sm" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300 text-sm"
                    placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
                    required
                  />
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#D4C4A8] mb-1.5 tracking-wide">
                    {locale === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300 text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9C9589] hover:text-[#C9A962] focus:outline-none transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPass" className="block text-sm font-medium text-[#D4C4A8] mb-1.5 tracking-wide">
                    {locale === 'es' ? 'Confirmar' : 'Confirm'}
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#9C9589] group-focus-within:text-[#C9A962] transition-colors text-sm" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPass"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] placeholder-[#6B6B6B] focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all duration-300 text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9C9589] hover:text-[#C9A962] focus:outline-none transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-4">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C9A962]/30 bg-[#1A1A1A]/60 text-[#C9A962] focus:ring-[#C9A962]/30 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <label htmlFor="terms" className="text-xs text-[#9C9589] leading-relaxed cursor-pointer">
                  {locale === 'es' ? (
                    <>
                      Acepto los{' '}
                      <Link href="/conditions-service" target="_blank" className="text-[#C9A962] hover:text-[#D4C4A8] transition-colors">
                        términos y condiciones
                      </Link>{' '}
                      y la{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-[#C9A962] hover:text-[#D4C4A8] transition-colors">
                        política de privacidad
                      </Link>
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <Link href="/conditions-service" target="_blank" className="text-[#C9A962] hover:text-[#D4C4A8] transition-colors">
                        terms and conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-[#C9A962] hover:text-[#D4C4A8] transition-colors">
                        privacy policy
                      </Link>
                    </>
                  )}
                </label>
              </div>

              {/* Promotions Checkbox */}
              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="promotions"
                    checked={receivePromotions}
                    onChange={(e) => setReceivePromotions(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C9A962]/30 bg-[#1A1A1A]/60 text-[#C9A962] focus:ring-[#C9A962]/30 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <label htmlFor="promotions" className="text-xs text-[#9C9589] cursor-pointer">
                  {locale === 'es' ? 'Deseo recibir correos promocionales y novedades' : 'I want to receive promotional emails and updates'}
                </label>
              </div>

              {errorMsg && (
                <div className="text-[#E57373] text-sm p-3 bg-[#C44536]/10 border border-[#C44536]/30 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#C9A962] to-[#A08848] hover:from-[#D4C4A8] hover:to-[#C9A962] text-[#1A1A1A] font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {locale === 'es' ? 'Registrando...' : 'Registering...'}
                  </span>
                ) : (
                  locale === 'es' ? 'Crear cuenta' : 'Create account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
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
              className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-[#1A1A1A]/60 border border-[#C9A962]/20 rounded-xl text-[#F5F1EB] hover:bg-[#1A1A1A] hover:border-[#C9A962]/40 transition-all duration-300"
            >
              <FaGoogle className="h-5 w-5 text-[#C9A962]" />
              <span className="font-medium text-sm">
                {locale === 'es' ? 'Registrarme con Google' : 'Sign up with Google'}
              </span>
            </button>

            {/* Login Link */}
            <div className="text-center mt-6 pt-5 border-t border-[#C9A962]/10">
              <p className="text-sm text-[#9C9589]">
                {locale === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
                <Link
                  href={`/login${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                  className="text-[#C9A962] hover:text-[#D4C4A8] font-medium transition-colors"
                >
                  {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center mt-4 text-xs text-[#6B6B6B] tracking-wide">
            {locale === 'es' ? 'Arte costarricense hecho a mano' : 'Costa Rican handmade art'}
          </p>
        </div>
      </div>
    </section>
  )
}
