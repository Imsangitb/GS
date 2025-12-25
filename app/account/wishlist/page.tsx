"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/app/components/PageHeader';
import FloatingBackButton from '@/app/components/FloatingBackButton';

type WishlistItem = {
  id: string;
  product_id: string;
  added_at: string;
  products: {
    name: string;
    price: number;
    description: string;
    images: string[];
  };
};

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?redirect=/account/wishlist');
      return;
    }

    async function fetchWishlist() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/wishlist');
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        
        const data = await response.json();
        setWishlistItems(data.wishlistItems || []);
      } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWishlist();
  }, [user, router]);

  const removeFromWishlist = async (wishlistItemId: string, productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      // Update the local state to reflect removal
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== wishlistItemId));
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      setError(error.message);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    const product = {
      id: item.product_id,
      name: item.products.name,
      price: item.products.price,
      images: item.products.images,
    };
    
    addToCart(product);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Your Wishlist"
          subtitle="Save and track products for later"
          gradient={true}
        />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader
          title="Your Wishlist"
          subtitle="Save and track products for later"
          gradient={true}
        />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>There was an error loading your wishlist: {error}</p>
            <p className="mt-2">Please try refreshing the page.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Your Wishlist"
        subtitle="Save and track products for later"
        gradient={true}
      />
      <FloatingBackButton href="/account" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save items you love to your wishlist and come back to them later</p>
              <Link href="/shop" className="inline-block bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Developer Insights</h2>
                  <p className="text-gray-600">Tech specs for your saved items</p>
                </div>
                <Link href="#" className="text-sm font-medium text-black flex items-center">
                  View All Insights
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-xs mb-1">Most Common</p>
                  <p className="font-medium">Sustainable Materials</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-xs mb-1">Average Price</p>
                  <p className="font-medium">$49.99</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-xs mb-1">Tech Category</p>
                  <p className="font-medium">Productivity</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-xs mb-1">Sustainability</p>
                  <p className="font-medium">4.2/5.0</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-64 w-full">
                    <Link href={`/shop/products/${item.product_id}`}>
                      <Image
                        src={item.products.images[0] || '/placeholder.jpg'}
                        alt={item.products.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => removeFromWishlist(item.id, item.product_id)}
                        className="bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/shop/products/${item.product_id}`} className="block">
                      <h2 className="text-lg font-medium hover:text-gray-700 transition-colors">{item.products.name}</h2>
                    </Link>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-1">{item.products.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">${item.products.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Added {formatDate(item.added_at)}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                      Add to Cart
                    </button>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        In Stock
                      </span>
                      <Link href={`/shop/products/${item.product_id}`} className="underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {wishlistItems.length > 0 && (
          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Developer Recommendations</h2>
              <p className="text-gray-600 mb-4">Based on your wishlist items, you might be interested in these developer tools:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <h3 className="font-medium mb-1">Code Editor Extension Pack</h3>
                  <p className="text-sm text-gray-600 mb-2">Boost your productivity with our curated development tools.</p>
                  <Link href="#" className="text-sm font-medium text-black">Learn More</Link>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <h3 className="font-medium mb-1">Sustainable Tech Newsletter</h3>
                  <p className="text-sm text-gray-600 mb-2">Weekly insights on eco-friendly technology innovations.</p>
                  <Link href="#" className="text-sm font-medium text-black">Subscribe</Link>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <h3 className="font-medium mb-1">API Access</h3>
                  <p className="text-sm text-gray-600 mb-2">Get developer access to our product data and sustainability metrics.</p>
                  <Link href="#" className="text-sm font-medium text-black">Request Access</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}