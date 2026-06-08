'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ChevronRight, Trash2, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { useSupabase } from '@/app/supabase-provider/provider';
import { getLocalViewedHistory, removeFromHistory, clearViewedHistory, ViewedProduct, syncViewedHistoryWithServer } from '@/lib/viewedHistory';
import { Session } from '@supabase/supabase-js';
import { useLocale } from "next-intl";
import { formatUSD } from '@/lib/formatCurrency';

export default function ViewedHistoryPage() {
  const [history, setHistory] = useState<ViewedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const locale = useLocale();

  // Cargar el historial y la sesión al montar el componente
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      // Obtener el historial local
      const viewedHistory = getLocalViewedHistory();
      setHistory(viewedHistory);

      // Verificar si el usuario está autenticado
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      setIsLoading(false);
    }

    loadData();
  }, [supabase]);

  // Sincronizar historial con el servidor si el usuario ha iniciado sesión
  useEffect(() => {
    if (session) {
      syncViewedHistoryWithServer();
    }
  }, [session]);

  // Función para eliminar un producto del historial
  const handleRemove = (productId: number) => {
    removeFromHistory(productId);
    setHistory(prev => prev.filter(item => item.id !== productId));
  };

  // Función para limpiar todo el historial
  const handleClearAll = () => {
    clearViewedHistory();
    setHistory([]);
  };

  // Formatear fecha
  const formatDate = (date: Date): string => {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-screen-xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-[#6B6459]">
        <Link href="/" locale={locale} className="transition-colors hover:text-[#A08848]">
          {locale == 'es' ? 'Inicio' : 'Home'}
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" strokeWidth={1.75} aria-hidden />
        <span className="font-medium text-[#2D2D2D]">
          {locale == 'es' ? 'Historial de productos vistos' : 'Viewed history'}
        </span>
      </div>

      {/* Encabezado */}
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
          {locale == 'es' ? 'Tu recorrido' : 'Your path'}
        </p>
        <h1 className="font-display text-3xl font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D] sm:text-4xl">
          {locale == 'es' ? 'Productos vistos recientemente' : 'Recently viewed products'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#4A4A4A]">
          {locale == 'es'
            ? 'Recupera las piezas que estabas comparando y vuelve al catálogo sin perder el hilo.'
            : 'Recover the pieces you were comparing and return to the catalog without losing your place.'}
        </p>
      </header>

      {/* Banner para usuarios no autenticados */}
      {!session && (
        <div className="mb-8 flex flex-col gap-4 border border-[#E8E4E0] bg-[#F5F1EB] p-4 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] sm:flex-row sm:items-center">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#A08848]" strokeWidth={1.75} aria-hidden />
          <div className="flex-grow">
            <p className="text-sm leading-relaxed text-[#4A4A4A]">
              <strong className="text-[#2D2D2D]">{locale == 'es' ? '¿Quieres guardar tu historial?' : 'Want to keep your history?'}</strong>{' '}
              {locale == 'es'
                ? 'Inicia sesión para mantener tus piezas vistas en todos tus dispositivos.'
                : 'Sign in to keep your viewed pieces across devices.'}
            </p>
          </div>
          <Link 
            href="/login?redirect_to=/viewed-history" 
            locale={locale}
            className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#2D2D2D] px-4 py-2 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
          >
            {locale == 'es' ? 'Iniciar sesión' : 'Sign in'}
          </Link>
        </div>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#E8E4E0] border-t-[#A08848]"></div>
          <span className="sr-only">{locale == 'es' ? 'Cargando historial' : 'Loading history'}</span>
        </div>
      ) : history.length > 0 ? (
        <>
          {/* Acciones */}
          <div className="mb-4 flex justify-end">
            <button 
              onClick={handleClearAll}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-[#C44536]/35 px-4 py-2 text-sm font-semibold text-[#9F2D24] transition-colors hover:bg-[#C44536]/10"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {locale == 'es' ? 'Limpiar historial' : 'Clear history'}
            </button>
          </div>

          {/* Lista de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((product) => {
              const productName = locale == 'es' ? product.name_es : product.name_en;
              const productHref = `/products?id=${product.id}`;

              return (
              <article key={`${product.id}-${product.viewedAt.toString()}`} className="group relative overflow-hidden border border-[#E8E4E0] bg-[#F5F1EB] transition-colors hover:border-[#C9A962]/55">
                {/* Botón eliminar */}
                <button 
                  onClick={() => handleRemove(product.id)}
                  className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-[#E8E4E0] bg-[#FFFDF9] text-[#6B6459] opacity-100 transition-colors hover:border-[#C44536]/45 hover:text-[#9F2D24] sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={locale == 'es' ? 'Eliminar del historial' : 'Remove from history'}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>

                <Link href={productHref} locale={locale} className="block">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#FAF6EF] p-5">
                    <Image
                      src={product.imageUrl}
                      alt={productName || ''}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] px-2 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#6B6459]">
                      {product.category || 'Artesanía'}
                    </span>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="mb-3">
                    <h2 className="mb-2 line-clamp-2 font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
                      {productName}
                    </h2>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[#A08848]">
                        {product.dolar_price ? `${formatUSD(product.dolar_price)}` : locale == 'es' ? 'Consultar' : 'Ask for price'}
                      </p>
                      
                      <div className="flex items-center text-right text-xs text-[#6B6459]">
                        <Clock className="mr-1 h-3 w-3" strokeWidth={1.75} aria-hidden />
                        <span title={formatDate(product.viewedAt)}>
                          {formatDate(product.viewedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={productHref}
                    locale={locale}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-sm border border-[#A08848] px-4 py-2 text-sm font-semibold text-[#A08848] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
                  >
                    {locale == 'es' ? 'Ver producto' : 'View product'}
                  </Link>
                </div>
              </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="border border-[#E8E4E0] bg-[#F5F1EB] px-5 py-12 text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#C9A962]/18 text-[#A08848]">
            <ShoppingBag className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-2xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
            {locale == 'es' ? 'No hay productos en tu historial' : 'No products in your history'}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
            {locale == 'es'
              ? 'Explora la tienda y vuelve aquí para comparar las piezas que viste.'
              : 'Explore the store and come back here to compare the pieces you viewed.'}
          </p>
          <Link 
            href="/products" 
            locale={locale}
            className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[#2D2D2D] px-6 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
          >
            {locale == 'es' ? 'Explorar productos' : 'Explore products'}
          </Link>
        </div>
      )}
      </div>
    </main>
  );
}
