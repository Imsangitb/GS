"use client";

import Image from 'next/image';
import Link from 'next/link';

type Category = {
  id: number;
  name: string;
  image: string;
  gradient: string;
};

type CategorySectionProps = {
  title: string;
  categories: Category[];
};

const CategorySection = ({ title, categories }: CategorySectionProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center relative">
          {title}
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-32 h-1 bg-teal-600"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow h-96"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all z-10 flex items-center justify-center">
                <div className="text-center text-white p-4 transform transition-transform group-hover:scale-105">
                  <h3 className="text-3xl font-bold mb-3">{category.name}</h3>
                  <Link 
                    href={`/categories/${category.name.toLowerCase()}`} 
                    className="inline-block mt-6 bg-white/10 backdrop-blur-sm border border-white px-8 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                  >
                    View Collection
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;