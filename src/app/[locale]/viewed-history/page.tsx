'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ChevronRight, Trash2, Clock, AlertCircle } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:text-teal-600">{locale == 'es' ? 'Inicio' : 'Home'}</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-gray-900">{locale == 'es' ? 'Historial de productos vistos' : 'Viewed history'}</span>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {locale == 'es' ? 'Productos vistos recientemente' : 'Recently viewed products'}
        </h1>
        <p className="text-gray-600">
          {locale == 'es' ? 'Aquí puedes ver los últimos productos que has visitado.' : 'Here you can see the last products you have visited.'}
        </p>
      </div>

      {/* Banner para usuarios no autenticados */}
      {!session && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
          <div className="flex-grow">
            <p className="text-blue-700 text-sm">
              <strong>{locale == 'es' ? '¿Quieres guardar tu historial?' : 'Do you want to save your history?'}</strong> {locale == 'es' ? 'Inicia sesión para mantener tu historial de productos vistos en todos tus dispositivos.' : 'Sign in to keep your viewed product history on all your devices.'}
            </p>
          </div>
          <Link 
            href="/login?redirect_to=/viewed-history" 
            className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 whitespace-nowrap flex-shrink-0"
          >
            {locale == 'es' ? 'Iniciar sesión' : 'Sign in'}
          </Link>
        </div>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : history.length > 0 ? (
        <>
          {/* Acciones */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleClearAll}
              className="flex items-center text-sm text-red-600 hover:text-red-800 transition"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {locale == 'es' ? 'Limpiar historial' : 'Clear history'}
            </button>
          </div>

          {/* Lista de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((product) => (
              <div key={`${product.id}-${product.viewedAt.toString()}`} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition relative group">
                {/* Botón eliminar */}
                <button 
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm hover:bg-gray-100"
                  aria-label="Eliminar del historial"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>

                <Link href={`/products?id=${product.id}`} className="block">
                  <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    <Image
                      src={product.imageUrl}
                      alt={locale == 'es' ? product.name_es : product.name_en || ''}
                      width={110}
                      height={0}
                      className="object-contain max-h-full w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full border border-teal-100">
                      {product.category || 'Artesanía'}
                    </span>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{locale == 'es' ? product.name_es : product.name_en}</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-teal-700">
                        {product.dolar_price ? `${formatUSD(product.dolar_price)}` : 'Consultar'}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span title={formatDate(product.viewedAt)}>
                          {formatDate(product.viewedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={`/products?id=${product.id}`}
                    className="block w-full text-center py-2 border border-teal-600 text-teal-700 rounded-md hover:bg-teal-50 transition text-sm"
                  >
                    {locale == 'es' ? 'Ver producto' : 'View product'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <div className="mb-4">
            <Image 
              src="/empty-history.svg" 
              alt="Historial vacío" 
              width={180} 
              height={180} 
              className="mx-auto opacity-80" 
            />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">{locale == 'es' ? 'No hay productos en tu historial' : 'No products in your history'}</h2>
          <p className="text-gray-500 mb-6">{locale == 'es' ? 'Explora nuestra tienda y vuelve aquí para ver tu historial de navegación' : 'Explore our store and come back here to see your navigation history'}</p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            {locale == 'es' ? 'Explorar productos' : 'Explore products'}
          </Link>
        </div>
      )}
    </div>
  );
}
