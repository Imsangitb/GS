"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of a cart item
export type CartItem = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    isSale?: boolean;
    originalPrice?: number;
    discountPercentage?: number;
    colors?: string[];
    sizes?: string[];
  };
  quantity: number;
  color?: string;
  size?: string;
};

// Define the cart shape
export type Cart = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
};

// Define the context shape
type CartContextType = {
  cart: Cart;
  cartItems: CartItem[]; // For backward compatibility
  addToCart: (product: any, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
};

// Create initial cart state
const initialCartState: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0
};

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cart: initialCartState,
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  toggleCart: () => {},
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCartState);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Initialize cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Handle both old and new cart format
        if (Array.isArray(parsedCart)) {
          // Old format - convert to new format
          const items = parsedCart.map(item => ({
            id: item.id,
            product: {
              id: item.id,
              name: item.name,
              price: item.price,
              images: [item.image || '/placeholder.jpg'],
            },
            quantity: item.quantity,
          }));
          
          setCart({
            items,
            totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          });
        } else {
          // New format
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    
    // Listen for cart toggle events
    const handleToggleCart = () => toggleCart();
    document.addEventListener('toggleCart', handleToggleCart);
    
    return () => {
      document.removeEventListener('toggleCart', handleToggleCart);
    };
  }, []);
  
  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Calculate total items and subtotal
  const calculateCartTotals = (items: CartItem[]): { totalItems: number; subtotal: number } => {
    let totalItems = 0;
    let subtotal = 0;
    
    items.forEach(item => {
      totalItems += item.quantity;
      
      // Handle sale prices if applicable
      let itemPrice = item.product.price;
      if (item.product.isSale && item.product.discountPercentage) {
        itemPrice = itemPrice * (1 - item.product.discountPercentage / 100);
      }
      
      subtotal += itemPrice * item.quantity;
    });
    
    return { totalItems, subtotal };
  };
  
  const addToCart = (product: any, quantity = 1, color?: string, size?: string) => {
    setCart(prevCart => {
      // Create product object with consistent structure
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || [product.image || '/placeholder.jpg'],
        isSale: product.isSale || false,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage,
        colors: product.colors,
        sizes: product.sizes
      };
      
      // Generate a unique ID for this item combination (product + variants)
      const itemId = `${product.id}${color ? `-${color}` : ''}${size ? `-${size}` : ''}`;
      
      // Check if the same product with the same variants already exists
      const existingItemIndex = prevCart.items.findIndex(item => 
        item.product.id === product.id && 
        item.color === (color || product.selectedColor) && 
        item.size === (size || product.selectedSize)
      );
      
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems = [
          ...prevCart.items, 
          {
            id: parseInt(itemId) || product.id,
            product: productData,
            quantity,
            color: color || product.selectedColor,
            size: size || product.selectedSize
          }
        ];
      }
      
      const { totalItems, subtotal } = calculateCartTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        subtotal
      };
    });
    
    // Open cart drawer when adding items
    setIsCartOpen(true);
  };
  
  const removeFromCart = (id: number | string) => {
    setCart(prevCart => {
      // Handle both string and number IDs
      const idToRemove = typeof id === 'string' ? parseInt(id) : id;
      const newItems = prevCart.items.filter(item => 
        item.id !== idToRemove && item.product.id !== idToRemove
      );
      
      const { totalItems, subtotal } = calculateCartTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        subtotal
      };
    });
  };
  
  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => {
      // Handle both string and number IDs
      const idToUpdate = typeof id === 'string' ? parseInt(id) : id;
      
      // Try to find by item id first, then by product id
      const itemIndex = prevCart.items.findIndex(item => item.id === idToUpdate);
      const productIndex = itemIndex >= 0 ? itemIndex : prevCart.items.findIndex(item => item.product.id === idToUpdate);
      
      if (productIndex < 0) return prevCart;
      
      const newItems = [...prevCart.items];
      newItems[productIndex] = {
        ...newItems[productIndex],
        quantity
      };
      
      const { totalItems, subtotal } = calculateCartTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        subtotal
      };
    });
  };
  
  const clearCart = () => {
    setCart(initialCartState);
  };
  
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      cartItems: cart.items, // For backward compatibility
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};