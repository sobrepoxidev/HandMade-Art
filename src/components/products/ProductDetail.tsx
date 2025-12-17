'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CurrencyConverterRow from '../CurrencyConverterRow';
import { 
  ChevronRight, 
  MinusCircle, 
  PlusCircle, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Search, 
  ArrowLeft,
  Check,
  Tag,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useSupabase } from '@/app/supabase-provider/provider';
import { useCart } from '@/context/CartContext';
import { Database, Json } from '@/lib/database.types';
import ReviewsList from '@/components/products/ReviewsList';
import RelatedProductsClient from '@/components/products/RelatedProductsClient';
import ReviewForm from '@/components/products/ReviewForm';
import { formatUSD } from '@/lib/formatCurrency';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

// Type guard para verificar si media es un array válido
function isMediaArray(media: Json): media is Array<{ url: string }> {
  return Array.isArray(media) && media.length > 0 && 
         typeof media[0] === 'object' && media[0] !== null && 
         'url' in media[0] && typeof media[0].url === 'string';
}

// The client component that handles UI and state
export default function ProductDetail({ id, locale }: { id: string, locale: string }) {
  // Ensure viewport starts at top when navigating to product page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [inventory, setInventory] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState<number>(0);
  
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
  
  // Cargar producto por ID y sus datos relacionados
  useEffect(() => {
    async function fetchProductAndRelatedData() {
      setLoading(true);
      try {
        // Fetch product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (productError) {
          throw productError;
        }

        if (!productData) {
          setError('Producto no encontrado');
          setLoading(false);
          return;
        }

        setProduct(productData as Product);

        // Registrar la visualización en el historial (si hay un usuario autenticado)
        if (currentSession?.user) {
          // Record view in view_history table
          await supabase.from('view_history').insert({
            user_id: currentSession.user.id,
            product_id: productData.id,
          }).select();
        }

        // Fetch category if available
        if (productData.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', productData.category_id)
            .single();
          
          setCategory(categoryData as Category);
        }

        // Fetch inventory data
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('product_id', productData.id)
          .single();
        
        if (inventoryData) {
          setInventory(inventoryData.quantity);
        }

        // Check if product is in favorites (if user is logged in)
        if (currentSession?.user) {
          const { data: favoriteData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', currentSession.user.id)
            .eq('product_id', productData.id)
            .single();

          setIsFavorite(!!favoriteData);
        }

      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProductAndRelatedData();
    }
  }, [id]); // Use id as dependency

  // Resetear zoom cuando cambia la imagen activa
  useEffect(() => {
    setIsZoomed(false);
    setZoomScale(1);
    setIsDragging(false);
    setLastTouchDistance(0);
  }, [activeImageIndex]);

  // Manejar la cantidad
  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Manejar click en la imagen para activar/desactivar zoom
  const handleImageClick = (e: React.MouseEvent) => {
    // Prevenir el click si estamos arrastrando
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (isZoomed) {
      setIsZoomed(false);
      setZoomScale(1);
    } else {
      setIsZoomed(true);
      setZoomScale(2.5);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Delay más largo para asegurar que no se active el click
    setTimeout(() => setIsDragging(false), 200);
  };

  // Función helper para calcular distancia entre dos toques
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Manejar inicio de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches as unknown as TouchList);
      setLastTouchDistance(distance);
    }
  };

  // Manejar movimiento de toque (pinch-to-zoom)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance > 0) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches as unknown as TouchList);
      const scaleChange = currentDistance / lastTouchDistance;
      const newScale = Math.max(1, Math.min(4, zoomScale * scaleChange));
      
      setZoomScale(newScale);
      setIsZoomed(newScale > 1);
      setLastTouchDistance(currentDistance);
    }
  };

  // Manejar fin de toque
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(0);
    }
  };

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
        // Eliminar de favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentSession.user.id)
          .eq('product_id', product.id);
          
        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Añadir a favoritos
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: currentSession.user.id,
            product_id: product.id
          });
          
        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
    }
  };

  // Añadir al carrito
  const handleAddToCart = async () => {
    if (!product) return;
    
    // Añadir al carrito
    addToCart(product, quantity);
    
    // Sincronizar con la base de datos si hay un usuario
    // Usamos el currentSession del nivel de componente
    if (currentSession?.user) {
      try {
        // Verificar si ya existe en el carrito
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', currentSession.user.id)
          .eq('product_id', product.id)
          .single();
        
        if (existingItem) {
          // Actualizar cantidad
          await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
        } else {
          // Insertar nuevo item
          await supabase
            .from('cart_items')
            .insert({
              user_id: currentSession.user.id,
              product_id: product.id,
              quantity: quantity
            });
        }
      } catch (error) {
        console.error('Error al sincronizar con la base de datos:', error);
      }
    }
    
  };

  // Si está cargando, muestra un spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A962]"></div>
      </div>
    );
  }

  // Si hay un error, muestra un mensaje
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-[#FAF8F5] border border-[#C44536]/30 rounded-lg p-6 inline-block">
          <h1 className="text-xl font-semibold text-[#C44536] mb-2">
            {error || 'Producto no encontrado'}
          </h1>
          <p className="text-[#C44536]/80 mb-4">
            {locale === 'es' ? 'Lo sentimos, no pudimos encontrar el producto que estás buscando.' : 'We apologize, we were unable to find the product you were looking for.'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#C9A962] to-[#A08848] text-[#1A1A1A] rounded-md hover:from-[#D4C4A8] hover:to-[#C9A962] transition font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'es' ? 'Volver a productos' : 'Back to products'}
          </Link>
        </div>
      </div>
    );
  }

  const mainImageUrl = (product.media && isMediaArray(product.media) && product.media[activeImageIndex]) 
    ? product.media[activeImageIndex].url 
    : '/product-placeholder.png';

  return (
    <div className="container mx-auto px-4 py-0 bg-[#FAF8F5]">
      {/* Breadcrumb */}
      <div className="mb-0.5 flex items-center text-sm text-[#9C9589]">
        <Link href="/" className="hover:text-[#C9A962] transition-colors">{locale === 'es' ? 'Inicio' : 'Home'}</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/products" className="hover:text-[#C9A962] transition-colors"> {locale === 'es' ? 'Productos' : 'Products'}</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-[#2D2D2D] truncate max-w-[200px]">{locale === 'es' ? product.name_es : product.name_en}</span>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Columna izquierda: Imágenes */}
        <div className="w-full md:w-7/12">
          <div className="sticky top-12">
            {/* Imagen principal con zoom */}
            <div className="relative bg-white h-[250px] md:h-[500px] flex items-center justify-center border border-[#E8E4E0] rounded-lg overflow-hidden mb-4">
              {/* Contenedor de la imagen con zoom y arrastre */}
              <motion.div 
                className="relative w-full h-full cursor-pointer"
                onClick={handleImageClick}
                drag={isZoomed}
                dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={{ 
                  scale: zoomScale,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.8
                }}
                style={{ 
                  touchAction: isZoomed ? 'none' : 'auto',
                  transformOrigin: 'center center'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={mainImageUrl}
                  alt={product.name || ''}
                  fill
                  className="object-contain select-none pointer-events-none"
                  priority
                  draggable={false}
                />
              </motion.div>

              {/* Indicadores fijos que no se mueven con el arrastre */}
              {!isZoomed && (
                <motion.div 
                  className="absolute bottom-2 right-2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {locale === 'es' ? 'Clic para zoom' : 'Click to zoom'}
                </motion.div>
              )}
              
              {isZoomed && (
                <>
                  <motion.div 
                    className="absolute top-1 left-1 bg-black/25 bg-opacity-60 text-white text-[0.70rem] px-1 rounded pointer-events-none z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {isDragging ? (locale === 'es' ? 'Arrastrando...' : 'Dragging...') : (locale === 'es' ? 'Arrastra para mover • Clic para salir • Pellizca para zoom' : 'Drag to move • Click to exit • Pinch to zoom')}
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 pointer-events-none z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Search className="h-4 w-4 text-gray-700" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded pointer-events-none z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {Math.round(zoomScale * 100)}%
                  </motion.div>
                </>
              )}
            </div>

            {/* Galería de miniaturas */}
            {product.media && isMediaArray(product.media) && product.media.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.media.map((item, index) => (
                  <button
                    key={index}
                    className={`relative h-16 border rounded-md overflow-hidden transition hover:border-[#C9A962] ${
                      activeImageIndex === index ? 'border-[#C9A962] ring-2 ring-[#C9A962]/30' : 'border-[#E8E4E0]'
                    }`}
                    onClick={() => {
                        setActiveImageIndex(index);
                        setIsZoomed(false);
                        setZoomScale(1);
                        setIsDragging(false);
                        setLastTouchDistance(0);
                      }}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <Image
                      src={item.url}
                      alt={`Imagen ${index + 1} de ${locale === 'es' ? product.name_es : product.name_en}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Información del producto */}
        <div className="w-full md:w-5/12">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D] mb-2">
            {locale === 'es' ? product.name_es : product.name_en}
          </h1>

          {/* Categoría */}
          <div className="mb-2">
            {category && (
              <Link
                href={`/products?category=${category.id}`}
                className="inline-block px-2 py-1 bg-[#2D2D2D] text-[#F5F1EB] text-[0.7rem] rounded-full border border-[#C9A962]/20 hover:border-[#C9A962]/50 hover:bg-[#3A3A3A] transition"
              >
                {locale === 'es' ? category.name_es : category.name_en}
              </Link>
            )}
            {product.brand && (
              <span className="ml-2 inline-block px-2 py-1 bg-[#C9A962]/10 text-[#C9A962] text-[0.7rem] rounded-full border border-[#C9A962]/30">
                {product.brand}
              </span>
            )}
          </div>
          
          {/* Precio */}
          <div className="mb-2">
            {product.dolar_price ? (
               product.discount_percentage && product.discount_percentage > 0 ? (
                 <div className="flex flex-col sm:flex-row sm:justify-start items-start sm:items-center gap-1 sm:gap-4">
                   {/* Price & discount section */}
                   <div className="flex items-center gap-0.5">
                     <p className="text-3xl font-bold text-[#C9A962]">
                       {formatUSD((Number(product.dolar_price) || 0) * (1 - (Number(product.discount_percentage) || 0) / 100))}
                     </p>
                     <p className="text-lg text-[#9C9589] line-through">
                       {formatUSD((Number(product.dolar_price) || 0) )}
                     </p>
                     <span className="text-sm font-medium bg-[#B55327]/10 text-[#B55327] px-2 py-0.5 rounded">
                       {product.discount_percentage}% OFF
                     </span>
                   </div>

                   {/* Currency converter in separate row when there's discount */}
                   <div className="flex items-center sm:mx-auto">
                     <CurrencyConverterRow amount={Number(product.dolar_price || 0)} />
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-4">
                   {/* Price and currency converter in same row when no discount */}
                   <p className="text-3xl font-bold text-[#C9A962]">
                     {formatUSD((Number(product.dolar_price) || 0))}
                   </p>
                   <CurrencyConverterRow amount={Number(product.dolar_price || 0)} />
                 </div>
               )
            ) : (
              <p className="text-xl font-medium text-[#C9A962]">
                {locale === 'es' ? 'Precio a consultar' : 'Price to consult'}
              </p>
            )
          }
            <p className="mt-2 text-sm">
              {inventory > 0 ? (
                <span className="text-[#4A7C59] flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  {inventory > 10 ? (locale === 'es' ? 'En stock' : 'In stock') : inventory==1 ? (locale === 'es' ? 'Última unidad' : 'Last unit') : (locale === 'es' ? `Solo quedan ${inventory} unidades` : `Only ${inventory} left`)}
                </span>
              ) : (
                <span className="text-[#C44536]">{locale === 'es' ? 'Vendido' : 'Sold out'}</span>
              )}
            </p>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-[#9C9589] mt-1">
                SKU: {product.sku}
              </p>
            )}
          </div>
          
          {/* Descripción */}
          <div className="mb-4 border-b border-[#E8E4E0]">
            <h2 className="text-lg font-semibold mb-2 text-[#2D2D2D]">{locale === 'es' ? 'Descripción' : 'Description'}</h2>
            <p className="text-[#4A4A4A] whitespace-pre-line pb-4">
              {locale === 'es' ? product.description : product.description_en}
            </p>
          </div>

          {/* Especificaciones técnicas */}
          {(product.weight_kg || product.length_cm || product.width_cm || product.height_cm) && (
            <div className="mb-8 border-b border-[#E8E4E0] pb-2 text-start">
              <h2 className="text-lg font-semibold mb-4 text-[#2D2D2D]">
                {locale === 'es' ? 'Especificaciones técnicas' : 'Technical specifications'}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-start">
                {product.weight_kg && (
                  <div className="flex justify-between py-2 border-b border-[#E8E4E0]/50">
                    <span className="text-[#9C9589]">
                      {locale === 'es' ? 'Peso:' : 'Weight:'}
                    </span>
                    <span className="font-medium text-[#2D2D2D]">
                      {product.weight_kg} kg
                    </span>
                  </div>
                )}
                {product.length_cm && (
                  <div className="flex justify-between py-2 border-b border-[#E8E4E0]/50">
                    <span className="text-[#9C9589]">
                      {locale === 'es' ? 'Largo:' : 'Length:'}
                    </span>
                    <span className="font-medium text-[#2D2D2D]">
                      {product.length_cm} cm
                    </span>
                  </div>
                )}
                {product.width_cm && (
                  <div className="flex justify-between py-2 border-b border-[#E8E4E0]/50">
                    <span className="text-[#9C9589]">
                      {locale === 'es' ? 'Ancho:' : 'Width:'}
                    </span>
                    <span className="font-medium text-[#2D2D2D]">
                      {product.width_cm} cm
                    </span>
                  </div>
                )}
                {product.height_cm && (
                  <div className="flex justify-between py-2 border-b border-[#E8E4E0]/50">
                    <span className="text-[#9C9589]">
                      {locale === 'es' ? 'Alto:' : 'Height:'}
                    </span>
                    <span className="font-medium text-[#2D2D2D]">
                      {product.height_cm} cm
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Acciones */}
          <div className="space-y-6 border-b border-[#E8E4E0] pb-6 mb-6">
            {/* Selector de cantidad */}
            <div>
              <h2 className="text-sm font-medium mb-2 text-[#2D2D2D]">{locale === 'es' ? 'Cantidad' : 'Quantity'}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="text-[#9C9589] hover:text-[#C9A962] disabled:text-[#E8E4E0] transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <MinusCircle className="h-6 w-6" />
                </button>
                <span className="w-8 text-center font-medium text-[#2D2D2D]">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= 10}
                  className="text-[#9C9589] hover:text-[#C9A962] disabled:text-[#E8E4E0] transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <PlusCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col space-y-3">
              {inventory > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-[#C9A962] to-[#A08848] text-[#1A1A1A] rounded-lg hover:from-[#D4C4A8] hover:to-[#C9A962] transition-all shadow-sm font-medium"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {locale === 'es' ? 'Añadir al carrito' : 'Add to cart'}
                </button>
              ) : (
                <Link
                  href={`https://wa.me/50684237555?text=${encodeURIComponent(
                    locale === 'es' ? 'Hola, estoy interesado en el producto: ' + product?.name_es + ' (' + window.location.href + ')' : 'Hello, I am interested in the product: ' + product?.name_en + ' (' + window.location.href + ')'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-[#4A7C59]/10 justify-center w-full px-4 py-2 text-sm font-medium text-[#4A7C59] hover:text-[#3A6349] border border-[#4A7C59]/30 rounded-md hover:bg-[#4A7C59]/20 transition-colors"
                >
                  {locale === 'es' ? 'Consultar disponibilidad' : 'Check availability'}
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                </Link>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center flex-1 py-2 px-4 border rounded-lg transition ${isFavorite ? 'bg-[#C44536]/10 text-[#C44536] border-[#C44536]/30' : 'border-[#E8E4E0] text-[#4A4A4A] hover:bg-[#FAF8F5] hover:border-[#C9A962]/30'}`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-[#C44536]' : ''}`} />
                  {isFavorite ? (locale === 'es' ? 'Guardado' : 'Saved') : (locale === 'es' ? 'Favorito' : 'Favorite')}
                </button>
                <button
                  className="flex items-center justify-center flex-1 py-2 px-4 border border-[#E8E4E0] text-[#4A4A4A] rounded-lg hover:bg-[#FAF8F5] hover:border-[#C9A962]/30 transition"
                  onClick={() => {
                    // Use Web Share API if available
                    if (navigator.share) {
                      navigator.share({
                        title: product?.name || 'Producto artesanal',
                        text: product?.description || 'Mira este increíble producto artesanal',
                        url: window.location.href
                      })
                      .catch(err => console.error('Error al compartir:', err));
                    } else {
                      // Fallback - copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert(locale === 'es' ? 'Enlace copiado al portapapeles' : 'Link copied to clipboard');
                    }
                  }}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  {locale === 'es' ? 'Compartir' : 'Share'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Detalles adicionales */}
          <div className="space-y-6">
            {/* Especificaciones */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#2D2D2D]">{locale === 'es' ? 'Especificaciones' : 'Specifications'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="py-1 border-b border-[#E8E4E0]/50">
                      <span className="text-[#9C9589] text-sm">{key}: </span>
                      <span className="text-[#2D2D2D] font-medium text-sm">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Etiquetas */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#2D2D2D]">{locale === 'es' ? 'Etiquetas' : 'Tags'}</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/products?tag=${tag}`}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-[#2D2D2D] hover:bg-[#3A3A3A] text-[#F5F1EB] text-sm transition border border-[#C9A962]/10 hover:border-[#C9A962]/30"
                    >
                      <Tag className="h-3 w-3 mr-1 text-[#C9A962]" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Características generales */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-[#2D2D2D]">{locale === 'es' ? 'Características' : 'Features'}</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-[#C9A962] font-medium mr-2">•</span>
                  <span className="text-[#4A4A4A]">{locale === 'es' ? 'Producto hecho a mano con materiales de calidad' : 'Product made by hand with quality materials'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C9A962] font-medium mr-2">•</span>
                  <span className="text-[#4A4A4A]">{locale === 'es' ? 'Diseño único y exclusivo' : 'Unique and exclusive design'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C9A962] font-medium mr-2">•</span>
                  <span className="text-[#4A4A4A]">{locale === 'es' ? 'Artesanía local de Costa Rica' : 'Local craftsmanship from Costa Rica'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {product && (
        <RelatedProductsClient
          title={locale === 'es' ? 'Otros productos' : 'Other products'}
          locale={locale}
          categoryId={product.category_id}
          excludeIds={[product.id]}
        />
      )}

      {/* Reviews Section */}
      {!loading && !error && product && (
        <div className="mt-16 border-t border-[#E8E4E0] pt-10">
          <h2 className="text-2xl font-bold flex items-center mb-6 text-[#2D2D2D]">
            <MessageSquare className="h-6 w-6 mr-2 text-[#C9A962]" />
            {locale === 'es' ? 'Reseñas y opiniones' : 'Reviews and opinions'}
          </h2>

          <div className="space-y-8">
            <ReviewsList productId={product.id} key={reviewsRefreshKey} />
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={() => setReviewsRefreshKey(prev => prev + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
