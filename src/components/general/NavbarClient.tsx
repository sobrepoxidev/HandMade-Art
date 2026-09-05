// components/layout/Navbar/NavbarClient.tsx
"use client"

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ChevronDown, Globe, Package } from 'lucide-react';
import { useSupabase } from '@/app/supabase-provider/provider';
import UserDropdown from '@/components/user/UserDropdown';
import SearchBar from '@/components/search/SearchBar';
import CategoryCarousel from '@/components/search/CategoryCarousel';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { getCategoryById, PRIMARY_NAV_CATEGORY_IDS } from '@/lib/content/categories';
import type { HomeCategory } from '@/lib/home/types';

type NavLink = {
  name: string;
  path: string;
};


export default function NavbarClient({
  locale,
  initialCategories = [],
}: {
  locale: string;
  initialCategories?: HomeCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { supabase, session } = useSupabase();
  const interestList = useInterestList();
  const localeKey: 'es' | 'en' = locale === 'es' ? 'es' : 'en';

  const [currentSession, setCurrentSession] = useState(session);

  useEffect(() => {
    setCurrentSession(session);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setCurrentSession(newSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [session, supabase.auth]);

  const shouldShowSearchComponents = !pathname.includes('/admin') && !pathname.includes('/catalog');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryList] = useState<HomeCategory[]>(initialCategories);
  const [showStoreCategories, setShowStoreCategories] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const primaryNav = PRIMARY_NAV_CATEGORY_IDS
    .map((id) => getCategoryById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // A11y: ESC closes the mobile menu and focus returns to the trigger button.
  // Body scroll is locked while the menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        // restore focus after React renders
        setTimeout(() => menuTriggerRef.current?.focus(), 0);
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  const navigationLinks: NavLink[] = [
    { name: locale === 'es' ? 'Inicio' : 'Home', path: '/' },
    { name: locale === 'es' ? 'Acerca de' : 'About', path: '/about' },
    { name: locale === 'es' ? 'Reinserción Sociolaboral' : 'Social Reintegration', path: '/reinsercion-sociolaboral' },
    { name: locale === 'es' ? 'Envíos' : 'Shipping', path: '/shipping' },
  ]

  const handleLogout = async (currentUrl: string) => {
    try {
      await supabase.auth.signOut();
      window.location.href = currentUrl;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLanguageChange = () => {
    const targetLocale = locale === 'es' ? 'en' : 'es';
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHost = window.location.host;

    const pathWithoutLocale = currentPath.replace(/^\/(es|en)/, '');

    let targetDomain;
    if (targetLocale === 'es') {
      targetDomain = currentHost.includes('localhost') ? currentHost : 'artehechoamano.com';
    } else {
      targetDomain = currentHost.includes('localhost') ? currentHost : 'handmadeart.store';
    }

    const protocol = window.location.protocol;
    const newUrl = `${protocol}//${targetDomain}/${targetLocale}${pathWithoutLocale}${currentSearch}`;

    window.location.href = newUrl;
  };

  const totalQuoteItems = interestList.getTotalItems();

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden w-full flex-col lg:flex" style={{ position: 'static' }}>
        {/* Primary Header Row */}
        <div className="flex w-full max-w-screen-2xl mx-auto items-center justify-between gap-5 px-4 py-2.5 sm:px-8 lg:px-12">
          {/* Left */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-sm text-[#F1E7D6] transition-colors hover:bg-[#1E1813] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A83A]"
              aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Handmade Art"
            >
              <span className="font-serif flex h-11 w-11 shrink-0 items-center justify-center bg-[#E0A83A] text-lg leading-none text-[#161210]">
                HM
              </span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-display text-xl md:text-2xl tracking-[-0.005em] text-[#F1E7D6]">
                  Handmade Art
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#8C7F6E]">
                  {locale === 'es' ? 'Taller · San Ramón, Costa Rica' : 'Workshop · San Ramón, Costa Rica'}
                </span>
              </span>
            </Link>
          </div>

          {/* Primary nav — Chorreadores / Espejos / Esculturas / Pinturas / Guías / El taller */}
          <nav
            className="hidden shrink-0 items-center gap-7 text-[15px] font-medium text-[#F1E7D6] xl:flex"
            aria-label={locale === 'es' ? 'Categorías principales' : 'Primary categories'}
          >
            {primaryNav.map((cat) => (
              <Link
                key={cat.id}
                href={`/c/${cat.slugs[localeKey]}`}
                className="transition-colors hover:text-[#F3C56B]"
              >
                {cat.dbName[localeKey]}
              </Link>
            ))}
            <Link
              href={locale === 'es' ? '/guias' : '/guides'}
              className="transition-colors hover:text-[#F3C56B]"
            >
              {locale === 'es' ? 'Guías' : 'Guides'}
            </Link>
            <Link
              href="/reinsercion-sociolaboral"
              className="inline-flex items-center gap-2 text-[#E0A83A] transition-colors hover:text-[#F3C56B]"
            >
              <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-[#E0A83A]" />
              {locale === 'es' ? 'El taller' : 'The workshop'}
            </Link>
          </nav>

          {shouldShowSearchComponents && (
            <div
              className="relative min-w-[240px] flex-1 xl:max-w-[280px]"
              style={{ zIndex: 40, position: 'relative' }}
            >
              <SearchBar
                variant="navbar"
                initialCategory={locale === 'es' ? 'Todo' : 'All'}
                initialCategories={categoryList}
                locale={locale}
              />
            </div>
          )}

          {/* Right */}
          <div className="hidden shrink-0 lg:flex items-center gap-3">
            <UserDropdown session={currentSession} onLogout={handleLogout} />
            <button
              onClick={handleLanguageChange}
              className="flex min-h-[44px] items-center space-x-1.5 rounded-sm px-2 py-1 text-sm text-[#F1E7D6] transition-colors hover:bg-[#1E1813] hover:text-[#E0A83A] focus:outline-none"
            >
              <Globe className="h-4 w-4" strokeWidth={1.8} />
              <span className="font-medium">{locale === 'es' ? 'ES' : 'EN'}</span>
            </button>
            {shouldShowSearchComponents && (
              <Link
                href="/products"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#E0A83A] px-3.5 py-2 text-sm font-bold text-[#161210] transition-colors hover:bg-[#F3C56B]"
              >
                <Package className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                {locale === 'es' ? 'Mi cotización' : 'My quote'}
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#161210] px-1 text-[11px] font-bold text-[#E0A83A]">
                  {totalQuoteItems}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Category nav — editorial, no fixed height (lets the 48px min-h breathe) */}
        {shouldShowSearchComponents && (
          <CategoryCarousel locale={locale} categories={categoryList} />
        )}

        {/* Hidden navigation links */}
        <div className="hidden">
          <button
            onClick={handleLanguageChange}
            className="flex items-center space-x-1 text-sm text-[#F1E7D6] hover:text-[#E0A83A] focus:outline-none"
          >
            <Globe className="h-4 w-4" />
            <span>{locale === 'es' ? 'ES' : 'EN'}</span>
          </button>

          {shouldShowSearchComponents && (
            <Link
              href="/products"
              className="relative flex items-center space-x-0.5 text-sm text-[#F1E7D6] hover:text-[#E0A83A]"
            >
              <Package className="h-5 w-5" />
              <span className="sr-only">{locale === 'es' ? 'Cotizar' : 'Get a quote'}</span>
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-8 w-8 items-center justify-center text-[#F1E7D6] hover:bg-[#1E1813] rounded focus-visible:outline-none"
            aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="hidden">
          <ul className="flex items-center gap-x-6">
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="block py-1 text-sm text-[#F1E7D6] transition hover:text-[#E0A83A]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/catalog"
                className="block py-1 text-sm text-[#F1E7D6] transition hover:text-[#E0A83A]"
              >
                {locale === 'es' ? 'Tienda' : 'Store'}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-1 text-sm text-[#F1E7D6] transition hover:text-[#E0A83A]"
              >
                {locale === 'es' ? 'Contacto' : 'Contact'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'es' ? 'Menú de navegación' : 'Navigation menu'}
          className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-57px)] overflow-y-auto bg-[#161210] shadow-[0_18px_50px_rgba(15,12,10,0.55)] w-full lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-80 lg:max-h-none border-t border-[#3A2E24]"
        >

          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-3 right-3 grid place-items-center w-11 h-11 text-[#F1E7D6] hover:bg-[#1E1813] rounded-sm lg:block hidden z-50 transition-colors"
            aria-label={locale === 'es' ? 'Cerrar menú' : 'Close menu'}
          >
            <X className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          </button>

          <nav className="px-4 py-4" aria-label={locale === 'es' ? 'Menú principal' : 'Main menu'}>
            {/* Quote CTA */}
            {shouldShowSearchComponents && (
              <div className="mb-4">
                <Link
                  href="/products"
                  className="inline-flex items-center w-full min-h-[48px] gap-3 text-sm font-bold bg-[#E0A83A] hover:bg-[#F3C56B] text-[#161210] px-4 py-3 rounded-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                  <span>
                    {locale === 'es' ? 'Solicitar cotización' : 'Request a quote'}
                  </span>
                </Link>
              </div>
            )}

            {/* Auth Links */}
            <div className="mb-4 border border-[#3A2E24] bg-[#1E1813] p-3 rounded-sm">
              <div className="flex items-center justify-between">
                {currentSession ? (
                  <>
                    <Link
                      href="/account"
                      className="flex items-center space-x-2 text-sm font-medium text-[#F1E7D6] hover:text-[#E0A83A] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>{locale === 'es' ? 'Mi cuenta' : 'My account'}</span>
                    </Link>
                    <button
                      onClick={async () => await handleLogout(window.location.href)}
                      className="text-sm text-[#8C7F6E] hover:text-[#E0A83A] transition-colors"
                    >
                      {locale === 'es' ? 'Cerrar sesión' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const fullPath = window.location.pathname + window.location.search;
                        router.push(`/login?returnUrl=${encodeURIComponent(fullPath)}`);
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium text-[#F1E7D6] hover:text-[#E0A83A] transition-colors"
                    >
                      {locale === 'es' ? 'Iniciar sesión' : 'Login'}
                    </button>
                    <button
                      onClick={() => {
                        const fullPath = window.location.pathname + window.location.search;
                        router.push(`/register?returnUrl=${encodeURIComponent(fullPath)}`);
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium text-[#E0A83A] hover:text-[#F3C56B] transition-colors"
                    >
                      {locale === 'es' ? 'Registrarse' : 'Register'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="my-4 h-px bg-[#E0A83A]/25" />

            {/* Navigation Links */}
            <div>
              <p className="mb-3 font-medium text-sm text-[#8C7F6E] uppercase tracking-wider">{locale === 'es' ? 'Navegar' : 'Browse'}</p>
              <ul className="space-y-1">
                {primaryNav.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/c/${cat.slugs[localeKey]}`}
                      className="block text-sm text-[#F1E7D6] hover:text-[#F3C56B] hover:bg-[#1E1813] px-3 py-2.5 rounded-sm transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.dbName[localeKey]}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={locale === 'es' ? '/guias' : '/guides'}
                    className="block text-sm text-[#F1E7D6] hover:text-[#F3C56B] hover:bg-[#1E1813] px-3 py-2.5 rounded-sm transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {locale === 'es' ? 'Guías' : 'Guides'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reinsercion-sociolaboral"
                    className="block text-sm text-[#E0A83A] hover:text-[#F3C56B] hover:bg-[#1E1813] px-3 py-2.5 rounded-sm transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {locale === 'es' ? 'El taller' : 'The workshop'}
                  </Link>
                </li>
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="block text-sm text-[#F1E7D6] hover:text-[#F3C56B] hover:bg-[#1E1813] px-3 py-2.5 rounded-sm transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="block text-sm text-[#F1E7D6] hover:text-[#F3C56B] hover:bg-[#1E1813] px-3 py-2.5 rounded-sm transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {locale === 'es' ? 'Contacto' : 'Contact'}
                  </Link>
                </li>

                {/* Store with categories */}
                <li className="mt-3">
                  <div className="mb-1">
                    <button
                      className="flex items-center justify-between w-full py-2.5 px-3 bg-[#1E1813] text-[#F1E7D6] rounded-sm font-medium text-sm hover:bg-[#2A2119] transition-colors"
                      onClick={() => setShowStoreCategories(!showStoreCategories)}
                      aria-expanded={showStoreCategories}
                    >
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-[#E0A83A]" />
                        <span>{locale === 'es' ? 'Tienda' : 'Store'}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-[#E0A83A] transition-transform ${showStoreCategories ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {showStoreCategories && (
                    <ul className="ml-3 mt-2 space-y-1 border-l-2 border-[#E0A83A]/30 pl-3">
                      <li>
                        <Link
                          href="/products"
                          className="block text-sm text-[#F1E7D6] hover:text-[#E0A83A] py-2 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {locale === 'es' ? 'Todos los productos' : 'All products'}
                        </Link>
                      </li>
                      {categoryList.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/products?category=${category.id}`}
                            className="block text-sm text-[#F1E7D6] hover:text-[#E0A83A] py-2 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {locale === 'es' ? category.name_es : category.name_en}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
