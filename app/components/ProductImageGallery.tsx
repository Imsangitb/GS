"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] bg-white rounded-lg overflow-hidden mb-4 border border-gray-100">
        <Image
          src={images[selectedImage]}
          alt={`${productName} - View ${selectedImage + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      </div>
      
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 bg-white border rounded-md overflow-hidden transition-all ${
                selectedImage === index 
                  ? 'border-teal-500 ring-2 ring-teal-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;