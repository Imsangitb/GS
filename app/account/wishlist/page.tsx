"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseClient } from '@/app/lib/supabase';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: number;
  added_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    sustainability_score?: number;
  };
}

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    async function fetchWishlist() {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select(`
            id, 
            user_id, 
            product_id, 
            added_at,
            product:products (
              id, 
              name, 
              price, 
              image,
              sustainability_score
            )
          `)
          .eq('user_id', user?.id)
          .order('added_at', { ascending: false });
          
        if (error) {
          setError('Failed to fetch wishlist: ' + error.message);
          return;
        }

        // Convert data to the correct format - handling product as an array
        const formattedData = data?.map(item => {
          // Extract the first item from the product array if it exists
          const productData = Array.isArray(item.product) && item.product.length > 0 
            ? item.product[0] 
            : { id: 0, name: 'Unknown Product', price: 0, image: '/placeholder.jpg', sustainability_score: 0 };
            
          return {
            id: item.id,
            user_id: item.user_id,
            product_id: item.product_id,
            added_at: item.added_at,
            product: {
              id: productData.id,
              name: productData.name,
              price: productData.price,
              image: productData.image,
              sustainability_score: productData.sustainability_score
            }
          };
        }) || [];
        
        setWishlistItems(formattedData);
        
      } catch (err) {
        console.error('Error in wishlist fetch:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWishlist();
  }, [user, router, supabase]);

  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistItemId);
        
      if (error) {
        setError('Failed to remove item: ' + error.message);
        return;
      }
      
      // Update the local state to reflect removal
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistItemId));
      
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('An unexpected error occurred.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <Link 
            href="/account" 
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Account
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {wishlistItems.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 text-gray-500">Browse our catalog and add items to your wishlist.</p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <li key={item.id} className="flex py-6 px-4 sm:px-6">
                  <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={item.product.image || '/placeholder.jpg'}
                      alt={item.product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          <Link href={`/shop/products/${item.product_id}`} className="hover:text-teal-600">
                            {item.product.name}
                          </Link>
                        </h4>
                        
                        {item.product.sustainability_score && (
                          <div className="mt-1 flex items-center">
                            <span className="text-xs font-medium mr-2">Sustainability:</span>
                            <div className="bg-gray-200 h-2 rounded-full w-24 overflow-hidden">
                              <div 
                                className={`h-full ${
                                  item.product.sustainability_score >= 80 ? 'bg-green-500' : 
                                  item.product.sustainability_score >= 60 ? 'bg-teal-500' :
                                  item.product.sustainability_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${item.product.sustainability_score}%` }}
                              ></div>
                            </div>
                            <span className="ml-1 text-xs font-medium">{item.product.sustainability_score}%</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-lg font-medium text-gray-900">${item.product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex-1"></div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <p className="text-gray-500">
                        Added on {new Date(item.added_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="font-medium text-red-600 hover:text-red-500 mr-4"
                        >
                          Remove
                        </button>
                        
                        <Link 
                          href={`/shop/products/${item.product_id}`}
                          className="font-medium text-teal-600 hover:text-teal-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <Link 
                href="/shop" 
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}