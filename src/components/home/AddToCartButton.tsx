'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSupabase } from '@/app/supabase-provider/provider';
import { ShoppingCartIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export default function AddToCartButton({ 
  product, 
  quantity = 1 
}: { 
  product: Product; 
  quantity?: number 
}) {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [inStock, setInStock] = useState<boolean | null>(null);
  const { supabase } = useSupabase();
  const { addToCart } = useCart();

  // Check inventory on component mount
  useEffect(() => {
    const checkInventory = async () => {
      try {
        const { data: inventory, error } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('product_id', product.id)
          .single();

        if (error) throw error;
        setInStock(inventory ? inventory.quantity > 0 : false);
      } catch (error) {
        console.error('Error checking inventory:', error);
        setInStock(true); // Default to in stock if there's an error
      }
    };

    checkInventory();
  }, [product.id, supabase]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inStock === false) return;
    
    setIsLoading(true);
    try {
      // Create a complete product object with required fields
      const cartProduct = {
        ...product,
        // Ensure required fields have proper types
        name: product.name || null,
        name_es: product.name_es || null,
        name_en: product.name_en || null,
        price: product.colon_price || 0,
        // Add other required fields with proper defaults
        created_at: product.created_at || new Date().toISOString(),
        modified_at: product.modified_at || new Date().toISOString(),
        description: product.description || '',
        category_id: product.category_id || null,
        sku: product.sku || '',
        brand: product.brand || '',
        is_featured: product.is_featured || false,
        is_active: product.is_active ?? true,
        tags: product.tags || [],
        specifications: product.specifications || {},
        discount_percentage: product.discount_percentage || 0,
        // Ensure media is always an array or null
        media: product.media || null
      };
      
      addToCart(cartProduct, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If we're still loading the inventory status, show a loading button
  if (inStock === null) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-lg bg-gray-200 text-gray-500 py-2.5 flex items-center justify-center gap-2 font-medium cursor-not-allowed"
      >
        <div className="animate-pulse">
          {locale === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      </button>
    );
  }

  // If product is out of stock, show WhatsApp contact button
  if (inStock === false) {
    return (
      <Link 
        href={`https://wa.me/50684237555?text=${encodeURIComponent(
          locale === 'es' 
            ? `¡Hola! Estoy interesado en el producto: ${product.name} (https://artehechoamano.com/product/${product.name}).\n¿Podrían darme más información?`
            : `Hello! I'm interested in the product: ${product.name} (https://handmadeart.store/product/${product.name}).\nCould you give me more information?`
        )}`} 
        target='_blank' 
        rel="noopener noreferrer" 
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {locale === 'es' ? 'Consultar disponibilidad' : 'Check availability'}
        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
        </svg>
      </Link>
    );
  }

  // Show add to cart button for in-stock items
  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full rounded-lg bg-teal-600 hover:bg-teal-700 text-white py-2.5 flex items-center justify-center gap-2 transition font-medium"
    >
      <ShoppingCartIcon className="h-4 w-4" />
      {isLoading ? 
        (locale === 'es' ? 'Añadiendo...' : 'Adding...') : 
        (locale === 'es' ? 'Añadir al carrito' : 'Add to cart')}
    </button>
  );
}