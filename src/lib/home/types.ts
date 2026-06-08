import type { Database } from '@/lib/database.types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

export type HomeProduct = Pick<
  ProductRow,
  'id' | 'name' | 'name_es' | 'name_en' | 'category_id' | 'media' | 'dolar_price' | 'is_featured'
>;

export type HomeCategory = Pick<CategoryRow, 'id' | 'name' | 'name_es' | 'name_en'>;

export const HOME_PRODUCT_COLUMNS =
  'id, name, name_es, name_en, category_id, media, dolar_price, is_featured' as const;

export const HOME_CATEGORY_COLUMNS = 'id, name, name_es, name_en' as const;
