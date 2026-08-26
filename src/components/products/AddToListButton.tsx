'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type MediaItem = { url: string; alt?: string; type?: string };

type Props = {
  product: Product;
};

export default function AddToListButton({ product }: Props) {
  const interestList = useInterestList();
  const locale = useLocale();
  const [justAdded, setJustAdded] = useState(false);

  const inList = interestList.isInList(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) return;
    const media = (product.media as MediaItem[] | null) ?? [];
    interestList.addItem({
      product_id: product.id,
      name: (locale === 'es' ? product.name_es : product.name_en) || product.name || '',
      sku: product.sku || undefined,
      main_image_url: media[0]?.url || undefined,
      price:
        (product.dolar_price ?? 0) *
        (1 - (product.discount_percentage ?? 0) / 100),
      dolar_price: product.dolar_price || 0,
      discount_percentage: product.discount_percentage || undefined,
      category_id: product.category_id || undefined,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const base =
    'grid place-items-center w-10 h-9 rounded-sm transition-[background-color,color,border-color] duration-200 border';

  const variant = inList
    ? 'bg-[#2F5F3E] text-white border-[#2F5F3E]'
    : justAdded
    ? 'bg-[#4A7C59] text-white border-[#4A7C59]'
    : 'bg-transparent text-[#A08848] border-[#C9A962] hover:bg-[#C9A962] hover:text-[#1A1A1A] hover:border-[#A08848]';

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-pressed={inList}
      aria-label={
        inList
          ? locale === 'es'
            ? 'Ya está en tu lista de cotización'
            : 'Already in your quote list'
          : locale === 'es'
            ? 'Agregar a la lista de cotización'
            : 'Add to quote list'
      }
      className={`${base} ${variant}`}
    >
      {inList || justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
