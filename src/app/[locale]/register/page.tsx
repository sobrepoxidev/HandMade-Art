'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
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

export default function RegisterPage() {
  const { supabase } = useSupabase();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receivePromotions, setReceivePromotions] = useState(true);
  const [returnUrl, setReturnUrl] = useState('/');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const returnUrlParam = searchParams.get('returnUrl');
    if (returnUrlParam) setReturnUrl(returnUrlParam);
  }, [searchParams]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');

    if (password !== confirmPass) {
      setErrorMsg(locale === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg(locale === 'es' ? 'Debes aceptar los términos para continuar.' : 'You must accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            receive_promotions: receivePromotions,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      setConfirmationMsg(locale === 'es'
        ? 'Registro exitoso. Revisa tu correo y confirma tu cuenta antes de iniciar sesión.'
        : 'Registration successful. Check your email and confirm your account before logging in.');
      setLoading(false);
    } catch {
      setErrorMsg(locale === 'es' ? 'Error inesperado. Intenta de nuevo.' : 'Unexpected error. Please try again.');
      setLoading(false);
    }
  };

  const signInWithGoogle = async (url: string) => {
    setLoading(true);
    setErrorMsg('');

    const redirectTo =
      `${window.location.origin}/auth/callback` +
      (url && url !== '/' ? `?next=${encodeURIComponent(url)}` : '');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data?.url) window.location.href = data.url;
  };

  return (
    <main className="bg-[#FAF6EF] px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-start gap-8 py-4 lg:grid-cols-[0.82fr_1.18fr] lg:py-10">
        <section className="hidden border border-[#E8E4E0] bg-[#2D2D2D] p-8 text-[#F5F1EB] lg:block">
          <div className="relative mb-8 h-16 w-16">
            <Image src={LOGO_URL} alt="" fill className="object-contain" />
          </div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#C9A962]">
            {locale === 'es' ? 'Nueva cuenta' : 'New account'}
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight tracking-[-0.005em]">
            {locale === 'es' ? 'Compra piezas únicas con checkout más rápido.' : 'Shop unique pieces with a faster checkout.'}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#D4C4A8]">
            {locale === 'es'
              ? 'Guarda tus datos básicos, recupera tu carrito y recibe novedades de piezas nuevas.'
              : 'Save basic details, recover your cart and get updates about new pieces.'}
          </p>
        </section>

        <section className="mx-auto w-full max-w-2xl border border-[#E8E4E0] bg-[#FAF6EF] p-6 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)] sm:p-8">
          <div className="mb-6">
            <div className="mb-5 flex items-center gap-3 lg:hidden">
              <div className="relative h-11 w-11 bg-[#2D2D2D]">
                <Image src={LOGO_URL} alt="" fill className="object-contain p-2" />
              </div>
              <span className="font-display text-xl text-[#2D2D2D]">Handmade <span className="text-[#A08848]">Art</span></span>
            </div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
              {locale === 'es' ? 'Crear cuenta' : 'Create account'}
            </h2>
            <p className="mt-2 text-sm text-[#4A4A4A]">
              {locale === 'es' ? 'Datos mínimos para comprar con menos fricción.' : 'Minimal details for a smoother purchase.'}
            </p>
          </div>

          {confirmationMsg && (
            <div className="mb-5 rounded-sm border border-[#4A7C59]/30 bg-[#4A7C59]/10 p-3 text-sm font-medium text-[#2F5F3E]">
              {confirmationMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="name"
                label={locale === 'es' ? 'Nombre completo' : 'Full name'}
                icon={<User className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
                value={name}
                onChange={setName}
                placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'}
                required
              />
              <TextField
                id="phone"
                type="tel"
                label={locale === 'es' ? 'Teléfono' : 'Phone'}
                icon={<Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
                value={phone}
                onChange={setPhone}
                placeholder="+506 8888 8888"
                required
              />
            </div>

            <TextField
              id="email"
              type="email"
              label={locale === 'es' ? 'Correo electrónico' : 'Email'}
              icon={<Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              value={email}
              onChange={setEmail}
              placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordField
                id="password"
                label={locale === 'es' ? 'Contraseña' : 'Password'}
                value={password}
                onChange={setPassword}
                show={showPassword}
                setShow={setShowPassword}
                locale={locale}
              />
              <PasswordField
                id="confirmPass"
                label={locale === 'es' ? 'Confirmar' : 'Confirm'}
                value={confirmPass}
                onChange={setConfirmPass}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                locale={locale}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#4A4A4A]">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#A08848]"
                required
              />
              <span>
                {locale === 'es' ? 'Acepto los ' : 'I accept the '}
                <Link href="/conditions-service" target="_blank" className="font-medium text-[#A08848] hover:text-[#2D2D2D]">
                  {locale === 'es' ? 'términos y condiciones' : 'terms and conditions'}
                </Link>
                {locale === 'es' ? ' y la ' : ' and '}
                <Link href="/privacy-policy" target="_blank" className="font-medium text-[#A08848] hover:text-[#2D2D2D]">
                  {locale === 'es' ? 'política de privacidad' : 'privacy policy'}
                </Link>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#4A4A4A]">
              <input
                type="checkbox"
                checked={receivePromotions}
                onChange={(event) => setReceivePromotions(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#A08848]"
              />
              {locale === 'es' ? 'Deseo recibir correos promocionales y novedades.' : 'I want to receive promotional emails and updates.'}
            </label>

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
              {loading ? (locale === 'es' ? 'Creando cuenta...' : 'Creating account...') : (locale === 'es' ? 'Crear cuenta' : 'Create account')}
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
            {locale === 'es' ? 'Registrarme con Google' : 'Sign up with Google'}
          </button>

          <p className="mt-6 border-t border-[#E8E4E0] pt-5 text-center text-sm text-[#4A4A4A]">
            {locale === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
            <Link
              href={`/login${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
              className="font-semibold text-[#A08848] hover:text-[#2D2D2D]"
            >
              {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function TextField({
  id,
  type = 'text',
  label,
  icon,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  type?: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-[#6B6459]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6459]">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] pl-10 pr-3 text-sm text-[#2D2D2D] placeholder:text-[#6B6459] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  setShow,
  locale,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  setShow: (value: boolean) => void;
  locale: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-[#6B6459]">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6459]" strokeWidth={1.75} aria-hidden />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] pl-10 pr-12 text-sm text-[#2D2D2D] placeholder:text-[#6B6459] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-sm text-[#6B6459] hover:text-[#A08848]"
          onClick={() => setShow(!show)}
          aria-label={show ? locale === 'es' ? 'Ocultar contraseña' : 'Hide password' : locale === 'es' ? 'Mostrar contraseña' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}
