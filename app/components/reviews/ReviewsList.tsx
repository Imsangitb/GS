"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    }
  }
}

interface ReviewsListProps {
  productId: string;
  refreshTrigger?: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, refreshTrigger = 0 }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error: supabaseError } = await supabase
          .from('reviews')
          .select(`
            *,
            user:user_id(
              id, email, user_metadata
            )
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        setReviews(data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, supabase, refreshTrigger]);

  if (loading) {
    return <div className="py-6 text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="py-6 text-center text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium mr-4">
          Customer Reviews ({reviews.length})
        </h3>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <div className="mr-4">
              {review.user?.user_metadata?.avatar_url ? (
                <Image
                  src={review.user.user_metadata.avatar_url}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                  {(review.user?.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium">
                {review.user?.user_metadata?.full_name || review.user?.email?.split('@')[0] || 'Anonymous'}
              </h4>
              
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-xs text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
              
              <h5 className="font-medium mt-2">{review.title}</h5>
              <p className="mt-1 text-gray-600">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;