"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import PageHeader from '../../components/PageHeader';
import NewsletterSection from '../../components/NewsletterSection';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session ID from URL params
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Clear cart on successful checkout
    clearCart();
    
    // In a real application, you would validate the session with Stripe
    // For demo purposes, we'll just use the session ID as the order ID
    const formattedOrderId = `GS-${sessionId.substring(0, 6)}`;
    setOrderId(formattedOrderId);
    setIsLoading(false);

  }, [searchParams, clearCart, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processing your order...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Order Confirmed"
        subtitle="Thank you for your purchase"
        gradient={true}
      />
      
      <div className="container mx-auto max-w-lg px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed and is being prepared for shipment.
          </p>
          
          <div className="mb-6 bg-gray-50 rounded-lg p-4 inline-block mx-auto">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-xl">{orderId}</p>
          </div>
          
          <p className="text-gray-600 mb-8">
            We've sent a confirmation email to your inbox with all the details.
          </p>
          
          {/* Developer-specific confirmation messaging */}
          <div className="bg-gray-50 rounded-lg p-5 mb-8 text-left">
            <h3 className="font-medium text-lg mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-.75-6.75a.75.75 0 011.5 0v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3z" clipRule="evenodd" />
              </svg>
              Shipping Information
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Your order is being processed with priority shipping. Expect delivery within 3-5 business days.
            </p>
            <h3 className="font-medium text-lg mt-4 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              Developer Benefits
            </h3>
            <p className="text-sm text-gray-600">
              As a member of our developer community, you've earned 150 points with this purchase. 
              Your current status: <span className="font-medium">Code Explorer</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/account/orders" 
              className="inline-block bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors"
            >
              Track Your Order
            </Link>
            <Link 
              href="/shop" 
              className="inline-block bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-6 rounded-md transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      
      {/* Product recommendations */}
      <div className="bg-gray-50 py-12 mb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would show actual product data in a real implementation */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-medium">Developer Essential #{i}</h3>
                  <p className="text-gray-600 text-sm mt-1">Perfect for your coding setup</p>
                  <div className="mt-4">
                    <button className="w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-800">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <NewsletterSection 
        title="Join Our Developer Community"
        subtitle="Get early access to new tech-focused products and exclusive developer content"
        buttonText="Subscribe"
        placeholderText="Enter your email"
        promoText="15% off your first order when you subscribe"
      />
    </>
  );
}