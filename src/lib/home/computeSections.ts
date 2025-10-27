import type { Database } from "@/lib/database.types";

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

export interface HomeSections {
  grid: {
    products: Record<number, Product[]>;
    priorityOrder: number[];
  };
  gifts: Product[];
  featured: Product[];
}

export function isMediaArray(media: unknown): media is Array<{ url: string }> {
  return Array.isArray(media) && media.length > 0 &&
    typeof media[0] === 'object' && media[0] !== null &&
    'url' in media[0] && typeof (media[0] as { url: string }).url === 'string';
}

/**
 * Pure function to compute sections deterministically for SSR/CSR.
 */
export function computeSections(
  allProducts: Product[],
  allCategories: Category[],
  priorityCategoryIds: number[] = [],
  productsPerCategory = 4,
  maxGifts = 12,
  _maxFeatured = 9 // unused: Featured shows ALL is_featured
): HomeSections {
  // Referenciar _maxFeatured para satisfacer lint sin alterar la lógica actual
  void _maxFeatured;
  const gridProducts: Record<number, Product[]> = {};

  // Build priority order with provided IDs first
  const finalPriorityOrder = [...priorityCategoryIds];
  allCategories.forEach(category => {
    if (!finalPriorityOrder.includes(category.id)) {
      finalPriorityOrder.push(category.id);
    }
  });

  // Track assigned products globally to avoid overlaps across sections
  const assignedIds = new Set<number>();

  // Helper to take products from a source, applying a filter and excluding already assigned
  const takeProducts = (
    sourceProducts: Product[],
    count: number,
    filter?: (p: Product) => boolean
  ): Product[] => {
    const result: Product[] = [];
    for (const product of sourceProducts) {
      if (result.length >= count) break;
      if (assignedIds.has(product.id)) continue;
      if (filter && !filter(product)) continue;
      result.push(product);
      assignedIds.add(product.id);
    }
    return result;
  };

  // 1) Featured: strictly products marked is_featured, shown EXCLUSIVELY here
  const featured = allProducts
    .filter(p => p.is_featured)
    .filter(p => isMediaArray(p.media));

  // Deduplicate featured by id and assign them to prevent use elsewhere
  const seenFeatured = new Set<number>();
  const uniqueFeatured: Product[] = [];
  for (const p of featured) {
    if (seenFeatured.has(p.id)) continue;
    seenFeatured.add(p.id);
    uniqueFeatured.push(p);
    assignedIds.add(p.id);
  }

  // 2) Grid: include only categories with enough non-featured products to fill the row
  const eligibleGridOrder = finalPriorityOrder.filter(categoryId => {
    const countWithImages = allProducts.filter(
      p => p.category_id === categoryId && !p.is_featured && isMediaArray(p.media)
    ).length;
    return countWithImages >= productsPerCategory;
  });

  for (const categoryId of eligibleGridOrder) {
    const categoryProducts = allProducts.filter(p => p.category_id === categoryId && !p.is_featured);

    const productsWithImages = takeProducts(
      categoryProducts,
      productsPerCategory,
      p => isMediaArray(p.media)
    );

    gridProducts[categoryId] = productsWithImages;

    // No fallback that pulls duplicates or featured; we keep rows strict
  }

  // 3) Gifts: exclude kitchen and any already assigned (grid/featured)
  const kitchenCategoryIds = allCategories
    .filter(c => ((c.name || '') + ' ' + (c.name_en || '') + ' ' + (c.name_es || '')).toLowerCase().includes('kitchen'))
    .map(c => c.id);

  const giftsSource = allProducts.filter(p => !p.is_featured);
  const gifts = takeProducts(
    giftsSource,
    maxGifts,
    p => isMediaArray(p.media) && !kitchenCategoryIds.includes(p.category_id || -1)
  );

  // Cross-validation: ensure no overlaps and no duplicates across sections
  const toId = (p: Product) => p.id;
  const idSet = new Set<number>();
  const ensureUnique = (list: Product[]) => {
    const out: Product[] = [];
    for (const p of list) {
      if (idSet.has(p.id)) continue;
      idSet.add(p.id);
      out.push(p);
    }
    return out;
  };

  const validatedFeatured = ensureUnique(uniqueFeatured);
  const validatedGifts = ensureUnique(gifts);
  const validatedGrid: Record<number, Product[]> = {};
  for (const [cid, list] of Object.entries(gridProducts)) {
    validatedGrid[Number(cid)] = ensureUnique(list);
  }

  // Optional: console warnings if anything was dropped due to duplication (dev aid)
  if (process.env.NODE_ENV !== 'production') {
    const totalAssigned = new Set<number>([...validatedFeatured.map(toId), ...validatedGifts.map(toId)]);
    for (const list of Object.values(validatedGrid)) {
      for (const p of list) totalAssigned.add(p.id);
    }
    const duplicates = allProducts.filter(p => totalAssigned.has(p.id)).length !== totalAssigned.size;
    if (duplicates) {
      console.warn('[computeSections] Duplicates were removed during validation to ensure exclusivity.');
    }
  }

  return {
    grid: {
      products: validatedGrid,
      priorityOrder: eligibleGridOrder,
    },
    gifts: validatedGifts,
    featured: validatedFeatured,
  };
}