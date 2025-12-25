"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductById, getRelatedProducts } from '../../../data/products';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import ProductImageGallery from '../../../components/ProductImageGallery';
import ProductActions from '../../../components/ProductActions';
import RelatedProducts from '../../../components/RelatedProducts';
import SustainabilityMeter from '../../../components/SustainabilityMeter';
import FloatingBackButton from '../../../components/FloatingBackButton';
import NewsletterSection from '../../../components/NewsletterSection';

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <a 
          href="/shop" 
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md transition-colors"
        >
          Back to Shop
        </a>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(id);
  
  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
  };
  
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleQuantityChange = (newQty: number) => {
    setQuantity(Math.max(1, newQty));
  };
  
  const handleAddToCart = () => {
    addToCart(
      product, 
      quantity, 
      selectedColor || undefined, 
      selectedSize || undefined
    );
  };
  
  const handleAddToWishlist = async () => {
    if (!user) {
      setWishlistMessage({
        type: 'error',
        text: 'Please sign in to add items to your wishlist'
      });
      return;
    }

    try {
      setIsAddingToWishlist(true);
      setWishlistMessage(null);
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: id })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to wishlist');
      }
      
      setWishlistMessage({
        type: 'success',
        text: 'Added to wishlist!'
      });

    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      setWishlistMessage({
        type: 'error',
        text: error.message || 'Failed to add to wishlist'
      });
    } finally {
      setIsAddingToWishlist(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setWishlistMessage(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="bg-white">
        <FloatingBackButton href="/shop" />
        
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span className="mx-2">/</span>
            <a href="/shop" className="hover:text-gray-900">Shop</a>
            <span className="mx-2">/</span>
            <a href={`/shop?category=${product.category}`} className="hover:text-gray-900">{product.category}</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Images */}
            <ProductImageGallery images={product.images} productName={product.name} />
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
                {product.inStock ? (
                  <span className="ml-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">In Stock</span>
                ) : (
                  <span className="ml-4 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Out of Stock</span>
                )}
              </div>
              
              <p className="text-gray-600 mb-8">{product.description}</p>
              
              {/* Sustainability Meter */}
              <div className="mb-8">
                <SustainabilityMeter 
                  score={product.techSpecs?.sustainabilityRating ? product.techSpecs.sustainabilityRating * 20 : 80} 
                  materials={[
                    { name: 'Recycled Materials', percentage: 80 },
                    { name: 'Organic Materials', percentage: 20 }
                  ]}
                  certifications={['GOTS Certified', 'Fair Trade']}
                  impact="Low environmental impact. 30% reduction in water usage compared to conventional manufacturing."
                />
              </div>
              
              {/* Product Actions (Color, Size, Quantity, Add to Cart) */}
              <ProductActions
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                quantity={quantity}
                onColorChange={handleColorSelection}
                onSizeChange={handleSizeSelection}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
              />
              
              {/* Wishlist Button */}
              <div className="mt-6">
                <button
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                  className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  {isAddingToWishlist ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Add to Wishlist
                    </>
                  )}
                </button>
                
                {wishlistMessage && (
                  <div className={`mt-2 text-center p-2 rounded text-sm ${wishlistMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {wishlistMessage.text}
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <ul className="list-disc pl-5 space-y-2 mb-8">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
                
                <div className="space-y-6">
                  {product.details && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Details</h3>
                      <p className="text-gray-600">{product.details}</p>
                    </div>
                  )}
                  
                  {product.care && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Care Instructions</h3>
                      <p className="text-gray-600">{product.care}</p>
                    </div>
                  )}
                  
                  {product.techSpecs && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium mb-4">Tech Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {Object.entries(product.techSpecs).map(([key, value]) => (
                          value && key !== 'sustainabilityRating' && (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
          
          {/* Developer Note - technical feature highlight */}
          <div className="mt-16 mb-8 p-8 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Developer-Focused Design
            </h3>
            <p className="text-gray-600">
              This product was designed with developers in mind, focusing on functionality, comfort, and sustainability. 
              Our team of engineers and designers has carefully considered the unique needs of tech professionals to create 
              products that enhance your coding experience.
            </p>
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