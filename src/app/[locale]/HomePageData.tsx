import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import OptimizedNew from '@/components/home/OptimizedNew';

/**
 * Server Component que pre-carga datos para la página principal
 * Aprovecha la naturaleza de React Server Components para:
 * - Reducir las llamadas a Supabase
 * - Mejorar el tiempo de carga inicial
 * - Reducir la cantidad de JavaScript enviado al cliente
 * - Permitir streaming de contenido para una experiencia más rápida
 */

export default async function HomePageData({ locale }: {locale: string}) {
  // Crear cliente de Supabase para server component
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Pre-cargar las categorías para un renderizado más rápido
  // Esta consulta se ejecuta en el servidor y no se envía al cliente
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  // Determinar las primeras categorías a mostrar (las 3 primeras)
  const firstCategories = categories?.slice(0, 3) || [];
  const firstCategoryIds = firstCategories.map(category => category.id);
  
  // Extraer las segundas categorías (de la 6 a la 12)
  const secondCategories = categories?.slice(6, 12) || [];
  const secondCategoryIds = secondCategories.map(category => category.id);
  
  // Pre-cargar productos específicamente de las categorías que se muestran primero
  // Esta estrategia garantiza que tengamos los productos que el usuario verá en la primera carga
  let initialProducts: Database['public']['Tables']['products']['Row'][] = [];
  
  if (firstCategoryIds.length > 0) {
    // Obtener productos de las primeras categorías (hasta 16 productos)
    const { data: firstCategoryProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .in('category_id', firstCategoryIds)
      .order('created_at', { ascending: false })
      .limit(16);
      
    if (firstCategoryProducts) {
      initialProducts = [...initialProducts, ...firstCategoryProducts];
    }
    
    // También obtenemos algunos productos de las siguientes categorías para tener un poco de contenido precargado
    if (secondCategoryIds.length > 0) {
      const { data: secondCategoryProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .in('category_id', secondCategoryIds)
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (secondCategoryProducts) {
        initialProducts = [...initialProducts, ...secondCategoryProducts];
      }
    }
  }
  
  // Pasar los datos pre-cargados al componente cliente
  return (
    <OptimizedNew 
      initialCategories={categories || []} 
      initialProducts={initialProducts} 
      locale={locale}
    />
  );
}
