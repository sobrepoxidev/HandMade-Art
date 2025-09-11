'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider/provider'
import { useLocale } from 'next-intl'
import { FaEnvelope, FaLock, FaUser, FaPhone, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
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
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }
    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los términos para continuar.')
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
        setConfirmationMsg('Registro exitoso. Revisa tu correo y confirma tu cuenta antes de iniciar sesión.')
        setLoading(false)
      }
    } catch {
      setErrorMsg('Error inesperado. Intenta de nuevo.')
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
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#b3d5c3] via-gray-100 to-gray-200 py-6 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg px-4 py-6 md:p-8 border border-gray-100">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {locale === 'es' ? 'Regístrate' : 'Register'}
            </h1>
            <p className="text-gray-600">
              {locale === 'es' ? 'Crea tu cuenta para comenzar a explorar Handmade Art' : 'Create your account to start exploring Handmade Art'}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3 md:space-y-6">
            <div className="space-y-3 md:space-y-6">
              {confirmationMsg && (
                <div className="mb-1 p-4 rounded-lg bg-teal-50 text-teal-700">
                  {confirmationMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-6">
                {/* Left Column */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'es' ? 'Nombre completo' : 'Full name'}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'es' ? 'Teléfono' : 'Phone'}
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-6">
                {/* Right Column */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'es' ? 'Correo electrónico' : 'Email'}
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-1 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'es' ? 'Confirmar contraseña' : 'Confirm password'}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPass"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-1 mb-1 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  {locale === 'es' ? (
                    <>
                      Acepto los{' '}
                      <Link href="/conditions-service" target="_blank" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                        Términos y condiciones
                      </Link>{' '}
                      así como la{' '}
                      <Link href="/privacy-policy" target="_blank" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                        política de privacidad
                      </Link>
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <Link href="/conditions-service" target="_blank" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                        terms and conditions
                      </Link>{' '}
                      and the{' '}
                      <Link href="/privacy-policy" target="_blank" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                        privacy policy
                      </Link>
                    </>
                  )}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="promotions"
                  checked={receivePromotions}
                  onChange={(e) => setReceivePromotions(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="promotions" className="ml-2 text-sm text-gray-700">
                  {locale === 'es' ? 'Deseo recibir correos promocionales y actualizaciones sobre nuevos productos' : 'I want to receive promotional emails and updates about new products'}
                </label>
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 mt-2"
              >
                {loading ? 'Registrando...' : 'Registrarme'}
              </button>

              

              
            </div>
          </form>
          {/* Google Sign In Button */}
          <div className="mt-3">
                <button
                  onClick={() => signInWithGoogle(returnUrl)}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                >
                  {locale === 'es' ? <FaGoogle className="mr-2 h-5 w-5" /> : <FaGoogle className="mr-2 h-5 w-5" />}
                  {locale === 'es' ? 'Registrarme con Google' : 'Register with Google'}
                </button>
              </div>
          <div className="mt-2">
                <p className="text-sm text-gray-600 text-center">
                  {locale === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}
                  <Link href={`/login${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`} className="font-medium text-teal-600 hover:text-teal-500 ml-2 transition-colors duration-200">
                    {locale === 'es' ? 'Inicia sesión' : 'Login'}
                  </Link>
                </p>
              </div>
        </div>
      </div>
    </section>
  )
}