'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

/**
 * Función para obtener categorías y productos desde el servidor
 * - Reduce peticiones repetidas a Supabase
 * - Aprovecha el caché de servidor de Next.js
 * - Centraliza la lógica de obtención de datos
 */
export async function getHomePageData() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  try {
    // Obtener categorías
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      throw new Error(`Error al cargar categorías: ${categoriesError.message}`);
    }

    // Obtener productos destacados o activos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(30);

    if (productsError) {
      throw new Error(`Error al cargar productos: ${productsError.message}`);
    }

    // Filtrar productos por categoría
    const productsByCategory: Record<number, unknown[]> = {};
    
    // Inicializar el objeto de productos por categoría
    categories.forEach(category => {
      productsByCategory[category.id] = [];
    });

    // Organizar productos por categoría
    products.forEach(product => {
      if (
        product.category_id &&
        productsByCategory[product.category_id] &&
        product.media &&
        Array.isArray(product.media) &&
        product.media.length > 0 &&
        product.media[0] &&
        typeof product.media[0] === 'object' &&
        product.media[0] !== null &&
        'url' in product.media[0]
      ) {
        // Solo añadir hasta 4 productos por categoría
        if (productsByCategory[product.category_id].length < 4) {
          productsByCategory[product.category_id].push(product);
        }
      }
    });

    return {
      categories,
      products,
      productsByCategory,
      error: null
    };
  } catch (error) {
    console.error('Error al obtener datos para la página de inicio:', error);
    return {
      categories: [],
      products: [],
      productsByCategory: {},
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
