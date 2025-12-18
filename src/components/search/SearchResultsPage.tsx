'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { SearchResult, searchProducts } from '@/lib/search';
import { ChevronRight, SlidersHorizontal, } from 'lucide-react';
import AddToCartButton from '@/components/home/AddToCartButton';
import PaginationControls from '@/components/products/PaginationControls';
import { supabase } from '@/lib/supabaseClient';
import { Database, Json } from '@/lib/database.types';
import { Product } from '@/lib/hooks/useProducts';
import { formatUSD } from '@/lib/formatCurrency';

// Número de productos por página
const PRODUCTS_PER_PAGE = 12;
export default function SearchResultsPage({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const categoryParam = searchParams.get('category') || 'Todo';
  // Category filter can be either id or name
  const isCategoryFilter = categoryParam && categoryParam !== 'Todo' && categoryParam !== 'Todas';
  const category = categoryParam;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSortBy = searchParams.get('sort') || 'relevance';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [categories, setCategories] = useState<Database['public']['Tables']['categories']['Row'][]>([]);
  const [categoryName, setCategoryName] = useState('');
  
  // Cargar categorías
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setCategories(data || []);
        if (isCategoryFilter) {
          const categoryData = data.find(cat => cat.id === parseInt(categoryParam, 10));
          setCategoryName(locale === 'es' ? (categoryData?.name_es || '') : (categoryData?.name_en || ''));
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    }

    fetchCategories();
  }, []);

  // Función para actualizar los parámetros de búsqueda y navegar
  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Aplicar actualizaciones
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Siempre resetear a página 1 cuando cambian los filtros
    if (Object.keys(updates).some(key => key !== 'page')) {
      params.set('page', '1');
    }

    // Navegar a la nueva URL
    router.push(`/search?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    async function fetchResults() {
      // Determine if we should perform a text search, a category filter search, or both
      if (!isCategoryFilter && query.length < 2) {
        // Nothing to search
        setResults([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Helper to format raw product rows into SearchResult
        type SupabaseProduct = {
          id: number;
          name: string | null;
          name_es: string | null;
          name_en: string | null;
          description: string | null;
          colon_price: number | null;
          dolar_price: number | null;
          media: Json;
          category_id: number | null;
          discount_percentage: number | null;
          created_at: string;
        };
        
        const toSearchResult = (product: SupabaseProduct): SearchResult => ({
          id: product.id,
          name: product.name,
          name_es: product.name_es,
          name_en: product.name_en,
          description: product.description,
          colon_price: product.colon_price,
          dolar_price: product.dolar_price,
          media: product.media as SearchResult['media'],
          category_id: product.category_id,
          discount_percentage: product.discount_percentage,
          created_at: product.created_at,
        });

        // If we have at least 2 chars in query, use full-text helper, otherwise fallback to category-only query.
        if (query.length >= 2) {
          const { results: data, totalCount } = await searchProducts(
            query,
            locale,
            isCategoryFilter ? category : undefined,
            currentPage,
            PRODUCTS_PER_PAGE,
            sortBy,
            true,
          );
          setResults(data);
          setTotalCount(totalCount);
        } else if (isCategoryFilter) {
          // Only category filter – categoryParam may be ID or name
          let categoryId: number | null = null;

          if (/^\d+$/.test(category)) {
            categoryId = parseInt(category, 10);
          } else {
            const { data: catData } = await supabase
              .from('categories')
              .select('id')
              .eq('name', category)
              .single();
            categoryId = catData?.id ?? null;
          }

          if (categoryId === null) {
            setResults([]);
            setTotalCount(0);
            setLoading(false);
            return;
          }

          const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
          const to = from + PRODUCTS_PER_PAGE - 1;

          const { data, count, error } = await supabase
            .from('products')
            .select('id, name, name_es, name_en, description, colon_price, dolar_price, media, category_id, discount_percentage, created_at', { count: 'exact' })
            .eq('category_id', categoryId)
            .range(from, to);

          if (error) throw error;

          setResults((data || []).map(toSearchResult));
          setTotalCount(count || 0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, category, sortBy, currentPage]);

  // Actualizar el estado local cuando cambian los parámetros de URL
  useEffect(() => {
    setSortBy(currentSortBy);
  }, [currentSortBy]);

  return (
    <div className="container mx-auto px-4 py-0">
      {/* Breadcrumb */}
      <div className="mb-0.5 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:text-teal-600">{locale === 'es' ? 'Inicio' : 'Home'}</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-gray-900">{locale === 'es' ? 'Resultados de búsqueda' : 'Search results'}</span>
      </div>

      {/* Search header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {totalCount > 0
            ? `${locale === 'es' ? 'Resultados para' : 'Results for'} "${query === '' ? categoryName : query}"`
            : query.length >= 2
              ? `${locale === 'es' ? 'No se encontraron resultados para' : 'No results found for'} "${query === '' ? categoryName : query}"`
              : `${locale === 'es' ? 'Buscar productos' : 'Search products'}`
          }
        </h1>
        {totalCount > 0 && (
          <p className="text-gray-500">Se encontraron {totalCount} productos</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
            <h2 className="font-medium text-lg mb-4 text-gray-800">{locale === 'es' ? 'Filtros' : 'Filters'}</h2>

            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-800">{locale === 'es' ? 'Categoría' : 'Category'}</h3>
              <div className="space-y-2 text-gray-800">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="Todas"
                    checked={category === 'Todas'}
                    className="text-teal-600"
                    onChange={() => updateSearchParams({ category: 'Todas' })}
                  />
                  <span className="ml-2">{locale === 'es' ? 'Todas las categorías' : 'All categories'}</span>
                </label>

                {/* Categorías dinámicas */}
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={cat.name}
                      checked={category === cat.name}
                      className="text-teal-600"
                      onChange={() => updateSearchParams({ category: cat.name })}
                    />
                    <span className="ml-2">{locale === 'es' ? cat.name_es : cat.name_en}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-800">{locale === 'es' ? 'Ordenar por' : 'Sort by'}</h3>
              <select
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateSearchParams({ sort: e.target.value });
                }}
              >
                <option value="relevance">{locale === 'es' ? 'Relevancia' : 'Relevance'}</option>
                <option value="price-asc">{locale === 'es' ? 'Precio: menor a mayor' : 'Price: lowest to highest'}</option>
                <option value="price-desc">{locale === 'es' ? 'Precio: mayor a menor' : 'Price: highest to lowest'}</option>
                <option value="newest">{locale === 'es' ? 'Más recientes' : 'Newest'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile filters button */}
        <div className="lg:hidden mb-2">
          <button
            className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md bg-white text-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {locale === 'es' ? 'Filtros y ordenación' : 'Filters and sorting'}
          </button>

          {showFilters && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md bg-white">
              <div className="mb-4">
                <h3 className="font-medium mb-2">{locale === 'es' ? 'Categoría' : 'Category'}</h3>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={category}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('category', e.target.value);
                    window.history.pushState(null, '', `?${params.toString()}`);
                  }}
                >
                  <option value="Todas">{locale === 'es' ? 'Todas las categorías' : 'All categories'}</option>
                  {/* Category options would be dynamically generated here */}
                </select>
              </div>

              <div>
                <h3 className="font-medium mb-2">{locale === 'es' ? 'Ordenar por' : 'Sort by'}</h3>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">{locale === 'es' ? 'Relevancia' : 'Relevance'}</option>
                  <option value="price-asc">{locale === 'es' ? 'Precio: menor a mayor' : 'Price: lowest to highest'}</option>
                  <option value="price-desc">{locale === 'es' ? 'Precio: mayor a menor' : 'Price: highest to lowest'}</option>
                  <option value="newest">{locale === 'es' ? 'Más recientes' : 'Newest'}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : totalCount > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                    <Link href={`/product/${product.name}`} className="block">
                      <div className="relative h-56 overflow-hidden bg-gray-50 flex items-center justify-center">
                        <Image
                          src={product.media?.[0]?.url || '/product-placeholder.png'}
                          alt={product.name || ''}
                          width={110}
                          height={0}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1 left-1 bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full border border-teal-100">
                          {locale === 'es' ? categories?.find((cat) => cat.id === product.category_id)?.name_es || 'Artesanía' : categories?.find((cat) => cat.id === product.category_id)?.name_en || 'Craft'}
                        </span>
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{locale === 'es' ? product.name_es : product.name_en}</h3>
                        {product.highlight && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.highlight}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-teal-700">
                            {product.dolar_price ? `${formatUSD(product.dolar_price)}` : (
                              <Link 
                                href={`https://wa.me/50684237555?text=${encodeURIComponent(
                                  locale === 'es' 
                                ? `¡Hola! Estoy interesado en el producto: ${product.name_es} (https://artehechoamano.com/product/${product.name}).\n¿Podrían darme más información?`
                                      : `Hello! I'm interested in the product: ${product.name_en} (https://handmadeart.store/product/${product.name}).\nCould you give me more information?`
                                )}`} 
                                target='_blank' 
                                rel="noopener noreferrer" 
                                 className="flex items-center justify-center w-full px-0.5 py-0.5 mr-0.5 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50 transition-colors"
                              >
                                {locale === 'es' ? 'Consultar precio' : 'Check price'}
                                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                                </svg>
                              </Link>
                            )}
                          </p>
                          <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-200">
                            {locale === 'es' ? 'Hecho a mano' : 'Handmade'}
                          </span>
                        </div>
                      </div>

                      <AddToCartButton product={product as Product} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalCount > PRODUCTS_PER_PAGE && (
                <div className="mt-8">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
                  />
                </div>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Image
                  src="/no-results.svg"
                  alt="No se encontraron resultados"
                  width={180}
                  height={180}
                  className="mx-auto opacity-80"
                />
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-2">{locale === 'es' ? 'No encontramos resultados para tu búsqueda' : 'No results found for your search'}</h2>
              <p className="text-gray-500 mb-6">{locale === 'es' ? 'Intenta con otros términos o navega por nuestras categorías' : 'Try with different terms or browse our categories'}</p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
              >
                {locale === 'es' ? 'Ver todos los productos' : 'See all products'}
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{locale === 'es' ? 'Ingresa al menos 2 caracteres para buscar' : 'Enter at least 2 characters to search'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}