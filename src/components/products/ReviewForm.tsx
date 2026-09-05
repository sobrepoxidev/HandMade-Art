'use client';

import { useState, useRef } from 'react';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSupabase } from '@/app/supabase-provider/provider';
import { useLocale } from 'next-intl';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { supabase } = useSupabase();
  const locale = useLocale();
  const starsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setError(
          locale === 'es'
            ? 'Debes iniciar sesión para dejar una reseña.'
            : 'You must be signed in to leave a review.'
        );
        setIsSubmitting(false);
        return;
      }

      if (!comment.trim()) {
        setError(
          locale === 'es'
            ? 'Escribe tu opinión antes de enviar.'
            : 'Write your opinion before submitting.'
        );
        setIsSubmitting(false);
        return;
      }

      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (existingReview) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ comment, rating, updated_at: new Date().toISOString() })
          .eq('id', existingReview.id);
        if (updateError) throw updateError;
        setSuccessMessage(
          locale === 'es' ? 'Tu reseña fue actualizada.' : 'Your review was updated.'
        );
      } else {
        const { error: insertError } = await supabase
          .from('reviews')
          .insert({ product_id: productId, user_id: session.user.id, comment, rating });
        if (insertError) throw insertError;
        setSuccessMessage(
          locale === 'es' ? 'Tu reseña fue publicada.' : 'Your review was published.'
        );
      }

      setComment('');
      setRating(5);
      onReviewSubmitted();

      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(
        locale === 'es'
          ? `Error al enviar la reseña: ${errorMessage}`
          : `Error submitting review: ${errorMessage}`
      );
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, idx + 2);
      setRating(next);
      starsRef.current[next - 1]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(1, idx);
      setRating(prev);
      starsRef.current[prev - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setRating(1);
      starsRef.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setRating(5);
      starsRef.current[4]?.focus();
    }
  };

  return (
    <section className="bg-[#1E1813] border border-[#3A2E24] rounded-md p-5 mt-8">
      <h3 className="font-display text-xl font-medium text-[#F1E7D6] mb-4 tracking-[-0.005em]">
        {locale === 'es' ? 'Deja tu opinión' : 'Leave your review'}
      </h3>

      <div aria-live="polite" aria-atomic="true">
        {error && (
          <div className="flex items-start gap-2 bg-[#D9563B]/12 border border-[#D9563B]/35 text-[#F2A38A] px-3 py-2.5 rounded-sm mb-4 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} aria-hidden />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-start gap-2 bg-[#3C9A70]/12 border border-[#3C9A70]/35 text-[#3C9A70] px-3 py-2.5 rounded-sm mb-4 text-sm">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} aria-hidden />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Rating */}
        <fieldset className="mb-5">
          <legend className="block text-sm font-medium text-[#F1E7D6] mb-2">
            {locale === 'es' ? 'Calificación' : 'Rating'}
          </legend>
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label={locale === 'es' ? 'Calificación de 1 a 5 estrellas' : 'Rating from 1 to 5 stars'}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= (hoveredStar || rating);
              return (
                <button
                  key={star}
                  ref={(el) => {
                    starsRef.current[star - 1] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={
                    locale === 'es'
                      ? `${star} ${star === 1 ? 'estrella' : 'estrellas'}`
                      : `${star} ${star === 1 ? 'star' : 'stars'}`
                  }
                  tabIndex={rating === star ? 0 : -1}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onKeyDown={(e) => handleStarKey(e, star)}
                  className="grid place-items-center w-11 h-11 rounded-sm transition-colors hover:bg-[#E0A83A]/12"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      isFilled
                        ? 'fill-[#E0A83A] text-[#E0A83A]'
                        : 'fill-[#3A2E24] text-[#3A2E24]'
                    }`}
                    strokeWidth={0}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Comment */}
        <div className="mb-5">
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-[#F1E7D6] mb-1.5"
          >
            {locale === 'es' ? 'Opinión' : 'Opinion'}{' '}
            <span aria-hidden className="text-[#D9563B]">*</span>
            <span className="sr-only"> ({locale === 'es' ? 'requerido' : 'required'})</span>
          </label>
          <textarea
            id="review-comment"
            className="w-full p-3 border border-[#3A2E24] rounded-sm bg-[#161210] text-[#F1E7D6] placeholder:text-[#8C7F6E] resize-y min-h-[96px] focus:border-[#F3C56B] focus:outline-none focus:ring-2 focus:ring-[#F3C56B]/20"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              locale === 'es'
                ? 'Comparte tu experiencia con esta pieza...'
                : 'Share your experience with this piece...'
            }
            required
            aria-required="true"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-sm
                     text-sm font-semibold tracking-wide text-[#161210] bg-[#E0A83A]
                     hover:bg-[#F3C56B] hover:text-[#161210]
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isSubmitting
            ? locale === 'es' ? 'Enviando…' : 'Sending…'
            : locale === 'es' ? 'Enviar reseña' : 'Submit review'}
        </button>
      </form>
    </section>
  );
}
