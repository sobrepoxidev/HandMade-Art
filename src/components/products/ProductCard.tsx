'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabaseClient';
import { useLocale } from 'next-intl';
import { formatUSD } from '@/lib/formatCurrency';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type MediaItem = { url: string; alt?: string; type?: string };

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [inventory, setInventory] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const locale = useLocale();
  
  const mainImageUrl = (product?.media as MediaItem[])?.[0]?.url || '/product-placeholder.png';
  
  // Fetch category and inventory data
  useEffect(() => {
    async function fetchData() {
      if (product.category_id) {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('id', product.category_id)
          .single();
          
        if (data) setCategory(data as Category);
      }
      
      // Get inventory data
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', product.id)
        .single();
        
      if (inventoryData) setInventory(inventoryData.quantity);
      
      // Check if user has this product in favorites
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: favoriteData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('product_id', product.id)
          .maybeSingle();
          
        setIsFavorite(!!favoriteData);
      }
    }
    
    fetchData();
  }, [product.id, product.category_id]);
  
  // Calculate final price with discount
  const finalPrice = product.dolar_price ? 
    product.discount_percentage && product.discount_percentage > 0 ?
      product.dolar_price * (1 - product.discount_percentage / 100) :
      product.dolar_price
    : null;
  
  return (
    <div
      className="bg-[#FAF8F5] border border-[#E8E4E0] rounded-lg overflow-hidden flex flex-col transition-all duration-300 h-full relative hover:shadow-lg hover:border-[#C9A962]/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Category badge */}
        {category && (
          <span className="bg-[#2D2D2D] text-[#F5F1EB] text-xs px-2 py-1 rounded-full border border-[#C9A962]/20">
            {locale === 'es' ? category.name_es : category.name_en}
          </span>
        )}

        {/* Featured badge */}
        {product.is_featured && (
          <span className="bg-[#C9A962]/10 text-[#C9A962] text-xs px-2 py-1 rounded-full border border-[#C9A962]/30 flex items-center">
            <Star className="h-3 w-3 mr-1 fill-[#C9A962]" />
            {locale === 'es' ? 'Destacado' : 'Featured'}
          </span>
        )}

        {/* Discount badge */}
        {Number(product.discount_percentage) > 0 && (
          <span className="bg-[#B55327]/10 text-[#B55327] text-xs px-2 py-1 rounded-full border border-[#B55327]/30 font-medium">
            {product.discount_percentage}% OFF
          </span>
        )}
      </div>

      {/* Botón de favorito */}
      <button
        className="absolute top-3 right-3 z-10 text-[#9C9589] hover:text-[#C44536] transition-colors"
        onClick={async (e) => {
          e.preventDefault();

          // Get user session
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            try {
              if (isFavorite) {
                // Remove from favorites
                await supabase
                  .from('favorites')
                  .delete()
                  .eq('user_id', session.user.id)
                  .eq('product_id', product.id);
              } else {
                // Add to favorites
                await supabase
                  .from('favorites')
                  .insert({
                    user_id: session.user.id,
                    product_id: product.id
                  });
              }

              setIsFavorite(!isFavorite);
            } catch (err) {
              console.error('Error updating favorites:', err);
            }
          } else {
            // Redirect to login or show login modal
            alert(locale === 'es' ? 'Inicia sesión para guardar favoritos' : 'Sign in to save favorites');
          }
        }}
      >
      </button>

      {/* Imagen del producto */}
      <Link href={`/product/${product.name}`} className="block h-48 sm:h-56 relative">
        <div className="h-full w-full flex items-center justify-center bg-white p-4">
          <Image
            src={mainImageUrl}
            alt={product.name || ''}
            width={180}
            height={180}
            className={`object-contain max-h-full max-w-full transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        </div>
      </Link>

      {/* Detalles del producto */}
      <div className="p-4 flex-grow flex flex-col">
        <Link
          href={`/product/${product.name}`}
          className="text-[#2D2D2D] font-medium mb-1 hover:text-[#C9A962] transition-colors line-clamp-2 min-h-[48px]"
        >
          {locale === 'es' ? product.name_es : product.name_en}
        </Link>

        {/* Calificación simulada - En un sistema real se calcularía basado en reseñas */}
        <div className="flex items-center text-[#C9A962] mb-2">
          <Star className="fill-current h-4 w-4" />
          <Star className="fill-current h-4 w-4" />
          <Star className="fill-current h-4 w-4" />
          <Star className="fill-current h-4 w-4" />
          <Star className="fill-current h-4 w-4 text-[#E8E4E0]" />
          <span className="text-xs text-[#9C9589] ml-1">(4.0)</span>
        </div>

        {/* Precio e Inventario */}
        <div className="mt-auto">
          {product.dolar_price ? (
            <div>
              {product.discount_percentage && product.discount_percentage > 0 ? (
                <div className="mb-2">
                  <p className="text-lg font-bold text-[#C9A962]">
                    {formatUSD(finalPrice || 0)}
                  </p>
                  <p className="text-xs text-[#9C9589] line-through">
                    {formatUSD(product.dolar_price || 0)}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold text-[#C9A962] mb-2">
                  {formatUSD(product.dolar_price || 0)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-[#4A4A4A] mb-2">
              {locale === 'es' ? 'Precio a consultar' : 'Price to consult'}
            </p>
          )}

          {/* Inventory status */}
          <p className="text-xs mb-2">
            {inventory > 0 ? (
              <span className="text-[#4A7C59] flex items-center">
                <Check className="h-3 w-3 mr-1" />
                {inventory > 10 ? locale === 'es' ? 'En stock' : 'In stock' : `${inventory} ${locale === 'es' ? 'disponibles' : 'available'}`}
              </span>
            ) : (
              <span className="text-[#C44536]">{locale === 'es' ? 'Agotado' : 'Out of stock'}</span>
            )}
          </p>

          {/* Botones de acción */}
          <div className="flex space-x-2 mt-2">
            <Link
              href={`/product/${product.name}`}
              className="flex-1 py-2 text-sm text-center text-[#2D2D2D] border border-[#E8E4E0] rounded hover:bg-[#FAF8F5] hover:border-[#C9A962]/50 hover:text-[#C9A962] transition"
            >
              {locale === 'es' ? 'Ver detalles' : 'View details'}
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              className={`flex items-center justify-center p-2 rounded transition
                ${inventory > 0 ? 'bg-gradient-to-r from-[#C9A962] to-[#A08848] text-[#1A1A1A] hover:from-[#D4C4A8] hover:to-[#C9A962]' : 'bg-[#E8E4E0] text-[#9C9589] cursor-not-allowed'}`}
              aria-label={locale === 'es' ? 'Añadir al carrito' : 'Add to cart'}
              disabled={inventory <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
