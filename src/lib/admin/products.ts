import { supabaseServer } from '@/lib/supabaseServer';
import { Database, Json } from '@/lib/database.types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type InventoryRow = Database['public']['Tables']['inventory']['Row'];

export interface AdminMediaItem {
  url: string;
  type: 'image' | 'video';
  alt?: string;
  caption?: string;
}

export interface AdminProductPayload {
  brand?: string | null;
  category_id?: number | null;
  colon_price?: number | null;
  country_of_origin?: string | null;
  customs_description_en?: string | null;
  dangerous_goods?: boolean;
  description?: string | null;
  description_en?: string | null;
  discount_percentage?: number | null;
  dolar_price?: number | null;
  height_cm?: number | null;
  hs_code?: string | null;
  is_active?: boolean | null;
  is_featured?: boolean | null;
  length_cm?: number | null;
  media?: AdminMediaItem[] | null;
  name?: string | null;
  name_en?: string | null;
  name_es?: string | null;
  sku?: string | null;
  specifications?: Json | null;
  tags?: string[] | null;
  weight_kg?: number | null;
  width_cm?: number | null;
  inventory_quantity?: number | null;
}

export interface AdminProduct extends ProductRow {
  inventory_quantity: number;
  inventory_reserved: number;
}

interface ProductWithInventory extends ProductRow {
  inventory?: InventoryRow[] | InventoryRow | null;
}

export const PRODUCT_SELECT = '*, inventory(id, quantity, reserved, updated_at)' as const;

const MAX_MEDIA_ITEMS = 12;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().replace(/\s+/g, ' ');
  return cleaned.length > 0 ? cleaned : null;
}

function nullableNumber(value: unknown, fieldName: string, min = 0, max = Number.POSITIVE_INFINITY) {
  if (value === null || value === undefined || value === '') return null;
  const numberValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numberValue) || numberValue < min || numberValue > max) {
    throw new Error(`${fieldName} must be a valid number between ${min} and ${max}.`);
  }
  return numberValue;
}

function nullableInteger(value: unknown, fieldName: string, min = 0) {
  const numberValue = nullableNumber(value, fieldName, min);
  if (numberValue === null) return null;
  if (!Number.isInteger(numberValue)) {
    throw new Error(`${fieldName} must be an integer.`);
  }
  return numberValue;
}

function nullableBoolean(value: unknown) {
  if (value === null || value === undefined) return null;
  return Boolean(value);
}

function normalizeTags(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    return tags.length ? tags : null;
  }
  if (!Array.isArray(value)) return null;
  const tags = value
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim())
    .filter(Boolean);
  return tags.length ? Array.from(new Set(tags)) : null;
}

function normalizeMedia(value: unknown): AdminMediaItem[] | null {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) {
    throw new Error('media must be an array.');
  }

  const media = value
    .slice(0, MAX_MEDIA_ITEMS)
    .map((item, index) => {
      if (!isRecord(item)) {
        throw new Error(`media item ${index + 1} is invalid.`);
      }

      const url = cleanString(item.url);
      if (!url) return null;

      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        throw new Error(`media item ${index + 1} must use a valid URL.`);
      }

      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`media item ${index + 1} must use http or https.`);
      }

      const rawType = cleanString(item.type);
      const type: 'image' | 'video' = rawType === 'video' ? 'video' : 'image';
      const alt = cleanString(item.alt);
      const caption = cleanString(item.caption);

      return {
        url,
        type,
        ...(alt ? { alt } : {}),
        ...(caption ? { caption } : {}),
      };
    })
    .filter((item): item is AdminMediaItem => item !== null);

  return media.length ? media : null;
}

export function parseProductPayload(input: unknown): AdminProductPayload {
  if (!isRecord(input)) {
    throw new Error('Payload must be an object.');
  }

  return {
    brand: cleanString(input.brand),
    category_id: nullableInteger(input.category_id, 'category_id', 1),
    colon_price: nullableNumber(input.colon_price, 'colon_price', 0),
    country_of_origin: cleanString(input.country_of_origin),
    customs_description_en: cleanString(input.customs_description_en),
    dangerous_goods: Boolean(input.dangerous_goods),
    description: cleanString(input.description),
    description_en: cleanString(input.description_en),
    discount_percentage: nullableNumber(input.discount_percentage, 'discount_percentage', 0, 100),
    dolar_price: nullableNumber(input.dolar_price, 'dolar_price', 0),
    height_cm: nullableNumber(input.height_cm, 'height_cm', 0),
    hs_code: cleanString(input.hs_code),
    is_active: nullableBoolean(input.is_active),
    is_featured: nullableBoolean(input.is_featured),
    length_cm: nullableNumber(input.length_cm, 'length_cm', 0),
    media: normalizeMedia(input.media),
    name: cleanString(input.name),
    name_en: cleanString(input.name_en),
    name_es: cleanString(input.name_es),
    sku: cleanString(input.sku),
    specifications: isRecord(input.specifications) ? input.specifications as Json : null,
    tags: normalizeTags(input.tags),
    weight_kg: nullableNumber(input.weight_kg, 'weight_kg', 0),
    width_cm: nullableNumber(input.width_cm, 'width_cm', 0),
    inventory_quantity: nullableInteger(input.inventory_quantity, 'inventory_quantity', 0),
  };
}

export function productPayloadToRecord(payload: AdminProductPayload): ProductInsert {
  const canonicalName = payload.name || payload.name_en || payload.name_es;
  if (!canonicalName) {
    throw new Error('Product name is required.');
  }

  const nameEs = payload.name_es || payload.name || payload.name_en;
  const nameEn = payload.name_en || payload.name || payload.name_es;
  const now = new Date().toISOString();

  return {
    brand: payload.brand,
    category_id: payload.category_id,
    colon_price: payload.colon_price,
    country_of_origin: payload.country_of_origin || 'Costa Rica',
    customs_description_en: payload.customs_description_en,
    dangerous_goods: payload.dangerous_goods ?? false,
    description: payload.description,
    description_en: payload.description_en,
    discount_percentage: payload.discount_percentage,
    dolar_price: payload.dolar_price,
    height_cm: payload.height_cm ?? 0,
    hs_code: payload.hs_code,
    is_active: payload.is_active ?? true,
    is_featured: payload.is_featured ?? false,
    length_cm: payload.length_cm ?? 0,
    media: payload.media as Json | null,
    modified_at: now,
    name: canonicalName,
    name_en: nameEn,
    name_es: nameEs,
    sku: payload.sku,
    specifications: payload.specifications ?? null,
    tags: payload.tags,
    weight_kg: payload.weight_kg ?? 0,
    width_cm: payload.width_cm ?? 0,
  };
}

export function productPayloadToUpdate(payload: AdminProductPayload): ProductUpdate {
  const record = productPayloadToRecord(payload);
  return {
    ...record,
    modified_at: new Date().toISOString(),
  };
}

export function normalizeAdminProduct(product: ProductWithInventory): AdminProduct {
  const inventory = Array.isArray(product.inventory)
    ? product.inventory[0]
    : product.inventory ?? null;
  const baseProduct = { ...product };
  delete baseProduct.inventory;

  return {
    ...(baseProduct as ProductRow),
    inventory_quantity: inventory?.quantity ?? 0,
    inventory_reserved: inventory?.reserved ?? 0,
  };
}

export async function ensureUniqueProductName(name: string, productId?: number) {
  let query = supabaseServer.from('products').select('id').eq('name', name).limit(1);
  if (productId) {
    query = query.neq('id', productId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    throw new Error('A product with this URL name already exists.');
  }
}

export async function setProductInventory(productId: number, quantity: number | null | undefined) {
  if (quantity === null || quantity === undefined) return;

  const now = new Date().toISOString();
  const { data: existingInventory, error: lookupError } = await supabaseServer
    .from('inventory')
    .select('id')
    .eq('product_id', productId)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existingInventory) {
    const { error } = await supabaseServer
      .from('inventory')
      .update({ quantity, updated_at: now })
      .eq('id', existingInventory.id);

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabaseServer
    .from('inventory')
    .insert({ product_id: productId, quantity, reserved: 0, updated_at: now });

  if (error) throw new Error(error.message);
}

export async function fetchAdminProduct(productId: number) {
  const { data, error } = await supabaseServer
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', productId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Product not found.');
  }

  return normalizeAdminProduct(data as ProductWithInventory);
}

export async function listAdminProducts() {
  const { data, error } = await supabaseServer
    .from('products')
    .select(PRODUCT_SELECT)
    .order('modified_at', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data || []) as ProductWithInventory[]).map(normalizeAdminProduct);
}
