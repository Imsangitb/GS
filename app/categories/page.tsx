import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Sample category data (you'll replace this with your actual data)
const categories = [
  {
    id: 1,
    name: "Accessories",
    description: "Elevate your style with our premium tech-inspired accessories",
    image: "/categories/accessories.jpg", 
    itemCount: 12,
    featured: true,
    slug: "accessories"
  },
  {
    id: 2,
    name: "Clothing",
    description: "Sustainable, comfortable apparel for the modern developer",
    image: "/categories/clothing.jpg",
    itemCount: 18,
    featured: true,
    slug: "clothing"
  },
  {
    id: 3,
    name: "Home",
    description: "Transform your space with our minimalist home decor collection",
    image: "/categories/home.jpg",
    itemCount: 9,
    featured: true,
    slug: "home"
  },
  {
    id: 4,
    name: "Gadgets",
    description: "Innovative tech accessories for your everyday needs",
    image: "/categories/gadgets.jpg", 
    itemCount: 15,
    featured: false,
    slug: "gadgets"
  },
  {
    id: 5,
    name: "Footwear",
    description: "Comfortable and stylish footwear for developers on the move",
    image: "/categories/footwear.jpg",
    itemCount: 7,
    featured: false,
    slug: "footwear"
  },
  {
    id: 6,
    name: "Books",
    description: "Curated collection of tech literature and coffee table books",
    image: "/categories/books.jpg",
    itemCount: 14,
    featured: false,
    slug: "books"
  },
];

const CategoriesPage: FC = () => {
  // Separate featured and regular categories
  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);
  
  return (
    <div className="pt-24 pb-16">
      {/* Page Header */}
      <div className="bg-gray-50 py-10 mb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-gray-600 max-w-3xl">
            Explore our carefully curated collections of tech-inspired products designed 
            for comfort, functionality, and sustainability.
          </p>
        </div>
      </div>
      
      {/* Featured Categories - Larger Cards */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold mb-8">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map(category => (
            <Link 
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block h-[400px] relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
              
              <div className="relative h-full w-full">
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-300 mb-4">{category.description}</p>
                <span className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                  {category.itemCount} Products
                </span>
                <div className="mt-4 inline-block border-b-2 border-teal-500 text-white font-medium">
                  Explore Collection
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Regular Categories - Smaller Cards */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">All Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularCategories.map(category => (
            <Link 
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex items-center bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-300"
            >
              <div className="h-20 w-20 rounded-md overflow-hidden relative flex-shrink-0">
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {category.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {category.itemCount} Products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;