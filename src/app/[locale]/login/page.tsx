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
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#8B4513] via-[#D2B48C] to-[#F5F5DC] py-6 px-4 sm:px-6 lg:px-8">
      {/* Patrón decorativo */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: 'url("/pattern-wood.svg")', backgroundSize: '100px' }}></div>
      </div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-amber-100">
          <div className="text-center mb-6">
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
              {locale === 'es' ? 'Inicia sesión' : 'Login'}
            </h1>
            <p className="text-amber-800">
              {locale === 'es' ? 'Bienvenido de nuevo a Handmade Art' : 'Welcome back to Handmade Art'}
            </p>
          </div>

          {confirmationMsg && (
            <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              {confirmationMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  className="w-full pl-10 pr-4 py-2.5 border border-amber-300 rounded-md text-amber-900 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-all duration-200 focus:shadow-md bg-amber-50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-amber-800">
                  {locale === 'es' ? 'Contraseña' : 'Password'}
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-amber-700 hover:text-amber-900 hover:underline"
                >
                  {locale === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 border border-amber-300 text-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-all duration-200 focus:shadow-md bg-amber-50"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" /> }
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B4513] hover:bg-[#6B3100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 mt-2"
            >
              {loading ? (locale === 'es' ? 'Iniciando sesión...' : 'Logging in...') : (locale === 'es' ? 'Iniciar sesión' : 'Login')}
            </button>
            
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
              {locale === 'es' ? 'Iniciar sesión con Google' : 'Login with Google'}
            </button>
          </div>

          <div className="text-center text-sm text-amber-800 mt-6">
            {locale === 'es' ? '¿No tienes una cuenta?' : 'Don\'t have an account?'}{' '}
            <Link
              href={`/register${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
              className="font-medium text-[#8B4513] hover:text-[#6B3100] hover:underline transition-colors duration-200"
            >
              {locale === 'es' ? 'Regístrate aquí' : 'Register here'}
            </Link>
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