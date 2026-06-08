'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  AlertCircle,
  Archive,
  Boxes,
  CheckCircle,
  Copy,
  EyeOff,
  Grid3X3,
  Image as ImageIcon,
  List,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { Database } from '@/lib/database.types';
import ProductEditor from './ProductEditor';
import type { AdminMediaItem, AdminProduct, AdminProductPayload } from '@/lib/admin/products';

type Category = Database['public']['Tables']['categories']['Row'];
type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'active' | 'inactive' | 'featured' | 'out_of_stock';

interface AdminProductsResponse {
  products: AdminProduct[];
  categories: Category[];
  error?: string;
}

interface ProductActionResult {
  success: boolean;
  error?: string;
}

const PLACEHOLDER_IMAGE = 'https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/placeholder-Td0lfdJbjHebhgL5vOIH3UC8U6qIIB.webp';

function isMediaArray(value: unknown): value is AdminMediaItem[] {
  return Array.isArray(value) && value.every((item) => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'url' in item &&
      typeof (item as { url?: unknown }).url === 'string'
    );
  });
}

function getMedia(product: AdminProduct) {
  return product.media && isMediaArray(product.media) ? product.media : [];
}

function getMainImage(product: AdminProduct) {
  return getMedia(product)[0]?.url || PLACEHOLDER_IMAGE;
}

function getDisplayName(product: AdminProduct, locale: string) {
  if (locale === 'es') return product.name_es || product.name_en || product.name || `Producto #${product.id}`;
  return product.name_en || product.name_es || product.name || `Product #${product.id}`;
}

function formatUsd(value: number | null) {
  if (value === null || value === undefined) return 'US$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function productToPayload(product: AdminProduct, overrides: Partial<AdminProductPayload> = {}): AdminProductPayload {
  return {
    brand: product.brand,
    category_id: product.category_id,
    colon_price: product.colon_price,
    country_of_origin: product.country_of_origin,
    customs_description_en: product.customs_description_en,
    dangerous_goods: product.dangerous_goods,
    description: product.description,
    description_en: product.description_en,
    discount_percentage: product.discount_percentage,
    dolar_price: product.dolar_price,
    height_cm: product.height_cm,
    hs_code: product.hs_code,
    inventory_quantity: product.inventory_quantity,
    is_active: product.is_active,
    is_featured: product.is_featured,
    length_cm: product.length_cm,
    media: getMedia(product),
    name: product.name,
    name_en: product.name_en,
    name_es: product.name_es,
    sku: product.sku,
    specifications: product.specifications,
    tags: product.tags,
    weight_kg: product.weight_kg,
    width_cm: product.width_cm,
    ...overrides,
  };
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-[#E8E4E0] bg-[#F5F1EB] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B6459]">{label}</p>
        <Icon className="h-5 w-5 text-[#A08848]" strokeWidth={1.5} aria-hidden />
      </div>
      <p className="mt-3 font-display text-3xl font-medium tabular-nums text-[#2D2D2D]">{value}</p>
    </div>
  );
}

export default function AdminDashboard({ locale }: { locale: string }) {
  const isEs = locale === 'es';
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [editorProduct, setEditorProduct] = useState<AdminProduct | null | undefined>(undefined);
  const [busyProductId, setBusyProductId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/products', { credentials: 'same-origin' });
      const payload = await response.json() as AdminProductsResponse;

      if (!response.ok) {
        throw new Error(payload.error || (isEs ? 'No se pudo cargar el CMS.' : 'CMS data could not be loaded.'));
      }

      setProducts(payload.products || []);
      setCategories(payload.categories || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : isEs ? 'No se pudo cargar el CMS.' : 'CMS data could not be loaded.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isEs]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categoryById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const stats = useMemo(() => {
    const active = products.filter((product) => product.is_active).length;
    const featured = products.filter((product) => product.is_featured).length;
    const outOfStock = products.filter((product) => product.inventory_quantity <= 0).length;
    return { active, featured, outOfStock, total: products.length };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const category = product.category_id ? categoryById.get(product.category_id) : null;
      const searchable = [
        product.name,
        product.name_es,
        product.name_en,
        product.sku,
        category?.name,
        category?.name_es,
        category?.name_en,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesCategory = !categoryFilter || product.category_id === Number(categoryFilter);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && Boolean(product.is_active)) ||
        (statusFilter === 'inactive' && !product.is_active) ||
        (statusFilter === 'featured' && Boolean(product.is_featured)) ||
        (statusFilter === 'out_of_stock' && product.inventory_quantity <= 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryById, categoryFilter, products, searchTerm, statusFilter]);

  const saveProduct = useCallback(async (payload: AdminProductPayload, productId?: number): Promise<ProductActionResult> => {
    const endpoint = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
    const method = productId ? 'PATCH' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json() as { product?: AdminProduct; error?: string };

      if (!response.ok || !data.product) {
        throw new Error(data.error || (isEs ? 'No se pudo guardar el producto.' : 'Product could not be saved.'));
      }

      setProducts((current) => {
        if (productId) {
          return current.map((product) => product.id === productId ? data.product as AdminProduct : product);
        }
        return [data.product as AdminProduct, ...current];
      });
      setEditorProduct(undefined);
      toast.success(isEs ? 'Producto guardado.' : 'Product saved.');
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : isEs ? 'No se pudo guardar el producto.' : 'Product could not be saved.';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isEs]);

  const quickUpdate = async (product: AdminProduct, overrides: Partial<AdminProductPayload>) => {
    setBusyProductId(product.id);
    await saveProduct(productToPayload(product, overrides), product.id);
    setBusyProductId(null);
  };

  const duplicateProduct = async (product: AdminProduct) => {
    const sourceName = product.name || getDisplayName(product, locale);
    const copySuffix = Date.now().toString().slice(-5);
    const payload = productToPayload(product, {
      is_active: false,
      is_featured: false,
      name: `${sourceName}-copy-${copySuffix}`,
      name_en: `${product.name_en || sourceName} copy`,
      name_es: `${product.name_es || sourceName} copia`,
      sku: product.sku ? `${product.sku}-COPY` : null,
    });

    setBusyProductId(product.id);
    await saveProduct(payload);
    setBusyProductId(null);
  };

  const archiveProduct = async (product: AdminProduct) => {
    const confirmed = window.confirm(
      isEs
        ? `¿Archivar "${getDisplayName(product, locale)}"? Se ocultará de la tienda, pero se conserva el historial.`
        : `Archive "${getDisplayName(product, locale)}"? It will be hidden from the storefront but history is preserved.`
    );
    if (!confirmed) return;

    setBusyProductId(product.id);
    try {
      const response = await fetch(`/api/admin/products/${product.id}?mode=archive`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await response.json() as { product?: AdminProduct; error?: string };

      if (!response.ok || !data.product) {
        throw new Error(data.error || (isEs ? 'No se pudo archivar el producto.' : 'Product could not be archived.'));
      }

      setProducts((current) => current.map((item) => item.id === product.id ? data.product as AdminProduct : item));
      toast.success(isEs ? 'Producto archivado.' : 'Product archived.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : isEs ? 'No se pudo archivar.' : 'Could not archive.');
    } finally {
      setBusyProductId(null);
    }
  };

  const deleteProduct = async (product: AdminProduct) => {
    const productName = product.name || getDisplayName(product, locale);
    const typed = window.prompt(
      isEs
        ? `Borrado definitivo. Escribí exactamente "${productName}" para confirmar.`
        : `Permanent delete. Type exactly "${productName}" to confirm.`
    );

    if (typed !== productName) return;

    setBusyProductId(product.id);
    try {
      const response = await fetch(`/api/admin/products/${product.id}?mode=hard`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await response.json() as { deleted?: boolean; error?: string };

      if (!response.ok || !data.deleted) {
        throw new Error(
          data.error ||
          (isEs
            ? 'No se pudo borrar. Si tiene historial de compra o cotización, archivá el producto.'
            : 'Could not delete. If it has order or quote history, archive the product instead.')
        );
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
      toast.success(isEs ? 'Producto borrado.' : 'Product deleted.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : isEs ? 'No se pudo borrar.' : 'Could not delete.');
    } finally {
      setBusyProductId(null);
    }
  };

  if (editorProduct !== undefined) {
    return (
      <ProductEditor
        locale={locale}
        product={editorProduct}
        categories={categories}
        onSave={saveProduct}
        onCancel={() => setEditorProduct(undefined)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 py-8 text-[#2D2D2D] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="flex flex-col gap-5 border-b border-[#E8E4E0] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              {isEs ? 'Administración' : 'Administration'}
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium text-[#2D2D2D] md:text-5xl">
              {isEs ? 'CMS de productos' : 'Product CMS'}
            </h1>
            <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-[#4A4A4A] md:text-base">
              {isEs
                ? 'Crear, editar, publicar, archivar y borrar productos desde un solo lugar. Los cambios impactan catálogo, búsqueda, detalle de producto, carrito e inventario.'
                : 'Create, edit, publish, archive and delete products from one place. Changes affect catalog, search, product detail, cart and inventory.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditorProduct(null)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {isEs ? 'Nuevo producto' : 'New product'}
          </button>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={isEs ? 'Resumen de productos' : 'Products summary'}>
          <StatTile icon={Package} label={isEs ? 'Productos' : 'Products'} value={stats.total} />
          <StatTile icon={CheckCircle} label={isEs ? 'Publicados' : 'Published'} value={stats.active} />
          <StatTile icon={Star} label={isEs ? 'Destacados' : 'Featured'} value={stats.featured} />
          <StatTile icon={Boxes} label={isEs ? 'Sin stock' : 'Out of stock'} value={stats.outOfStock} />
        </section>

        <section className="mt-6 border border-[#E8E4E0] bg-[#F5F1EB] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
            <div>
              <label htmlFor="product-search" className="sr-only">
                {isEs ? 'Buscar productos' : 'Search products'}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                <input
                  id="product-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={isEs ? 'Buscar por nombre, SKU o categoría...' : 'Search by name, SKU or category...'}
                  className="min-h-[44px] w-full rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] py-2.5 pl-10 pr-3 text-sm text-[#2D2D2D] outline-none placeholder:text-[#6B6459]/70 focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="min-h-[44px] rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] px-3 py-2.5 text-sm text-[#2D2D2D] outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
              aria-label={isEs ? 'Filtrar por estado' : 'Filter by status'}
            >
              <option value="all">{isEs ? 'Todos los estados' : 'All statuses'}</option>
              <option value="active">{isEs ? 'Publicados' : 'Published'}</option>
              <option value="inactive">{isEs ? 'Archivados' : 'Archived'}</option>
              <option value="featured">{isEs ? 'Destacados' : 'Featured'}</option>
              <option value="out_of_stock">{isEs ? 'Sin stock' : 'Out of stock'}</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="min-h-[44px] rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] px-3 py-2.5 text-sm text-[#2D2D2D] outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
              aria-label={isEs ? 'Filtrar por categoría' : 'Filter by category'}
            >
              <option value="">{isEs ? 'Todas las categorías' : 'All categories'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {(isEs ? category.name_es : category.name_en) || category.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void loadProducts()}
                disabled={loading}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition hover:border-[#A08848] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} aria-hidden />
                {isEs ? 'Actualizar' : 'Refresh'}
              </button>
              <div className="flex border border-[#E8E4E0] bg-[#FFFDF9]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label={isEs ? 'Vista de cuadrícula' : 'Grid view'}
                  aria-pressed={viewMode === 'grid'}
                  className={`grid h-11 w-11 place-items-center ${viewMode === 'grid' ? 'bg-[#2D2D2D] text-[#F5F1EB]' : 'text-[#6B6459]'}`}
                >
                  <Grid3X3 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label={isEs ? 'Vista de lista' : 'List view'}
                  aria-pressed={viewMode === 'list'}
                  className={`grid h-11 w-11 place-items-center ${viewMode === 'list' ? 'bg-[#2D2D2D] text-[#F5F1EB]' : 'text-[#6B6459]'}`}
                >
                  <List className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex gap-3 border border-[#C44536] bg-[#FFFDF9] p-4 text-sm text-[#9F2D24]" role="alert">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[360px] animate-pulse border border-[#E8E4E0] bg-[#F5F1EB]" />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="mt-6 flex min-h-[260px] flex-col items-center justify-center border border-dashed border-[#E8E4E0] bg-[#F5F1EB] p-8 text-center">
            <Package className="h-8 w-8 text-[#A08848]" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 font-display text-2xl font-medium text-[#2D2D2D]">
              {isEs ? 'No hay productos para este filtro' : 'No products match this filter'}
            </h2>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-[#6B6459]">
              {isEs ? 'Probá limpiar búsqueda o crear un producto nuevo.' : 'Try clearing search or create a new product.'}
            </p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <section
            className={
              viewMode === 'grid'
                ? 'mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
                : 'mt-6 space-y-3'
            }
          >
            {filteredProducts.map((product) => {
              const category = product.category_id ? categoryById.get(product.category_id) : null;
              const displayName = getDisplayName(product, locale);
              const busy = busyProductId === product.id;
              const statusLabel = product.is_active ? (isEs ? 'Publicado' : 'Published') : (isEs ? 'Archivado' : 'Archived');
              const stockLabel = product.inventory_quantity <= 0
                ? isEs ? 'Sin stock' : 'Out of stock'
                : `${product.inventory_quantity} ${isEs ? 'en stock' : 'in stock'}`;

              if (viewMode === 'list') {
                return (
                  <article key={product.id} className="grid gap-4 border border-[#E8E4E0] bg-[#F5F1EB] p-3 md:grid-cols-[88px_1fr_auto] md:items-center">
                    <ProductThumb src={getMainImage(product)} alt={displayName} size="small" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-xl font-medium text-[#2D2D2D]">{displayName}</h2>
                        {product.is_featured && <StatusBadge tone="gold" label={isEs ? 'Destacado' : 'Featured'} />}
                        <StatusBadge tone={product.is_active ? 'success' : 'muted'} label={statusLabel} />
                      </div>
                      <p className="mt-1 text-sm text-[#6B6459]">
                        {product.sku ? `SKU ${product.sku}` : isEs ? 'Sin SKU' : 'No SKU'} · {(isEs ? category?.name_es : category?.name_en) || category?.name || (isEs ? 'Sin categoría' : 'No category')}
                      </p>
                    </div>
                    <ProductActions
                      busy={busy}
                      isEs={isEs}
                      onArchive={() => void archiveProduct(product)}
                      onDelete={() => void deleteProduct(product)}
                      onDuplicate={() => void duplicateProduct(product)}
                      onEdit={() => setEditorProduct(product)}
                      onToggleActive={() => void quickUpdate(product, { is_active: !product.is_active })}
                      onToggleFeatured={() => void quickUpdate(product, { is_featured: !product.is_featured })}
                      product={product}
                    />
                  </article>
                );
              }

              return (
                <article key={product.id} className="group flex min-h-[420px] flex-col border border-[#E8E4E0] bg-[#F5F1EB] transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]">
                  <button type="button" onClick={() => setEditorProduct(product)} className="relative aspect-square w-full overflow-hidden border-b border-[#E8E4E0] bg-[#FFFDF9]">
                    <ProductThumb src={getMainImage(product)} alt={displayName} size="large" />
                  </button>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={product.is_active ? 'success' : 'muted'} label={statusLabel} />
                      {product.is_featured && <StatusBadge tone="gold" label={isEs ? 'Destacado' : 'Featured'} />}
                      <StatusBadge tone={product.inventory_quantity <= 0 ? 'error' : 'muted'} label={stockLabel} />
                    </div>

                    <h2 className="mt-4 font-display text-xl font-medium leading-tight text-[#2D2D2D]">
                      {displayName}
                    </h2>
                    <p className="mt-2 text-sm text-[#6B6459]">
                      {(isEs ? category?.name_es : category?.name_en) || category?.name || (isEs ? 'Sin categoría' : 'No category')}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#E8E4E0] pt-4 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-[0.08em] text-[#6B6459]">{isEs ? 'Precio' : 'Price'}</p>
                        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-[#2D2D2D]">
                          {formatUsd(product.dolar_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.08em] text-[#6B6459]">{isEs ? 'Descuento' : 'Discount'}</p>
                        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-[#2D2D2D]">
                          {product.discount_percentage ? `${product.discount_percentage}%` : '0%'}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#6B6459]">
                      {product.sku ? `SKU ${product.sku}` : isEs ? 'Sin SKU' : 'No SKU'}
                    </p>

                    <div className="mt-auto pt-4">
                      <ProductActions
                        busy={busy}
                        isEs={isEs}
                        onArchive={() => void archiveProduct(product)}
                        onDelete={() => void deleteProduct(product)}
                        onDuplicate={() => void duplicateProduct(product)}
                        onEdit={() => setEditorProduct(product)}
                        onToggleActive={() => void quickUpdate(product, { is_active: !product.is_active })}
                        onToggleFeatured={() => void quickUpdate(product, { is_featured: !product.is_featured })}
                        product={product}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: 'success' | 'error' | 'gold' | 'muted' }) {
  const className = {
    success: 'border-[#4A7C59]/35 text-[#2F5F3E]',
    error: 'border-[#C44536]/35 text-[#9F2D24]',
    gold: 'border-[#C9A962]/45 text-[#A08848]',
    muted: 'border-[#E8E4E0] text-[#6B6459]',
  }[tone];

  return (
    <span className={`inline-flex min-h-[26px] items-center border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${className}`}>
      {label}
    </span>
  );
}

function ProductThumb({ src, alt, size }: { src: string; alt: string; size: 'small' | 'large' }) {
  return (
    <div className={`relative overflow-hidden bg-[#FFFDF9] ${size === 'small' ? 'h-[88px] w-[88px] border border-[#E8E4E0]' : 'h-full w-full'}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={size === 'small' ? '88px' : '(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw'} className="object-contain p-3 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" unoptimized />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="h-6 w-6 text-[#A08848]" strokeWidth={1.5} aria-hidden />
        </div>
      )}
    </div>
  );
}

function ProductActions({
  busy,
  isEs,
  onArchive,
  onDelete,
  onDuplicate,
  onEdit,
  onToggleActive,
  onToggleFeatured,
  product,
}: {
  busy: boolean;
  isEs: boolean;
  onArchive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  product: AdminProduct;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
      <ActionButton icon={Pencil} label={isEs ? 'Editar' : 'Edit'} onClick={onEdit} primary />
      <ActionButton icon={Copy} label={isEs ? 'Duplicar' : 'Duplicate'} onClick={onDuplicate} disabled={busy} />
      <ActionButton icon={product.is_active ? EyeOff : CheckCircle} label={product.is_active ? (isEs ? 'Ocultar' : 'Hide') : (isEs ? 'Publicar' : 'Publish')} onClick={onToggleActive} disabled={busy} />
      <ActionButton icon={Star} label={product.is_featured ? (isEs ? 'Quitar destacado' : 'Unfeature') : (isEs ? 'Destacar' : 'Feature')} onClick={onToggleFeatured} disabled={busy} />
      <ActionButton icon={Archive} label={isEs ? 'Archivar' : 'Archive'} onClick={onArchive} disabled={busy} />
      <ActionButton icon={Trash2} label={isEs ? 'Borrar' : 'Delete'} onClick={onDelete} disabled={busy} danger />
    </div>
  );
}

function ActionButton({
  danger = false,
  disabled = false,
  icon: Icon,
  label,
  onClick,
  primary = false,
}: {
  danger?: boolean;
  disabled?: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  const className = primary
    ? 'border-[#2D2D2D] bg-[#2D2D2D] text-[#F5F1EB] hover:bg-[#1A1A1A]'
    : danger
      ? 'border-[#C44536] text-[#9F2D24] hover:bg-[#FFFDF9]'
      : 'border-[#E8E4E0] text-[#2D2D2D] hover:border-[#A08848] hover:bg-[#FFFDF9]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-sm border px-3 py-2 text-xs font-semibold tracking-wide transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848] ${className}`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      {label}
    </button>
  );
}
