"use client";

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import ProductActions from '@/app/components/ProductActions';
import SustainabilityMeter from '@/app/components/SustainabilityMeter';
import RelatedProducts from '@/app/components/RelatedProducts';
import ProductImageGallery from '@/app/components/ProductImageGallery';
import FloatingBackButton from '@/app/components/FloatingBackButton';
import { useCart } from '@/app/context/CartContext';
import productsData, { getProductById, getRelatedProducts } from '@/app/data/products';

// Define interfaces for our components
interface Color {
  name: string;
  value: string;
  code: string;
}

interface Size {
  name: string;
  code: string;
  inStock: boolean;
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Define a type for the product details to avoid TypeScript errors
interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  categoryName?: string;
  image?: string;
  images: string[];
  isSale?: boolean;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  longDescription: string;
  colors: Color[];
  sizes: Size[];
  isNewArrival: boolean;
  inStock: boolean;
  features: string[];
  sustainability: {
    score: number;
    materials: Array<{name: string; percentage: number}>;
    certifications: string[];
    impact: string;
  };
  related: number[];
  details?: string;
  care?: string;
}

const ProductPage: FC<ProductPageProps> = ({ params }) => {
  // Use the useParams hook to get the ID in a client component
  const urlParams = useParams();
  // Use the id from useParams instead of accessing params directly
  const productId = urlParams.id as string;
  
  // State to store product data
  const [product, setProduct] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Helper function to convert color names to hex
  function colorToHex(color: string): string {
    const colorMap: {[key: string]: string} = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Gray': '#808080',
      'Navy': '#000080',
      'Brown': '#A52A2A',
      'Tan': '#D2B48C',
      'Silver': '#C0C0C0',
      'Blue': '#0000FF',
      'Red': '#FF0000',
      'Green': '#008000',
      'Yellow': '#FFFF00',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Pink': '#FFC0CB',
      'Teal': '#008080',
      'Burgundy': '#800020',
      'Camel': '#C19A6B',
      'Terracotta': '#E2725B',
    };
    
    return colorMap[color] || '#CCCCCC';
  }

  // Load product data on component mount
  useEffect(() => {
    if (productId) {
      const fetchedProduct = getProductById(productId);
      
      if (!fetchedProduct) {
        notFound();
        return;
      }
      
      setProduct(fetchedProduct);
      
      // Transform colors from string[] to Color[] if needed
      const formattedColors: Color[] = Array.isArray(fetchedProduct.colors) 
        ? fetchedProduct.colors.map(color => {
            if (typeof color === 'string') {
              return { 
                name: color, 
                value: colorToHex(color), 
                code: color.substring(0, 3).toUpperCase() 
              };
            }
            return color as Color;
          })
        : [];

      // Transform sizes from string[] to Size[] if needed
      const formattedSizes: Size[] = Array.isArray(fetchedProduct.sizes)
        ? fetchedProduct.sizes.map(size => {
            if (typeof size === 'string') {
              return {
                name: size,
                code: size.substring(0, 2).toUpperCase(),
                inStock: true
              };
            }
            return size as Size;
          })
        : [];
      
      // Create related products array
      const relatedProductIds = getRelatedProducts(productId, 3).map(p => parseInt(p.id));
      
      // Create the enhanced product details
      const enhancedProductDetails: ProductDetail = {
        ...fetchedProduct,
        rating: 4.7,
        reviewCount: 124,
        longDescription: fetchedProduct.details || fetchedProduct.description,
        categoryName: fetchedProduct.category,
        isNewArrival: false,
        isSale: 'originalPrice' in fetchedProduct,
        inStock: fetchedProduct.inStock !== false,
        colors: formattedColors,
        sizes: formattedSizes,
        features: fetchedProduct.features || ["Premium product", "High quality materials", "Durable design"],
        sustainability: {
          score: 85,
          materials: [
            { name: "Sustainable Materials", percentage: 70 },
            { name: "Other Materials", percentage: 30 }
          ],
          certifications: [
            "Eco-Friendly Certified",
            "Responsibly Sourced"
          ],
          impact: "This product helps reduce waste and environmental impact."
        },
        related: relatedProductIds
      };
      
      setProductDetails(enhancedProductDetails);
      setLoading(false);
    }
  }, [productId]);
  
  // Show loading state while fetching product
  if (loading || !product || !productDetails) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16">
      {/* Tech-inspired Back Button */}
      <div className="container mx-auto px-4 mb-6">
        <Link 
          href="/shop" 
          className="tech-back-btn group inline-flex items-center py-2 px-4 rounded-md relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Animated circuit pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-40 transition-opacity">
            <div className="circuit-pattern w-full h-full"></div>
          </div>
          
          {/* Button text and icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-teal-500 group-hover:text-teal-400 relative z-10 transition-transform duration-300 transform group-hover:-translate-x-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 relative z-10 text-white font-medium">Back to Shop</span>
        </Link>
      </div>
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="text-sm text-gray-500">
          <ol className="list-none p-0 inline-flex items-center">
            <li className="flex items-center">
              <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <Link href="/categories" className="hover:text-teal-600 transition-colors">Categories</Link>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link href={`/categories/${product.category}`} className="hover:text-teal-600 transition-colors capitalize">
                {productDetails.categoryName}
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Product Details */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image Gallery */}
          <div className="w-full md:w-7/12">
            <ProductImageGallery images={productDetails.images} productName={product.name} />
          </div>
          
          {/* Product Info */}
          <div className="w-full md:w-5/12">
            <div className="sticky top-24">
              {productDetails.isNewArrival && (
                <div className="inline-block bg-teal-500 text-white px-3 py-1 text-sm font-medium rounded-full mb-4">
                  NEW ARRIVAL
                </div>
              )}
              {productDetails.isSale && (
                <div className="inline-block bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-full mb-4 ml-2">
                  SALE
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(productDetails.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{productDetails.rating} ({productDetails.reviewCount} {productDetails.reviewCount === 1 ? 'review' : 'reviews'})</span>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {productDetails.isSale && productDetails.originalPrice && (
                  <span className="ml-3 text-sm line-through text-gray-500">
                    ${productDetails.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">
                {product.description}
              </p>
              
              {/* Product Actions Component */}
              {productDetails.inStock ? (
                <>
                  <ProductActions 
                    product={product} 
                    colors={productDetails.colors} 
                    sizes={productDetails.sizes} 
                  />
                  
                  {/* Product Features */}
                  <div className="mt-8 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {productDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="mt-6 mb-8 p-4 border-l-4 border-red-500 bg-red-50 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Out of Stock</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>This product is currently out of stock. Please check back later or browse our other products.</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="rounded-md bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-100"
                            onClick={() => {
                              // You can implement a notification subscription here
                              alert("We'll notify you when this product is back in stock!");
                            }}
                          >
                            Notify me when available
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sustainability Information */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Sustainability</h3>
                <SustainabilityMeter 
                  score={productDetails.sustainability.score} 
                  materials={productDetails.sustainability.materials} 
                  certifications={productDetails.sustainability.certifications}
                  impact={productDetails.sustainability.impact}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Description and Details */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>
            <div className="prose prose-lg max-w-none">
              <p>{productDetails.longDescription}</p>
            </div>
            
            {/* Tech Specs */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Materials</h4>
                    <ul className="space-y-1">
                      {productDetails.sustainability.materials.map((material, idx) => (
                        <li key={idx} className="text-gray-900 flex items-center">
                          <span className="font-medium">{material.name}:</span> 
                          <span className="ml-2">{material.percentage}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Certifications</h4>
                    <ul className="space-y-1">
                      {productDetails.sustainability.certifications.length > 0 ? (
                        productDetails.sustainability.certifications.map((cert, idx) => (
                          <li key={idx} className="text-gray-900">{cert}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No specific certifications</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Care Instructions */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Care Instructions</h3>
              <div className="bg-white p-6 rounded-lg shadow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Spot clean with a damp cloth</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Do not machine wash</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Avoid direct sunlight for prolonged periods</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Store in a cool, dry place when not in use</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Shipping & Returns */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Shipping</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Free standard shipping on orders over $50</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Standard delivery: 3-5 business days</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Express delivery: 1-2 business days</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Returns</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>30-day return policy</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Free returns on all orders</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Items must be unused and in original packaging</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Reviews Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                <button className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Write a Review
                </button>
              </div>
              
              {productDetails.reviewCount > 0 ? (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900 mb-1">{productDetails.rating.toFixed(1)}</div>
                          <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(productDetails.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">{productDetails.reviewCount} {productDetails.reviewCount === 1 ? 'review' : 'reviews'}</p>
                        </div>
                      </div>
                      
                      <div className="md:w-3/4 md:pl-8 md:border-l border-gray-200">
                        <div className="space-y-2">
                          {/* 5 star rating bar */}
                          <div className="flex items-center">
                            <div className="w-1/5 text-sm text-gray-600">5 stars</div>
                            <div className="w-3/5">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: '70%' }}></div>
                              </div>
                            </div>
                            <div className="w-1/5 text-sm text-gray-600 text-right">70%</div>
                          </div>
                          
                          {/* 4 star rating bar */}
                          <div className="flex items-center">
                            <div className="w-1/5 text-sm text-gray-600">4 stars</div>
                            <div className="w-3/5">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: '20%' }}></div>
                              </div>
                            </div>
                            <div className="w-1/5 text-sm text-gray-600 text-right">20%</div>
                          </div>
                          
                          {/* 3 star rating bar */}
                          <div className="flex items-center">
                            <div className="w-1/5 text-sm text-gray-600">3 stars</div>
                            <div className="w-3/5">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: '5%' }}></div>
                              </div>
                            </div>
                            <div className="w-1/5 text-sm text-gray-600 text-right">5%</div>
                          </div>
                          
                          {/* 2 star rating bar */}
                          <div className="flex items-center">
                            <div className="w-1/5 text-sm text-gray-600">2 stars</div>
                            <div className="w-3/5">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: '3%' }}></div>
                              </div>
                            </div>
                            <div className="w-1/5 text-sm text-gray-600 text-right">3%</div>
                          </div>
                          
                          {/* 1 star rating bar */}
                          <div className="flex items-center">
                            <div className="w-1/5 text-sm text-gray-600">1 star</div>
                            <div className="w-3/5">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: '2%' }}></div>
                              </div>
                            </div>
                            <div className="w-1/5 text-sm text-gray-600 text-right">2%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      All Reviews
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      5 Stars
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      4 Stars
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      With Photos
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      Verified Purchases
                    </button>
                  </div>
                  
                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Alex Johnson</h4>
                        <span className="text-sm text-gray-500">Verified Purchase</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">March 23, 2025</span>
                      </div>
                      
                      <h5 className="text-lg font-medium mb-2">Perfect for my daily commute!</h5>
                      <p className="text-gray-700 mb-4">
                        I've been using this laptop sleeve for about a month now and it's been fantastic. The materials are high quality and I love the additional pocket for my charger. The water resistance has already saved my laptop once during a surprise rain shower!
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden">
                          <Image src="/products/user-review-1.jpg" alt="User review photo" fill className="object-cover" />
                        </div>
                        <div className="w-20 h-20 relative rounded-md overflow-hidden">
                          <Image src="/products/user-review-2.jpg" alt="User review photo" fill className="object-cover" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Helpful (24)
                          </button>
                        </div>
                        <button className="text-sm text-teal-600 hover:text-teal-800">
                          Report
                        </button>
                      </div>
                    </div>
                    
                    {/* Review 2 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Taylor Wilson</h4>
                        <span className="text-sm text-gray-500">Verified Purchase</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">March 15, 2025</span>
                      </div>
                      
                      <h5 className="text-lg font-medium mb-2">Good quality, but smaller than expected</h5>
                      <p className="text-gray-700 mb-4">
                        The quality of this sleeve is excellent, and I appreciate the eco-friendly materials. However, my 14" laptop is a tight fit, so I'd recommend sizing up if you have a bulkier device. Overall, still a great purchase and I'm happy with the sustainability aspects.
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Helpful (12)
                          </button>
                        </div>
                        <button className="text-sm text-teal-600 hover:text-teal-800">
                          Report
                        </button>
                      </div>
                    </div>
                    
                    {/* Load More Button */}
                    <div className="text-center">
                      <button className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        Load More Reviews
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h4 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h4>
                  <p className="mt-1 text-gray-500">Be the first to review this product</p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {productDetails.related.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <RelatedProducts productIds={productDetails.related} products={productsData} />
        </div>
      )}
      
      {/* Floating Back Button (appears on scroll) */}
      <FloatingBackButton href={`/categories/${product.category}`} />
    </div>
  );
};

export default ProductPage;