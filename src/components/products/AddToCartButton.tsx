'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

type Props = {
  product: Product;
  disabled?: boolean;
};

export default function AddToCartButton({ product, disabled = false }: Props) {
  const { addToCart } = useCart();
  const locale = useLocale();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const base =
    'grid place-items-center w-10 h-9 rounded-sm transition-[background-color,color,border-color] duration-200 border';

  const variant = disabled
    ? 'bg-[#F5F1EB] text-[#9C9589] border-[#E8E4E0]/70 cursor-not-allowed'
    : justAdded
    ? 'bg-[#4A7C59] text-white border-[#4A7C59]'
    : 'bg-transparent text-[#A08848] border-[#C9A962] hover:bg-[#C9A962] hover:text-[#1A1A1A] hover:border-[#A08848]';

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      aria-label={locale === 'es' ? 'Añadir al carrito' : 'Add to cart'}
      className={`${base} ${variant}`}
    >
      {justAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
    </button>
  );
}
