// components/layout/Navbar/index.tsx
// Componente principal SSR
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import NavbarClient from './NavbarClient';
import SearchBar from '../search/SearchBar';
import CategoryCarousel from '../search/CategoryCarousel';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { HOME_CATEGORY_COLUMNS, type HomeCategory } from '@/lib/home/types';
import { Globe, Menu, Package, ShoppingBag } from 'lucide-react';

export default async function Navbar({ locale }: { locale: string }) {
  // Obtener la ruta actual para determinar si mostrar componentes de búsqueda
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const shouldShowSearchComponents = !pathname.includes('/admin') && !pathname.includes('/catalog');

  let categories: HomeCategory[] = [];
  if (shouldShowSearchComponents) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('categories')
      .select(HOME_CATEGORY_COLUMNS)
      .order(locale === 'es' ? 'name_es' : 'name_en');

    categories = data || [];
  }

  return (
    <header className="relative z-40 max-w-[100vw] bg-[#FAF6EF] border-b border-[#E8E4E0] ">
      {/* Top Bar */}
      <div className="container mx-auto flex max-w-full items-center justify-between px-2 md:px-4 py-1 bg-[#FAF6EF]">
        {/* Logo - SSR (Left) */}

          <div className="min-w-0 lg:hidden bg-[#FAF6EF]">
          <Link href="/" className="flex min-w-0 items-center focus-visible:outline-[#C9A962] focus-visible:outline-offset-2" aria-label="HandMadeArt Home">
            <div className="relative flex min-w-0 items-center gap-2 overflow-hidden">

              <div className="lg:hidden">
              <Image
                src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
                alt="Hand Made Art Logo"
                width={40}
                height={40}
                className="w-9 sm:w-10 md:w-[52px] object-cover"
                priority
                unoptimized
              />
              </div>


              <span className="mr-1 hidden truncate whitespace-nowrap text-base tracking-normal text-[#2D2D2D] sm:block sm:text-2xl md:text-3xl">
                <span className="mr-1 font-light">HANDMADE</span>
                <span className="font-semibold text-[#B55327]">ART</span>
              </span>
            </div>
          </Link>
          </div>


        {/* Client-side interactivity (Center and Right) */}
        <div className="relative flex min-w-0 max-w-[calc(100vw-52px)] flex-grow items-center justify-end">
          {/* Mobile actions rendered on the server so cart/menu are visible before hydration. */}
          <div className="fixed right-2 top-1 z-[80] flex shrink-0 items-center gap-1 bg-[#FAF6EF] lg:hidden">
            <details className="group">
              <summary
                className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-sm text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848] [&::-webkit-details-marker]:hidden"
                aria-label={locale === 'es' ? 'Abrir menú' : 'Open menu'}
              >
                <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
              </summary>

              <nav
                className="fixed inset-x-0 top-12 max-h-[calc(100vh-3rem)] overflow-y-auto border-y border-[#E8E4E0] bg-[#FAF6EF] px-4 py-4 shadow-[0_18px_50px_rgba(92,69,48,0.18)]"
                aria-label={locale === 'es' ? 'Menú móvil' : 'Mobile menu'}
              >
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {shouldShowSearchComponents && (
                    <Link
                      href="/cart"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#C9A962] px-4 py-3 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
                    >
                      <ShoppingBag className="h-5 w-5" strokeWidth={2} aria-hidden />
                      {locale === 'es' ? 'Carrito' : 'Cart'}
                    </Link>
                  )}
                  <Link
                    href={locale === 'es' ? '/en' : '/es'}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-4 py-3 text-sm font-semibold text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB]"
                  >
                    <Globe className="h-4 w-4" strokeWidth={2} aria-hidden />
                    {locale === 'es' ? 'EN' : 'ES'}
                  </Link>
                </div>

                <div className="mb-4 rounded-sm border border-[#E8E4E0] bg-[#F5F1EB] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link href="/login" className="text-sm font-medium text-[#2D2D2D]">
                      {locale === 'es' ? 'Iniciar sesión' : 'Sign in'}
                    </Link>
                    <Link href="/register" className="text-sm font-medium text-[#A08848]">
                      {locale === 'es' ? 'Crear cuenta' : 'Create account'}
                    </Link>
                  </div>
                </div>

                <div className="my-4 h-px bg-[#C9A962]/30" />

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                  {locale === 'es' ? 'Navegar' : 'Browse'}
                </p>
                <ul className="space-y-1">
                  {[
                    { name: locale === 'es' ? 'Inicio' : 'Home', path: '/' },
                    { name: locale === 'es' ? 'Acerca de' : 'About', path: '/about' },
                    { name: locale === 'es' ? 'Reinserción Sociolaboral' : 'Social Reintegration', path: '/reinsercion-sociolaboral' },
                    { name: locale === 'es' ? 'Envíos' : 'Shipping', path: '/shipping' },
                    { name: locale === 'es' ? 'Contacto' : 'Contact', path: '/contact' },
                  ].map((link) => (
                    <li key={link.path}>
                      <Link href={link.path} className="block rounded-sm px-3 py-2.5 text-sm text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB] hover:text-[#A08848]">
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  {shouldShowSearchComponents && (
                    <li className="mt-3">
                      <details>
                        <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-sm bg-[#2D2D2D] px-3 py-2.5 text-sm font-medium text-[#F5F1EB] transition-colors hover:bg-[#3A3A3A] [&::-webkit-details-marker]:hidden">
                          <span className="inline-flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#C9A962]" strokeWidth={2} aria-hidden />
                            {locale === 'es' ? 'Tienda' : 'Store'}
                          </span>
                        </summary>
                        <ul className="ml-3 mt-2 space-y-1 border-l-2 border-[#C9A962]/30 pl-3">
                          <li>
                            <Link href="/products" className="block py-2 text-sm text-[#2D2D2D] hover:text-[#A08848]">
                              {locale === 'es' ? 'Todos los productos' : 'All products'}
                            </Link>
                          </li>
                          {categories.map((category) => (
                            <li key={category.id}>
                              <Link href={`/products?category=${category.id}`} className="block py-2 text-sm text-[#2D2D2D] hover:text-[#A08848]">
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

            {shouldShowSearchComponents && (
              <Link
                href="/cart"
                className="grid h-11 w-11 place-items-center rounded-sm text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                aria-label={locale === 'es' ? 'Ver carrito' : 'View cart'}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={2} aria-hidden />
              </Link>
            )}
          </div>

          <NavbarClient
            locale={locale}
            initialCategories={categories}
          />
        </div>
      </div>

        {/* Mobile Search Bar - Visible by default on mobile */}
        {shouldShowSearchComponents && (
          <div className="lg:hidden bg-[#FAF6EF] px-0 my-2 border-t border-[#E8E4E0]/50">
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
