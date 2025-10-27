'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { useDiscountCode } from '@/lib/hooks/useDiscountCode';
import { CategoryChips } from '@/components/catalog/CategoryChips';
import { InterestDrawer } from '@/components/catalog/InterestDrawer';
import CurrencyConverterRow from '@/components/CurrencyConverterRow';
import { 
  Loader2, 
  Tag, 
  X, 
  Check, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Share2, 
  Star, 
  Eye, 
  ShoppingCart,
  GitCompare,
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Facebook,
  Twitter,
  MessageCircle,
  Copy,
  Plus,
  Minus
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatUSD } from '@/lib/formatCurrency';
import { useLocale } from 'next-intl';
import { Database } from '@/lib/database.types';

// Extender el tipo de product_card_view con campos adicionales
type ProductCardView = Database['public']['Views']['product_card_view']['Row'];

type ProductsRow = Database['public']['Tables']['products']['Row'];
type ProductDetails = Pick<ProductsRow, 'id' | 'media' | 'name_es' | 'name_en'>;

type MediaItem = {
  url: string;
  type?: 'image' | 'video' | string | null;
  caption?: string | null;
};

interface Product extends ProductCardView {
  id: number; // Asegurar que id no sea null
  name: string; // Asegurar que name no sea null
  name_es: string; // Asegurar que name_es no sea null
  name_en: string; // Asegurar que name_en no sea null
  media?: MediaItem[];
  is_featured?: boolean;
  rating?: number;
  review_count?: number;
}

// Helpers de tipo para parsear media (Json) sin usar any
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeMedia(value: unknown): MediaItem[] {
  if (!Array.isArray(value)) return [];
  const result: MediaItem[] = [];
  for (const entry of value) {
    if (typeof entry === 'string') {
      result.push({ url: entry, type: 'image' });
      continue;
    }
    if (isRecord(entry) && typeof entry['url'] === 'string') {
      const url = entry['url'] as string;
      const type = typeof entry['type'] === 'string' ? (entry['type'] as string) : 'image';
      const caption = typeof entry['caption'] === 'string' ? (entry['caption'] as string) : null;
      result.push({ url, type, caption });
    }
  }
  return result;
}

interface Category {
  id: number;
  name: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export default function CatalogPage() {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [showDiscountSuccess, setShowDiscountSuccess] = useState(false);
  const [discountError, setDiscountError] = useState('');
  
  // Nuevas funcionalidades
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [comparisonList, setComparisonList] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showShareModal, setShowShareModal] = useState<Product | null>(null);
  const [quickMediaIndex, setQuickMediaIndex] = useState(0);
  
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const interestList = useInterestList();
  const discountCode = useDiscountCode();

  // Normalizador de marcas para evitar duplicados por espacios/caso
  const normalizeBrand = (b: string) => b.trim().replace(/\s+/g, ' ').toLowerCase();

  // Cargar categorías
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_es, name')
        .order('name_es');

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name_es || cat.name || ''
      }));

      setCategories(formattedCategories);
    }

    loadCategories();
  }, []);

  // Cargar productos con datos extendidos
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      
      let query = supabase
        .from('product_card_view')
        .select('*')
        .order('name');

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading products:', error);
        setLoading(false);
        return;
      }

      // Simular datos de rating y reseñas (en producción vendrían de la DB)
      let enhancedProducts: Product[] = (data || [])
        .filter((product): product is NonNullable<typeof product> & { id: number; name: string } =>
          product !== null &&
          typeof product.id === 'number' &&
          typeof product.name === 'string'
        )
        .map(product => ({
          ...product,
          // Completar temporalmente name_es y name_en; se sobreescriben con datos reales más abajo
          name_es: product.name ?? '',
          name_en: product.name ?? '',
          rating: Math.random() * 2 + 3, // Rating entre 3-5
          review_count: Math.floor(Math.random() * 50) + 1,
          media: product.main_image_url ? [{ url: product.main_image_url, type: 'image' }] : []
        }));

      // Traer media real desde products y fusionar
      try {
        const ids = enhancedProducts.map(p => p.id);
        if (ids.length > 0) {
          const { data: mediaRows, error: mediaError } = await supabase
            .from('products')
            .select('id, media, name_es, name_en')
            .in('id', ids);

          if (mediaError) {
            console.error('Error loading media for products:', mediaError);
          } else if (mediaRows) {
            const detailsById = new Map<number, { media?: MediaItem[]; name_es: string | null; name_en: string | null }>();
            for (const row of mediaRows as ProductDetails[]) {
              const items = normalizeMedia(row.media as unknown);
              detailsById.set(row.id, {
                media: items.length > 0 ? items : undefined,
                name_es: row.name_es,
                name_en: row.name_en,
              });
            }

            enhancedProducts = enhancedProducts.map(p => {
              const details = detailsById.get(p.id);
              if (!details) return p;
              return {
                ...p,
                media: details.media ?? p.media,
                name_es: details.name_es ?? p.name_es ?? p.name,
                name_en: details.name_en ?? p.name_en ?? p.name,
              };
            });
          }
        }
      } catch (e) {
        console.error('Unexpected error while merging media:', e);
      }

      setProducts(enhancedProducts);
      
      // Calcular rango de precios
      const prices = enhancedProducts
        .map(p => p.dolar_price)
        .filter(p => p !== null) as number[];
      if (prices.length > 0) {
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
      
      setLoading(false);
    }

    loadProducts();
  }, [selectedCategory]);

  // Búsqueda inteligente con autocompletado
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = products
        .filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(p => p.name)
        .slice(0, 5);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  // Conjunto normalizado de marcas seleccionadas
  const selectedBrandsNormalized = useMemo(() => new Set(selectedBrands.map(b => normalizeBrand(b))), [selectedBrands]);

  // Productos filtrados y ordenados
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Filtro de búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.brand && product.brand.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Filtro de precio
      if (product.dolar_price) {
        if (product.dolar_price < priceRange[0] || product.dolar_price > priceRange[1]) {
          return false;
        }
      }

      // Filtro de marcas (normalizado, ignora espacios/caso)
      if (selectedBrandsNormalized.size > 0) {
        const brandKey = product.brand ? normalizeBrand(product.brand) : '';
        if (!selectedBrandsNormalized.has(brandKey)) return false;
      }

      return true;
    });

    // Ordenamiento
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => (a.dolar_price || 0) - (b.dolar_price || 0));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.dolar_price || 0) - (a.dolar_price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, searchQuery, priceRange, selectedBrandsNormalized, sortBy]);

  // Obtener marcas únicas (ignorando espacios/caso)
  const availableBrands = useMemo(() => {
    const brands = products
      .map(p => p.brand)
      .filter(Boolean) as string[];
    const seen = new Set<string>();
    const list: string[] = [];
    for (const b of brands) {
      const key = normalizeBrand(b);
      if (!seen.has(key)) {
        seen.add(key);
        list.push(b.trim().replace(/\s+/g, ' '));
      }
    }
    return list.sort();
  }, [products]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleApplyDiscountCode = async () => {
    if (!discountCodeInput.trim()) return;
    
    setDiscountError('');
    const result = await discountCode.applyCode(discountCodeInput.trim());
    
    if (result.isValid) {
      setShowDiscountSuccess(true);
      setDiscountCodeInput('');
      setTimeout(() => setShowDiscountSuccess(false), 6500);
    } else {
      setDiscountError(result.errorMessage || 'Código inválido');
    }
  };

  const handleRemoveDiscountCode = () => {
    discountCode.removeCode();
    setDiscountError('');
    setShowDiscountSuccess(false);
  };

  const handleCalculateDiscount = (productPrice: number, categoryId: number | null) => {
    if (!discountCode.appliedCode) return null;
    
    const result = discountCode.calculateDiscount(
      productPrice,
      discountCode.appliedCode,
      categoryId || undefined,
      true
    );
    
    if (!result.isValid) return null;
    
    return {
      discountedPrice: result.finalPrice,
      discountAmount: result.discountAmount
    };
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleComparison = (productId: number) => {
    setComparisonList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setZoomLevel(1);
    setQuickMediaIndex(0);
  };

  const handleShare = (product: Product) => {
    setShowShareModal(product);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalItems = interestList.getTotalItems();

  // Media para modal de Vista Rápida
  const quickMediaItems: MediaItem[] = useMemo(() => {
    if (!quickViewProduct) return [];
    const items = Array.isArray(quickViewProduct.media) ? quickViewProduct.media : [];
    if (items.length > 0) return items;
    if (quickViewProduct.main_image_url) return [{ url: quickViewProduct.main_image_url, type: 'image' }];
    return [{ url: '/placeholder-image.png', type: 'image' }];
  }, [quickViewProduct]);

  // Componente de tarjeta de producto mejorada
  const ProductCard = ({ product }: { product: Product }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    
    const isInList = interestList.isInList(product.id);
    const currentItem = interestList.getItem(product.id);
    const currentQty = currentItem?.qty || 0;
    const isInWishlist = wishlist.includes(product.id);
    const isInComparison = comparisonList.includes(product.id);

    const originalPrice = product.dolar_price || 0;
    const discountInfo = handleCalculateDiscount(originalPrice, product.category_id);
    const finalPrice = discountInfo?.discountedPrice || originalPrice;

    const mediaItems: MediaItem[] = useMemo(() => {
      const items = Array.isArray(product.media) ? product.media : [];
      if (items.length > 0) return items;
      if (product.main_image_url) return [{ url: product.main_image_url, type: 'image' }];
      return [{ url: '/placeholder-image.png', type: 'image' }];
    }, [product.media, product.main_image_url]);

    useEffect(() => {
      setActiveMediaIndex(0);
      setImageError(false);
    }, [product.id]);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          viewMode === 'list' ? 'flex' : 'flex flex-col'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Imagen del producto */}
        <div className={`relative bg-gray-50 ${
          viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
        }`}>
          <Image
            src={imageError ? '/placeholder-image.png' : (mediaItems[activeMediaIndex]?.url || '/placeholder-image.png')}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes={viewMode === 'list' ? '(max-width: 768px) 12rem, 12rem' : '(max-width: 768px) 100vw, 33vw'}
            priority={false}
          />

          {mediaItems.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {mediaItems.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir a la imagen ${i + 1}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMediaIndex(i); setImageError(false); }}
                  className={`w-2.5 h-2.5 rounded-full border border-white/70 transition-colors ${
                    i === activeMediaIndex ? 'bg-teal-500' : 'bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                ⭐ Destacado
              </span>
            )}
            {discountInfo && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Acciones rápidas */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 right-2 flex flex-col gap-2"
              >
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => handleQuickView(product)}
                  className="p-2 bg-white/80 text-gray-700 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleComparison(product.id)}
                  disabled={comparisonList.length >= 3 && !isInComparison}
                  className={`p-2 rounded-full transition-colors ${
                    isInComparison 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white disabled:opacity-50'
                  }`}
                >
                  <GitCompare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(product)}
                  className="p-2 bg-white/80 text-gray-700 rounded-full hover:bg-green-500 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vista rápida en hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-2 left-2 right-2"
              >
                <button
                  onClick={() => handleQuickView(product)}
                  className="w-full bg-black/80 text-white py-1 px-1 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                >
                  Vista Rápida
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Miniaturas del carrusel (visibles en grid) */}
        {viewMode === 'grid' && mediaItems.length > 1 && (
          <div className="mt-2 px-2 flex gap-2 overflow-x-auto">
            {mediaItems.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMediaIndex(i); setImageError(false); }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border transition ${
                  i === activeMediaIndex ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`Mostrar imagen ${i + 1}`}
              >
                <Image
                  src={m.url}
                  alt={`Miniatura ${i + 1} de ${product.name}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Información del producto */}
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-700">
                  ({product.review_count})
                </span>
              </div>
            )}
          </div>

          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors line-clamp-2">
              {locale === 'es' ? product.name_es : product.name_en}
            </h3>
          </Link>

          {product.brand && (
            <p className="text-sm text-gray-700 mb-2">{product.brand}</p>
          )}

          {viewMode === 'list' && product.description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Precio y conversor */}
          <div className="space-y-2">
            {product.dolar_price ? (
              <div className="flex items-center justify-between">
                <div>
                  {discountInfo ? (
                    <div className="space-y-1 pr-0.5">
                      <p className="text-lg font-bold text-teal-700">
                        {formatUSD(finalPrice)}
                      </p>
                      <p className="text-sm text-gray-700 line-through">
                        {formatUSD(originalPrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-teal-700 pr-0.5">  
                      {formatUSD(originalPrice)}
                    </p>
                  )}
                </div>
                <CurrencyConverterRow amount={finalPrice} />
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-700">
                Precio a consultar
              </p>
            )}
          </div>

          {/* Controles de cantidad */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => interestList.updateQuantity(product.id, Math.max(0, currentQty - 1))}
                disabled={currentQty === 0}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{currentQty}</span>
              <button
                onClick={() => {
                  if (!isInList || currentQty === 0) {
                    // Agregar el producto a la lista con los datos necesarios para cotización
                    interestList.addItem({
                      product_id: product.id,
                      name: product.name,
                      sku: product.sku ?? undefined,
                      main_image_url: product.main_image_url ?? product.media?.[0]?.url,
                      // Guardamos el precio en dólares original; el descuento se calcula al enviar
                      dolar_price: product.dolar_price ?? undefined,
                      price: product.dolar_price ?? undefined,
                      discount_percentage: product.discount_percentage ?? undefined,
                      category_id: product.category_id ?? undefined,
                    });
                  } else {
                    interestList.updateQuantity(product.id, currentQty + 1);
                  }
                }}
                className="p-1 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {isInList && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-teal-600 text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                En lista
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-black">
      {/* Header mejorado */}
      <div className="bg-white shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="text-teal-600" />
                {locale === 'es' ? 'Catálogo de Productos' : 'Product Catalog'}
              </h1>
              <p className="text-gray-700 mt-2">
                {locale === 'es' ? 'Descubre una amplia variedad de productos únicos' : 'Discover a wide variety of unique products'}
              </p>
            </div>

            {/* Búsqueda inteligente */}
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Sugerencias de búsqueda */}
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
                  >
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Código de descuento mejorado */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {!discountCode.appliedCode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Tag className="h-4 w-4 text-teal-500" />
                <span>¿Tienes un código de descuento?</span>
              </div>
              <div className="flex gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={discountCodeInput}
                  onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                  placeholder="Ingresa tu código"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring- text-black focus:ring-teal-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscountCode()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyDiscountCode}
                  disabled={!discountCodeInput.trim() || discountCode.loading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  {discountCode.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Aplicar'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Código aplicado: {discountCode.appliedCode.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {discountCode.appliedCode.discount_type === 'percentage'
                      ? `${discountCode.appliedCode.discount_value}% de descuento`
                      : `$${discountCode.appliedCode.discount_value.toFixed(2)} USD de descuento`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveDiscountCode}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
          
          {/* Mensajes de error y éxito */}
          <AnimatePresence>
            {discountError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2"
              >
                {discountError}
              </motion.div>
            )}
            
            {showDiscountSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2"
              >
                ¡Código aplicado correctamente! Los descuentos se mostrarán en los productos aplicables.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categorías mejoradas */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            discountCategories={discountCode.appliedCode?.categories || []}
            hasDiscountForAll={discountCode.appliedCode?.apply_to_all_categories || false}
          />
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="bg-white shadow-sm text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Controles de vista y filtros */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-teal-50 border-teal-200 text-teal-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ordenamiento y estadísticas */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <TrendingUp className="w-4 h-4" />
                <span>{filteredProducts.length} productos</span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="name">{locale === 'es' ? 'Nombre A-Z' : 'Name A-Z'}</option>
                <option value="price_asc">{locale === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
                <option value="price_desc">{locale === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
                <option value="rating">{locale === 'es' ? 'Mejor Valorados' : 'Best Rated'}</option>
                <option value="newest">{locale === 'es' ? 'Más Recientes' : 'Newest'}</option>
              </select>

              {/* Comparador */}
              {comparisonList.length > 0 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <GitCompare className="w-4 h-4" />
                  {locale === 'es' ? `Comparar (${comparisonList.length})` : `Compare (${comparisonList.length})`}
                </motion.button>
              )}
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Filtro de precio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'es' ? 'Rango de Precio' : 'Price Range'}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Filtro de marcas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'es' ? 'Marcas' : 'Brands'}
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableBrands.map(brand => (
                        <label key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBrandsNormalized.has(normalizeBrand(brand))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (!selectedBrandsNormalized.has(normalizeBrand(brand))) {
                                  setSelectedBrands([...selectedBrands, brand.trim().replace(/\s+/g, ' ')]);
                                }
                              } else {
                                const key = normalizeBrand(brand);
                                setSelectedBrands(selectedBrands.filter(b => normalizeBrand(b) !== key));
                              }
                            }}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setPriceRange([0, 1000]);
                          setSelectedBrands([]);
                          setSelectedCategory(null);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {locale === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full px-3 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        {locale === 'es' ? 'Aplicar Filtros' : 'Apply Filters'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-teal-600" />
            </motion.div>
            <span className="ml-2 text-gray-700">Cargando productos...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-700 text-lg mb-4">
              {locale === 'es' ? 'No se encontraron productos que coincidan con tus criterios' : 'No products found matching your criteria'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 1000]);
                setSelectedBrands([]);
                setSelectedCategory(null);
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {locale === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal de vista rápida */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setQuickViewProduct(null); setZoomLevel(1); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Vista Rápida</h2>
                  <button
                    onClick={() => { setQuickViewProduct(null); setZoomLevel(1); }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Carrusel de imágenes */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={quickMediaItems[quickMediaIndex]?.url || '/placeholder-image.png'}
                        alt={quickViewProduct.name}
                        fill
                        className="object-contain"
                        style={{ transform: `scale(${zoomLevel})` }}
                      />

                      {quickMediaItems.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {quickMediaItems.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              aria-label={`Ir a la imagen ${i + 1}`}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickMediaIndex(i); }}
                              className={`w-2.5 h-2.5 rounded-full border border-white/70 transition-colors ${
                                i === quickMediaIndex ? 'bg-teal-500' : 'bg-white/70 hover:bg-white'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Controles de zoom */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                          onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                          className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                          className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setZoomLevel(1)}
                          className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {quickMediaItems.length > 1 && (
                      <div className="px-1 flex gap-2 overflow-x-auto">
                        {quickMediaItems.map((m, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickMediaIndex(i); setZoomLevel(1); }}
                            className={`relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border transition ${
                              i === quickMediaIndex ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            aria-label={`Mostrar imagen ${i + 1}`}
                          >
                            <Image src={m.url} alt={`Miniatura ${i + 1} de ${quickViewProduct.name}`} fill className="object-cover" sizes="56px" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {quickViewProduct.name}
                      </h3>
                      {quickViewProduct.brand && (
                        <p className="text-gray-700">{quickViewProduct.brand}</p>
                      )}
                    </div>

                    {quickViewProduct.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(quickViewProduct.rating!)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-700">
                          ({quickViewProduct.review_count} reseñas)
                        </span>
                      </div>
                    )}

                    {quickViewProduct.description && (
                      <p className="text-gray-700">{quickViewProduct.description}</p>
                    )}

                    {/* Precio y conversor */}
                    {quickViewProduct.dolar_price && (
                      <div className="space-y-3">
                        <div className="text-3xl font-bold text-teal-700">
                          {formatUSD(quickViewProduct.dolar_price)}
                        </div>
                        <CurrencyConverterRow amount={quickViewProduct.dolar_price} />
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-3">
                      <Link
                        href={`/product/${quickViewProduct.id}`}
                        className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors text-center"
                      >
                        {locale === 'es' ? 'Ver Detalles' : 'View Details'}
                      </Link>
                      <button
                        onClick={() => toggleWishlist(quickViewProduct.id)}
                        className={`p-3 rounded-lg border transition-colors ${
                          wishlist.includes(quickViewProduct.id)
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className="w-5 h-5" fill={wishlist.includes(quickViewProduct.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de compartir */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {locale === 'es' ? 'Compartir Producto' : 'Share Product'}
                </h3>
                <button
                  onClick={() => setShowShareModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Image
                    src={showShareModal.main_image_url || '/placeholder-image.png'}
                    alt={showShareModal.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{showShareModal.name}</h4>
                    {showShareModal.dolar_price && (
                      <p className="text-teal-600 font-bold">
                        {formatUSD(showShareModal.dolar_price)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/product/${showShareModal.id}`;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/product/${showShareModal.id}`;
                      const text = `¡Mira este producto: ${showShareModal.name}!`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/product/${showShareModal.id}`;
                      const text = `¡Mira este producto: ${showShareModal.name}! ${url}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/product/${showShareModal.id}`;
                      copyToClipboard(url);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                    {locale === 'es' ? 'Copiar' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de comparación */}
      <AnimatePresence>
        {showComparison && comparisonList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Comparar Productos</h2>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comparisonList.map(productId => {
                    const product = products.find(p => p.id === productId);
                    if (!product) return null;

                    return (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="relative aspect-square bg-gray-100 rounded-lg mb-4">
                          <Image
                            src={product.main_image_url || '/placeholder-image.png'}
                            alt={locale === 'es' ? product.name : `${product.name} image`}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            onClick={() => toggleComparison(product.id)}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                        
                        {product.brand && (
                          <p className="text-sm text-gray-700 mb-2">{product.brand}</p>
                        )}

                        {product.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating!)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-700">
                              ({product.review_count})
                            </span>
                          </div>
                        )}

                        {product.dolar_price && (
                          <div className="text-xl font-bold text-teal-700 mb-4">
                            {formatUSD(product.dolar_price)}
                          </div>
                        )}

                        <div className="space-y-2 text-sm">
                          {product.weight_kg && (
                            <div className="flex justify-between">
                              <span className="text-gray-700">Peso:</span>
                              <span>{product.weight_kg} kg</span>
                            </div>
                          )}
                          {product.length_cm && product.width_cm && product.height_cm && (
                            <div className="flex justify-between">
                              <span className="text-gray-700">
                                {locale === 'es' ? 'Dimensiones:' : 'Dimensions:'}
                              </span>
                              <span>{product.length_cm}×{product.width_cm}×{product.height_cm} cm</span>
                            </div>
                          )}
                        </div>

                        <Link
                          href={`/product/${product.id}`}
                          className="block w-full mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg text-center hover:bg-teal-700 transition-colors"
                        >
                          {locale === 'es' ? 'Ver Detalles' : 'View Details'}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra inferior sticky */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-700">
                    {totalItems} {totalItems === 1 ? locale === 'es' ? 'producto' : 'product' : locale === 'es' ? 'productos' : 'products'} selected
                  </div>
                  {wishlist.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <Heart className="w-4 h-4" fill="currentColor" />
                      {wishlist.length} en wishlist
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDrawerOpen(true)}
                  className="bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {locale === 'es' ? 'Ver Selección' : 'View Selection'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer de selección */}
      <InterestDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        interestList={interestList}
        appliedDiscountCode={discountCode.appliedCode}
      />

      {/* Espaciado para la barra inferior */}
      {totalItems > 0 && <div className="h-20" />}
    </div>
  );
}