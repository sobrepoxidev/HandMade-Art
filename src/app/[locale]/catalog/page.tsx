'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Check,
  Grid3X3,
  List,
  Minus,
  PackageOpen,
  Plus,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react';
import { InterestDrawer } from '@/components/catalog/InterestDrawer';
import { useDiscountCode, type DiscountCode } from '@/lib/hooks/useDiscountCode';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { supabase } from '@/lib/supabaseClient';
import { formatUSD } from '@/lib/formatCurrency';
import type { Database } from '@/lib/database.types';

type ProductCardView = Database['public']['Views']['product_card_view']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest';

interface CatalogProduct extends ProductCardView {
  id: number;
  name: string;
}

interface CatalogCategory {
  id: number;
  name: string;
  name_en: string | null;
  name_es: string | null;
}

interface PriceDetails {
  originalPrice: number;
  finalPrice: number;
  discountAmount: number;
}

const PRODUCT_COLUMNS = [
  'id',
  'name',
  'description',
  'category_id',
  'sku',
  'brand',
  'dolar_price',
  'discount_percentage',
  'weight_kg',
  'length_cm',
  'width_cm',
  'height_cm',
  'main_image_url',
].join(',');

function isCatalogProduct(row: ProductCardView): row is CatalogProduct {
  return typeof row.id === 'number' && typeof row.name === 'string' && row.name.trim().length > 0;
}

function getCategoryName(category: CatalogCategory | undefined, locale: string) {
  if (!category) return '';
  return (locale === 'es' ? category.name_es : category.name_en) || category.name;
}

function getPriceDetails(product: CatalogProduct, appliedCode: DiscountCode | null, calculateDiscount: ReturnType<typeof useDiscountCode>['calculateDiscount']): PriceDetails {
  const originalPrice = product.dolar_price ?? 0;
  const codeDiscount = appliedCode
    ? calculateDiscount(originalPrice, appliedCode, product.category_id ?? undefined, true)
    : null;

  if (codeDiscount?.isValid && codeDiscount.discountAmount > 0) {
    return {
      originalPrice,
      finalPrice: codeDiscount.finalPrice,
      discountAmount: codeDiscount.discountAmount,
    };
  }

  if (product.discount_percentage && product.discount_percentage > 0) {
    const discountAmount = originalPrice * (product.discount_percentage / 100);
    return {
      originalPrice,
      finalPrice: Math.max(0, originalPrice - discountAmount),
      discountAmount,
    };
  }

  return {
    originalPrice,
    finalPrice: originalPrice,
    discountAmount: 0,
  };
}

export default function CatalogPage() {
  const locale = useLocale();
  const interestList = useInterestList();
  const discountCode = useDiscountCode();

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalogData() {
      setLoading(true);

      const [categoryResponse, productResponse] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name, name_es, name_en')
          .order(locale === 'es' ? 'name_es' : 'name_en', { ascending: true }),
        supabase
          .from('product_card_view')
          .select(PRODUCT_COLUMNS)
          .order('name', { ascending: true }),
      ]);

      if (!categoryResponse.error && categoryResponse.data) {
        setCategories((categoryResponse.data as CategoryRow[]).map((category) => ({
          id: category.id,
          name: category.name,
          name_en: category.name_en,
          name_es: category.name_es,
        })));
      }

      if (!productResponse.error && productResponse.data) {
        setProducts((productResponse.data as unknown as ProductCardView[]).filter(isCatalogProduct));
      }

      setLoading(false);
    }

    loadCatalogData();
  }, [locale]);

  const categoryById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const nextProducts = products.filter((product) => {
      if (selectedCategory && product.category_id !== selectedCategory) return false;

      if (!normalizedQuery) return true;

      const searchable = [
        product.name,
        product.description,
        product.brand,
        product.sku,
        getCategoryName(categoryById.get(product.category_id ?? -1), locale),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });

    return [...nextProducts].sort((a, b) => {
      if (sortBy === 'price_asc') return (a.dolar_price ?? 0) - (b.dolar_price ?? 0);
      if (sortBy === 'price_desc') return (b.dolar_price ?? 0) - (a.dolar_price ?? 0);
      if (sortBy === 'newest') return b.id - a.id;
      return a.name.localeCompare(b.name);
    });
  }, [categoryById, locale, products, searchQuery, selectedCategory, sortBy]);

  const discountCategoryIds = discountCode.appliedCode?.apply_to_all_categories
    ? []
    : discountCode.appliedCode?.categories || [];
  const totalItems = interestList.getTotalItems();
  const selectedCategoryName = selectedCategory
    ? getCategoryName(categoryById.get(selectedCategory), locale)
    : locale === 'es' ? 'Todas las categorías' : 'All categories';

  const handleApplyDiscountCode = async () => {
    if (!discountCodeInput.trim()) return;

    setDiscountError('');
    setDiscountSuccess(false);

    const result = await discountCode.applyCode(discountCodeInput.trim());

    if (result.isValid) {
      setDiscountCodeInput('');
      setDiscountSuccess(true);
      return;
    }

    setDiscountError(
      result.errorMessage || (locale === 'es' ? 'Código inválido o expirado.' : 'Invalid or expired code.')
    );
  };

  const filterPanel = (
    <CatalogFilters
      locale={locale}
      categories={categories}
      selectedCategory={selectedCategory}
      selectedCategoryName={selectedCategoryName}
      discountCategoryIds={discountCategoryIds}
      hasGlobalDiscount={Boolean(discountCode.appliedCode?.apply_to_all_categories)}
      onSelectCategory={(categoryId) => {
        setSelectedCategory(categoryId);
        setShowMobileFilters(false);
      }}
    />
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF6EF] text-[#2D2D2D]">
      <section className="border-b border-[#E8E4E0] bg-[#F5F1EB]">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
                {locale === 'es' ? 'Catálogo de cotización' : 'Quote catalog'}
              </p>
              <h1 className="mt-3 font-display text-[clamp(34px,5vw,54px)] font-medium leading-[0.98] tracking-[-0.01em] text-[#2D2D2D]">
                {locale === 'es' ? 'Elige piezas para una solicitud personalizada.' : 'Choose pieces for a personalized request.'}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#4A4A4A]">
                {locale === 'es'
                  ? 'Arma una lista de interés con piezas disponibles, cantidades y notas. Te responderemos con una cotización revisada.'
                  : 'Build an interest list with available pieces, quantities and notes. We will reply with a reviewed quote.'}
              </p>
            </div>

            <div className="border border-[#E8E4E0] bg-[#FAF6EF] p-4">
              <label htmlFor="catalog-discount" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                <Tag className="h-4 w-4 text-[#A08848]" strokeWidth={1.75} aria-hidden />
                {locale === 'es' ? 'Código de descuento' : 'Discount code'}
              </label>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  id="catalog-discount"
                  value={discountCodeInput}
                  onChange={(event) => {
                    setDiscountCodeInput(event.target.value);
                    setDiscountError('');
                    setDiscountSuccess(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleApplyDiscountCode();
                  }}
                  className="h-11 min-w-0 flex-1 rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-3 text-sm text-[#2D2D2D] placeholder:text-[#6B6459] focus:border-[#A08848] focus:outline-none focus:ring-2 focus:ring-[#A08848]/25"
                  placeholder={locale === 'es' ? 'Ingresa tu código' : 'Enter your code'}
                />
                <button
                  type="button"
                  onClick={handleApplyDiscountCode}
                  disabled={discountCode.loading || !discountCodeInput.trim()}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-sm bg-[#2D2D2D] px-4 py-2 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A] disabled:bg-[#E8E4E0] disabled:text-[#6B6459] sm:w-auto"
                >
                  {discountCode.loading ? (locale === 'es' ? 'Aplicando' : 'Applying') : locale === 'es' ? 'Aplicar' : 'Apply'}
                </button>
              </div>
              {discountSuccess && discountCode.appliedCode && (
                <p className="mt-2 flex items-center gap-1 text-sm font-medium text-[#2F5F3E]">
                  <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {locale === 'es' ? `Código ${discountCode.appliedCode.code} aplicado.` : `Code ${discountCode.appliedCode.code} applied.`}
                </p>
              )}
              {discountError && (
                <p className="mt-2 text-sm font-medium text-[#9F2D24]">{discountError}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            {filterPanel}
          </aside>

          <div className="min-w-0">
            <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
              <label className="relative block">
                <span className="sr-only">{locale === 'es' ? 'Buscar productos' : 'Search products'}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6459]" strokeWidth={1.75} aria-hidden />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-12 w-full rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] pl-10 pr-3 text-sm text-[#2D2D2D] placeholder:text-[#6B6459] focus:border-[#A08848] focus:outline-none focus:ring-2 focus:ring-[#A08848]/25"
                  placeholder={locale === 'es' ? 'Buscar por pieza, material o SKU' : 'Search by piece, material or SKU'}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-4 py-2 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#A08848] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {locale === 'es' ? 'Filtros' : 'Filters'}
              </button>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-12 rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-3 text-sm text-[#2D2D2D] focus:border-[#A08848] focus:outline-none focus:ring-2 focus:ring-[#A08848]/25"
                aria-label={locale === 'es' ? 'Ordenar productos' : 'Sort products'}
              >
                <option value="name">{locale === 'es' ? 'Nombre A-Z' : 'Name A-Z'}</option>
                <option value="price_asc">{locale === 'es' ? 'Precio menor' : 'Lowest price'}</option>
                <option value="price_desc">{locale === 'es' ? 'Precio mayor' : 'Highest price'}</option>
                <option value="newest">{locale === 'es' ? 'Más recientes' : 'Newest'}</option>
              </select>

              <div className="inline-flex h-12 rounded-sm border border-[#E8E4E0]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`grid h-full w-12 place-items-center transition-colors ${viewMode === 'grid' ? 'bg-[#2D2D2D] text-[#F5F1EB]' : 'text-[#6B6459] hover:bg-[#F5F1EB]'}`}
                  aria-label={locale === 'es' ? 'Vista de cuadrícula' : 'Grid view'}
                >
                  <Grid3X3 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={`grid h-full w-12 place-items-center transition-colors ${viewMode === 'list' ? 'bg-[#2D2D2D] text-[#F5F1EB]' : 'text-[#6B6459] hover:bg-[#F5F1EB]'}`}
                  aria-label={locale === 'es' ? 'Vista de lista' : 'List view'}
                >
                  <List className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-[#E8E4E0] py-3">
              <p className="text-sm text-[#4A4A4A]">
                {loading
                  ? locale === 'es' ? 'Cargando piezas...' : 'Loading pieces...'
                  : `${filteredProducts.length} ${locale === 'es' ? 'de' : 'of'} ${products.length} ${locale === 'es' ? 'piezas' : 'pieces'}`}
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#C9A962] px-4 py-2 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {locale === 'es' ? 'Lista' : 'List'} ({totalItems})
              </button>
            </div>

            {loading ? (
              <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse border border-[#E8E4E0] bg-[#FAF6EF]">
                    <div className="aspect-square bg-[#F5F1EB]" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-2/3 bg-[#E8E4E0]" />
                      <div className="h-6 w-1/3 bg-[#E8E4E0]" />
                      <div className="h-11 bg-[#F5F1EB]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <CatalogProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    viewMode={viewMode}
                    categoryName={getCategoryName(categoryById.get(product.category_id ?? -1), locale)}
                    interestList={interestList}
                    appliedCode={discountCode.appliedCode}
                    calculateDiscount={discountCode.calculateDiscount}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-[#E8E4E0] bg-[#F5F1EB] px-6 py-14 text-center">
                <PackageOpen className="mx-auto h-7 w-7 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-4 font-display text-2xl font-medium text-[#2D2D2D]">
                  {locale === 'es' ? 'No hay piezas con esos filtros' : 'No pieces match those filters'}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
                  {locale === 'es'
                    ? 'Limpia la búsqueda o cambia de categoría para seguir explorando.'
                    : 'Clear the search or switch category to keep browsing.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-6 inline-flex min-h-[44px] items-center rounded-sm border border-[#E8E4E0] px-5 py-2.5 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#A08848]"
                >
                  {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/45 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto border border-[#E8E4E0] bg-[#FAF6EF] p-4 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-[#2D2D2D]">
                {locale === 'es' ? 'Filtros' : 'Filters'}
              </h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="grid h-11 w-11 place-items-center rounded-sm text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB]"
                aria-label={locale === 'es' ? 'Cerrar filtros' : 'Close filters'}
              >
                <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E4E0] bg-[#FAF6EF]/96 px-4 py-3 shadow-[0_-12px_36px_-18px_rgba(61,46,32,0.30)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#2D2D2D]">
              {totalItems} {totalItems === 1 ? (locale === 'es' ? 'pieza seleccionada' : 'piece selected') : (locale === 'es' ? 'piezas seleccionadas' : 'pieces selected')}
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-4 py-2 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {locale === 'es' ? 'Solicitar' : 'Request quote'}
            </button>
          </div>
        </div>
      )}

      <InterestDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        interestList={interestList}
        appliedDiscountCode={discountCode.appliedCode}
      />
      {totalItems > 0 && <div className="h-20" />}
    </main>
  );
}

function CatalogFilters({
  locale,
  categories,
  selectedCategory,
  selectedCategoryName,
  discountCategoryIds,
  hasGlobalDiscount,
  onSelectCategory,
}: {
  locale: string;
  categories: CatalogCategory[];
  selectedCategory: number | null;
  selectedCategoryName: string;
  discountCategoryIds: number[];
  hasGlobalDiscount: boolean;
  onSelectCategory: (categoryId: number | null) => void;
}) {
  return (
    <div className="border border-[#E8E4E0] bg-[#FAF6EF] p-4 lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-medium text-[#2D2D2D]">
            {locale === 'es' ? 'Categorias' : 'Categories'}
          </h2>
          <p className="mt-1 text-xs text-[#6B6459]">{selectedCategoryName}</p>
        </div>
        {(hasGlobalDiscount || discountCategoryIds.length > 0) && (
          <span className="rounded-sm border border-[#C9A962]/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A08848]">
            {locale === 'es' ? 'Oferta' : 'Offer'}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1 border-t border-[#E8E4E0] pt-4">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`flex min-h-[42px] w-full items-center justify-between rounded-sm px-3 text-left text-sm transition-colors ${selectedCategory === null ? 'bg-[#F5F1EB] font-semibold text-[#A08848]' : 'text-[#4A4A4A] hover:bg-[#F5F1EB]'}`}
        >
          {locale === 'es' ? 'Todas las categorías' : 'All categories'}
          {selectedCategory === null && <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
        </button>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const hasDiscount = hasGlobalDiscount || discountCategoryIds.includes(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`flex min-h-[42px] w-full items-center justify-between gap-3 rounded-sm px-3 text-left text-sm transition-colors ${isSelected ? 'bg-[#F5F1EB] font-semibold text-[#A08848]' : 'text-[#4A4A4A] hover:bg-[#F5F1EB]'}`}
            >
              <span>{getCategoryName(category, locale)}</span>
              <span className="flex items-center gap-2">
                {hasDiscount && <Tag className="h-3.5 w-3.5 text-[#A08848]" strokeWidth={1.75} aria-hidden />}
                {isSelected && <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CatalogProductCard({
  product,
  locale,
  viewMode,
  categoryName,
  interestList,
  appliedCode,
  calculateDiscount,
}: {
  product: CatalogProduct;
  locale: string;
  viewMode: ViewMode;
  categoryName: string;
  interestList: ReturnType<typeof useInterestList>;
  appliedCode: DiscountCode | null;
  calculateDiscount: ReturnType<typeof useDiscountCode>['calculateDiscount'];
}) {
  const [imageError, setImageError] = useState(false);
  const currentItem = interestList.getItem(product.id);
  const price = getPriceDetails(product, appliedCode, calculateDiscount);
  const hasDiscount = price.discountAmount > 0;
  const productHref = `/product/${encodeURIComponent(product.name)}`;
  const dimensions = [product.length_cm, product.width_cm, product.height_cm].every(Boolean)
    ? `${product.length_cm} x ${product.width_cm} x ${product.height_cm} cm`
    : null;

  const addToList = () => {
    interestList.addItem({
      product_id: product.id,
      name: product.name,
      sku: product.sku || undefined,
      main_image_url: product.main_image_url || undefined,
      price: price.finalPrice,
      dolar_price: product.dolar_price || 0,
      discount_percentage: product.discount_percentage || undefined,
      category_id: product.category_id || undefined,
    });
  };

  return (
    <article className={`group border border-[#E8E4E0] bg-[#FAF6EF] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)] ${viewMode === 'list' ? 'md:flex' : ''}`}>
      <Link
        href={productHref}
        className={`relative block bg-[#F5F1EB] ${viewMode === 'list' ? 'md:w-64 md:shrink-0' : ''}`}
        aria-label={product.name}
      >
        <div className="relative aspect-square">
          <Image
            src={imageError ? '/placeholder-image.png' : product.main_image_url || '/placeholder-image.png'}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            sizes={viewMode === 'list' ? '(max-width: 768px) 100vw, 16rem' : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'}
            onError={() => setImageError(true)}
          />
        </div>
        {categoryName && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#2D2D2D] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F5F1EB]">
            {categoryName}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <Link href={productHref} className="block">
            <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D] transition-colors group-hover:text-[#A08848]">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4A4A4A]">
              {product.description}
            </p>
          )}

          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B6459]">
            {product.sku && (
              <div>
                <dt className="sr-only">SKU</dt>
                <dd className="tabular-nums">SKU {product.sku}</dd>
              </div>
            )}
            {dimensions && (
              <div>
                <dt className="sr-only">{locale === 'es' ? 'Dimensiones' : 'Dimensions'}</dt>
                <dd>{dimensions}</dd>
              </div>
            )}
            {product.weight_kg && (
              <div>
                <dt className="sr-only">{locale === 'es' ? 'Peso' : 'Weight'}</dt>
                <dd>{product.weight_kg} kg</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              {hasDiscount && (
                <p className="text-xs text-[#6B6459] line-through tabular-nums">
                  {formatUSD(price.originalPrice)}
                </p>
              )}
              <p className="font-display text-2xl font-semibold tabular-nums text-[#2D2D2D]">
                {formatUSD(price.finalPrice)}
              </p>
            </div>
            {hasDiscount && (
              <span className="rounded-sm border border-[#C9A962]/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A08848]">
                {locale === 'es' ? 'Descuento' : 'Discount'}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            {currentItem ? (
              <div className="flex min-h-[44px] items-center justify-between rounded-sm border border-[#E8E4E0] px-2">
                <button
                  type="button"
                  onClick={() => interestList.updateQuantity(product.id, currentItem.qty - 1)}
                  className="grid h-10 w-10 place-items-center rounded-sm text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB]"
                  aria-label={locale === 'es' ? 'Reducir cantidad' : 'Decrease quantity'}
                >
                  <Minus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
                <span className="text-sm font-semibold tabular-nums text-[#2D2D2D]">
                  {currentItem.qty}
                </span>
                <button
                  type="button"
                  onClick={() => interestList.updateQuantity(product.id, currentItem.qty + 1)}
                  className="grid h-10 w-10 place-items-center rounded-sm text-[#2D2D2D] transition-colors hover:bg-[#F5F1EB]"
                  aria-label={locale === 'es' ? 'Aumentar cantidad' : 'Increase quantity'}
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={addToList}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-4 py-2 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {locale === 'es' ? 'Agregar' : 'Add'}
              </button>
            )}

            <Link
              href={productHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[#E8E4E0] px-4 py-2 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#A08848]"
            >
              {locale === 'es' ? 'Ver' : 'View'}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
