import { createClient } from '@/utils/supabase/server';
import { Database } from '@/lib/database.types';
import OptimizedNew from '@/components/home/OptimizedNew';
import { computeSections } from '@/lib/home/computeSections';

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
  const supabase = await createClient();
  
  // Definir categorías prioritarias (IDs que se mostrarán primero)
  // Estos IDs se pueden cambiar según las necesidades del negocio
  const priorityCategoryIds = [3, 1, 5, 2]; // Ejemplo: IDs de categorías prioritarias
  
  // Pre-cargar las categorías para un renderizado más rápido
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  // Preparar la lista de IDs de categorías para la carga inicial
  // Incluimos las categorías prioritarias y algunas adicionales
  const categoryIdsToLoad = [...priorityCategoryIds];
  
  // Añadir otras categorías que no estén en la lista de prioridad
  if (categories) {
    categories.forEach(category => {
      if (!categoryIdsToLoad.includes(category.id) && categoryIdsToLoad.length < 10) {
        categoryIdsToLoad.push(category.id);
      }
    });
  }
  
  // Pre-cargar productos para snapshot SSR: aseguramos cobertura suficiente para 6 categorías
  let initialProducts: Database['public']['Tables']['products']['Row'][] = [];
  
  if (categoryIdsToLoad.length > 0) {
    // 1) Traer productos NO destacados de las categorías consideradas con mayor límite
    //    Esto mejora la probabilidad de tener ≥4 productos por categoría para el grid
    const { data: baseProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('is_featured', true)
      .in('category_id', categoryIdsToLoad)
      .order('created_at', { ascending: false })
      .limit(120); // Mayor cobertura para asegurar 6 categorías x 4 productos

    if (baseProducts) {
      initialProducts = baseProducts;
    }

    // 2) Agregar productos destacados (sección featured) sin duplicar IDs
    const { data: featuredProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (featuredProducts) {
      const seen = new Set(initialProducts.map(p => p.id));
      for (const product of featuredProducts) {
        if (!seen.has(product.id)) {
          initialProducts.push(product);
          seen.add(product.id);
        }
      }
    }
  }
  
  // Calcular snapshot SSR determinista de secciones para evitar mismatch de hidratación
  const initialSections = computeSections(
    initialProducts,
    categories || [],
    priorityCategoryIds,
    4,
    12,
    9
  );
  
  // Pasar los datos pre-cargados y la configuración al componente cliente
  return (
    <OptimizedNew 
      initialCategories={categories || []} 
      initialProducts={initialProducts} 
      initialSections={initialSections}
      priorityCategoryIds={priorityCategoryIds}
      locale={locale}
    />
  );
}
