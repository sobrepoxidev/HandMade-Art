'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider/provider'
import Link from 'next/link'
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useLocale } from 'next-intl'


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
          setErrorMsg('Has excedido el número de intentos permitidos. Por favor, espera unos minutos antes de intentarlo nuevamente o usa el inicio de sesión con Google.')
        } else {
          setErrorMsg(error.message)
        }
        setLoading(false)
      } else {
        setConfirmationMsg('Iniciando sesión...')
        router.replace(returnUrl)
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setErrorMsg('Error inesperado. Intenta de nuevo o usa el inicio de sesión con Google.')
      setLoading(false)
    }
  }

  const signInWithGoogle = async (url: string) => {
    setLoading(true);
    setErrorMsg("");

    const redirectTo = new URL('/auth/callback', window.location.origin);
    
    // Asegurar que la URL incluya el locale correcto
    let nextUrl = url;
    if (!nextUrl.startsWith(`/${locale}/`) && nextUrl !== '/') {
      nextUrl = `/${locale}${nextUrl}`;
    }
    
    redirectTo.searchParams.set('next', nextUrl);
  
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: redirectTo.toString()
      },
    });
  
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }
  
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  if (!mounted) return null

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#b3d5c3] via-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {locale === 'es' ? 'Inicia sesión' : 'Login'}
            </h1>
            <p className="text-gray-600">
              {locale === 'es' ? 'Bienvenido de nuevo a Handmade Art' : 'Welcome back to Handmade Art'}
            </p>
          </div>

          {confirmationMsg && (
            <div className="mb-6 p-4 rounded-lg bg-teal-50 text-teal-700">
              {confirmationMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-700 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200 focus:shadow-md"
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 text-gray-700 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200 focus:shadow-md"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" /> }
                </button>
              </div>
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
              {loading ? (locale === 'es' ? 'Iniciando sesión...' : 'Logging in...') : (locale === 'es' ? 'Iniciar sesión' : 'Login')}
            </button>
            
          </form>
          {/* Google Sign In Button */}
          <div className="mt-6">
              <button
                onClick={() => signInWithGoogle(returnUrl)}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                <FaGoogle className="mr-2 h-5 w-5" />
                {locale === 'es' ? 'Iniciar sesión con Google' : 'Login with Google'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-4">
              {locale === 'es' ? '¿No tienes una cuenta?' : 'Don\'t have an account?'}{' '}
              <Link
                href={`/register${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200"
              >
                {locale === 'es' ? 'Regístrate aquí' : 'Register here'}
              </Link>
            </div>
        </div>
      </div>
    </section>
  )
}