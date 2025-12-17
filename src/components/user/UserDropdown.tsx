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
        className="flex items-center space-x-1 text-sm rounded-lg px-3 py-1.5 text-[#2D2D2D] hover:text-[#C9A962] hover:bg-[#F5F1EB] transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="hidden md:inline font-medium">
          {currentSession ? `${locale === 'es' ? 'Hola' : 'Hello'}, ${currentSession.user.email?.split('@')[0]}` : locale === 'es' ? 'Cuenta y Listas' : 'Account and Lists'}
        </span>
        <span className="md:hidden">
          <User className="h-5 w-5" />
        </span>
        <ChevronDown className={`h-3 w-3 text-[#C9A962] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-[#2D2D2D] border border-[#C9A962]/20 rounded-xl shadow-2xl overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          {!currentSession ? (
            <>
              <div className="p-4 border-b border-[#C9A962]/10">
                <div className="flex justify-center py-2">
                  <button
                    onClick={() => {
                      const fullPath = window.location.pathname + window.location.search;
                      router.push(`/login?returnUrl=${fullPath}`);
                      setIsOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-[#1A1A1A] bg-gradient-to-r from-[#C9A962] to-[#A08848] hover:from-[#D4C4A8] hover:to-[#C9A962] rounded-lg transition-all shadow-lg"
                  >
                    {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
                  </button>
                </div>
                <div className="text-center text-sm mt-3">
                  <span className="text-[#9C9589]">{locale === 'es' ? '¿Eres nuevo?' : 'Are you new?'}</span>{' '}
                  <button
                    onClick={() => {
                      const fullPath = window.location.pathname + window.location.search;
                      router.push(`/register?returnUrl=${fullPath}`);
                      setIsOpen(false);
                    }}
                    className="text-[#C9A962] hover:text-[#D4C4A8] font-medium transition-colors"
                  >
                    {locale === 'es' ? 'Crear una cuenta' : 'Create an account'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 border-b border-[#C9A962]/10 bg-[#3A3A3A]/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-[#F5F1EB]">{locale === 'es' ? 'Mi cuenta' : 'My account'}</span>
                <button
                  onClick={async () => {
                    await onLogout(window.location.href);
                    setIsOpen(false);
                  }}
                  className="text-xs text-[#C44536] hover:text-[#E57373] font-medium transition-colors"
                >
                  {locale === 'es' ? 'Cerrar sesión' : 'Sign out'}
                </button>
              </div>
              <div className="text-sm text-[#9C9589]">
                {currentSession.user.email}
              </div>
            </div>
          )}

          <div className="py-2">
            <Link
              href="/account"
              className="flex items-center px-4 py-2.5 text-sm text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-[#C9A962]" />
              {locale === 'es' ? 'Mi cuenta' : 'My account'}
            </Link>
            <Link
              href="/viewed-history"
              className="flex items-center px-4 py-2.5 text-sm text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <History className="h-4 w-4 mr-3 text-[#B55327]" />
              {locale === 'es' ? 'Artículos vistos recientemente' : 'Recently viewed items'}
            </Link>
            <Link
              href="/favorites"
              className="flex items-center px-4 py-2.5 text-sm text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-4 w-4 mr-3 text-[#C44536]" />
              {locale === 'es' ? 'Mis favoritos' : 'My favorites'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
