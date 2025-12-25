"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type OrderConfirmationProps = {
  orderId: string;
};

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId }) => {
  return (
    <div className="text-center space-y-8 py-4">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      {/* Confirmation Message */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
        <p className="text-lg font-semibold">Order Number: {orderId}</p>
      </div>
      
      {/* Order Details */}
      <div className="bg-gray-50 p-6 rounded-md max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4">Order Information</h2>
        
        <div className="space-y-4 text-left">
          <div>
            <p className="text-gray-600">We've sent a confirmation email to your registered email address with all the order details.</p>
          </div>
          
          <div>
            <h3 className="font-medium">Estimated Delivery</h3>
            <p className="text-gray-700">
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Shipping Updates</h3>
            <p className="text-gray-700">You will receive shipping updates via email.</p>
          </div>
        </div>
      </div>
      
      {/* Call-to-action buttons */}
      <div className="space-y-3 pt-4">
        <Link 
          href="/account" 
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md transition-colors w-full max-w-xs"
        >
          Track Your Order
        </Link>
        <Link 
          href="/shop" 
          className="inline-block bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 py-2 px-6 rounded-md transition-colors w-full max-w-xs mt-3"
        >
          Continue Shopping
        </Link>
      </div>
      
      {/* Brand Logo */}
      <div className="pt-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 relative">
            <Image 
              src="/images/email/GSLogo BGR.png" 
              alt="Glossify Store Logo" 
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
        </div>
        <p className="text-gray-500 mt-3 text-sm">
          Sustainable products for a better tomorrow
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;