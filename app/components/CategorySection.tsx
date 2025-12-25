"use client";

import Image from 'next/image';
import Link from 'next/link';

type Category = {
  id: number;
  name: string;
  image: string;
  gradient: string;
  description?: string; // Added description field
};

type CategorySectionProps = {
  title: string;
  categories: Category[];
  techThemed?: boolean; // Added tech theme flag
};

const CategorySection = ({ title, categories, techThemed = false }: CategorySectionProps) => {
  return (
    <section className={`py-20 ${techThemed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center relative">
          {title}
          <span className={`absolute left-1/2 -translate-x-1/2 -bottom-4 w-32 h-1 ${techThemed ? 'bg-indigo-600' : 'bg-teal-600'}`}></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`group relative overflow-hidden rounded-lg ${techThemed ? 'border border-gray-200' : 'shadow-md hover:shadow-xl'} transition-all h-80`}
            >
              <div className={`absolute inset-0 ${techThemed ? 'bg-black/50' : 'bg-black/40'} group-hover:bg-black/30 transition-all z-10 flex items-center justify-center`}>
                <div className="text-center text-white p-4 transform transition-transform group-hover:scale-105">
                  <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
                  {category.description && techThemed && (
                    <p className="text-sm text-gray-200 mb-4 opacity-90">{category.description}</p>
                  )}
                  <Link 
                    href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className={`inline-block mt-2 ${
                      techThemed 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : 'bg-white/10 backdrop-blur-sm border border-white hover:bg-white hover:text-black'
                    } px-6 py-2 rounded-md transition-colors text-sm`}
                  >
                    Explore
                  </Link>
                </div>
              </div>
              
              <div className="h-full w-full">
                {category.image.startsWith('/') ? (
                  <div className="relative h-full w-full">
                    <Image 
                      src={category.image} 
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw" 
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                    />
                  </div>
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${category.gradient}`}></div>
                )}
              </div>
              
              {techThemed && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-black/50 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white font-mono">
                    &lt;{category.name.toLowerCase().replace(/\s+/g, '-')}/&gt;
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;