'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider/provider'
import { useLocale } from 'next-intl'
import { FaEnvelope, FaLock, FaUser, FaPhone, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import Image from 'next/image'
//import { Tooltip } from 'react-tooltip' // Ejemplo: npm install react-tooltip (o quítalo si no lo quieres)

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
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#8B4513] via-[#D2B48C] to-[#F5F5DC] py-6 px-4 sm:px-6 lg:px-8 text-gray-800">
      {/* Patrón decorativo */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: 'url("/pattern-wood.svg")', backgroundSize: '100px' }}></div>
      </div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl px-4 py-6 md:p-8 border border-amber-100">
          <div className="text-center mb-4 md:mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-16">
                <Image 
                  src="/logo.svg" 
                  alt="Handmade Art Logo" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#8B4513] mb-2">
              {locale === 'es' ? 'Regístrate' : 'Register'}
            </h1>
            <p className="text-amber-800">
              {locale === 'es' ? 'Crea tu cuenta para comenzar a explorar Handmade Art' : 'Create your account to start exploring Handmade Art'}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3 md:space-y-6">
            <div className="space-y-3 md:space-y-6">
              {confirmationMsg && (
                <div className="mb-4 p-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  {confirmationMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                {/* Left Column */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-1">
                    {locale === 'es' ? 'Nombre completo' : 'Full name'}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-1">
                    {locale === 'es' ? 'Teléfono' : 'Phone'}
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mt-3">
                {/* Right Column */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-1">
                    {locale === 'es' ? 'Correo electrónico' : 'Email'}
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-1">
                    {locale === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="confirmPass" className="block text-sm font-medium text-amber-800 mb-1">
                  {locale === 'es' ? 'Confirmar contraseña' : 'Confirm password'}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPass"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 mb-1 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-amber-900">
                  {locale === 'es' ? (
                    <>
                      Acepto los{' '}
                      <Link href="/conditions-service" target="_blank" className="font-medium text-[#8B4513] hover:text-[#6B3100] hover:underline transition-colors duration-200">
                        Términos y condiciones
                      </Link>{' '}
                      así como la{' '}
                      <Link href="/privacy-policy" target="_blank" className="font-medium text-[#8B4513] hover:text-[#6B3100] hover:underline transition-colors duration-200">
                        política de privacidad
                      </Link>
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <Link href="/conditions-service" target="_blank" className="font-medium text-[#8B4513] hover:text-[#6B3100] hover:underline transition-colors duration-200">
                        terms and conditions
                      </Link>{' '}
                      and the{' '}
                      <Link href="/privacy-policy" target="_blank" className="font-medium text-[#8B4513] hover:text-[#6B3100] hover:underline transition-colors duration-200">
                        privacy policy
                      </Link>
                    </>
                  )}
                </label>
              </div>

              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="promotions"
                  checked={receivePromotions}
                  onChange={(e) => setReceivePromotions(e.target.checked)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                />
                <label htmlFor="promotions" className="ml-2 text-sm text-amber-900">
                  {locale === 'es' ? 'Deseo recibir correos promocionales y actualizaciones sobre nuevos productos' : 'I want to receive promotional emails and updates about new products'}
                </label>
              </div>

              {errorMsg && (
                <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md mt-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B4513] hover:bg-[#6B3100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 mt-4"
              >
                {loading 
                  ? (locale === 'es' ? 'Registrando...' : 'Registering...') 
                  : (locale === 'es' ? 'Registrarme' : 'Register')
                }
              </button>
            </div>
          </form>
          
          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-amber-700">{locale === 'es' ? 'O continúa con' : 'Or continue with'}</span>
            </div>
          </div>
          
          {/* Google Sign In Button */}
          <div>
            <button
              onClick={() => signInWithGoogle(returnUrl)}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-900 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
            >
              <FaGoogle className="mr-2 h-5 w-5 text-amber-700" />
              {locale === 'es' ? 'Registrarme con Google' : 'Register with Google'}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-800">
              {locale === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}{' '}
              <Link 
                href={`/login${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`} 
                className="font-medium text-[#8B4513] hover:text-[#6B3100] hover:underline transition-colors duration-200"
              >
                {locale === 'es' ? 'Inicia sesión' : 'Login'}
              </Link>
            </p>
          </div>
          
          {/* Decoración */}
          <div className="mt-8 pt-6 border-t border-amber-100 text-center">
            <p className="text-xs text-amber-600">
              {locale === 'es' ? 'Arte costarricense hecho a mano con ♥' : 'Costa Rican handmade art with ♥'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}