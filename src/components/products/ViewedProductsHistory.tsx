'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Database, Json } from '@/lib/database.types';

// Type guard para verificar si media es un array válido
function isMediaArray(media: Json): media is Array<{ url: string }> {
  return Array.isArray(media) && media.length > 0 && 
         typeof media[0] === 'object' && media[0] !== null && 
         'url' in media[0] && typeof media[0].url === 'string';
}
import { getLocalViewedHistory, syncViewedHistoryWithServer } from '@/lib/viewedHistory';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
import { formatUSD } from '@/lib/formatCurrency';

type Product = Database['public']['Tables']['products']['Row'];

export default function ViewedProductsHistory() {
    const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Keep the state setter but remove the unused variable
  const [, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchViewedProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        const isLoggedIn = !!session?.user;
        setIsAuthenticated(isLoggedIn);
        
        // If logged in, sync local history with server
        if (isLoggedIn) {
          await syncViewedHistoryWithServer();
        }
        
        // Fetch the product data
        if (isLoggedIn) {
          // Fetch from database
          const { data: viewHistory, error: historyError } = await supabase
            .from('view_history')
            .select('product_id, viewed_at')
            .eq('user_id', session.user.id)
            .order('viewed_at', { ascending: false })
            .limit(8);
            
          if (historyError) {
            throw historyError;
          }
          
          if (viewHistory && viewHistory.length > 0) {
            // Get the product IDs
            const productIds = viewHistory.map(item => item.product_id);
            
            // Fetch the products
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('id, name, name_es, name_en, media, dolar_price, category_id, discount_percentage, is_active, created_at')
              .in('id', productIds);
              
            if (productsError) {
              throw productsError;
            }
            
            // Sort products in the same order as the view history
            const sortedProducts = productIds.map(id => 
              productsData?.find(product => product.id === id)
            ).filter(Boolean) as Product[];
            
            setProducts(sortedProducts);
          }
        } else {
          // Get from local storage
          const localHistory = getLocalViewedHistory();
          
          if (localHistory.length > 0) {
            // Get the product IDs
            const productIds = localHistory.map(item => item.id);
            
            // Fetch the products
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('id, name, name_es, name_en, media, dolar_price, category_id, discount_percentage, is_active, created_at')
              .in('id', productIds);
              
            if (productsError) {
              throw productsError;
            }
            
            // Sort products in the same order as the local history
            const sortedProducts = productIds.map(id => 
              productsData?.find(product => product.id === id)
            ).filter(Boolean) as Product[];
            
            setProducts(sortedProducts.slice(0, 8));
          }
        }
      } catch (err) {
        console.error('Error fetching viewed products:', err);
        setError('No se pudieron cargar los productos vistos recientemente');
      } finally {
        setLoading(false);
      }
    }
    
    fetchViewedProducts();
  }, []);
  
  if (loading) {
    return (
      <div className="px-4 py-6">
        <h2 className="mb-4 flex items-center font-display text-xl font-medium text-[#2D2D2D]">
          <Clock className="mr-2 h-5 w-5" />
          {locale === 'es' ? 'Vistos recientemente' : 'Recently viewed'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="mb-2 h-40 w-full rounded-sm bg-[#E8E4E0]"></div>
              <div className="mb-1 h-4 w-2/3 rounded bg-[#E8E4E0]"></div>
              <div className="h-4 w-1/2 rounded bg-[#E8E4E0]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="mb-2 flex items-center text-[#9F2D24]">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return null; // Don't show anything if there's no history
  }
  
  return (
    <div className="rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-4 py-6">
      <h2 className="mb-4 flex items-center font-display text-xl font-medium text-[#2D2D2D]">
        <Clock className="mr-2 h-5 w-5" />
        {locale === 'es' ? 'Vistos recientemente' : 'Recently viewed'}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map(product => (
          <Link 
            href={`/product/${product.name}`} 
            key={product.id}
            className="group"
          >
            <div className="overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] transition-[border-color,box-shadow] hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]">
              <div className="h-40 relative">
                <Image
                  src={(product.media && isMediaArray(product.media) && product.media[0]?.url) || '/product-placeholder.png'}
                  alt={product.name || 'Producto'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain p-2"
                />
              </div>
              <div className="p-2">
                <h3 className="line-clamp-1 text-sm font-medium text-[#2D2D2D] group-hover:text-[#A08848]">
                  {(locale === 'es' ? product.name_es : product.name_en) || product.name}
                </h3>
                <p className="text-sm font-semibold text-[#2D2D2D]">
                  {product.dolar_price ? `${formatUSD(product.dolar_price)}` : locale === 'es' ? 'Precio a consultar' : 'Price on request'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
