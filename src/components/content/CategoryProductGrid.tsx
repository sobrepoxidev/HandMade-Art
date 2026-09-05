'use client';

// Thin client wrapper so server components (category/guide pages) can render
// ProductCard, which needs the useInterestList() hook to be called by a
// client component. Do not add styling logic here — ProductCard owns its
// own markup; this file only wires up the hook and the grid layout.

import ProductCard from '@/components/products/ProductCard';
import { useInterestList } from '@/lib/hooks/useInterestList';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface CategoryProductGridProps {
  products: Product[];
  categoryName?: string;
}

export default function CategoryProductGrid({
  products,
  categoryName,
}: CategoryProductGridProps) {
  const interestList = useInterestList();

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={categoryName}
          interestList={interestList}
        />
      ))}
    </div>
  );
}
