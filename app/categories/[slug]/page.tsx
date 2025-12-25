import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FloatingBackButton from '../../components/FloatingBackButton';
import productsData from '@/app/data/products';

// Sample category data (you'll replace this with your actual data)
const categories = [
  {
    id: 1,
    name: "Accessories",
    description: "Elevate your style with our premium accessories. From leather wallets to scarves, our accessories combine quality craftsmanship with elegant design.",
    image: "/images/scarf-1.jpg", 
    slug: "accessories",
    banner: "/images/scarf-2.jpg"
  },
  {
    id: 2,
    name: "Clothing",
    description: "Sustainable, comfortable apparel for everyday wear. Our clothing line is crafted from premium materials and designed with both style and comfort in mind.",
    image: "/images/tshirt-1.jpg",
    slug: "clothing",
    banner: "/images/tshirt-2.jpg"
  },
  {
    id: 3,
    name: "Home",
    description: "Transform your space with our elegant home collection. From desk lamps to decor items, our home collection helps create a stylish, comfortable environment.",
    image: "/images/lamp-1.jpg",
    slug: "home",
    banner: "/images/lamp-2.jpg"
  },
  {
    id: 4,
    name: "Kitchen",
    description: "Elevate your culinary experience with our premium kitchen products. Designed for both functionality and aesthetics, our kitchen items are perfect for the home chef.",
    image: "/images/coffee-1.jpg", 
    slug: "kitchen",
    banner: "/images/coffee-2.jpg"
  },
  {
    id: 5,
    name: "Office",
    description: "Enhance your workspace with our elegant office supplies. From notebook covers to desk organizers, our office products combine style with functionality.",
    image: "/images/notebook-1.jpg",
    slug: "office",
    banner: "/images/notebook-2.jpg"
  }
];

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage: FC<CategoryPageProps> = async ({ params }) => {
  const { slug } = await Promise.resolve(params);
  
  // Find the category based on slug
  const category = categories.find(cat => cat.slug.toLowerCase() === slug.toLowerCase());
  
  // If category doesn't exist, return 404
  if (!category) {
    notFound();
  }
    // Get products for this category using the real product data
  const products = productsData.filter(product => 
    product.category.toLowerCase() === slug.toLowerCase()
  );

  // Function to format price
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };
  
  // Calculate sale price
  const calculateSalePrice = (price: number, discountPercentage: number): number => {
    return price * (1 - discountPercentage / 100);
  };

  // Generate back button code animation
  const backBtnCode = `
function goBack() {
  window.history.back();
  // Navigate to previous page
  return true;
}`;
  
  return (
    <div className="pt-24 pb-16">
      {/* Tech-inspired Back Button */}
      <div className="container mx-auto px-4 mb-6">
        <Link 
          href="/categories" 
          className="tech-back-btn group inline-flex items-center py-2 px-4 rounded-md relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Animated circuit pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-40 transition-opacity">
            <div className="circuit-pattern w-full h-full"></div>
          </div>
          
          {/* Terminal-style blinking cursor effect */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center px-3 overflow-hidden">
            <div className="hidden sm:block text-xs text-teal-400 font-mono opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
              {backBtnCode}
              <span className="inline-block w-2 h-4 bg-teal-400 ml-1 animate-cursor"></span>
            </div>
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
          <span className="ml-2 relative z-10 text-white font-medium">Back to Categories</span>
        </Link>
      </div>

      {/* Category Banner */}
      <div className="relative h-[300px] md:h-[400px] mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
        <Image 
          src={category.banner || category.image}
          alt={category.name}
          fill
          priority
          className="object-cover"
        />
        <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-white/90 max-w-2xl">{category.description}</p>
        </div>
      </div>
      
      {/* Product Filters - Basic Version */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="mb-2 sm:mb-0">
            <span className="text-gray-600">{products.length} products</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-10 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-10 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none text-sm">
                <option>All items</option>
                <option>In stock</option>
                <option>On sale</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No products found in this category</h3>
            <p className="text-gray-500 mt-2">Check back soon as we're constantly adding new items!</p>
            <Link href="/shop" className="inline-block mt-6 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 border border-gray-100 group"
              >
                {/* Product Labels (using properties only if they exist) */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {/* Sale badge */}
                  {'originalPrice' in product && (
                    <div className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      SALE
                    </div>
                  )}
                </div>
                
                <Link href={`/shop/products/${product.id}`} className="block relative h-64 overflow-hidden">
                  <Image
                    src={product.images[0]} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                
                <div className="p-5">
                  <Link href={`/shop/products/${product.id}`} className="block">
                    <h3 className="text-lg font-medium mb-2 group-hover:text-teal-600 transition-colors">{product.name}</h3>
                  </Link>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">{formatPrice(product.price)}</span>
                    {'originalPrice' in product && (
                      <span className="ml-3 text-sm line-through text-gray-500">
                        {formatPrice(product.originalPrice as number)}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock indicator */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <p className={`text-sm flex items-center ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.inStock ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      href={`/shop/products/${product.id}`}
                      className="text-sm text-gray-600 hover:text-black transition mb-2 inline-block"
                    >
                      View Details
                    </Link>
                    
                    {product.inStock ? (
                      <button 
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-md font-medium transition-all"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button 
                        className="w-full bg-gray-300 text-gray-500 py-2 rounded-md font-medium cursor-not-allowed"
                        disabled
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Back Button (appears on scroll) */}
      <FloatingBackButton href="/categories" />
    </div> 
  );
};

export default CategoryPage;