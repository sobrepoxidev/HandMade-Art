// components/layout/Navbar/NavbarClient.tsx
"use client"

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingBag, ChevronDown, Globe, Package } from 'lucide-react';
import { useSupabase } from '@/app/supabase-provider/provider';
import { useCart } from '@/context/CartContext';
import UserDropdown from '@/components/user/UserDropdown';
import SearchBar from '@/components/search/SearchBar';
import { getCategories } from '@/lib/categories';
import CategoryCarousel from '@/components/search/CategoryCarousel';

type NavLink = {
  name: string;
  path: string;
};


export default function NavbarClient({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { supabase, session } = useSupabase();
  const { totalItems } = useCart();

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
  const [categoryList, setCategoryList] = useState<{ id: number, name: string | null, name_es: string | null, name_en: string | null }[]>([]);
  const [showStoreCategories, setShowStoreCategories] = useState(false);

  useEffect(() => {
    if (!shouldShowSearchComponents) return;

    const loadCategories = async () => {
      const categories = await getCategories();
      setCategoryList(categories);
    };

    loadCategories();
  }, [shouldShowSearchComponents]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden w-full flex-col lg:flex" style={{ position: 'static' }}>
        {/* Primary Header Row */}
        <div className="flex w-full items-center justify-between px-4 py-2">
          {/* Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center text-[#2D2D2D] hover:bg-[#F5F1EB] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962]"
              aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg" alt="HandMadeArt Logo" width={40} height={40} className="w-8 md:w-10 object-cover" unoptimized />
              <span className="hidden sm:block text-lg md:text-2xl tracking-wider text-[#2D2D2D]">
                <span className="mr-1 font-light">HANDMADE</span><span className="font-semibold text-[#B55327]">ART</span>
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4">
            <UserDropdown session={currentSession} onLogout={handleLogout} />
            <button
              onClick={handleLanguageChange}
              className="flex items-center space-x-1.5 text-sm text-[#2D2D2D] hover:text-[#C9A962] transition-colors focus:outline-none px-2 py-1 rounded-lg hover:bg-[#F5F1EB]"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{locale === 'es' ? 'ES' : 'EN'}</span>
            </button>
            {shouldShowSearchComponents && (
              <Link href="/cart" className="relative flex items-center text-[#2D2D2D] hover:text-[#C9A962] transition-colors px-2 py-1 rounded-lg hover:bg-[#F5F1EB]">
                <ShoppingBag className="h-5 w-5" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A962] text-xs font-semibold text-[#1A1A1A] ml-1">
                  {totalItems}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Search bar */}
        {shouldShowSearchComponents && (
          <div className="flex w-full items-center justify-center pt-3 px-4">
            <div className="flex w-full max-w-6xl items-center">
              <div
                className="relative w-full flex items-center rounded-lg overflow-visible"
                style={{
                  zIndex: 40,
                  position: 'relative',
                }}
              >
                <SearchBar
                  variant="navbar"
                  initialCategory={locale === 'es' ? 'Todo' : 'All'}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category carousel */}
        {shouldShowSearchComponents && (
          <div className="w-full flex justify-center px-4 pb-2">
            <CategoryCarousel locale={locale} categories={categoryList} className="max-w-6xl" />
          </div>
        )}

        {/* Hidden navigation links */}
        <div className="hidden">
          <button
            onClick={handleLanguageChange}
            className="flex items-center space-x-1 text-sm text-[#2D2D2D] hover:text-[#C9A962] focus:outline-none"
          >
            <Globe className="h-4 w-4" />
            <span>{locale === 'es' ? 'ES' : 'EN'}</span>
          </button>

          {shouldShowSearchComponents && (
            <Link
              href="/cart"
              className="relative flex items-center space-x-0.5 text-sm text-[#2D2D2D] hover:text-[#C9A962]"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">{locale === 'es' ? 'Carrito' : 'Cart'}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A962] text-xs font-medium text-[#1A1A1A]">
                {totalItems}
              </span>
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-8 w-8 items-center justify-center text-[#2D2D2D] hover:bg-[#F5F1EB] rounded focus-visible:outline-none"
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
                  className="block py-1 text-sm text-[#2D2D2D] transition hover:text-[#C9A962]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/catalog"
                className="block py-1 text-sm text-[#2D2D2D] transition hover:text-[#C9A962]"
              >
                {locale === 'es' ? 'Tienda' : 'Store'}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-1 text-sm text-[#2D2D2D] transition hover:text-[#C9A962]"
              >
                {locale === 'es' ? 'Contacto' : 'Contact'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Actions - Right Side */}
      <div className="flex items-center justify-end space-x-0.5 sm:space-x-1 ml-auto lg:hidden" style={{ minWidth: '100px', flexShrink: 0 }}>
        <div className="hidden md:flex items-center">
          <UserDropdown session={currentSession} onLogout={handleLogout} />
        </div>

        <button
          onClick={handleLanguageChange}
          className="flex h-10 items-center space-x-1 rounded-lg px-2 text-sm text-[#2D2D2D] transition hover:bg-[#F5F1EB]"
          aria-label={locale === 'es' ? 'Cambiar idioma' : 'Change language'}
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{locale === 'es' ? 'ES' : 'EN'}</span>
        </button>

        {shouldShowSearchComponents && (
          <Link
            href="/cart"
            className="relative flex h-10 items-center space-x-0.5 rounded-lg px-1 text-sm text-[#2D2D2D] transition hover:bg-[#F5F1EB]"
            aria-label={locale === 'es' ? 'Carrito' : 'Cart'}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden md:inline">{locale === 'es' ? 'Carrito' : 'Cart'}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A962] text-xs font-semibold text-[#1A1A1A]">
              {totalItems}
            </span>
          </Link>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center text-[#2D2D2D] transition hover:bg-[#F5F1EB] rounded-lg focus-visible:outline-none"
          style={{ width: '40px', height: '40px', flexShrink: 0 }}
          aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
          aria-expanded={isMenuOpen}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20px', height: '20px' }}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-57px)] overflow-y-auto bg-white shadow-xl w-full lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-80 lg:max-h-none border-t border-[#E8E4E0]">

          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-3 right-3 p-1.5 text-[#2D2D2D] hover:bg-[#F5F1EB] rounded-lg lg:block hidden z-50 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>

          <nav className="px-4 py-4">
            {/* Cart Link */}
            {shouldShowSearchComponents && (
              <div className="mb-4">
                <Link
                  href="/cart"
                  className="flex items-center space-x-3 text-sm font-medium bg-gradient-to-r from-[#C9A962] to-[#A08848] p-3.5 rounded-xl text-[#1A1A1A] w-full shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{locale === 'es' ? 'Ver carrito' : 'View cart'} ({totalItems})</span>
                </Link>
              </div>
            )}

            {/* Auth Links */}
            <div className="mb-4 p-3 bg-[#F5F1EB] rounded-xl">
              <div className="flex items-center justify-between">
                {currentSession ? (
                  <>
                    <Link
                      href="/account"
                      className="flex items-center space-x-2 text-sm font-medium text-[#2D2D2D] hover:text-[#C9A962] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>{locale === 'es' ? 'Mi cuenta' : 'My account'}</span>
                    </Link>
                    <button
                      onClick={async () => await handleLogout(window.location.href)}
                      className="text-sm text-[#9C9589] hover:text-[#C9A962] transition-colors"
                    >
                      {locale === 'es' ? 'Cerrar sesión' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const fullPath = window.location.pathname + window.location.search;
                        router.push(`/login?returnUrl=${fullPath}`);
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium text-[#2D2D2D] hover:text-[#C9A962] transition-colors"
                    >
                      {locale === 'es' ? 'Iniciar sesión' : 'Login'}
                    </button>
                    <button
                      onClick={() => {
                        const fullPath = window.location.pathname + window.location.search;
                        router.push(`/register?returnUrl=${fullPath}`);
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium text-[#C9A962] hover:text-[#A08848] transition-colors"
                    >
                      {locale === 'es' ? 'Registrarse' : 'Register'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#C9A962]/30 to-transparent"></div>

            {/* Navigation Links */}
            <div>
              <p className="mb-3 font-medium text-sm text-[#9C9589] uppercase tracking-wider">{locale === 'es' ? 'Navegar' : 'Browse'}</p>
              <ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="block text-sm text-[#2D2D2D] hover:text-[#C9A962] hover:bg-[#F5F1EB] px-3 py-2.5 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="block text-sm text-[#2D2D2D] hover:text-[#C9A962] hover:bg-[#F5F1EB] px-3 py-2.5 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {locale === 'es' ? 'Contacto' : 'Contact'}
                  </Link>
                </li>

                {/* Store with categories */}
                <li className="mt-3">
                  <div className="mb-1">
                    <button
                      className="flex items-center justify-between w-full py-2.5 px-3 bg-[#2D2D2D] text-[#F5F1EB] rounded-xl font-medium text-sm hover:bg-[#3A3A3A] transition-colors"
                      onClick={() => setShowStoreCategories(!showStoreCategories)}
                      aria-expanded={showStoreCategories}
                    >
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-[#C9A962]" />
                        <span>{locale === 'es' ? 'Tienda' : 'Store'}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-[#C9A962] transition-transform ${showStoreCategories ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {showStoreCategories && (
                    <ul className="ml-3 mt-2 space-y-1 border-l-2 border-[#C9A962]/30 pl-3">
                      <li>
                        <Link
                          href="/products"
                          className="block text-sm text-[#2D2D2D] hover:text-[#C9A962] py-2 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {locale === 'es' ? 'Todos los productos' : 'All products'}
                        </Link>
                      </li>
                      {categoryList.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/products?category=${category.id}`}
                            className="block text-sm text-[#2D2D2D] hover:text-[#C9A962] py-2 transition-colors"
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
