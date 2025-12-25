"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import PageHeader from '../components/PageHeader';
import NewsletterSection from '../components/NewsletterSection';

// Import the default export (products array)
import products from '../data/products';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  features: string[];
  colors?: string[];
  sizes?: string[];
  details: string;
  care: string;
  images: string[];
  // Added properties for product labels
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  discountPercentage?: number;
}

interface PriceRangeState {
  min: number;
  max: number;
}

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // Use the imported products array directly
  const allProducts = products as Product[];
  
  // Assign product labels using useMemo to prevent unnecessary recalculations
  const productsWithLabels = useMemo(() => {
    return allProducts.map(product => {
      // Simply using product ID for demo purposes
      // In a real app, you'd have actual data for these properties
      const productId = parseInt(product.id);
      return {
        ...product,
        isNew: productId % 5 === 0, // Every 5th product is new
        isBestSeller: productId % 3 === 0, // Every 3rd product is a best seller
        isSale: productId % 4 === 0, // Every 4th product is on sale
        discountPercentage: productId % 4 === 0 ? 15 : 0 // 15% discount on sale items
      };
    });
  }, [allProducts]);
  
  const initialCategory = searchParams.get('category') || 'all';
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsWithLabels);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<PriceRangeState>({ min: 0, max: 1000 });
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // Extract all unique categories using useMemo
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(allProducts.map(product => product.category)))];
  }, [allProducts]);
  
  // This effect filters and sorts products when filter criteria change
  useEffect(() => {
    let result = [...productsWithLabels];
    
    // Apply category filter
    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Apply sorting
    if (sortOrder === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      // Sort by isNew flag then by ID
      result.sort((a, b) => {
        if (a.isNew === b.isNew) {
          return parseInt(b.id) - parseInt(a.id);
        }
        return a.isNew ? -1 : 1;
      });
    } else if (sortOrder === 'best-selling') {
      // Sort by isBestSeller flag
      result.sort((a, b) => {
        if (a.isBestSeller === b.isBestSeller) {
          return 0;
        }
        return a.isBestSeller ? -1 : 1;
      });
    }
    
    setFilteredProducts(result);
    
  }, [activeCategory, sortOrder, priceRange, productsWithLabels]);
  
  // Separate effect for URL updates to prevent infinite loops
  useEffect(() => {
    const url = activeCategory !== 'all' 
      ? `/shop?category=${activeCategory}` 
      : '/shop';
    
    // Only update URL if necessary, and do it without scroll reset
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== url && typeof window !== 'undefined') {
      router.push(url, { scroll: false });
    }
  }, [activeCategory, router]);
  
  const handleCategoryChange = (category: string): void => {
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortOrder(e.target.value);
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max'): void => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleAddToCart = (product: Product): void => {
    console.log("Quick add to cart:", product);
    try {
      addToCart(product, 1);
      
      // Show added confirmation
      setAddedProduct(product.id);
      
      // Hide confirmation after 2 seconds
      setTimeout(() => {
        setAddedProduct(null);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  
  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };
  
  // Calculate sale price
  const calculateSalePrice = (price: number, discountPercentage: number): number => {
    return price * (1 - discountPercentage / 100);
  };
  
  return (
    <>
      <PageHeader
        title="Shop Our Collection"
        subtitle="Discover developer-focused fashion that combines functionality, style, and technology"
        gradient={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h2 className="font-semibold mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      activeCategory === category 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <h2 className="font-semibold mb-3">Sort By</h2>
              <select 
                className="w-full p-2 border rounded-md bg-white"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="default">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div>
              <h2 className="font-semibold mb-3">Price Range</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <input 
                    type="number" 
                    min="0" 
                    max={priceRange.max} 
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, 'min')}
                    className="w-20 p-2 border rounded-md"
                  />
                </div>
                <span>to</span>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <input 
                    type="number" 
                    min={priceRange.min} 
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, 'max')}
                    className="w-20 p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative group">
                {/* IMPROVED Product Labels - CONSISTENT STYLE */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <div className="bg-black bg-opacity-70 text-white text-xs font-medium px-3 py-1 rounded">
                      NEW
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="bg-black bg-opacity-70 text-white text-xs font-medium px-3 py-1 rounded">
                      BEST SELLER
                    </div>
                  )}
                  {product.isSale && (
                    <div className="bg-black bg-opacity-70 text-white text-xs font-medium px-3 py-1 rounded">
                      SALE {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                
                <Link href={`/shop/products/${product.id}`} className="block">
                  <div className="aspect-square relative bg-gray-100 overflow-hidden">
                    <Image 
                      src={product.images[0]} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/shop/products/${product.id}`} className="block">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    {product.isSale ? (
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</p>
                        <p className="text-red-600 font-medium">
                          {formatPrice(calculateSalePrice(product.price, product.discountPercentage || 0))}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-2 font-medium">{formatPrice(product.price)}</p>
                    )}
                  </Link>
                  
                  {/* Improved Stock indicator */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <p className={`text-sm flex items-center ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.inStock ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      href={`/shop/products/${product.id}`}
                      className="text-sm text-gray-600 hover:text-black transition mb-1 inline-block"
                    >
                      View Details
                    </Link>
                    
                    {/* Softer, more stylish Add to Cart Button with hover effects */}
                    {product.inStock && (
                      <button 
                        onClick={() => handleAddToCart(product)}
                        onMouseEnter={() => setHoveredButton(product.id)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className={`flex items-center justify-center py-2 px-4 rounded-md text-sm transition-all duration-300 ${
                          addedProduct === product.id 
                            ? 'bg-green-500 text-white' 
                            : hoveredButton === product.id
                              ? 'bg-gray-800 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-800 hover:text-white'
                        }`}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {addedProduct === product.id ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setPriceRange({ min: 0, max: 1000 });
                setSortOrder('default');
              }}
              className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
      
      <NewsletterSection 
        title="Join Our Developer Community"
        subtitle="Subscribe for product releases, coding resources, and exclusive offers"
        buttonText="Subscribe"
        placeholderText="Enter your email"
        promoText="Get 15% off your first tech purchase when you subscribe!"
      />
    </>
  );
}