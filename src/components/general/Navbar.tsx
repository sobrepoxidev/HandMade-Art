// components/layout/Navbar/index.tsx
// Componente principal SSR
import { Link } from '@/i18n/navigation';
import NavbarClient from './NavbarClient';
import SearchBar from '../search/SearchBar';
import CategoryCarousel from '../search/CategoryCarousel';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { HOME_CATEGORY_COLUMNS, type HomeCategory } from '@/lib/home/types';
import { Globe, Menu, Package } from 'lucide-react';
import { getCategoryById, PRIMARY_NAV_CATEGORY_IDS } from '@/lib/content/categories';

export default async function Navbar({ locale }: { locale: string }) {
  // Obtener la ruta actual para determinar si mostrar componentes de búsqueda
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const shouldShowSearchComponents = !pathname.includes('/admin') && !pathname.includes('/catalog');
  const localeKey = locale === 'es' ? 'es' : 'en';

  let categories: HomeCategory[] = [];
  if (shouldShowSearchComponents) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('categories')
      .select(HOME_CATEGORY_COLUMNS)
      .order(locale === 'es' ? 'name_es' : 'name_en');

    categories = data || [];
  }

  const primaryNav = PRIMARY_NAV_CATEGORY_IDS
    .map((id) => getCategoryById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <header className="relative z-40 max-w-[100vw] bg-[#161210] border-b border-[#3A2E24]">
      {/* Announcement strip */}
      <div className="hidden md:flex items-center justify-center gap-9 h-[38px] border-b border-[#3A2E24] bg-[#1E1813] px-4 text-[12px] font-medium tracking-[0.02em] text-[#C9BBA5]">
        <span className="text-[#E0A83A]">
          {locale === 'es' ? 'Cada compra financia formación en oficios' : 'Every purchase funds trade training'}
        </span>
        <span className="text-[#3A2E24]">|</span>
        <span>{locale === 'es' ? 'Envíos a todo Costa Rica y al exterior' : 'Shipping across Costa Rica and abroad'}</span>
        <span className="text-[#3A2E24]">|</span>
        <span>USD · CRC · SINPE</span>
      </div>

      {/* Top Bar */}
      <div className="container mx-auto flex max-w-full items-center justify-between px-2 md:px-4 py-1 bg-[#161210]">
        {/* Logo - SSR (Left) */}

          <div className="min-w-0 lg:hidden bg-[#161210]">
          {/* The accessible name must contain the visible text ("Handmade Art"),
              otherwise voice-control users saying what they read cannot activate
              it. "HandMadeArt Home" failed that check. */}
          <Link
            href="/"
            className="flex min-w-0 items-center focus-visible:outline-[#E0A83A] focus-visible:outline-offset-2"
            aria-label={locale === 'es' ? 'Handmade Art, ir al inicio' : 'Handmade Art, go to home'}
          >
            <div className="relative flex min-w-0 items-center gap-2.5 overflow-hidden">
              <span className="font-serif flex h-9 w-9 shrink-0 items-center justify-center bg-[#E0A83A] text-[15px] leading-none text-[#161210] sm:h-10 sm:w-10 sm:text-base">
                HM
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="truncate whitespace-nowrap font-display text-lg tracking-normal text-[#F1E7D6] sm:text-xl">
                  Handmade Art
                </span>
                <span className="hidden text-[9px] uppercase tracking-[0.22em] text-[#8C7F6E] sm:block">
                  {locale === 'es' ? 'Taller · San Ramón, Costa Rica' : 'Workshop · San Ramón, Costa Rica'}
                </span>
              </span>
            </div>
          </Link>
          </div>


        {/* Client-side interactivity (Center and Right) */}
        <div className="relative flex min-w-0 max-w-[calc(100vw-52px)] flex-grow items-center justify-end">
          {/* Mobile actions rendered on the server so cart/menu are visible before hydration. */}
          <div className="fixed right-2 top-1 z-[80] flex shrink-0 items-center gap-1 bg-[#161210] lg:hidden">
            <details className="group">
              <summary
                className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-sm text-[#F1E7D6] transition-colors hover:bg-[#1E1813] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A83A] [&::-webkit-details-marker]:hidden"
                aria-label={locale === 'es' ? 'Abrir menú' : 'Open menu'}
              >
                <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </summary>

              <nav
                className="fixed inset-x-0 top-12 max-h-[calc(100vh-3rem)] overflow-y-auto border-y border-[#3A2E24] bg-[#161210] px-4 py-4 shadow-[0_18px_50px_rgba(15,12,10,0.55)]"
                aria-label={locale === 'es' ? 'Menú móvil' : 'Mobile menu'}
              >
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {shouldShowSearchComponents && (
                    <Link
                      href="/products"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#E0A83A] px-4 py-3 text-sm font-bold text-[#161210] transition-colors hover:bg-[#F3C56B]"
                    >
                      <Package className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                      {locale === 'es' ? 'Cotizar' : 'Get a quote'}
                    </Link>
                  )}
                  <Link
                    href={locale === 'es' ? '/en' : '/es'}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-[#3A2E24] px-4 py-3 text-sm font-semibold text-[#F1E7D6] transition-colors hover:bg-[#1E1813]"
                  >
                    <Globe className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                    {locale === 'es' ? 'EN' : 'ES'}
                  </Link>
                </div>

                <div className="mb-4 rounded-sm border border-[#3A2E24] bg-[#1E1813] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link href="/login" className="text-sm font-medium text-[#F1E7D6]">
                      {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
                    </Link>
                    <Link href="/register" className="text-sm font-medium text-[#E0A83A]">
                      {locale === 'es' ? 'Crear cuenta' : 'Create account'}
                    </Link>
                  </div>
                </div>

                <div className="my-4 h-px bg-[#E0A83A]/25" />

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#8C7F6E]">
                  {locale === 'es' ? 'Navegar' : 'Browse'}
                </p>
                <ul className="space-y-1">
                  {primaryNav.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/c/${cat.slugs[localeKey]}`}
                        className="block rounded-sm px-3 py-2.5 text-sm text-[#F1E7D6] transition-colors hover:bg-[#1E1813] hover:text-[#F3C56B]"
                      >
                        {cat.dbName[localeKey]}
                      </Link>
                    </li>
                  ))}
                  {[
                    { name: locale === 'es' ? 'Guías' : 'Guides', path: locale === 'es' ? '/guias' : '/guides' },
                    { name: locale === 'es' ? 'El taller' : 'The workshop', path: '/reinsercion-sociolaboral' },
                    { name: locale === 'es' ? 'Envíos' : 'Shipping', path: '/shipping' },
                    { name: locale === 'es' ? 'Contacto' : 'Contact', path: '/contact' },
                  ].map((link) => (
                    <li key={link.path}>
                      <Link href={link.path} className="block rounded-sm px-3 py-2.5 text-sm text-[#F1E7D6] transition-colors hover:bg-[#1E1813] hover:text-[#F3C56B]">
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  {shouldShowSearchComponents && (
                    <li className="mt-3">
                      <details>
                        <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-sm bg-[#1E1813] px-3 py-2.5 text-sm font-medium text-[#F1E7D6] transition-colors hover:bg-[#2A2119] [&::-webkit-details-marker]:hidden">
                          <span className="inline-flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#E0A83A]" strokeWidth={1.8} aria-hidden />
                            {locale === 'es' ? 'Tienda' : 'Store'}
                          </span>
                        </summary>
                        <ul className="ml-3 mt-2 space-y-1 border-l-2 border-[#E0A83A]/30 pl-3">
                          <li>
                            <Link href="/products" className="block py-2 text-sm text-[#F1E7D6] hover:text-[#F3C56B]">
                              {locale === 'es' ? 'Todos los productos' : 'All products'}
                            </Link>
                          </li>
                          {categories.map((category) => (
                            <li key={category.id}>
                              <Link href={`/products?category=${category.id}`} className="block py-2 text-sm text-[#F1E7D6] hover:text-[#F3C56B]">
                                {(locale === 'es' ? category.name_es : category.name_en) || category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  )}
                </ul>
              </nav>
            </details>
          </div>

          <NavbarClient
            locale={locale}
            initialCategories={categories}
          />
        </div>
      </div>

        {/* Mobile Search Bar - Visible by default on mobile */}
        {shouldShowSearchComponents && (
          <div className="lg:hidden bg-[#161210] px-0 my-2 border-t border-[#3A2E24]/50">
            <SearchBar
              variant="mobile"
              initialCategory={locale === 'es' ? 'Todo' : 'All'}
              initialCategories={categories}
              locale={locale}
              className="w-full px-2"
            />
            <CategoryCarousel locale={locale} categories={categories} className="mt-1" />
          </div>
        )}
    </header>
  );
}
