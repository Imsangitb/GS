"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorItem {
  name: string;
  value: string;
  code: string;
}

interface SizeItem {
  name: string;
  code: string;
  inStock: boolean;
}

interface ProductActionsProps {
  product: any;
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
}

const ProductActions = ({ 
  product, 
  selectedColor, 
  selectedSize, 
  quantity,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onAddToCart
}: ProductActionsProps) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const colors: ColorItem[] = product.colors ? product.colors.map((color: string) => ({
    name: color,
    value: color.toLowerCase(),
    code: color
  })) : [];
  
  const sizes: SizeItem[] = product.sizes ? product.sizes.map((size: string) => ({
    name: size,
    code: size,
    inStock: true
  })) : [];

  // Find the selected color object
  const selectedColorObj = colors.find((color: ColorItem) => color.code === selectedColor);

  const handleAddToCart = () => {
    onAddToCart();
    
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const incrementQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            {selectedColorObj && (
              <span className="text-sm text-gray-500">{selectedColorObj.name}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color: ColorItem) => (
              <button
                key={color.code}
                onClick={() => onColorChange(color.code)}
                className={`relative rounded-full w-9 h-9 border transition-all duration-200 ${
                  selectedColor === color.code
                    ? 'ring-2 ring-teal-500 ring-offset-2 scale-110'
                    : 'ring-1 ring-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Select color: ${color.name}`}
              >
                <span className="sr-only">{color.name}</span>
                {selectedColor === color.code && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-white drop-shadow-md" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <button
              type="button"
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Size guide
            </button>
          </div>
          
          <AnimatePresence>
            {showSizeGuide && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 bg-gray-50 rounded-md p-4 overflow-hidden"
              >
                <h4 className="text-sm font-medium mb-2">Size Guide</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-3 py-2 text-left">Size</th>
                        <th className="px-3 py-2 text-left">Dimensions</th>
                        <th className="px-3 py-2 text-left">Fits Laptop</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-3 py-2">Small</td>
                        <td className="px-3 py-2">35 x 25 cm</td>
                        <td className="px-3 py-2">Standard</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-3 py-2">Medium</td>
                        <td className="px-3 py-2">37 x 26 cm</td>
                        <td className="px-3 py-2">Medium</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-3 py-2">Large</td>
                        <td className="px-3 py-2">39 x 28 cm</td>
                        <td className="px-3 py-2">Large</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">X-Large</td>
                        <td className="px-3 py-2">41 x 30 cm</td>
                        <td className="px-3 py-2">Extra Large</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((size: SizeItem) => (
              <button
                key={size.code}
                type="button"
                className={`relative py-2 px-3 text-sm font-medium rounded-md border transition-all duration-200 ${
                  !size.inStock
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                    : selectedSize === size.code
                    ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                    : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (size.inStock) {
                    onSizeChange(size.code);
                  }
                }}
                disabled={!size.inStock}
              >
                {size.name}
                {!size.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-t border-gray-300 absolute w-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Stock Status */}
          <div className="mt-2 flex items-center text-sm">
            <svg className="h-4 w-4 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700">In stock and ready to ship</span>
          </div>
        </div>
      )}
      
      {/* Quantity Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center border border-gray-300 rounded-md w-32 shadow-sm">
          <button
            type="button"
            className="flex-1 flex items-center justify-center h-9 text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <span className="sr-only">Decrease</span>
          </button>
          <span className="w-12 h-9 flex items-center justify-center text-gray-900 font-medium border-x border-gray-300">
            {quantity}
          </span>
          <button
            type="button"
            className="flex-1 flex items-center justify-center h-9 text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={incrementQuantity}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
            </svg>
            <span className="sr-only">Increase</span>
          </button>
        </div>
      </div>
      
      {/* Shipping & Availability */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span className="text-sm font-medium">Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Order now for delivery by {getDeliveryDate()}</span>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Add to Cart
        </button>
      </div>
      
      {/* Success Message */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Added to your cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to calculate delivery date (3 business days from now)
function getDeliveryDate() {
  const date = new Date();
  let businessDays = 3;
  
  while (businessDays > 0) {
    date.setDate(date.getDate() + 1);
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      businessDays -= 1;
    }
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default ProductActions;