'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLocale } from 'next-intl';
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';

interface Props {
  productId: number;
}

/**
 * Wrapper for the reviews block on the product page.
 * Encapsulates the refresh-on-submit pattern so the section can be
 * code-split with next/dynamic without pulling these handlers into
 * the main bundle.
 */
export default function ReviewsSection({ productId }: Props) {
  const locale = useLocale();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="mt-16 border-t border-[#E8E4E0] pt-10">
      <h2 className="font-display text-2xl font-medium text-[#2D2D2D] tracking-[-0.005em] mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#A08848]" strokeWidth={1.75} aria-hidden />
        {locale === 'es' ? 'Reseñas y opiniones' : 'Reviews and opinions'}
      </h2>

      <div className="space-y-8">
        <ReviewsList productId={productId} key={refreshKey} />
        <ReviewForm
          productId={productId}
          onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </section>
  );
}
