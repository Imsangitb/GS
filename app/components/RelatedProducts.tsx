"use client";

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedProductsProps {
  products: any[];
}

const RelatedProducts: FC<RelatedProductsProps> = ({ products }) => {
  // Function to determine the color based on sustainability score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-teal-100 text-teal-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Link 
          href={`/shop/products/${product.id}`} 
          key={product.id}
          className="group block"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition border border-gray-100 h-full flex flex-col">
            <div className="relative h-60 overflow-hidden bg-gray-100">
              {/* Product image */}
              <Image
                src={product.image || (product.images && product.images[0]) || '/placeholder.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Sale badge */}
              {product.isSale && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  SALE
                </div>
              )}

              {/* Sustainability badge */}
              {product.sustainabilityScore && (
                <div className={`absolute top-3 right-3 ${getScoreColor(product.sustainabilityScore)} px-2 py-1 text-xs font-medium rounded-full flex items-center`}>
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {product.sustainabilityScore}%
                </div>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-medium mb-2 group-hover:text-teal-600 transition-colors">
                {product.name}
              </h3>
              
              {/* Display first certification if available */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {product.certifications[0]}
                  </span>
                  {product.certifications.length > 1 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{product.certifications.length - 1}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center mt-auto">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.isSale && product.originalPrice && (
                  <span className="ml-2 text-sm line-through text-gray-500">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button className="mt-3 w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedProducts;