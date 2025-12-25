"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Types from the orders page
type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image: string;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod?: {
    cardType: string;
    lastFourDigits: string;
  };
};

// Mock orders data - in a real application this would come from an API
const mockOrders: Record<string, Order> = {
  'GS-123456': {
    id: 'GS-123456',
    date: '2025-04-15T15:30:00Z',
    total: 142.97,
    status: 'processing',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Eco-friendly Coffee Mug',
        price: 24.99,
        quantity: 2,
        color: 'Natural',
        image: '/images/coffee-1.jpg'
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        name: 'Organic Cotton T-shirt',
        price: 29.99,
        quantity: 1,
        color: 'Blue',
        size: 'M',
        image: '/images/tshirt-1.jpg'
      }
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Doe',
      address1: '123 Main Street',
      address2: 'Apt 45',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
      phone: '555-123-4567'
    },
    paymentMethod: {
      cardType: 'Visa',
      lastFourDigits: '4242'
    }
  },
  'GS-789012': {
    id: 'GS-789012',
    date: '2025-04-10T10:15:00Z',
    total: 89.98,
    status: 'shipped',
    trackingNumber: 'UPS-1234567890',
    estimatedDelivery: '2025-04-20',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        name: 'Recycled Paper Notebook',
        price: 14.99,
        quantity: 2,
        color: 'Brown',
        image: '/images/notebook-1.jpg'
      },
      {
        id: 'item-4',
        productId: 'prod-4',
        name: 'Sustainable Wool Scarf',
        price: 59.99,
        quantity: 1,
        color: 'Green',
        image: '/images/scarf-1.jpg'
      }
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Doe',
      address1: '123 Main Street',
      address2: 'Apt 45',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
      phone: '555-123-4567'
    },
    paymentMethod: {
      cardType: 'Mastercard',
      lastFourDigits: '8765'
    }
  },
  'GS-345678': {
    id: 'GS-345678',
    date: '2025-03-28T09:45:00Z',
    total: 119.97,
    status: 'delivered',
    trackingNumber: 'FEDEX-0987654321',
    items: [
      {
        id: 'item-5',
        productId: 'prod-5',
        name: 'LED Desk Lamp',
        price: 39.99,
        quantity: 1,
        color: 'White',
        image: '/images/lamp-1.jpg'
      },
      {
        id: 'item-6',
        productId: 'prod-3',
        name: 'Recycled Paper Notebook',
        price: 14.99,
        quantity: 2,
        color: 'Gray',
        image: '/images/notebook-2.jpg'
      },
      {
        id: 'item-7',
        productId: 'prod-6',
        name: 'Cork Wallet',
        price: 49.99,
        quantity: 1,
        color: 'Natural',
        image: '/images/wallet-1.jpg'
      }
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Doe',
      address1: '123 Main Street',
      address2: 'Apt 45',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
      phone: '555-123-4567'
    },
    paymentMethod: {
      cardType: 'Visa',
      lastFourDigits: '1111'
    }
  }
};

// Tracking timeline steps based on status
const getTrackingSteps = (order: Order) => {
  const steps = [
    { status: 'processing', label: 'Order Placed', date: order.date, completed: true },
    { status: 'processing', label: 'Processing', date: new Date(new Date(order.date).getTime() + 24 * 60 * 60 * 1000).toISOString(), completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'shipped', label: 'Shipped', date: order.status === 'shipped' || order.status === 'delivered' ? new Date(new Date(order.date).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : null, completed: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'Delivered', date: order.status === 'delivered' ? new Date(order.estimatedDelivery || '').toISOString() : null, completed: order.status === 'delivered' }
  ];

  if (order.status === 'cancelled') {
    return [
      { status: 'processing', label: 'Order Placed', date: order.date, completed: true },
      { status: 'cancelled', label: 'Cancelled', date: new Date(new Date(order.date).getTime() + 12 * 60 * 60 * 1000).toISOString(), completed: true }
    ];
  }

  return steps;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (dateString: string | null) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isOrderLoading, setIsOrderLoading] = useState(true);

  const orderId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  useEffect(() => {
    // Check if user is logged in
    if (!isLoading && !user) {
      router.push('/auth/signin?redirect=/account/orders/' + orderId);
      return;
    }

    // In a real application, you would fetch the order from an API
    // For now, we'll use mock data with a timeout to simulate loading
    const timer = setTimeout(() => {
      const foundOrder = mockOrders[orderId];
      setOrder(foundOrder || null);
      setIsOrderLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [orderId, user, isLoading, router]);

  // Get status badge style based on order status
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || isOrderLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <Link href="/account/orders" className="text-teal-600 hover:text-teal-800 flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            
            <div className="h-28 bg-gray-200 rounded mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <Link href="/account/orders" className="text-teal-600 hover:text-teal-800 flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-medium mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the order you're looking for</p>
          <Link href="/account/orders" className="inline-block bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md transition-colors">
            Go Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/account/orders" className="text-teal-600 hover:text-teal-800 flex items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Order header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order tracking */}
        {order.status !== 'cancelled' && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Order Tracking</h2>
            
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute top-5 left-5 ml-2.5 h-full w-0.5 bg-gray-200"></div>
              
              {/* Steps */}
              <div className="space-y-8">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className={`absolute mt-1.5 rounded-full border-4 border-white ${step.completed ? 'bg-teal-500' : 'bg-gray-200'}`} style={{height: '20px', width: '20px'}}></div>
                    <div className="ml-10">
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                      {step.date && (
                        <p className="text-sm text-gray-500">
                          {formatDate(step.date)} at {formatTime(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.trackingNumber && (order.status === 'shipped' || order.status === 'delivered') && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">Tracking Number:</p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="font-medium">{order.trackingNumber}</span>
                  <a 
                    href="#" 
                    className="text-teal-600 hover:text-teal-800 text-sm"
                    onClick={(e) => e.preventDefault()}
                  >
                    Track Package →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order details */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-wrap border-b border-gray-200 pb-4 last:border-0 last:pb-0 gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                    <p>Quantity: {item.quantity}</p>
                    {item.color && <p>Color: {item.color}</p>}
                    {item.size && <p>Size: {item.size}</p>}
                  </div>
                </div>
                
                <div className="w-full sm:w-auto sm:text-right mt-2 sm:mt-0">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">${item.price} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="sm:w-80 ml-auto">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${(order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax:</span>
                <span>${(order.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipping and payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t border-gray-200">
          {order.shippingAddress && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="mt-1">Phone: {order.shippingAddress.phone}</p>}
              </div>
            </div>
          )}
          
          {order.paymentMethod && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
              <div className="text-gray-600">
                <p>{order.paymentMethod.cardType} ending in {order.paymentMethod.lastFourDigits}</p>
              </div>
            </div>
          )}
        </div>

        {/* Need Help */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">If you have any questions about your order, please contact our customer service team.</p>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/contact" 
              className="inline-block bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 py-2 px-4 rounded-md transition-colors text-sm"
            >
              Contact Us
            </Link>
            {(order.status === 'processing' || order.status === 'shipped') && (
              <button 
                className="inline-block bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors text-sm"
                onClick={() => alert('This feature is not implemented yet')}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}