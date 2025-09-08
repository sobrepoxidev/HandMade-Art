// components/layout/Navbar/NavbarClient.tsx
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingBag, ChevronDown, Globe, Package } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
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


export default function NavbarClient({ locale, session: initialSession }: { locale: string; session: Session | null }) {
  //const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();
  const { supabase } = useSupabase();
  const { totalItems } = useCart();

  // Determinar si mostrar componentes de búsqueda (ocultar en /admin y /catalog)
  // Considerar rutas con locale: /es/admin, /en/admin, /es/catalog, /en/catalog
  const shouldShowSearchComponents = !pathname.includes('/admin') && !pathname.includes('/catalog');

  // Estados para la UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<{ id: number, name_es: string, name_en: string }[]>([]);
  const [showStoreCategories, setShowStoreCategories] = useState(false);
  // Estado local para la sesión que escuchará cambios
  const [session, setSession] = useState<Session | null>(initialSession);



  // Cargar categorías de la base de datos solo si se van a mostrar
  useEffect(() => {
    if (!shouldShowSearchComponents) return;
    
    const loadCategories = async () => {
      const categories = await getCategories();
      setCategoryList(categories);
    };

    loadCategories();
  }, [shouldShowSearchComponents]);



  // Suscripción a cambios en la sesión
  useEffect(() => {
    // Configurar suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Actualizar la sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getInitialSession();

    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, session]);

  // Cerrar menú móvil al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);


  // Definir los enlaces de navegación
  const navigationLinks: NavLink[] = [
    { name: locale === 'es' ? 'Inicio' : 'Home', path: '/' },
    { name: locale === 'es' ? 'Acerca de' : 'About', path: '/about' },
    { name: locale === 'es' ? 'Impacto' : 'Impact', path: '/impact' },
    { name: locale === 'es' ? 'Envíos' : 'Shipping', path: '/shipping' },
    // Store se trata de manera especial ahora, con categorías desplegables
  ]

  // Logout function
  const handleLogout = async (currentUrl: string) => {
    try {
      await supabase.auth.signOut();
      // Redirect to home or login page
      window.location.href = currentUrl;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Language change function optimized for mobile
  const handleLanguageChange = () => {
    const targetLocale = locale === 'es' ? 'en' : 'es';
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    // Remove current locale from path if it exists
    const pathWithoutLocale = currentPath.replace(/^\/(es|en)/, '');
    
    // Construct new URL with target locale
    const newUrl = `/${targetLocale}${pathWithoutLocale}${currentSearch}`;
    
    // Use window.location.href for immediate navigation (works better on mobile)
    window.location.href = newUrl;
  };

  return (
    <>
      {/* Desktop Navigation - Amazon Style */}
      <div className="hidden w-full flex-col lg:flex" style={{ position: 'static' }}>
        {/* Primary Header Row */}
        <div className="flex w-full items-center justify-between px-4 py-2">
          {/* Left */}
          <div className="flex items-center gap-2">
            {/* Hamburger button visible on desktop too */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-100 rounded focus-visible:outline-none"
              aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg" alt="HandMadeArt Logo" width={40} height={40} className="w-8 md:w-10 object-cover" unoptimized />
              <span className="hidden sm:block text-lg md:text-2xl tracking-wider text-gray-800">
                <span className="mr-1">HANDMADE</span><span className="font-bold text-[#B55327]">ART</span>
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4">
            <UserDropdown session={session} onLogout={handleLogout} />
            {/* Language selector */}
            <button
              onClick={handleLanguageChange}
              className="flex items-center space-x-1 text-sm text-gray-700 hover:text-teal-700 focus:outline-none"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === 'es' ? 'ES' : 'EN'}</span>
            </button>
            {/* Cart */}
            {shouldShowSearchComponents && (
              <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-teal-700">
                <ShoppingBag className="h-5 w-5" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white ml-0.5">
                  {totalItems}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Top Row: Search bar with filter dropdown */}
        {shouldShowSearchComponents && (
          <div className="flex w-full items-center justify-center pt-3 px-4">
            <div className="flex w-full max-w-6xl items-center">
              <div
                className="relative w-full flex items-center rounded-md border border-gray-300 bg-white overflow-visible"
                style={{
                  zIndex: 40, // Lower z-index to stay below mobile menu
                  position: 'relative',
                }}
              >
                {/* Integrated SearchBar component with higher z-index to ensure dropdowns appear */}
                <SearchBar
                  variant="navbar"
                  initialCategory={locale === 'es' ? 'Todo' : 'All'}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category carousel - horizontally scrollable */}
        {/* reservar espacio mientras se carga */}
        {shouldShowSearchComponents && (
          <div className="w-full flex justify-center h-8"><CategoryCarousel locale={locale} categories={categoryList} className="mt-1 max-w-6xl" /></div>
        )}

          {/* Desktop action icons */}
          <div className="hidden">
            {/* Language selector */}
            <button
              onClick={handleLanguageChange}
              className="flex items-center space-x-1 text-sm text-gray-700 hover:text-teal-700 focus:outline-none"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === 'es' ? 'ES' : 'EN'}</span>
            </button>

            {/* Cart */}
            {shouldShowSearchComponents && (
              <Link
                href="/cart"
                className="relative flex items-center space-x-0.5 text-sm text-gray-700 hover:text-teal-700"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">{locale === 'es' ? 'Carrito' : 'Cart'}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white">
                  {totalItems}
                </span>
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-100 rounded focus-visible:outline-none"
              aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Bottom Row: Navigation links */}
        <div className="hidden">
          <ul className="flex items-center gap-x-6">
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="block py-1 text-sm text-gray-700 transition hover:text-teal-700"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/catalog"
                className="block py-1 text-sm text-gray-700 transition hover:text-teal-700"
              >
                {locale === 'es' ? 'Tienda' : 'Store'}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-1 text-sm text-gray-700 transition hover:text-teal-700"
              >
                {locale === 'es' ? 'Contacto' : 'Contact'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Actions - Right Side */}
      <div className="flex items-center justify-end space-x-0.5 sm:space-x-1 ml-auto lg:hidden" style={{ minWidth: '100px', flexShrink: 0 }}>
        {/* User Dropdown - Desktop */}
        <div className="hidden md:flex items-center">
          <UserDropdown session={session} onLogout={handleLogout} />
        </div>

        {/* Language selector - Implementado con next-intl */}
        <button
          onClick={handleLanguageChange}
          className="flex h-10 items-center space-x-1 rounded-md px-2 text-sm text-gray-700 transition hover:bg-gray-100"
          aria-label={locale === 'es' ? 'Cambiar idioma' : 'Change language'}
        >
          <Globe className="h-4 w-4" />
          <span>{locale === 'es' ? 'ES' : 'EN'}</span>
        </button>

        {/* Cart */}
        {shouldShowSearchComponents && (
          <Link
            href="/cart"
            className="relative flex h-10 items-center space-x-0.5 rounded-md px-0.5 text-sm text-gray-700 transition hover:bg-gray-100"
            aria-label={locale === 'es' ? 'Carrito' : 'Cart'}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden md:inline">{locale === 'es' ? 'Carrito' : 'Cart'}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white">
              {totalItems}
            </span>
          </Link>
        )}
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none"
          style={{ width: '40px', height: '40px', flexShrink: 0 }}
          aria-label={isMenuOpen ? (locale === 'es' ? 'Cerrar menú' : 'Close menu') : (locale === 'es' ? 'Abrir menú' : 'Open menu')}
          aria-expanded={isMenuOpen}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20px', height: '20px' }}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </div>
        </button>

      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-57px)] overflow-y-auto bg-white shadow-lg w-full lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-72 lg:max-h-none">

          <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-2 right-2 p-1 text-gray-700 hover:bg-gray-100 rounded lg:block hidden z-50"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>

            <nav className="px-4 py-3">
            {/* Mobile Search - Amazon Style */}


            {/* Cart Link - Movido arriba */}
            {shouldShowSearchComponents && (
              <div className="mb-3">
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-sm font-medium bg-gray-50 p-3 rounded-md text-gray-900 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{locale === 'es' ? 'Ver carrito' : 'View cart'} ({totalItems})</span>
                </Link>
              </div>
            )}

            {/* Mobile Auth Links */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                {session ? (
                  <>
                    <Link
                      href="/account"
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>{locale === 'es' ? 'Mi cuenta' : 'My account'}</span>
                    </Link>
                    <button
                      onClick={async () => await handleLogout(window.location.href)}
                      className="text-sm text-gray-700"
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
                      className="text-sm text-gray-700"
                    >
                      {locale === 'es' ? 'Iniciar sesión' : 'Login'}
                    </button>
                    <button
                      onClick={() => {
                        const fullPath = window.location.pathname + window.location.search;
                        router.push(`/register?returnUrl=${fullPath}`);
                        setIsMenuOpen(false);
                      }}
                      className="text-sm text-gray-700"
                    >
                      {locale === 'es' ? 'Registrarse' : 'Register'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="my-3 h-px bg-gray-100"></div>

            {/* Mobile Navigation Links - Amazon Style */}
            <div>
              <p className="mb-2 font-semibold text-sm text-gray-800">{locale === 'es' ? 'Navegar por:' : 'Browse by:' }</p>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="block text-sm text-gray-700 hover:text-teal-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="block text-sm text-gray-700 hover:text-teal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {locale === 'es' ? 'Contacto' : 'Contact'}
                  </Link>
                </li>
                {/* Store con categorías desplegables */}
                <li className="mb-2">
                  <div className="mb-1">
                    <button
                      className="flex items-center justify-between w-full py-2 px-3 bg-teal-50 text-teal-700 rounded-md font-medium text-sm hover:bg-teal-100 transition-colors"
                      onClick={() => setShowStoreCategories(!showStoreCategories)}
                      aria-expanded={showStoreCategories}
                    >
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        <span>{locale === 'es' ? 'Tienda' : 'Store'}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showStoreCategories ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                  </div>


                  {/* Lista de categorías */}
                  {showStoreCategories && (
                    <ul className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                      <li>
                        <Link
                          href="/products"
                          className="block text-sm text-gray-700 hover:text-teal-700 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {locale === 'es' ? 'Todos los productos' : 'All products'}
                        </Link>
                      </li>
                      {categoryList.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/products?category=${category.id}`}
                            className="block text-sm text-gray-700 hover:text-teal-700 py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {locale === 'es' ? category.name_es : category.name_en  }
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>



                {/* Enlace a carrito eliminado - ya movido arriba */}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}