'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabaseClient';

const CART_STORAGE_KEY = 'handmade_cart';

type Product = Database['public']['Tables']['products']['Row'];

export type CartItem = {
  product: Product;
  quantity: number;
  id?: number; // Optional ID from the database cart_items table
};

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  syncCartWithDB: (userId?: string) => Promise<void>;
}

const CartContext = createContext<CartContextProps>({
  cart: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  isLoading: false,
  syncCartWithDB: async () => {},
});

// Helpers for URL encoding
function encodeCartToBase64(cart: CartItem[]): string {
  const minimalCart = cart.map(item => ({ id: item.product.id, qty: item.quantity }));
  return btoa(JSON.stringify(minimalCart));
}

function decodeCartFromBase64(encoded: string): { id: number; qty: number }[] {
  try {
    return JSON.parse(atob(encoded));
  } catch (error) {
    console.error("Error decoding cart:", error);
    return [];
  }
}

// Helpers for localStorage persistence
function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const minimalCart = cart.map(item => ({ id: item.product.id, qty: item.quantity }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(minimalCart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

function loadCartFromStorage(): { id: number; qty: number }[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return null;
  }
}

function clearCartFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cart from localStorage:", error);
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 🔄 Control para evitar el sync en el primer render
  const firstRender = useRef(true);
  const isRebuilding = useRef(false);

  // 🧠 Efecto: sincronizar carrito con URL solo cuando el carrito cambie
  useEffect(() => {
    // Don't sync URL during initial load or while rebuilding
    if (firstRender.current || isRebuilding.current || !isInitialized) {
      firstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (cart.length > 0) {
      params.set('cart', encodeCartToBase64(cart));
      // Also save to localStorage as backup
      saveCartToStorage(cart);
    } else {
      params.delete('cart');
      clearCartFromStorage();
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [cart, pathname, router, searchParams, isInitialized]);

  // 🎁 Funciones del carrito
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      const newCart = existing
        ? prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { product, quantity }];

      // Immediately save to localStorage
      saveCartToStorage(newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCart(prev => {
      const newCart = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product.id !== productId);
      if (newCart.length === 0) {
        clearCartFromStorage();
      } else {
        saveCartToStorage(newCart);
      }
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    clearCartFromStorage();
    // Clear discount info when cart is cleared
    if (typeof window !== 'undefined') {
      localStorage.removeItem('discountInfo');
    }
  }, []);

  // 🚀 Al montar: reconstruir carrito desde URL o localStorage
  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return;

    const rebuildCart = async () => {
      isRebuilding.current = true;
      setIsLoading(true);

      try {
        // Priority 1: Check URL parameter
        const encoded = searchParams.get('cart');
        let parsedCart: { id: number; qty: number }[] = [];

        if (encoded) {
          parsedCart = decodeCartFromBase64(encoded);
          console.log("Cart found in URL:", parsedCart);
        }

        // Priority 2: If URL is empty, check localStorage
        if (parsedCart.length === 0) {
          const storedCart = loadCartFromStorage();
          if (storedCart && storedCart.length > 0) {
            parsedCart = storedCart;
            console.log("Cart found in localStorage:", parsedCart);
          }
        }

        // If no cart data found anywhere, we're done
        if (parsedCart.length === 0) {
          console.log("No cart data found");
          setIsInitialized(true);
          isRebuilding.current = false;
          setIsLoading(false);
          return;
        }

        // Fetch products from Supabase
        const productIds = parsedCart.map(item => item.id);

        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (error) {
          console.error('Error fetching products:', error);
          setIsInitialized(true);
          isRebuilding.current = false;
          setIsLoading(false);
          return;
        }

        if (!products || products.length === 0) {
          console.warn('No products found for the IDs in cart');
          clearCartFromStorage();
          setIsInitialized(true);
          isRebuilding.current = false;
          setIsLoading(false);
          return;
        }

        // Rebuild cart with full product data
        const newCartItems: CartItem[] = [];

        parsedCart.forEach(parsedItem => {
          const product = products.find(p => p.id === parsedItem.id);
          if (product) {
            newCartItems.push({
              product: product as Product,
              quantity: parsedItem.qty
            });
          }
        });

        if (newCartItems.length > 0) {
          console.log("Cart rebuilt successfully:", newCartItems.length, "items");
          setCart(newCartItems);
          // Save to localStorage to ensure persistence
          saveCartToStorage(newCartItems);
        }

      } catch (err) {
        console.error('Error rebuilding cart:', err);
      } finally {
        setIsInitialized(true);
        isRebuilding.current = false;
        setIsLoading(false);
      }
    };

    rebuildCart();
  }, [searchParams, isInitialized]);

  // Calculate total items and subtotal
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * (item.product.dolar_price || 0)), 0);

  // Sync cart with database
  const syncCartWithDB = async (userId?: string) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Here would go the actual implementation to sync with Supabase
      // For now just a placeholder
      console.log('Syncing cart with DB for user:', userId);
    } catch (error) {
      console.error('Error syncing cart with DB:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      totalItems, 
      subtotal, 
      isLoading, 
      syncCartWithDB
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
