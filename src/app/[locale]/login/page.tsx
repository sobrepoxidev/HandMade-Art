'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useSupabase } from '@/app/supabase-provider/provider';
import { useLocale } from 'next-intl';

const LOGO_URL = 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.52Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.45l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A9.99 9.99 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.88A6 6 0 0 1 6.1 12c0-.65.11-1.28.31-1.88V7.53H3.06A9.99 9.99 0 0 0 2 12c0 1.61.39 3.13 1.06 4.47l3.35-2.59Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.96 3 14.7 2 12 2a9.99 9.99 0 0 0-8.94 5.53l3.35 2.59C7.2 7.76 9.4 5.98 12 5.98Z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState('');
  const [returnUrl, setReturnUrl] = useState('/');

  useEffect(() => {
    const returnUrlParam = searchParams.get('returnUrl') || searchParams.get('redirect');
    if (returnUrlParam) setReturnUrl(returnUrlParam);
  }, [searchParams]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMsg(error.message.includes('rate limit')
          ? locale === 'es'
            ? 'Has excedido el número de intentos permitidos. Espera unos minutos o usa Google.'
            : 'You have exceeded the allowed attempts. Wait a few minutes or use Google.'
          : error.message);
        setLoading(false);
        return;
      }

      setConfirmationMsg(locale === 'es' ? 'Iniciando sesión...' : 'Logging in...');
      router.replace(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(locale === 'es'
        ? 'Error inesperado. Intenta de nuevo o usa Google.'
        : 'Unexpected error. Try again or use Google.');
      setLoading(false);
    }
  };

  const signInWithGoogle = async (url: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const redirectTo = new URL('/auth/callback', window.location.origin);
      const nextPath = normalizeReturnPath(url || '/', locale);
      redirectTo.searchParams.set('next', nextPath);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: unknown) {
      console.error('Google login error:', error);
      setErrorMsg(error instanceof Error ? error.message : locale === 'es' ? 'Error al iniciar sesión con Google' : 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF6EF] px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-5xl items-start gap-8 py-4 lg:grid-cols-[0.9fr_1.1fr] lg:py-10">
        <section className="hidden border border-[#E8E4E0] bg-[#2D2D2D] p-8 text-[#F5F1EB] lg:block">
          <div className="relative mb-8 h-16 w-16">
            <Image src={LOGO_URL} alt="" fill className="object-contain" />
          </div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#C9A962]">
            {locale === 'es' ? 'Cuenta Handmade Art' : 'Handmade Art account'}
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight tracking-[-0.005em]">
            {locale === 'es' ? 'Vuelve a tu carrito, favoritos y pedidos.' : 'Return to your cart, favorites and orders.'}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#D4C4A8]">
            {locale === 'es'
              ? 'Compra piezas únicas con una cuenta que conserva tu flujo y acelera el checkout.'
              : 'Shop one-of-a-kind pieces with an account that keeps your flow and speeds up checkout.'}
          </p>
        </section>

        <section className="mx-auto w-full max-w-md border border-[#E8E4E0] bg-[#FAF6EF] p-6 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)] sm:p-8">
          <div className="mb-7">
            <div className="mb-5 flex items-center gap-3 lg:hidden">
              <div className="relative h-11 w-11 bg-[#2D2D2D]">
                <Image src={LOGO_URL} alt="" fill className="object-contain p-2" />
              </div>
              <span className="font-display text-xl text-[#2D2D2D]">Handmade <span className="text-[#A08848]">Art</span></span>
            </div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
              {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
            </h2>
            <p className="mt-2 text-sm text-[#4A4A4A]">
              {locale === 'es' ? 'Accede para continuar tu compra.' : 'Access your account to continue shopping.'}
            </p>
          </div>

          {confirmationMsg && (
            <div className="mb-5 rounded-sm border border-[#4A7C59]/30 bg-[#4A7C59]/10 p-3 text-sm font-medium text-[#2F5F3E]">
              {confirmationMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-[#6B6459]">
                {locale === 'es' ? 'Correo electrónico' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6459]" strokeWidth={1.75} aria-hidden />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] pl-10 pr-3 text-sm text-[#2D2D2D] placeholder:text-[#6B6459] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
                  placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.06em] text-[#6B6459]">
                  {locale === 'es' ? 'Contraseña' : 'Password'}
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-[#A08848] hover:text-[#2D2D2D]">
                  {locale === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6459]" strokeWidth={1.75} aria-hidden />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] pl-10 pr-12 text-sm text-[#2D2D2D] placeholder:text-[#6B6459] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-sm text-[#6B6459] hover:text-[#A08848]"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? locale === 'es' ? 'Ocultar contraseña' : 'Hide password' : locale === 'es' ? 'Mostrar contraseña' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-sm border border-[#C44536]/30 bg-[#C44536]/10 p-3 text-sm text-[#9F2D24]">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-sm bg-[#2D2D2D] px-5 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (locale === 'es' ? 'Iniciando...' : 'Signing in...') : (locale === 'es' ? 'Iniciar sesión' : 'Sign in')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#E8E4E0]" />
            <span className="text-xs text-[#6B6459]">{locale === 'es' ? 'o' : 'or'}</span>
            <span className="h-px flex-1 bg-[#E8E4E0]" />
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle(returnUrl)}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-sm border border-[#E8E4E0] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#A08848] hover:bg-[#F5F1EB]"
          >
            <GoogleIcon />
            {locale === 'es' ? 'Continuar con Google' : 'Continue with Google'}
          </button>

          <p className="mt-6 border-t border-[#E8E4E0] pt-5 text-center text-sm text-[#4A4A4A]">
            {locale === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
            <Link
              href={`/register${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
              className="font-semibold text-[#A08848] hover:text-[#2D2D2D]"
            >
              {locale === 'es' ? 'Crear cuenta' : 'Create account'}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function normalizeReturnPath(raw: string, locale: string) {
  try {
    const url = new URL(raw, window.location.origin);
    let path = url.pathname.replace(/^\/(es|en)(?=\/|$)/, '');
    path = `/${locale}${path === '' ? '' : path}`.replace(/\/{2,}/g, '/');
    return `${path}${url.search || ''}`;
  } catch {
    const safe = raw.startsWith('/') ? raw : `/${raw}`;
    return `/${locale}${safe}`.replace(/\/{2,}/g, '/');
  }
}
