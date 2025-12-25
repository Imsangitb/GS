"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

type Product = {
  id: string; // Changed from number to string to match product.ts
  name: string;
  price: number;
  description: string; // Added to match product structure
  category: string; // Added to match product structure
  images: string[]; // Changed from image to images array
  isSale?: boolean;
  originalPrice?: number;
};

type FeaturedProductsProps = {
  title: string;
  products: Product[];
  tagline?: string;
};

const FeaturedProducts = ({ title, products, tagline }: FeaturedProductsProps) => {
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // Changed from number to string
  
  const handleAddToCart = (product: Product) => {
    setAddingToCart(product.id);
    
    // Simulate a small delay for button animation
    setTimeout(() => {
      addToCart(product);
      setAddingToCart(null);
    }, 400);
  };
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            <Link 
              href="/shop" 
              className="px-6 py-2 border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white rounded-md transition-colors flex items-center"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {tagline && (
            <p className="text-gray-600 mt-2 text-lg">{tagline}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            // Get the first image from the images array
            const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;
            
            return (
              <div 
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <div className="relative h-64 overflow-hidden">
                  {primaryImage ? (
                    <div className="relative h-full w-full">
                      <Link href={`/shop/products/${product.id}`}>
                        <Image 
                          src={primaryImage} 
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                    </div>
                  ) : (
                    <div className="h-full bg-gray-200"></div>
                  )}
                  
                  {product.isSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                      SALE
                    </div>
                  )}
                  
                  {/* Quick view button */}
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-black/70 translate-y-full group-hover:translate-y-0 transition-transform">
                    <Link href={`/shop/products/${product.id}`} className="text-white text-center block text-sm">
                      Quick View
                    </Link>
                  </div>
                </div>
                
                <div className="p-5">
                  <Link href={`/shop/products/${product.id}`}>
                    <h3 className="text-lg font-medium mb-2 hover:text-teal-600 transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                    {product.isSale && product.originalPrice && (
                      <span className="ml-3 text-sm line-through text-gray-500">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button 
                    className={`w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md font-medium transition-all ${
                      addingToCart === product.id ? 'bg-teal-600' : ''
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                  >
                    {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;