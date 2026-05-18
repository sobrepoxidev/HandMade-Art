'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CurrencyConverterRow from '../CurrencyConverterRow';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ZoomIn,
  ArrowLeft,
  Check,
  Tag,
} from 'lucide-react';
import { notify } from '@/components/ui/notify';
import { supabase } from '@/lib/supabaseClient';
import { useSupabase } from '@/app/supabase-provider/provider';
import { useCart } from '@/context/CartContext';
import { Database, Json } from '@/lib/database.types';
import { formatUSD } from '@/lib/formatCurrency';

// Reviews live below the fold and are not critical for first paint.
// Lazy-load them so framer-motion (used in the gallery) is the only
// big dependency that ships with the main bundle.
const ReviewsSection = dynamic(() => import('./ReviewsSection'), {
  ssr: false,
  loading: () => (
    <div
      className="mt-16 border-t border-[#E8E4E0] pt-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-7 w-56 bg-[#E8E4E0] rounded animate-pulse mb-6" />
      <div className="space-y-4">
        <div className="h-5 w-1/3 bg-[#E8E4E0] rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-[#E8E4E0] rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-[#E8E4E0] rounded animate-pulse" />
      </div>
    </div>
  ),
});

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

// Type guard para verificar si media es un array válido
function isMediaArray(media: Json): media is Array<{ url: string }> {
  return Array.isArray(media) && media.length > 0 && 
         typeof media[0] === 'object' && media[0] !== null && 
         'url' in media[0] && typeof media[0].url === 'string';
}

// The client component that handles UI and state
interface ProductDetailProps {
  slug: string;
  locale: string;
  initialProduct?: Product | null;
  initialCategory?: Category | null;
  initialInventory?: number;
  children?: ReactNode;
}

export default function ProductDetail({
  slug,
  locale,
  initialProduct = null,
  initialCategory = null,
  initialInventory = 0,
  children,
}: ProductDetailProps) {
  // Ensure viewport starts at top when navigating to product page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  // Start hydrated with SSR data so the HTML on first paint already has the full product.
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [inventory, setInventory] = useState<number>(initialInventory);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState(initialProduct == null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  // Pinch state: kept as ref to avoid render thrashing during touchmove (60+ fps).
  const lastTouchDistanceRef = useRef(0);
  // Live announcement for screen readers when something happens (cart add).
  const [announcement, setAnnouncement] = useState('');
  
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Get Supabase session at the component level
  const { session, supabase: supabaseContext } = useSupabase();
  
  // Estado local para el estado de la sesión (igual que en el carrito)
  const [currentSession, setCurrentSession] = useState(session);
  
  // Actualizar el estado local cuando cambia la sesión (igual que en el carrito)
  useEffect(() => {
    setCurrentSession(session);
    
    // Configurar un listener para cambios en la sesión
    const { data: { subscription } } = supabaseContext.auth.onAuthStateChange(
      (_event, newSession) => {
        setCurrentSession(newSession);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [session, supabaseContext.auth]);
  
  // Fallback fetch: only runs if SSR didn't pre-fill the product.
  // The page.tsx server component already SSRs product + category + inventory.
  // Here we (a) cover the legacy path where ProductDetail is imported without SSR data,
  // and (b) record view history + favorites which depend on the client session.
  useEffect(() => {
    async function loadFallback() {
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('name', slug)
          .single();

        if (productError || !productData) {
          setError('Producto no encontrado');
          setLoading(false);
          return;
        }

        setProduct(productData as Product);

        if (productData.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', productData.category_id)
            .single();
          if (categoryData) setCategory(categoryData as Category);
        }

        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('product_id', productData.id)
          .maybeSingle();
        if (inventoryData) setInventory(inventoryData.quantity);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }

    if (slug && !initialProduct) {
      loadFallback();
    }
  }, [slug, initialProduct]);

  // Side effects that always depend on the client session: view history + favorites.
  useEffect(() => {
    if (!product?.id) return;
    const productId = product.id;

    if (currentSession?.user) {
      void supabase
        .from('view_history')
        .insert({ user_id: currentSession.user.id, product_id: productId })
        .select();

      void supabase
        .from('favorites')
        .select('id')
        .eq('user_id', currentSession.user.id)
        .eq('product_id', productId)
        .maybeSingle()
        .then(({ data }) => {
          setIsFavorite(!!data);
        });
    } else {
      setIsFavorite(false);
    }
  }, [product?.id, currentSession?.user]);

  // Resetear zoom cuando cambia la imagen activa
  useEffect(() => {
    setIsZoomed(false);
    setZoomScale(1);
    setIsDragging(false);
    lastTouchDistanceRef.current = 0;
  }, [activeImageIndex]);

  // Quantity handlers (stable references).
  const handleIncrement = useCallback(() => {
    setQuantity((prev) => (prev < 10 ? prev + 1 : prev));
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  // Toggle zoom on click/Enter/Space.
  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => {
      const next = !prev;
      setZoomScale(next ? 2.5 : 1);
      return next;
    });
  }, []);

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      toggleZoom();
    },
    [isDragging, toggleZoom]
  );

  const handleImageKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleZoom();
      } else if (e.key === 'Escape' && isZoomed) {
        e.preventDefault();
        toggleZoom();
      }
    },
    [isZoomed, toggleZoom]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setTimeout(() => setIsDragging(false), 200);
  }, []);

  // Pinch helpers — only the final scale lands in React state.
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const [t1, t2] = [touches[0], touches[1]];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastTouchDistanceRef.current = getTouchDistance(
        e.touches as unknown as TouchList
      );
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistanceRef.current > 0) {
      e.preventDefault();
      const currentDistance = getTouchDistance(
        e.touches as unknown as TouchList
      );
      const scaleChange = currentDistance / lastTouchDistanceRef.current;
      setZoomScale((prev) => {
        const next = Math.max(1, Math.min(4, prev * scaleChange));
        setIsZoomed(next > 1);
        return next;
      });
      lastTouchDistanceRef.current = currentDistance;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchDistanceRef.current = 0;
    }
  }, []);

  // Añadir o quitar de favoritos
  const handleToggleFavorite = async () => {
    if (!product) return;
    
    // Verificar si hay un usuario autenticado
    // Usamos el currentSession del nivel de componente
    if (!currentSession?.user) {
      // Redireccionar a login si no hay usuario
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentSession.user.id)
          .eq('product_id', product.id);

        if (error) throw error;
        setIsFavorite(false);
        notify.success(
          locale === 'es' ? 'Quitado de favoritos' : 'Removed from favorites'
        );
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: currentSession.user.id,
            product_id: product.id,
          });

        if (error) throw error;
        setIsFavorite(true);
        notify.success(
          locale === 'es' ? 'Guardado en favoritos' : 'Saved to favorites'
        );
      }
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
      notify.error(
        locale === 'es'
          ? 'No pudimos actualizar tus favoritos'
          : "We couldn't update your favorites"
      );
    }
  };

  // Añadir al carrito
  const handleAddToCart = async () => {
    if (!product) return;

    addToCart(product, quantity);

    const productName =
      (locale === 'es' ? product.name_es : product.name_en) ||
      product.name ||
      '';
    const toastMsg =
      locale === 'es'
        ? `${productName} · ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} añadidas al carrito`
        : `${productName} · ${quantity} ${quantity === 1 ? 'unit' : 'units'} added to cart`;

    notify.success(toastMsg);

    setAnnouncement(
      locale === 'es'
        ? `Producto añadido al carrito: ${productName}, cantidad ${quantity}.`
        : `Added to cart: ${productName}, quantity ${quantity}.`
    );

    if (currentSession?.user) {
      try {
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', currentSession.user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (existingItem) {
          await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
        } else {
          await supabase.from('cart_items').insert({
            user_id: currentSession.user.id,
            product_id: product.id,
            quantity,
          });
        }
      } catch (error) {
        console.error('Error al sincronizar con la base de datos:', error);
      }
    }
  };

  const handleShare = useCallback(async () => {
    const shareData = {
      title: product?.name_es || product?.name_en || product?.name || 'Handmade Art',
      text:
        (locale === 'es' ? product?.description : product?.description_en) ||
        (locale === 'es'
          ? 'Mira esta pieza artesanal de Handmade Art'
          : 'Check out this handmade piece from Handmade Art'),
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator === 'undefined') return;
    const nav = navigator;
    try {
      if (typeof nav.share === 'function') {
        await nav.share(shareData);
        return;
      }
      if (nav.clipboard) {
        await nav.clipboard.writeText(shareData.url);
        notify.success(
          locale === 'es' ? 'Enlace copiado al portapapeles' : 'Link copied to clipboard'
        );
        setAnnouncement(
          locale === 'es' ? 'Enlace copiado al portapapeles.' : 'Link copied to clipboard.'
        );
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  }, [product, locale]);

  if (loading) {
    return (
      <main
        className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">
          {locale === 'es' ? 'Cargando producto…' : 'Loading product…'}
        </span>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E8E4E0] border-t-[#A08848]" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white border border-[#E8E4E0] rounded-md p-8 max-w-md mx-auto">
          <h1 className="font-display text-xl font-medium text-[#2D2D2D] mb-2">
            {error || (locale === 'es' ? 'Producto no encontrado' : 'Product not found')}
          </h1>
          <p className="text-[#6B6459] mb-5 text-sm leading-relaxed">
            {locale === 'es'
              ? 'No pudimos encontrar el producto que estás buscando.'
              : "We couldn't find the product you're looking for."}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#F5F1EB] bg-[#2D2D2D] rounded-sm hover:bg-[#1A1A1A] transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden />
            {locale === 'es' ? 'Volver a productos' : 'Back to products'}
          </Link>
        </div>
      </main>
    );
  }

  const mainImageUrl = (product.media && isMediaArray(product.media) && product.media[activeImageIndex]) 
    ? product.media[activeImageIndex].url 
    : '/product-placeholder.png';

  return (
    <main className="container mx-auto px-4 py-2 bg-[#FAF8F5]">
      {/* Accessible live region for cart / share announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Breadcrumb */}
      <nav
        aria-label={locale === 'es' ? 'Migas de pan' : 'Breadcrumb'}
        className="py-3 flex items-center text-[13px] text-[#6B6459]"
      >
        <Link href="/" className="hover:text-[#A08848] transition-colors">
          {locale === 'es' ? 'Inicio' : 'Home'}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-[#9C9589]" aria-hidden />
        <Link href="/products" className="hover:text-[#A08848] transition-colors">
          {locale === 'es' ? 'Productos' : 'Products'}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-[#9C9589]" aria-hidden />
        <span className="font-medium text-[#2D2D2D] truncate max-w-[180px] sm:max-w-[320px]">
          {locale === 'es' ? product.name_es : product.name_en}
        </span>
      </nav>

      <article className="flex flex-col md:flex-row md:gap-10">
        {/* LEFT — gallery */}
        <div className="w-full md:w-7/12">
          <div className="sticky top-12">
            {/* Main image with zoom */}
            <div className="relative bg-white aspect-square md:aspect-[4/5] border border-[#E8E4E0] rounded-md overflow-hidden mb-4">
              <motion.div
                className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                role="button"
                tabIndex={0}
                aria-label={
                  isZoomed
                    ? locale === 'es' ? 'Salir del zoom' : 'Exit zoom'
                    : locale === 'es' ? 'Ampliar imagen' : 'Zoom image'
                }
                aria-pressed={isZoomed}
                onClick={handleImageClick}
                onKeyDown={handleImageKeyDown}
                drag={isZoomed}
                dragConstraints={{ left: -250, right: 250, top: -250, bottom: 250 }}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={{ scale: zoomScale }}
                transition={{ type: 'tween', duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  touchAction: isZoomed ? 'none' : 'auto',
                  transformOrigin: 'center center',
                  willChange: isZoomed ? 'transform' : 'auto',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={mainImageUrl}
                  alt={
                    (locale === 'es' ? product.name_es : product.name_en) ||
                    product.name ||
                    (locale === 'es'
                      ? 'Producto artesanal hecho a mano en Costa Rica'
                      : 'Handmade artisan product from Costa Rica')
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-contain select-none pointer-events-none p-4 sm:p-6"
                  priority
                  draggable={false}
                />
              </motion.div>

              {/* Single, sober zoom indicator */}
              <div
                aria-hidden
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-[#1A1A1A]/80 text-[#F5F1EB] text-[11px] font-medium px-2 py-1 rounded-sm pointer-events-none backdrop-blur-sm"
              >
                <ZoomIn className="h-3 w-3" strokeWidth={2} />
                {isZoomed
                  ? `${Math.round(zoomScale * 100)}%`
                  : locale === 'es' ? 'Ampliar' : 'Zoom'}
              </div>
            </div>

            {/* Thumbnails */}
            {product.media && isMediaArray(product.media) && product.media.length > 1 && (
              <div
                className="grid grid-cols-4 sm:grid-cols-5 gap-2"
                role="tablist"
                aria-label={locale === 'es' ? 'Vistas del producto' : 'Product views'}
              >
                {product.media.map((item, index) => {
                  const isActive = activeImageIndex === index;
                  return (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="product-main-image"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        setActiveImageIndex(index);
                        setIsZoomed(false);
                        setZoomScale(1);
                        setIsDragging(false);
                        lastTouchDistanceRef.current = 0;
                      }}
                      aria-label={
                        locale === 'es'
                          ? `Ver vista ${index + 1}`
                          : `View image ${index + 1}`
                      }
                      className={`relative aspect-square border rounded-sm overflow-hidden transition-[border-color,box-shadow] duration-200 ${
                        isActive
                          ? 'border-[#A08848] shadow-[0_0_0_2px_rgba(160,136,72,0.18)]'
                          : 'border-[#E8E4E0] hover:border-[#C9A962]/60'
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={
                          locale === 'es'
                            ? `Vista ${index + 1} de ${product.name_es || product.name}`
                            : `View ${index + 1} of ${product.name_en || product.name}`
                        }
                        fill
                        sizes="(max-width: 640px) 25vw, 96px"
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — product info */}
        <div className="w-full md:w-5/12 mt-6 md:mt-0">
          {/* Category / brand pills */}
          {(category || product.brand) && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {category && (
                <Link
                  href={`/products?category=${category.id}`}
                  className="inline-flex items-center px-2.5 py-1 bg-[#2D2D2D] text-[#F5F1EB] text-[10px] uppercase tracking-[0.08em] font-medium rounded-sm hover:bg-[#1A1A1A] transition-colors"
                >
                  {locale === 'es' ? category.name_es : category.name_en}
                </Link>
              )}
              {product.brand && (
                <span className="inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] font-medium text-[#A08848] border border-[#C9A962]/45 rounded-sm">
                  {product.brand}
                </span>
              )}
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] font-medium text-[#2D2D2D] tracking-[-0.005em] mb-3">
            {locale === 'es' ? product.name_es : product.name_en}
          </h1>

          {/* Price block */}
          <div className="mb-3">
            {product.dolar_price ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-[34px] sm:text-[40px] font-semibold text-[#2D2D2D] tracking-tight tabular-nums leading-none">
                    {formatUSD(
                      (Number(product.dolar_price) || 0) *
                        (1 - (Number(product.discount_percentage) || 0) / 100)
                    )}
                  </p>
                  {Number(product.discount_percentage) > 0 && (
                    <>
                      <p className="text-base text-[#9C9589] line-through tabular-nums">
                        {formatUSD(Number(product.dolar_price) || 0)}
                      </p>
                      <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.06em] bg-[#C44536] text-white px-2 py-0.5 rounded-sm">
                        -{product.discount_percentage}%
                      </span>
                    </>
                  )}
                </div>
                <CurrencyConverterRow
                  amount={Number(product.dolar_price || 0)}
                />
              </div>
            ) : (
              <p className="font-display text-2xl font-medium text-[#A08848]">
                {locale === 'es' ? 'Precio a consultar' : 'Price on request'}
              </p>
            )}

            {/* Stock + SKU row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
              {inventory > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[#2F5F3E]">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]" />
                  <Check className="h-4 w-4" aria-hidden />
                  <span className="font-medium">
                    {inventory > 10
                      ? locale === 'es' ? 'En stock' : 'In stock'
                      : inventory === 1
                      ? locale === 'es' ? 'Última unidad' : 'Last unit'
                      : locale === 'es'
                      ? `Solo quedan ${inventory} unidades`
                      : `Only ${inventory} left`}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[#9F2D24]">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#C44536]" />
                  <span className="font-medium">
                    {locale === 'es' ? 'Vendido' : 'Sold out'}
                  </span>
                </span>
              )}
              {product.sku && (
                <span className="text-xs text-[#6B6459] tabular-nums">
                  SKU: <span className="font-medium text-[#4A4A4A]">{product.sku}</span>
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-5 pt-5 border-t border-[#E8E4E0]">
            <h2 className="font-display text-base font-medium text-[#2D2D2D] tracking-[-0.005em] mb-2">
              {locale === 'es' ? 'Descripción' : 'Description'}
            </h2>
            <p className="text-[14.5px] text-[#4A4A4A] leading-relaxed whitespace-pre-line">
              {locale === 'es' ? product.description : product.description_en}
            </p>
          </div>

          {/* Technical specs as <dl> for semantic SEO + a11y */}
          {(product.weight_kg || product.length_cm || product.width_cm || product.height_cm) && (
            <div className="mb-6 pt-5 border-t border-[#E8E4E0]">
              <h2 className="font-display text-base font-medium text-[#2D2D2D] tracking-[-0.005em] mb-3">
                {locale === 'es' ? 'Especificaciones técnicas' : 'Technical specifications'}
              </h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                {product.weight_kg && (
                  <div className="flex justify-between items-baseline py-1 border-b border-[#E8E4E0]/70">
                    <dt className="text-[#6B6459]">{locale === 'es' ? 'Peso' : 'Weight'}</dt>
                    <dd className="font-medium text-[#2D2D2D] tabular-nums">{product.weight_kg} kg</dd>
                  </div>
                )}
                {product.length_cm && (
                  <div className="flex justify-between items-baseline py-1 border-b border-[#E8E4E0]/70">
                    <dt className="text-[#6B6459]">{locale === 'es' ? 'Largo' : 'Length'}</dt>
                    <dd className="font-medium text-[#2D2D2D] tabular-nums">{product.length_cm} cm</dd>
                  </div>
                )}
                {product.width_cm && (
                  <div className="flex justify-between items-baseline py-1 border-b border-[#E8E4E0]/70">
                    <dt className="text-[#6B6459]">{locale === 'es' ? 'Ancho' : 'Width'}</dt>
                    <dd className="font-medium text-[#2D2D2D] tabular-nums">{product.width_cm} cm</dd>
                  </div>
                )}
                {product.height_cm && (
                  <div className="flex justify-between items-baseline py-1 border-b border-[#E8E4E0]/70">
                    <dt className="text-[#6B6459]">{locale === 'es' ? 'Alto' : 'Height'}</dt>
                    <dd className="font-medium text-[#2D2D2D] tabular-nums">{product.height_cm} cm</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
          
          {/* Actions */}
          <div className="pt-5 pb-6 border-t border-[#E8E4E0] space-y-5">
            {/* Quantity selector */}
            <div>
              <label
                htmlFor="qty-display"
                className="block text-xs uppercase tracking-[0.08em] font-medium text-[#6B6459] mb-2"
              >
                {locale === 'es' ? 'Cantidad' : 'Quantity'}
              </label>
              <div className="inline-flex items-center border border-[#E8E4E0] rounded-sm overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="grid place-items-center w-11 h-11 text-[#2D2D2D] hover:bg-[#FAF8F5] disabled:text-[#E8E4E0] disabled:hover:bg-transparent transition-colors"
                  aria-label={locale === 'es' ? 'Disminuir cantidad' : 'Decrease quantity'}
                  aria-controls="qty-display"
                >
                  <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
                </button>
                <span
                  id="qty-display"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="min-w-[44px] text-center font-medium text-[#2D2D2D] tabular-nums select-none"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= 10}
                  className="grid place-items-center w-11 h-11 text-[#2D2D2D] hover:bg-[#FAF8F5] disabled:text-[#E8E4E0] disabled:hover:bg-transparent transition-colors"
                  aria-label={locale === 'es' ? 'Aumentar cantidad' : 'Increase quantity'}
                  aria-controls="qty-display"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>

            {/* Primary CTA + secondary actions */}
            <div className="flex flex-col gap-3">
              {inventory > 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center w-full min-h-[52px] px-5 py-3 bg-[#C9A962] text-[#1A1A1A]
                             text-sm font-semibold tracking-wide uppercase
                             rounded-sm hover:bg-[#A08848] hover:text-[#F5F1EB]
                             transition-colors duration-200
                             shadow-[0_2px_8px_-4px_rgba(160,136,72,0.4)]"
                >
                  <ShoppingCart className="h-4 w-4 mr-2.5" strokeWidth={2} aria-hidden />
                  {locale === 'es' ? 'Añadir al carrito' : 'Add to cart'}
                </button>
              ) : (
                <Link
                  href={`https://wa.me/50684237555?text=${encodeURIComponent(
                    locale === 'es'
                      ? `Hola, estoy interesado en el producto: ${product.name_es} (${typeof window !== 'undefined' ? window.location.href : ''})`
                      : `Hello, I am interested in the product: ${product.name_en} (${typeof window !== 'undefined' ? window.location.href : ''})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    locale === 'es'
                      ? 'Consultar disponibilidad por WhatsApp (abre en nueva ventana)'
                      : 'Check availability on WhatsApp (opens in new window)'
                  }
                  className="inline-flex items-center justify-center w-full min-h-[52px] px-5 py-3 text-sm font-semibold text-[#2F5F3E] bg-[#4A7C59]/10 border border-[#4A7C59]/40 rounded-sm hover:bg-[#4A7C59]/20 transition-colors"
                >
                  {locale === 'es' ? 'Consultar por WhatsApp' : 'Ask on WhatsApp'}
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                </Link>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  aria-pressed={isFavorite}
                  aria-label={
                    isFavorite
                      ? locale === 'es' ? 'Quitar de favoritos' : 'Remove from favorites'
                      : locale === 'es' ? 'Añadir a favoritos' : 'Add to favorites'
                  }
                  className={`inline-flex items-center justify-center flex-1 min-h-[44px] px-4 py-2.5 text-sm font-medium rounded-sm border transition-colors ${
                    isFavorite
                      ? 'bg-[#C44536]/10 text-[#9F2D24] border-[#C44536]/40'
                      : 'text-[#2D2D2D] border-[#E8E4E0] hover:border-[#C9A962]/60 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-[#C44536]' : ''}`}
                    strokeWidth={2}
                    aria-hidden
                  />
                  {isFavorite
                    ? locale === 'es' ? 'Guardado' : 'Saved'
                    : locale === 'es' ? 'Favorito' : 'Favorite'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label={locale === 'es' ? 'Compartir producto' : 'Share product'}
                  className="inline-flex items-center justify-center flex-1 min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#2D2D2D] border border-[#E8E4E0] rounded-sm hover:border-[#C9A962]/60 hover:bg-[#FAF8F5] transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" strokeWidth={2} aria-hidden />
                  {locale === 'es' ? 'Compartir' : 'Share'}
                </button>
              </div>
            </div>
          </div>

          {/* Optional sections */}
          <div className="space-y-6 pt-2">
            {/* Specifications JSON */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="font-display text-base font-medium text-[#2D2D2D] tracking-[-0.005em] mb-2">
                  {locale === 'es' ? 'Detalles' : 'Details'}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-baseline py-1 border-b border-[#E8E4E0]/70"
                    >
                      <dt className="text-[#6B6459] capitalize">{key}</dt>
                      <dd className="font-medium text-[#2D2D2D] text-right">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h2 className="font-display text-base font-medium text-[#2D2D2D] tracking-[-0.005em] mb-2">
                  {locale === 'es' ? 'Etiquetas' : 'Tags'}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <li key={index}>
                      <Link
                        href={`/products?tag=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center min-h-[32px] px-3 py-1 rounded-sm bg-[#2D2D2D] hover:bg-[#1A1A1A] text-[#F5F1EB] text-xs font-medium transition-colors"
                      >
                        <Tag className="h-3 w-3 mr-1.5 text-[#C9A962]" strokeWidth={2} aria-hidden />
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Brand promise (always shown) */}
            <div>
              <h2 className="font-display text-base font-medium text-[#2D2D2D] tracking-[-0.005em] mb-2">
                {locale === 'es' ? 'Por qué importa' : 'Why it matters'}
              </h2>
              <ul className="space-y-1.5 text-sm text-[#4A4A4A]">
                <li className="flex items-start gap-2.5">
                  <span aria-hidden className="text-[#A08848] mt-1 leading-none">·</span>
                  <span>
                    {locale === 'es'
                      ? 'Hecho a mano con materiales nobles, sin atajos industriales.'
                      : 'Handmade with honest materials, no industrial shortcuts.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden className="text-[#A08848] mt-1 leading-none">·</span>
                  <span>
                    {locale === 'es'
                      ? 'Diseño único — no encontrarás dos piezas idénticas.'
                      : 'One-of-a-kind design — no two pieces are identical.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden className="text-[#A08848] mt-1 leading-none">·</span>
                  <span>
                    {locale === 'es'
                      ? 'Cada compra apoya la reinserción social y laboral en Costa Rica.'
                      : 'Every purchase supports social reintegration in Costa Rica.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>

      {/* Related products (server-streamed via Suspense) */}
      {children}

      {/* Reviews — lazy-loaded to keep the main bundle lean */}
      {!loading && !error && product && (
        <ReviewsSection productId={product.id} />
      )}
    </main>
  );
}
