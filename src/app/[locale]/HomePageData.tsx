import { createClient } from '@/utils/supabase/server';
import HeroSection from '@/components/home/HeroSection';
import Marquee from '@/components/home/Marquee';
import CategoryTiles from '@/components/home/CategoryTiles';
import FeaturedPieces from '@/components/home/FeaturedPieces';
import ImpactSplit from '@/components/home/ImpactSplit';
import ProcessSteps from '@/components/home/ProcessSteps';
import QuoteCTA from '@/components/home/QuoteCTA';
import { computeSections } from '@/lib/home/computeSections';
import { HOME_CATEGORY_COLUMNS, HOME_PRODUCT_COLUMNS, type HomeProduct } from '@/lib/home/types';

/**
 * Server Component que pre-carga datos para la página principal.
 * "Taller nocturno": hero + marquee + categorías + piezas destacadas +
 * impacto social + proceso + CTA de cotización, todo renderizado en el
 * servidor (sin fetch en cliente al montar).
 */
export default async function HomePageData({ locale }: { locale: string }) {
  const supabase = await createClient();

  const priorityCategoryIds = [3, 1, 5, 2];

  const { data: categories } = await supabase
    .from('categories')
    .select(HOME_CATEGORY_COLUMNS)
    .order('name');

  const categoryIdsToLoad = [...priorityCategoryIds];
  if (categories) {
    categories.forEach((category) => {
      if (!categoryIdsToLoad.includes(category.id) && categoryIdsToLoad.length < 10) {
        categoryIdsToLoad.push(category.id);
      }
    });
  }

  let initialProducts: HomeProduct[] = [];

  if (categoryIdsToLoad.length > 0) {
    const [baseRes, featuredRes] = await Promise.all([
      supabase
        .from('products')
        .select(HOME_PRODUCT_COLUMNS)
        .eq('is_active', true)
        .neq('is_featured', true)
        .in('category_id', categoryIdsToLoad)
        .order('created_at', { ascending: false })
        .limit(120),
      supabase
        .from('products')
        .select(HOME_PRODUCT_COLUMNS)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false }),
    ]);

    if (baseRes.data) initialProducts = baseRes.data;

    if (featuredRes.data) {
      const seen = new Set(initialProducts.map((p) => p.id));
      for (const product of featuredRes.data) {
        if (!seen.has(product.id)) {
          initialProducts.push(product);
          seen.add(product.id);
        }
      }
    }
  }

  const initialSections = computeSections(initialProducts, categories || [], priorityCategoryIds, 4, 12, 9);

  return (
    <>
      <HeroSection locale={locale} featuredProducts={initialSections.featured} />
      <Marquee locale={locale} />
      <CategoryTiles locale={locale} />
      <FeaturedPieces locale={locale} />
      <ImpactSplit locale={locale} />
      <ProcessSteps locale={locale} />
      <QuoteCTA locale={locale} />
    </>
  );
}
