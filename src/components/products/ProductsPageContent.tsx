'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronRight, GridIcon, ListIcon } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import PaginationControls from './PaginationControls';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/lib/database.types';
import ViewedProductsHistory from './ViewedProductsHistory';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type MediaItem = { url: string; alt?: string; type?: string };
type ProductWithInventory = Product & {
  inventory?: { quantity: number | null }[] | { quantity: number | null } | null;
};

const PRODUCTS_PER_PAGE = 12;

function getInventoryQuantity(product: ProductWithInventory) {
  if (Array.isArray(product.inventory)) return product.inventory[0]?.quantity ?? null;
  return product.inventory?.quantity ?? null;
}

export default function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = useLocale();
  
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryName, setCategoryName] = useState<string>('');
  
  // Valores de filtros y paginación
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const tagFilter = searchParams.get('tag');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const stockFilter = searchParams.get('in_stock');
  const sortBy = searchParams.get('sort') || 'name_asc';
  const featuredOnly = searchParams.get('featured') === 'true';
  
  // Cargar categorías al inicio
  useEffect(() => {
    async function fetchData() {
      try {
       const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, name_es, name_en')
          .order(locale === 'es' ? 'name_es' : 'name_en', { ascending: true });
        
        setCategoryName(locale === 'es' ? (categoriesData?.find(c => c.id === Number(categoryFilter))?.name_es || '') : (categoriesData?.find(c => c.id === Number(categoryFilter))?.name_en || ''));  
        if (categoriesError) {
             console.error('Error fetching categories:', categoriesError);
          throw categoriesError;
        }
        setCategories(categoriesData as Category[]);
      } catch (err) {
        console.error('Error al cargar datos de filtros:', err);
      }
    }
    
    fetchData();
  }, [categoryFilter, locale]);
  
  // Cargar productos con filtros y paginación
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // Cálculo para paginación
        const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const to = from + PRODUCTS_PER_PAGE - 1;

        
        // Construir la consulta base
        let query = supabase
          .from('products')
          .select('*, inventory(quantity)', { count: 'exact' });
        
        // Solo mostrar productos activos por defecto
        query = query.eq('is_active', true);
        
        // Aplicar filtros
        if (categoryFilter) {
          query = query.eq('category_id', Number(categoryFilter));
        }
        
        if (brandFilter) {
          query = query.eq('brand', brandFilter);
        }
        
        if (tagFilter) {
          query = query.contains('tags', [tagFilter]);
        }
        
        if (minPrice) {
          query = query.gte('dolar_price', minPrice);
        }
        
        if (maxPrice) {
          query = query.lte('dolar_price', maxPrice);
        }
        
        // Filtrar por disponibilidad en inventario
        if (stockFilter === 'true') {
          // Aquí necesitaríamos un join con la tabla de inventario
          // Esto es un enfoque simplificado
          query = query.gte('inventory.quantity', 1);
        }
        
        // Filtrar productos destacados
        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }
        
        // Aplicar ordenamiento
        if (sortBy === 'price_asc') {
          query = query.order('dolar_price', { ascending: true });
        } else if (sortBy === 'price_desc') {
          query = query.order('dolar_price', { ascending: false });
        } else if (sortBy === 'name_desc') {
          query = query.order(locale === 'es' ? 'name_es' : 'name_en', { ascending: false });
        } else if (sortBy === 'discount') {
          query = query.order('discount_percentage', { ascending: false, nullsFirst: false });
        } else if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else {
          // Por defecto, ordenar por nombre ascendente
          query = query.order(locale === 'es' ? 'name_es' : 'name_en', { ascending: true });
        }
        
        // Aplicar paginación
        query = query.range(from, to);
        
        // Ejecutar consulta
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setProducts(data as Product[]);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [currentPage, categoryFilter, brandFilter, tagFilter, minPrice, maxPrice, sortBy, stockFilter, featuredOnly, locale]);
  
  // Manejar cambios en filtros
  const handleFilterChange = (params: URLSearchParams) => {
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // Calcular total de páginas
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  
  // Determinar si hay productos
  const hasProducts = !loading && products.length > 0;
  
  
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center text-sm text-[#6B6459]">
          <Link href="/" className="hover:text-[#C9A962] transition-colors">{locale === 'es' ? 'Inicio' : 'Home'}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-[#4A4A4A]">{locale === 'es' ? 'Productos' : 'Products'}</span>
          {categoryFilter && (
            <>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-medium text-[#2D2D2D]">{categoryName}</span>
            </>
          )}
        </div>

        {/* Encabezado */}
        <div className="mb-6 max-w-3xl">
          <h1 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
            {categoryFilter ? `${categoryName}` : locale === 'es' ? 'Todos los Productos' : 'All Products'}
          </h1>
          <p className="text-[#4A4A4A] text-sm mt-2 leading-relaxed">
            {locale === 'es' ? 'Descubre nuestra colección de productos hechos a mano.' : 'Discover our collection of handmade products.'}
            {totalCount > 0 && ` ${locale === 'es' ? 'Mostrando' : 'Showing'} ${products.length} ${locale === 'es' ? 'de' : 'of'} ${totalCount} ${locale === 'es' ? 'productos' : 'products'}.`}
          </p>
        </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col gap-5 md:flex-row">
        {/* Barra lateral de filtros */}
        <aside className="md:w-64">
          <ProductFilters
            categories={categories}
            isMobile={true}
            locale={locale}
          />
          
          <div className="hidden md:block">
            <ProductFilters
              categories={categories}
              isMobile={false}
              locale={locale}
            />
          </div>
        </aside>
        
        {/* Lista de productos */}
        <div className="flex-1">
          {/* Barra de control */}
          <div className="mb-4 flex flex-col items-stretch justify-between gap-3 border-b border-[#E8E4E0] pb-4 sm:flex-row sm:items-center">
            {/* Información de resultados */}
            <div className="text-sm text-[#6B6459]">
              {totalCount > 0 && (
                <p>
                  {locale === 'es' ? 'Mostrando' : 'Showing'} <span className="font-medium text-[#2D2D2D]">{products.length}</span> de <span className="font-medium text-[#2D2D2D]">{totalCount}</span> {locale === 'es' ? 'productos' : 'products'}
                  {currentPage > 1 && ` (${locale === 'es' ? 'página' : 'page'} ${currentPage} de ${totalPages})`}
                </p>
              )}
            </div>

            {/* Controles */}
            <div className="flex w-full items-center gap-3 sm:w-auto">
              {/* Selector de ordenamiento */}
              <div className="relative w-full sm:w-auto">
                <select
                  className="h-11 w-full appearance-none rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] pl-3 pr-9 text-sm text-[#2D2D2D] cursor-pointer focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25 sm:w-auto"
                  value={sortBy}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('sort', e.target.value);
                    params.set('page', '1');
                    handleFilterChange(params);
                  }}
                >
                  <option value="name_asc">{locale === 'es' ? 'Nombre: A-Z' : 'Name: A-Z'}</option>
                  <option value="name_desc">{locale === 'es' ? 'Nombre: Z-A' : 'Name: Z-A'}</option>
                  <option value="price_asc">{locale === 'es' ? 'Precio: Menor a mayor' : 'Price: Lowest to highest'}</option>
                  <option value="price_desc">{locale === 'es' ? 'Precio: Mayor a menor' : 'Price: Highest to lowest'}</option>
                  <option value="newest">{locale === 'es' ? 'Más recientes' : 'Newest'}</option>
                  <option value="discount">{locale === 'es' ? 'Mayor descuento' : 'Highest discount'}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4 text-[#9C9589]" />
              </div>

              {/* Cambio de vista (grid/list) */}
              <div className="hidden overflow-hidden rounded-sm border border-[#E8E4E0] md:flex">
                <button
                  className={`grid h-11 w-11 place-items-center ${viewMode === 'grid' ? 'bg-[#2D2D2D] text-[#C9A962]' : 'text-[#6B6459] hover:text-[#C9A962] bg-[#FAF6EF]'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Ver en cuadrícula"
                >
                  <GridIcon className="h-5 w-5" />
                </button>
                <button
                  className={`grid h-11 w-11 place-items-center ${viewMode === 'list' ? 'bg-[#2D2D2D] text-[#C9A962]' : 'text-[#6B6459] hover:text-[#C9A962] bg-[#FAF6EF]'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Ver en lista"
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Estado de carga */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-sm border border-[#E8E4E0] bg-[#FAF6EF]">
                  <div className="aspect-square bg-[#F5F1EB]" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded bg-[#E8E4E0]" />
                    <div className="h-6 w-1/3 rounded bg-[#E8E4E0]" />
                    <div className="h-11 rounded bg-[#F5F1EB]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 rounded-sm border border-[#C44536]/30 bg-[#C44536]/10 p-4">
              <p className="text-[#C44536]">{error}</p>
            </div>
          )}

          {/* Sin resultados */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-sm border border-[#E8E4E0] bg-[#F5F1EB] p-8 text-center">
              <h2 className="font-display text-xl font-medium text-[#2D2D2D] mb-2">{locale === 'es' ? 'No se encontraron productos' : 'No products found'}</h2>
              <p className="text-[#4A4A4A] mb-4">
                {locale === 'es' ? 'No hay productos disponibles con los filtros seleccionados.' : 'No products available with the selected filters.'}
              </p>
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set('page', '1');
                  handleFilterChange(params);
                }}
                className="inline-flex min-h-[44px] items-center rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
              >
                {locale === 'es' ? 'Borrar filtros' : 'Clear filters'}
              </button>
            </div>
          )}
          
          {/* Lista de productos en modo grid */}
          {hasProducts && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={
                    (locale === 'es'
                      ? categories.find(cat => cat.id === product.category_id)?.name_es
                      : categories.find(cat => cat.id === product.category_id)?.name_en) || undefined
                  }
                  inventoryQuantity={getInventoryQuantity(product as ProductWithInventory)}
                />
              ))}
            </div>
          )}
          
          {/* Lista de productos en modo lista */}
          {hasProducts && viewMode === 'list' && (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)] sm:flex-row"
                >
                  {/* Imagen del producto */}
                  <Link
                    href={`/product/${product.name}`}
                    className="relative h-40 flex-shrink-0 bg-[#F5F1EB] sm:h-auto sm:w-48"
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Image
                        src={(product.media as MediaItem[])?.[0]?.url || '/product-placeholder.png'}
                        alt={product.name || ''}
                        width={150}
                        height={150}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Información del producto */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="mb-2">
                      <Link
                        href={`/product/${product.name}`}
                        className="text-lg font-medium text-[#2D2D2D] hover:text-[#C9A962] transition"
                      >
                        {locale === 'es' ? product.name : product.name}
                      </Link>
                      {product.category_id && (
                        <div className="mt-1">
                          <span className="inline-block rounded-sm bg-[#2D2D2D] px-2 py-0.5 text-xs text-[#F5F1EB]">
                            {locale === 'es' ? categories.find(cat => cat.id === product.category_id)?.name_es : categories.find(cat => cat.id === product.category_id)?.name_en || 'Categoría'}
                          </span>
                        </div>
                      )}
                      {product.brand && (
                          <span className="ml-1 inline-block rounded-sm border border-[#C9A962]/30 bg-[#C9A962]/10 px-2 py-0.5 text-xs text-[#A08848]">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#4A4A4A] mb-4 line-clamp-2">
                      {product.description || (locale === 'es' ? 'No hay descripción disponible.' : 'No description available.')}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                      <div>
                        {product.dolar_price ? (
                          <div>
                            {product.discount_percentage && product.discount_percentage > 0 ? (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <p className="font-display text-lg font-semibold text-[#2D2D2D]">
                                    ${((Number(product.dolar_price) || 0) * (1 - (Number(product.discount_percentage) || 0) / 100)).toFixed(2)}
                                  </p>
                                  <span className="text-xs font-medium bg-[#B55327]/10 text-[#B55327] px-1.5 py-0.5 rounded border border-[#B55327]/30">
                                    {product.discount_percentage}% OFF
                                  </span>
                                </div>
                                <p className="text-xs text-[#9C9589] line-through">
                                  ${(Number(product.dolar_price) || 0).toFixed(2)}
                                </p>
                              </div>
                            ) : (
                              <p className="font-display text-lg font-semibold text-[#2D2D2D]">
                                ${(Number(product.dolar_price) || 0).toFixed(2)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-[#4A4A4A]">
                            {locale === 'es' ? 'Precio a consultar' : 'Price to consult'}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/product/${product.name}`}
                        className="inline-flex min-h-[44px] items-center rounded-sm border border-[#E8E4E0] px-4 py-2 text-sm font-medium text-[#2D2D2D] transition-colors hover:border-[#A08848] hover:text-[#A08848]"
                      >
                        {locale === 'es' ? 'Ver detalles' : 'View details'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {hasProducts && totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}

          {/* Recently viewed products */}
          {!loading && !error && (
            <div className="mt-16">
              <ViewedProductsHistory />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
