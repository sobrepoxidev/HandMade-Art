'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/lib/database.types';
import { Star } from 'lucide-react';
import { useLocale } from 'next-intl';

// Define a type for profile data
type ProfileType = Database['public']['Tables']['user_profiles']['Row'];

type Review = Database['public']['Tables']['reviews']['Row'];

// We don't need a User type since we're fetching from profiles directly

// Helper function to format relative time without date-fns
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `hace ${diffInSeconds} segundos`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
}

interface ReviewsListProps {
  productId: number;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
    const locale = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<{[key: string]: ProfileType}>({});
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      // Fetch reviews for the product
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
        return;
      }
      
      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + (review.rating || 0), 0);
        setAverageRating(totalRating / data.length);
        
        // Fetch user information for each review
        const userIds = [...new Set(data.map(review => review.user_id))];
        const usersData: {[key: string]: ProfileType} = {};
        
        for (const userId of userIds) {
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (userData) {
            usersData[userId] = userData;
          }
        }
        
        setUsers(usersData);
      }
      
      setLoading(false);
    };
    
    fetchReviews();
  }, [productId]);
  
  if (loading) {
    return (
      <div className="py-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="py-4">
        <p className="text-gray-500">{locale === 'es' ? 'Este producto aún no tiene reseñas. ¡Sé el primero en compartir tu opinión!' : 'This product has no reviews yet. Be the first to share your opinion!'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Average Rating */}
      {averageRating !== null && (
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-lg font-medium">
            {averageRating.toFixed(1)} de 5
          </span>
          <span className="text-gray-500 ml-2">
            ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-4 w-4 ${star <= (review.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {review.created_at && formatRelativeTime(review.created_at)}
              </span>
            </div>
            
            <h3 className="font-medium">{users[review.user_id]?.full_name || 'Usuario anónimo'}</h3>
            
            {review.comment && (
              <p className="text-gray-700 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
