"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  
  useEffect(() => {
    // Check if cart and cart.items exist before accessing length
    setIsCartEmpty(!cart?.items?.length);
  }, [cart]);
  
  const handleQuantityChange = (productId: string, action: 'increase' | 'decrease') => {
    if (!cart?.items) return;
    
    const item = cart.items.find(item => item.product.id === productId);
    if (!item) return;
    
    const newQuantity = action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };
  
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };
  
  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    
    return cart.items.reduce((total, item) => {
      const itemPrice = item.product.isSale && item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  // Navigate back to shop page
  const handleContinueShopping = () => {
    router.push('/shop');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
      
      {isCartEmpty ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <svg 
            className="w-20 h-20 mx-auto text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={handleContinueShopping}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h2 className="text-xl font-semibold">Items ({cart?.items?.length || 0})</h2>
                <button 
                  onClick={() => clearCart()}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Clear all items from cart"
                >
                  Clear Cart
                </button>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cart?.items?.map((item) => (
                  <li key={item.product.id} className="py-6 flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                      <div className="flex-1">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="text-base font-medium hover:text-gray-600 transition-colors">{item.product.name}</h3>
                        </Link>
                        
                        {/* Price */}
                        <div className="mt-1">
                          {item.product.isSale && item.product.discountPercentage ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(item.product.price)}
                              </span>
                              <span className="text-red-600">
                                {formatPrice(item.product.price * (1 - item.product.discountPercentage / 100))}
                              </span>
                            </div>
                          ) : (
                            <span>{formatPrice(item.product.price)}</span>
                          )}
                        </div>
                        
                        {/* Additional info (color/size) could go here */}
                        {item.product.colors && (
                          <p className="text-sm text-gray-600 mt-1">
                            Color: {item.color || item.product.colors[0]}
                          </p>
                        )}
                        
                        {item.product.sizes && (
                          <p className="text-sm text-gray-600 mt-1">
                            Size: {item.size || item.product.sizes[0]}
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity and Remove Controls */}
                      <div className="flex items-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded mr-4">
                          <button 
                            onClick={() => handleQuantityChange(item.product.id, 'decrease')}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.product.id, 'increase')}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemove(item.product.id)}
                          className="w-10 h-10 rounded flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
                </div>
                
                <p className="text-sm text-gray-500 italic">
                  Shipping and taxes calculated at checkout
                </p>
                
                <div className="pt-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                    aria-label="Proceed to checkout"
                  >
                    Checkout
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full mt-3 py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 hover:text-black transition-colors flex items-center justify-center"
                    aria-label="Continue shopping"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}