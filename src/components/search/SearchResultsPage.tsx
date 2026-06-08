'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import PaginationControls from '@/components/products/PaginationControls';
import { supabase } from '@/lib/supabaseClient';
import { searchProducts, type SearchResult } from '@/lib/search';
import type { Database, Json } from '@/lib/database.types';

const PRODUCTS_PER_PAGE = 12;

type Category = Database['public']['Tables']['categories']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type ProductWithInventory = Product & {
  inventory?: { quantity: number | null }[] | { quantity: number | null } | null;
};

function isAllCategory(value: string) {
  return ['Todo', 'Todas', 'All', ''].includes(value);
}

function getInventoryQuantity(product: ProductWithInventory) {
  if (Array.isArray(product.inventory)) return product.inventory[0]?.quantity ?? null;
  return product.inventory?.quantity ?? null;
}

function toProductRow(result: SearchResult): Product {
  return {
    brand: null,
    category_id: result.category_id,
    colon_price: result.colon_price,
    country_of_origin: null,
    created_at: result.created_at || new Date().toISOString(),
    customs_description_en: null,
    dangerous_goods: false,
    description: result.description,
    description_en: null,
    discount_percentage: result.discount_percentage ?? null,
    dolar_price: result.dolar_price,
    height_cm: 0,
    hs_code: null,
    id: result.id,
    is_active: true,
    is_featured: false,
    length_cm: 0,
    media: result.media as Json,
    modified_at: null,
    name: result.name,
    name_en: result.name_en,
    name_es: result.name_es,
    sku: null,
    specifications: null,
    tags: null,
    weight_kg: 0,
    width_cm: 0,
  };
}

export default function SearchResultsPage({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const category = searchParams.get('category') || 'Todas';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sort') || 'relevance';
  const isCategoryFilter = !isAllCategory(category);

  const [results, setResults] = useState<ProductWithInventory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_es, name_en')
        .order(locale === 'es' ? 'name_es' : 'name_en', { ascending: true });

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      setCategories((data || []) as Category[]);
      const selectedCategory = (data || []).find((cat) => cat.id === Number(category));
      setCategoryName(
        selectedCategory
          ? (locale === 'es' ? selectedCategory.name_es : selectedCategory.name_en) || selectedCategory.name || ''
          : ''
      );
    }

    fetchCategories();
  }, [category, locale]);

  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });

    if (Object.keys(updates).some((key) => key !== 'page')) {
      params.set('page', '1');
    }

    router.push(`/search?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    async function fetchResults() {
      if (!isCategoryFilter && query.length < 2) {
        setResults([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
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
          setResults(data.map((item) => toProductRow(item)));
          setTotalCount(totalCount);
        } else {
          const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
          const to = from + PRODUCTS_PER_PAGE - 1;

          const { data, count, error } = await supabase
            .from('products')
            .select('*, inventory(quantity)', { count: 'exact' })
            .eq('is_active', true)
            .eq('category_id', Number(category))
            .order('created_at', { ascending: false })
            .range(from, to);

          if (error) throw error;

          setResults((data || []) as ProductWithInventory[]);
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
  }, [query, category, sortBy, currentPage, isCategoryFilter, locale]);

  const fallbackCategoryName = isCategoryFilter
    ? locale === 'es' ? 'categoría seleccionada' : 'selected category'
    : '';
  const titleTarget = query || categoryName || fallbackCategoryName;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  const title = loading
    ? query.length >= 2
      ? `${locale === 'es' ? 'Buscando' : 'Searching'} "${query}"`
      : isCategoryFilter
        ? `${locale === 'es' ? 'Cargando' : 'Loading'} ${categoryName || fallbackCategoryName}`
        : locale === 'es' ? 'Buscar productos' : 'Search products'
    : totalCount > 0
      ? `${locale === 'es' ? 'Resultados para' : 'Results for'} "${titleTarget}"`
      : query.length >= 2 || isCategoryFilter
        ? `${locale === 'es' ? 'Sin resultados para' : 'No results for'} "${titleTarget}"`
        : locale === 'es' ? 'Buscar productos' : 'Search products';

  return (
    <main className="min-h-screen bg-[#FAF6EF]">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-8 lg:px-12">
        <nav className="mb-3 flex items-center text-sm text-[#6B6459]" aria-label={locale === 'es' ? 'Migas de pan' : 'Breadcrumb'}>
          <Link href="/" className="transition-colors hover:text-[#A08848]">
            {locale === 'es' ? 'Inicio' : 'Home'}
          </Link>
          <ChevronRight className="mx-1 h-4 w-4" strokeWidth={1.75} aria-hidden />
          <span className="font-medium text-[#2D2D2D]">
            {locale === 'es' ? 'Búsqueda' : 'Search'}
          </span>
        </nav>

        <header className="mb-6 max-w-3xl">
          <h1 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
            {loading
              ? locale === 'es'
                ? 'Preparando piezas disponibles y filtros de compra.'
                : 'Preparing available pieces and shopping filters.'
              : totalCount > 0
              ? `${locale === 'es' ? 'Encontramos' : 'Found'} ${totalCount} ${locale === 'es' ? 'productos listos para comprar.' : 'products ready to shop.'}`
              : locale === 'es'
                ? 'Explora por categoría o escribe al menos dos caracteres en la barra de búsqueda.'
                : 'Browse by category or type at least two characters in the search bar.'}
          </p>
        </header>

        <div className="flex flex-col gap-5 lg:flex-row">
          <aside className="hidden w-64 shrink-0 lg:block">
            <SearchFilters
              locale={locale}
              category={category}
              sortBy={sortBy}
              categories={categories}
              onChange={updateSearchParams}
            />
          </aside>

          <div className="lg:hidden">
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-4 py-2 text-sm font-medium text-[#2D2D2D]"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {locale === 'es' ? 'Filtros y orden' : 'Filters and sort'}
            </button>

            {showFilters && (
              <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40">
                <div className="absolute inset-x-0 bottom-0 border border-[#E8E4E0] bg-[#FAF6EF] p-4 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-display text-xl font-medium text-[#2D2D2D]">
                      {locale === 'es' ? 'Filtros' : 'Filters'}
                    </h2>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-sm text-[#2D2D2D] hover:bg-[#F5F1EB]"
                      onClick={() => setShowFilters(false)}
                      aria-label={locale === 'es' ? 'Cerrar filtros' : 'Close filters'}
                    >
                      <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </button>
                  </div>
                  <SearchFilters
                    locale={locale}
                    category={category}
                    sortBy={sortBy}
                    categories={categories}
                    onChange={(updates) => {
                      updateSearchParams(updates);
                      setShowFilters(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <section className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
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
            ) : totalCount > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categoryName={
                        (locale === 'es'
                          ? categories.find((cat) => cat.id === product.category_id)?.name_es
                          : categories.find((cat) => cat.id === product.category_id)?.name_en) || undefined
                      }
                      inventoryQuantity={getInventoryQuantity(product)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <PaginationControls currentPage={currentPage} totalPages={totalPages} />
                )}
              </>
            ) : (
              <div className="rounded-sm border border-[#E8E4E0] bg-[#F5F1EB] p-8 text-center">
                <h2 className="font-display text-xl font-medium text-[#2D2D2D]">
                  {locale === 'es' ? 'No encontramos piezas' : 'No pieces found'}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
                  {locale === 'es'
                    ? 'Prueba con otra categoría o revisa el catálogo completo.'
                    : 'Try another category or browse the full catalog.'}
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
                >
                  {locale === 'es' ? 'Ver catálogo' : 'Browse catalog'}
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function SearchFilters({
  locale,
  category,
  sortBy,
  categories,
  onChange,
}: {
  locale: string;
  category: string;
  sortBy: string;
  categories: Category[];
  onChange: (updates: Record<string, string | null>) => void;
}) {
  return (
    <div className="border border-[#E8E4E0] bg-[#FAF6EF] p-4 lg:sticky lg:top-24">
      <h2 className="font-display text-xl font-medium text-[#2D2D2D]">
        {locale === 'es' ? 'Refinar' : 'Refine'}
      </h2>

      <fieldset className="mt-4 border-t border-[#E8E4E0] pt-4">
        <legend className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B6459]">
          {locale === 'es' ? 'Categoría' : 'Category'}
        </legend>
        <div className="mt-3 space-y-1">
          <label className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-[#4A4A4A] hover:bg-[#F5F1EB]">
            <input
              type="radio"
              name="category"
              value="Todas"
              checked={isAllCategory(category)}
              onChange={() => onChange({ category: null })}
              className="h-4 w-4 accent-[#A08848]"
            />
            {locale === 'es' ? 'Todas las categorías' : 'All categories'}
          </label>

          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-[#4A4A4A] hover:bg-[#F5F1EB]"
            >
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={category === String(cat.id)}
                onChange={() => onChange({ category: String(cat.id) })}
                className="h-4 w-4 accent-[#A08848]"
              />
              {(locale === 'es' ? cat.name_es : cat.name_en) || cat.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block border-t border-[#E8E4E0] pt-4 text-xs font-medium uppercase tracking-[0.08em] text-[#6B6459]">
        {locale === 'es' ? 'Ordenar por' : 'Sort by'}
        <select
          className="mt-2 h-11 w-full rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-3 text-sm normal-case tracking-normal text-[#2D2D2D] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
          value={sortBy}
          onChange={(event) => onChange({ sort: event.target.value })}
        >
          <option value="relevance">{locale === 'es' ? 'Relevancia' : 'Relevance'}</option>
          <option value="price-asc">{locale === 'es' ? 'Precio: menor a mayor' : 'Price: lowest to highest'}</option>
          <option value="price-desc">{locale === 'es' ? 'Precio: mayor a menor' : 'Price: highest to lowest'}</option>
          <option value="newest">{locale === 'es' ? 'Más recientes' : 'Newest'}</option>
        </select>
      </label>
    </div>
  );
}
