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
  
  // Pre-cargar productos de las categorías seleccionadas
  let initialProducts: Database['public']['Tables']['products']['Row'][] = [];
  
  if (categoryIdsToLoad.length > 0) {
    // Obtener productos de las categorías prioritarias (hasta 4 por categoría)
    const { data: priorityProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .in('category_id', categoryIdsToLoad)
      .order('created_at', { ascending: false })
      .limit(40); // Limitamos a 40 productos en total (aproximadamente 4 por categoría)
      
    if (priorityProducts) {
      initialProducts = priorityProducts;
    }
    
  // Obtener TODOS los productos destacados adicionales (sin límite)
  const { data: featuredProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
      
    if (featuredProducts) {
      // Añadir productos destacados que no estén ya en la lista inicial
      featuredProducts.forEach(product => {
        if (!initialProducts.some(p => p.id === product.id)) {
          initialProducts.push(product);
        }
      });
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
