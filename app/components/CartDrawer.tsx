"use client";

import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const CartDrawer = () => {
  const { 
    cart,
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity 
  } = useCart();
  
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isCartOpen) {
        toggleCart();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Toggle body scroll
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, toggleCart]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isCartOpen, toggleCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay with fade-in animation */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-500 ease-in-out animate-fadeIn"
        style={{ 
          animation: 'fadeIn 0.3s forwards',
          backdropFilter: 'blur(2px)'
        }}
        onClick={toggleCart}
      ></div>
      
      {/* Drawer with slide-in animation */}
      <div 
        ref={drawerRef}
        className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-xl transform transition-transform duration-500 ease-out animate-slideIn"
        style={{ 
          animation: 'slideIn 0.4s forwards',
          boxShadow: '-8px 0 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Cart {cart.items.length > 0 && `(${cart.totalItems})`}</h2>
            <button 
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-16 animate-fadeIn" style={{ animation: 'fadeIn 0.5s forwards' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="mt-6 text-xl text-gray-500">Your cart is empty</p>
                <button 
                  onClick={toggleCart}
                  className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors transform hover:scale-105"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item, index) => (
                  <li 
                    key={`${item.product.id}-${item.color || ''}-${item.size || ''}`}
                    className="py-6 flex animate-fadeSlideIn" 
                    style={{ animation: `fadeSlideIn 0.5s ${index * 0.1}s forwards` }}
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                      <Image
                        src={item.product.images[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover object-center"
                      />
                    </div>
                    
                    <div className="ml-6 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="pr-2">
                            <Link href={`/shop/products/${item.product.id}`} className="hover:text-teal-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="ml-4 whitespace-nowrap">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        {/* Display variants if they exist */}
                        {(item.color || item.size) && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.color && <span className="mr-2">Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 min-w-[30px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="font-medium text-red-600 hover:text-red-500 transition-colors group flex items-center"
                        >
                          <span className="group-hover:underline">Remove</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 animate-slideUp" style={{ animation: 'slideUp 0.4s forwards' }}>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p className="text-xl">${cart.subtotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/cart" onClick={toggleCart}>
                <button
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-all transform hover:scale-105 shadow-md"
                >
                  View Cart
                </button>
              </Link>
              <Link href="/checkout" onClick={toggleCart}>
                <button
                  className="w-full mt-3 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-all transform hover:scale-105 shadow-md"
                >
                  Checkout
                </button>
              </Link>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hover:underline"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;