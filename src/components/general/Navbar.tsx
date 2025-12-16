// components/layout/Navbar/index.tsx
// Componente principal SSR
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import NavbarClient from './NavbarClient';
import SearchBar from '../search/SearchBar';
import CategoryCarousel from '../search/CategoryCarousel';
import { headers } from 'next/headers';

export default async function Navbar({ locale }: { locale: string }) {
  // Obtener la ruta actual para determinar si mostrar componentes de búsqueda
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const shouldShowSearchComponents = !pathname.includes('/admin') && !pathname.includes('/catalog');


  return (
    <header className="relative z-40 bg-white border-b border-[#E8E4E0] ">
      {/* Top Bar */}
      <div className="container mx-auto flex items-center justify-between px-2 md:px-4 py-1 bg-white">
        {/* Logo - SSR (Left) */}

          <div className="lg:hidden bg-white">
          <Link href="/" className="flex items-center focus-visible:outline-[#C9A962] focus-visible:outline-offset-2" aria-label="HandMadeArt Home">
            <div className="relative overflow-hidden flex items-center gap-3">

              <div className="lg:hidden">
              <Image
                src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
                alt="Hand Made Art Logo"
                width={65}
                height={0}
                className="w-[40px] md:w-[65px] object-cover"
                priority
                unoptimized
              />
              </div>
              <div className="hidden lg:block">
              <Image
                src="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
                alt="Hand Made Art Logo"
                width={65}
                height={0}
                className="w-[40px] md:w-[65px] object-cover"
                priority
                unoptimized
              />
              </div>


              <h1 className="text-lg sm:text-3xl mr-1 tracking-wider text-[#2D2D2D]">
                <span className="mr-1 font-light">HANDMADE</span>
                <span className="font-semibold text-[#B55327]">ART</span>
              </h1>
            </div>
          </Link>
          </div>


        {/* Client-side interactivity (Center and Right) */}
        <div className="flex-grow flex items-center justify-end">
          <NavbarClient
            locale={locale}
          />
        </div>
      </div>

        {/* Mobile Search Bar - Visible by default on mobile */}
        {shouldShowSearchComponents && (
          <div className="lg:hidden bg-white px-0 my-3 border-t border-[#E8E4E0]/50">
            <SearchBar
              variant="mobile"
              initialCategory={locale === 'es' ? 'Todo' : 'All'}
              locale={locale}
              className="w-full px-2"
            />
            <CategoryCarousel locale={locale} className="mt-1" />
          </div>
        )}
    </header>
  );
}
