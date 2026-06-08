'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Database } from '@/lib/database.types';
import type { AdminMediaItem, AdminProduct, AdminProductPayload } from '@/lib/admin/products';

type Category = Database['public']['Tables']['categories']['Row'];

interface ProductEditorProps {
  locale: string;
  product: AdminProduct | null;
  categories: Category[];
  onSave: (payload: AdminProductPayload, productId?: number) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

interface ProductFormState {
  brand: string;
  categoryId: string;
  colonPrice: string;
  countryOfOrigin: string;
  customsDescriptionEn: string;
  dangerousGoods: boolean;
  description: string;
  descriptionEn: string;
  discountPercentage: string;
  dolarPrice: string;
  heightCm: string;
  hsCode: string;
  inventoryQuantity: string;
  isActive: boolean;
  isFeatured: boolean;
  lengthCm: string;
  media: AdminMediaItem[];
  name: string;
  nameEn: string;
  nameEs: string;
  sku: string;
  specificationsText: string;
  tagsText: string;
  weightKg: string;
  widthCm: string;
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
}

interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface ToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const INPUT_CLASS =
  'min-h-[44px] w-full rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] px-3 py-2.5 text-sm text-[#2D2D2D] outline-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-[#6B6459]/70 focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25';

const LABEL_CLASS = 'mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-[#6B6459]';
const MEDIA_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime';

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

function numberToField(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value);
}

function productToForm(product: AdminProduct | null): ProductFormState {
  const media = product?.media && isMediaArray(product.media) ? product.media : [];
  const specifications =
    product?.specifications && typeof product.specifications === 'object'
      ? JSON.stringify(product.specifications, null, 2)
      : '';

  return {
    brand: product?.brand || 'Handmade Art',
    categoryId: product?.category_id ? String(product.category_id) : '',
    colonPrice: numberToField(product?.colon_price),
    countryOfOrigin: product?.country_of_origin || 'Costa Rica',
    customsDescriptionEn: product?.customs_description_en || '',
    dangerousGoods: product?.dangerous_goods ?? false,
    description: product?.description || '',
    descriptionEn: product?.description_en || '',
    discountPercentage: numberToField(product?.discount_percentage),
    dolarPrice: numberToField(product?.dolar_price),
    heightCm: numberToField(product?.height_cm),
    hsCode: product?.hs_code || '',
    inventoryQuantity: numberToField(product?.inventory_quantity ?? 0),
    isActive: product?.is_active ?? true,
    isFeatured: product?.is_featured ?? false,
    lengthCm: numberToField(product?.length_cm),
    media,
    name: product?.name || product?.name_en || product?.name_es || '',
    nameEn: product?.name_en || product?.name || '',
    nameEs: product?.name_es || product?.name || '',
    sku: product?.sku || '',
    specificationsText: specifications,
    tagsText: Array.isArray(product?.tags) ? product.tags.join(', ') : '',
    weightKg: numberToField(product?.weight_kg),
    widthCm: numberToField(product?.width_cm),
  };
}

function toNumberOrNull(value: string) {
  const cleaned = value.trim();
  if (!cleaned) return null;
  return Number(cleaned);
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  max,
  step,
  required = false,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        className={INPUT_CLASS}
      />
    </div>
  );
}

function TextArea({ id, label, value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${INPUT_CLASS} min-h-[112px] resize-y leading-relaxed`}
      />
    </div>
  );
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[58px] cursor-pointer items-center justify-between gap-4 rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] px-4 py-3"
    >
      <span>
        <span className="block text-sm font-semibold text-[#2D2D2D]">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-[#6B6459]">{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded-sm border-[#E8E4E0] accent-[#2D2D2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
      />
    </label>
  );
}

export default function ProductEditor({ locale, product, categories, onSave, onCancel }: ProductEditorProps) {
  const isEs = locale === 'es';
  const isEditing = Boolean(product);
  const [form, setForm] = useState<ProductFormState>(() => productToForm(product));
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<number | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copy = useMemo(() => ({
    title: isEditing
      ? isEs ? 'Editar producto' : 'Edit product'
      : isEs ? 'Nuevo producto' : 'New product',
    subtitle: isEs
      ? 'Gestioná el contenido completo que usa la tienda pública: ficha, SEO básico, precios, media, stock y estado.'
      : 'Manage the full content used by the storefront: listing data, basic SEO, prices, media, stock and status.',
    save: isEditing
      ? isEs ? 'Guardar producto' : 'Save product'
      : isEs ? 'Crear producto' : 'Create product',
    saving: isEs ? 'Guardando...' : 'Saving...',
    cancel: isEs ? 'Cerrar' : 'Close',
  }), [isEditing, isEs]);

  const primaryImage = form.media[0]?.url || '';

  const setField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setMediaItem = (index: number, patch: Partial<AdminMediaItem>) => {
    setForm((current) => ({
      ...current,
      media: current.media.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  };

  const addMediaItem = () => {
    setForm((current) => ({
      ...current,
      media: [
        ...current.media,
        {
          url: '',
          type: 'image',
          alt: current.nameEs || current.nameEn || current.name || undefined,
        },
      ],
    }));
  };

  const removeMediaItem = (index: number) => {
    setForm((current) => ({
      ...current,
      media: current.media.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const moveMediaItem = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.media.length) return current;
      const media = [...current.media];
      const [item] = media.splice(index, 1);
      media.splice(nextIndex, 0, item);
      return { ...current, media };
    });
  };

  const uploadMediaFile = async (file: File, index?: number) => {
    const target = typeof index === 'number' ? index : 'new';
    setUploadingMedia(target);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/product-media', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });
      const payload = await response.json() as { url?: string; type?: 'image' | 'video'; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || (isEs ? 'No se pudo subir el archivo.' : 'Media file could not be uploaded.'));
      }

      const nextItem: AdminMediaItem = {
        url: payload.url,
        type: payload.type === 'video' ? 'video' : 'image',
        alt: form.nameEs || form.nameEn || form.name || undefined,
      };

      if (typeof index === 'number') {
        setMediaItem(index, nextItem);
      } else {
        setForm((current) => ({
          ...current,
          media: [...current.media, nextItem],
        }));
      }

      toast.success(isEs ? 'Archivo subido.' : 'Media uploaded.');
    } catch (err) {
      const message = err instanceof Error ? err.message : isEs ? 'No se pudo subir el archivo.' : 'Media file could not be uploaded.';
      setError(message);
      toast.error(message);
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleNewMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    void uploadMediaFile(file);
  };

  const handleReplaceMediaUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    void uploadMediaFile(file, index);
  };

  const buildPayload = (): AdminProductPayload => {
    const canonicalName = form.name.trim() || form.nameEn.trim() || form.nameEs.trim();
    if (!canonicalName) {
      throw new Error(isEs ? 'El nombre para URL es obligatorio.' : 'The URL name is required.');
    }

    if (/[/?#]/.test(canonicalName)) {
      throw new Error(isEs ? 'El nombre para URL no puede incluir /, ? ni #.' : 'The URL name cannot include /, ? or #.');
    }

    let specifications = null;
    if (form.specificationsText.trim()) {
      try {
        specifications = JSON.parse(form.specificationsText);
      } catch {
        throw new Error(isEs ? 'El JSON de especificaciones no es válido.' : 'The specifications JSON is invalid.');
      }
    }

    return {
      brand: form.brand,
      category_id: form.categoryId ? Number(form.categoryId) : null,
      colon_price: toNumberOrNull(form.colonPrice),
      country_of_origin: form.countryOfOrigin,
      customs_description_en: form.customsDescriptionEn,
      dangerous_goods: form.dangerousGoods,
      description: form.description,
      description_en: form.descriptionEn,
      discount_percentage: toNumberOrNull(form.discountPercentage),
      dolar_price: toNumberOrNull(form.dolarPrice),
      height_cm: toNumberOrNull(form.heightCm),
      hs_code: form.hsCode,
      inventory_quantity: toNumberOrNull(form.inventoryQuantity),
      is_active: form.isActive,
      is_featured: form.isFeatured,
      length_cm: toNumberOrNull(form.lengthCm),
      media: form.media.filter((item) => item.url.trim().length > 0),
      name: canonicalName,
      name_en: form.nameEn,
      name_es: form.nameEs,
      sku: form.sku,
      specifications,
      tags: form.tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      weight_kg: toNumberOrNull(form.weightKg),
      width_cm: toNumberOrNull(form.widthCm),
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = buildPayload();
      const result = await onSave(payload, product?.id);
      if (!result.success) {
        throw new Error(result.error || (isEs ? 'No se pudo guardar el producto.' : 'Product could not be saved.'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : isEs ? 'No se pudo guardar el producto.' : 'Product could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setField('categoryId', event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FAF6EF] text-[#2D2D2D]">
      <div className="sticky top-0 z-20 border-b border-[#E8E4E0] bg-[#FAF6EF]/95 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              {isEs ? 'CMS de productos' : 'Product CMS'}
            </p>
            <h2 className="mt-1 font-display text-2xl font-medium text-[#2D2D2D] md:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-2 max-w-[72ch] text-sm leading-relaxed text-[#4A4A4A]">{copy.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#A08848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
            >
              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {copy.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
            >
              <Save className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {saving ? copy.saving : copy.save}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          {error && (
            <div className="flex gap-3 border border-[#C44536] bg-[#FFFDF9] p-4 text-sm text-[#9F2D24]" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
              <p>{error}</p>
            </div>
          )}

          <section className="border border-[#E8E4E0] bg-[#F5F1EB] p-4 sm:p-5">
            <h3 className="font-display text-xl font-medium text-[#2D2D2D]">
              {isEs ? 'Ficha pública' : 'Public listing'}
            </h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                id="product-name"
                label={isEs ? 'Nombre para URL' : 'URL name'}
                value={form.name}
                onChange={(value) => setField('name', value)}
                placeholder="Espejo tallado jaguar"
                required
              />
              <Field
                id="product-sku"
                label="SKU"
                value={form.sku}
                onChange={(value) => setField('sku', value)}
                placeholder="HM-0001"
              />
              <Field
                id="product-name-es"
                label={isEs ? 'Nombre en español' : 'Spanish name'}
                value={form.nameEs}
                onChange={(value) => setField('nameEs', value)}
                required
              />
              <Field
                id="product-name-en"
                label={isEs ? 'Nombre en inglés' : 'English name'}
                value={form.nameEn}
                onChange={(value) => setField('nameEn', value)}
                required
              />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TextArea
                id="product-description-es"
                label={isEs ? 'Descripción en español' : 'Spanish description'}
                value={form.description}
                onChange={(value) => setField('description', value)}
              />
              <TextArea
                id="product-description-en"
                label={isEs ? 'Descripción en inglés' : 'English description'}
                value={form.descriptionEn}
                onChange={(value) => setField('descriptionEn', value)}
              />
            </div>
          </section>

          <section className="border border-[#E8E4E0] bg-[#F5F1EB] p-4 sm:p-5">
            <h3 className="font-display text-xl font-medium text-[#2D2D2D]">
              {isEs ? 'Comercio e inventario' : 'Commerce and inventory'}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                id="product-usd"
                label={isEs ? 'Precio USD' : 'USD price'}
                value={form.dolarPrice}
                onChange={(value) => setField('dolarPrice', value)}
                type="number"
                min="0"
                step="0.01"
              />
              <Field
                id="product-crc"
                label={isEs ? 'Precio CRC' : 'CRC price'}
                value={form.colonPrice}
                onChange={(value) => setField('colonPrice', value)}
                type="number"
                min="0"
                step="100"
              />
              <Field
                id="product-discount"
                label={isEs ? 'Descuento %' : 'Discount %'}
                value={form.discountPercentage}
                onChange={(value) => setField('discountPercentage', value)}
                type="number"
                min="0"
                max="100"
                step="0.1"
              />
              <Field
                id="product-inventory"
                label={isEs ? 'Inventario disponible' : 'Available inventory'}
                value={form.inventoryQuantity}
                onChange={(value) => setField('inventoryQuantity', value)}
                type="number"
                min="0"
                step="1"
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Toggle
                id="product-active"
                label={isEs ? 'Publicado' : 'Published'}
                description={isEs ? 'Visible en la tienda y disponible para compra.' : 'Visible in the storefront and available for purchase.'}
                checked={form.isActive}
                onChange={(checked) => setField('isActive', checked)}
              />
              <Toggle
                id="product-featured"
                label={isEs ? 'Destacado' : 'Featured'}
                description={isEs ? 'Puede aparecer en módulos destacados de la página principal.' : 'Can appear in featured storefront modules.'}
                checked={form.isFeatured}
                onChange={(checked) => setField('isFeatured', checked)}
              />
            </div>
          </section>

          <section className="border border-[#E8E4E0] bg-[#F5F1EB] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-xl font-medium text-[#2D2D2D]">
                  {isEs ? 'Imágenes y videos' : 'Images and videos'}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B6459]">
                  {isEs ? 'La primera imagen será la principal en catálogo y producto.' : 'The first image is used as the main catalog and product image.'}
                </p>
              </div>
              <button
                type="button"
                onClick={addMediaItem}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition hover:border-[#A08848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {isEs ? 'Agregar media' : 'Add media'}
              </button>
              <label className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition hover:bg-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#A08848]">
                <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {uploadingMedia === 'new'
                  ? isEs ? 'Subiendo...' : 'Uploading...'
                  : isEs ? 'Subir archivo' : 'Upload file'}
                <input
                  type="file"
                  accept={MEDIA_ACCEPT}
                  onChange={handleNewMediaUpload}
                  disabled={uploadingMedia !== null}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="mt-5 space-y-4">
              {form.media.length === 0 && (
                <div className="flex min-h-[120px] flex-col items-center justify-center border border-dashed border-[#E8E4E0] bg-[#FAF6EF] p-5 text-center">
                  <ImageIcon className="h-6 w-6 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  <p className="mt-3 text-sm text-[#6B6459]">
                    {isEs ? 'Agregá URLs de imágenes o videos para publicar el producto.' : 'Add image or video URLs to publish this product.'}
                  </p>
                </div>
              )}

              {form.media.map((item, index) => (
                <div key={`${item.url}-${index}`} className="grid gap-3 border border-[#E8E4E0] bg-[#FAF6EF] p-3 lg:grid-cols-[96px_1fr_auto]">
                  <div className="relative flex h-24 items-center justify-center overflow-hidden border border-[#E8E4E0] bg-[#FFFDF9]">
                    {item.url ? (
                      <Image src={item.url} alt={item.alt || form.nameEs || 'Product media'} fill sizes="96px" className="object-contain" unoptimized />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1fr_140px]">
                    <Field
                      id={`media-url-${index}`}
                      label={isEs ? `URL media ${index + 1}` : `Media URL ${index + 1}`}
                      value={item.url}
                      onChange={(value) => setMediaItem(index, { url: value })}
                      type="url"
                      placeholder="https://..."
                    />
                    <div>
                      <label htmlFor={`media-type-${index}`} className={LABEL_CLASS}>
                        {isEs ? 'Tipo' : 'Type'}
                      </label>
                      <select
                        id={`media-type-${index}`}
                        value={item.type}
                        onChange={(event) => setMediaItem(index, { type: event.target.value === 'video' ? 'video' : 'image' })}
                        className={INPUT_CLASS}
                      >
                        <option value="image">{isEs ? 'Imagen' : 'Image'}</option>
                        <option value="video">{isEs ? 'Video' : 'Video'}</option>
                      </select>
                    </div>
                    <Field
                      id={`media-alt-${index}`}
                      label={isEs ? 'Texto alternativo' : 'Alt text'}
                      value={item.alt || ''}
                      onChange={(value) => setMediaItem(index, { alt: value })}
                    />
                    <Field
                      id={`media-caption-${index}`}
                      label={isEs ? 'Nota interna/caption' : 'Internal caption'}
                      value={item.caption || ''}
                      onChange={(value) => setMediaItem(index, { caption: value })}
                    />
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col">
                    <label className="grid h-10 w-10 cursor-pointer place-items-center rounded-sm border border-[#E8E4E0] text-[#2D2D2D] focus-within:ring-2 focus-within:ring-[#A08848]">
                      <span className="sr-only">{isEs ? 'Reemplazar por archivo' : 'Replace with file'}</span>
                      <Upload className={`h-4 w-4 ${uploadingMedia === index ? 'animate-pulse' : ''}`} strokeWidth={1.5} aria-hidden />
                      <input
                        type="file"
                        accept={MEDIA_ACCEPT}
                        onChange={(event) => handleReplaceMediaUpload(index, event)}
                        disabled={uploadingMedia !== null}
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => moveMediaItem(index, -1)}
                      disabled={index === 0}
                      aria-label={isEs ? 'Subir media' : 'Move media up'}
                      className="grid h-10 w-10 place-items-center rounded-sm border border-[#E8E4E0] text-[#2D2D2D] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                    >
                      <ArrowUp className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMediaItem(index, 1)}
                      disabled={index === form.media.length - 1}
                      aria-label={isEs ? 'Bajar media' : 'Move media down'}
                      className="grid h-10 w-10 place-items-center rounded-sm border border-[#E8E4E0] text-[#2D2D2D] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                    >
                      <ArrowDown className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index)}
                      aria-label={isEs ? 'Eliminar media' : 'Remove media'}
                      className="grid h-10 w-10 place-items-center rounded-sm border border-[#C44536] text-[#9F2D24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#E8E4E0] bg-[#F5F1EB] p-4 sm:p-5">
            <h3 className="font-display text-xl font-medium text-[#2D2D2D]">
              {isEs ? 'Logística y atributos' : 'Logistics and attributes'}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field id="weight-kg" label={isEs ? 'Peso kg' : 'Weight kg'} value={form.weightKg} onChange={(value) => setField('weightKg', value)} type="number" min="0" step="0.01" />
              <Field id="length-cm" label={isEs ? 'Largo cm' : 'Length cm'} value={form.lengthCm} onChange={(value) => setField('lengthCm', value)} type="number" min="0" step="0.1" />
              <Field id="width-cm" label={isEs ? 'Ancho cm' : 'Width cm'} value={form.widthCm} onChange={(value) => setField('widthCm', value)} type="number" min="0" step="0.1" />
              <Field id="height-cm" label={isEs ? 'Alto cm' : 'Height cm'} value={form.heightCm} onChange={(value) => setField('heightCm', value)} type="number" min="0" step="0.1" />
              <Field id="brand" label={isEs ? 'Marca/taller' : 'Brand/workshop'} value={form.brand} onChange={(value) => setField('brand', value)} />
              <Field id="origin" label={isEs ? 'País de origen' : 'Country of origin'} value={form.countryOfOrigin} onChange={(value) => setField('countryOfOrigin', value)} />
              <Field id="hs-code" label="HS code" value={form.hsCode} onChange={(value) => setField('hsCode', value)} />
              <Field id="tags" label={isEs ? 'Tags, separados por coma' : 'Tags, comma separated'} value={form.tagsText} onChange={(value) => setField('tagsText', value)} />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TextArea
                id="customs-description"
                label={isEs ? 'Descripción aduanal en inglés' : 'Customs description in English'}
                value={form.customsDescriptionEn}
                onChange={(value) => setField('customsDescriptionEn', value)}
                rows={3}
              />
              <TextArea
                id="specifications-json"
                label={isEs ? 'Especificaciones JSON' : 'Specifications JSON'}
                value={form.specificationsText}
                onChange={(value) => setField('specificationsText', value)}
                placeholder='{"material":"wood"}'
                rows={3}
              />
            </div>
            <div className="mt-4">
              <Toggle
                id="dangerous-goods"
                label={isEs ? 'Mercancía peligrosa' : 'Dangerous goods'}
                description={isEs ? 'Marcar solo si el envío requiere tratamiento especial.' : 'Use only when shipping requires special handling.'}
                checked={form.dangerousGoods}
                onChange={(checked) => setField('dangerousGoods', checked)}
              />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-[112px] lg:self-start">
          <div className="border border-[#E8E4E0] bg-[#F5F1EB] p-4 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
            <div className="relative aspect-square overflow-hidden border border-[#E8E4E0] bg-[#FFFDF9]">
              {primaryImage ? (
                <Image src={primaryImage} alt={form.nameEs || form.nameEn || 'Product preview'} fill sizes="360px" className="object-contain" unoptimized />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#6B6459]">
                  <ImageIcon className="h-8 w-8 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  <p className="mt-3 text-sm">{isEs ? 'Sin imagen principal' : 'No main image'}</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="category" className={LABEL_CLASS}>
                  {isEs ? 'Categoría' : 'Category'}
                </label>
                <select id="category" value={form.categoryId} onChange={handleCategoryChange} className={INPUT_CLASS}>
                  <option value="">{isEs ? 'Sin categoría' : 'No category'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {(isEs ? category.name_es : category.name_en) || category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border border-[#E8E4E0] bg-[#FAF6EF] p-3">
                <p className="text-xs uppercase tracking-[0.08em] text-[#6B6459]">
                  {isEs ? 'Vista de publicación' : 'Publishing view'}
                </p>
                <h4 className="mt-2 font-display text-xl font-medium text-[#2D2D2D]">
                  {isEs ? form.nameEs || form.name : form.nameEn || form.name}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
                  {(isEs ? form.description : form.descriptionEn) || (isEs ? 'Sin descripción todavía.' : 'No description yet.')}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="border border-[#E8E4E0] px-2 py-1 text-[#6B6459]">
                    {form.isActive ? (isEs ? 'Publicado' : 'Published') : (isEs ? 'Archivado' : 'Archived')}
                  </span>
                  {form.isFeatured && (
                    <span className="border border-[#C9A962]/45 px-2 py-1 text-[#A08848]">
                      {isEs ? 'Destacado' : 'Featured'}
                    </span>
                  )}
                  <span className="border border-[#E8E4E0] px-2 py-1 text-[#6B6459]">
                    {form.inventoryQuantity || 0} {isEs ? 'en stock' : 'in stock'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setField('isActive', false)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition hover:border-[#A08848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
              >
                <Archive className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {isEs ? 'Marcar como archivado' : 'Mark as archived'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
