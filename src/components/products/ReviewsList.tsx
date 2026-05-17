'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/lib/database.types';
import { Star } from 'lucide-react';
import { useLocale } from 'next-intl';

type ProfileType = Database['public']['Tables']['user_profiles']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

const RTF_ES = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const RTF_EN = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function formatRelativeTime(dateString: string, locale: 'es' | 'en'): string {
  const date = new Date(dateString);
  const diff = (date.getTime() - Date.now()) / 1000;
  const rtf = locale === 'es' ? RTF_ES : RTF_EN;

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diff) >= secondsInUnit) {
      return rtf.format(Math.round(diff / secondsInUnit), unit);
    }
  }
  return rtf.format(0, 'second');
}

interface ReviewsListProps {
  productId: number;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const locale = useLocale() as 'es' | 'en';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<Record<string, ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
        return;
      }

      const rows = data || [];
      setReviews(rows);

      if (rows.length === 0) {
        setLoading(false);
        return;
      }

      const totalRating = rows.reduce((sum, r) => sum + (r.rating || 0), 0);
      setAverageRating(totalRating / rows.length);

      // Batch fetch user profiles (was N+1)
      const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
      if (userIds.length) {
        const { data: usersData } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', userIds);
        if (!cancelled && usersData) {
          const map: Record<string, ProfileType> = {};
          for (const u of usersData) map[u.id] = u;
          setUsers(map);
        }
      }

      setLoading(false);
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="py-2" aria-busy="true" aria-live="polite">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[#E8E4E0] rounded w-1/4" />
          <div className="h-4 bg-[#E8E4E0] rounded w-1/2" />
          <div className="h-4 bg-[#E8E4E0] rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-[#6B6459] py-2">
        {locale === 'es'
          ? 'Este producto aún no tiene reseñas. Sé el primero en compartir tu experiencia.'
          : 'No reviews yet. Be the first to share your experience.'}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {averageRating !== null && (
        <div className="flex items-baseline gap-2 mb-4">
          <div className="flex" aria-label={`${averageRating.toFixed(1)} ${locale === 'es' ? 'de' : 'out of'} 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-[#C9A962] text-[#C9A962]'
                    : 'fill-[#E8E4E0] text-[#E8E4E0]'
                }`}
                strokeWidth={0}
                aria-hidden
              />
            ))}
          </div>
          <span className="font-display text-2xl font-medium text-[#2D2D2D] tabular-nums">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-[#6B6459]">
            ({reviews.length}{' '}
            {locale === 'es'
              ? reviews.length === 1 ? 'reseña' : 'reseñas'
              : reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      )}

      <ul className="space-y-6">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-b border-[#E8E4E0] pb-5 last:border-b-0"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex" aria-label={`${review.rating} ${locale === 'es' ? 'de' : 'out of'} 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= (review.rating || 0)
                        ? 'fill-[#C9A962] text-[#C9A962]'
                        : 'fill-[#E8E4E0] text-[#E8E4E0]'
                    }`}
                    strokeWidth={0}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-xs text-[#6B6459]">
                {review.created_at && formatRelativeTime(review.created_at, locale)}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#2D2D2D] mb-1">
              {users[review.user_id]?.full_name ||
                (locale === 'es' ? 'Cliente verificado' : 'Verified customer')}
            </p>

            {review.comment && (
              <p className="text-[#4A4A4A] leading-relaxed text-[14.5px]">
                {review.comment}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
