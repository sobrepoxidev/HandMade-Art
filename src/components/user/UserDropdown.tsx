'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Session } from '@supabase/supabase-js';
import { ChevronDown, User, History, Heart } from 'lucide-react';
import { useLocale } from "next-intl";
import { useSupabase } from '@/app/supabase-provider/provider';

interface UserDropdownProps {
  session: Session | null;
  onLogout: (currentUrl: string) => Promise<void>;
}

export default function UserDropdown({ session, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const { supabase } = useSupabase();
  
  // Estado local para el estado de la sesión (igual que en el carrito)
  const [currentSession, setCurrentSession] = useState(session);
  
  // Actualizar el estado local cuando cambia la sesión (igual que en el carrito)
  useEffect(() => {
    setCurrentSession(session);
    
    // Configurar un listener para cambios en la sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setCurrentSession(newSession);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [session, supabase.auth]);

  // Build the full current path *with* query string so we can return here after auth

  // Cierra el dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar al presionar tecla Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[44px] items-center space-x-1 rounded-sm px-3 py-1.5 text-sm text-[#F1E7D6] hover:text-[#F3C56B] hover:bg-[#1E1813] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A83A] transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="hidden md:inline font-medium">
          {currentSession ? `${locale === 'es' ? 'Hola' : 'Hello'}, ${currentSession.user.email?.split('@')[0]}` : locale === 'es' ? 'Cuenta' : 'Account'}
        </span>
        <span className="md:hidden">
          <User className="h-5 w-5" />
        </span>
        <ChevronDown className={`h-3 w-3 text-[#E0A83A] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-sm border border-[#E0A83A]/20 bg-[#1E1813] shadow-[0_18px_40px_rgba(15,12,10,0.5)]"
          style={{ zIndex: 9999 }}
        >
          {!currentSession ? (
            <>
              <div className="p-4 border-b border-[#E0A83A]/10">
                <div className="flex justify-center py-2">
                  <button
                    onClick={() => {
                      const fullPath = window.location.pathname + window.location.search;
                      router.push(`/login?returnUrl=${encodeURIComponent(fullPath)}`);
                      setIsOpen(false);
                    }}
                    className="block w-full rounded-sm bg-[#E0A83A] px-4 py-2.5 text-center text-sm font-semibold text-[#161210] transition-colors hover:bg-[#F3C56B] hover:text-[#161210] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C56B]"
                  >
                    {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
                  </button>
                </div>
                <div className="text-center text-sm mt-3">
                  <span className="text-[#8C7F6E]">{locale === 'es' ? '¿Eres nuevo?' : 'Are you new?'}</span>{' '}
                  <button
                    onClick={() => {
                      const fullPath = window.location.pathname + window.location.search;
                      router.push(`/register?returnUrl=${encodeURIComponent(fullPath)}`);
                      setIsOpen(false);
                    }}
                    className="text-[#E0A83A] hover:text-[#F3C56B] font-medium transition-colors"
                  >
                    {locale === 'es' ? 'Crear una cuenta' : 'Create an account'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 border-b border-[#E0A83A]/10 bg-[#2A2119]/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-[#F1E7D6]">{locale === 'es' ? 'Mi cuenta' : 'My account'}</span>
                <button
                  onClick={async () => {
                    await onLogout(window.location.href);
                    setIsOpen(false);
                  }}
                  className="text-xs text-[#D9563B] hover:text-[#F2A38A] font-medium transition-colors"
                >
                  {locale === 'es' ? 'Cerrar sesión' : 'Sign out'}
                </button>
              </div>
              <div className="text-sm text-[#8C7F6E]">
                {currentSession.user.email}
              </div>
            </div>
          )}

          <div className="py-2">
            <Link
              href="/account"
              className="flex items-center px-4 py-2.5 text-sm text-[#F1E7D6] hover:bg-[#2A2119] hover:text-[#E0A83A] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-[#E0A83A]" />
              {locale === 'es' ? 'Mi cuenta' : 'My account'}
            </Link>
            <Link
              href="/viewed-history"
              className="flex items-center px-4 py-2.5 text-sm text-[#F1E7D6] hover:bg-[#2A2119] hover:text-[#E0A83A] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <History className="h-4 w-4 mr-3 text-[#E0A83A]" />
              {locale === 'es' ? 'Artículos vistos recientemente' : 'Recently viewed items'}
            </Link>
            <Link
              href="/favorites"
              className="flex items-center px-4 py-2.5 text-sm text-[#F1E7D6] hover:bg-[#2A2119] hover:text-[#E0A83A] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-4 w-4 mr-3 text-[#D9563B]" />
              {locale === 'es' ? 'Mis favoritos' : 'My favorites'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
