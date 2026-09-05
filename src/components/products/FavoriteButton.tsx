'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  productId: number;
  initialIsFavorite: boolean;
};

export default function FavoriteButton({ productId, initialIsFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      alert(locale === 'es' ? 'Inicia sesión para guardar favoritos' : 'Sign in to save favorites');
      return;
    }

    const nextState = !isFavorite;
    setIsFavorite(nextState);

    startTransition(async () => {
      try {
        if (nextState) {
          await supabase
            .from('favorites')
            .insert({ user_id: session.user.id, product_id: productId });
        } else {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', session.user.id)
            .eq('product_id', productId);
        }
      } catch (err) {
        console.error('Error updating favorites:', err);
        setIsFavorite(!nextState);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={
        isFavorite
          ? locale === 'es' ? 'Quitar de favoritos' : 'Remove from favorites'
          : locale === 'es' ? 'Añadir a favoritos' : 'Add to favorites'
      }
      aria-pressed={isFavorite}
      className="grid place-items-center w-9 h-9 rounded-sm bg-[#F1E7D6]/95 backdrop-blur-sm border border-[#D8C9AE] shadow-sm text-[#7A6E5E] hover:text-[#D9563B] hover:border-[#D9563B]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A22] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1E7D6] transition-colors disabled:opacity-60"
    >
      <Heart
        className={`h-4 w-4 transition-all ${isFavorite ? 'fill-[#D9563B] text-[#D9563B] scale-110' : 'fill-transparent'}`}
        strokeWidth={2}
      />
    </button>
  );
}
