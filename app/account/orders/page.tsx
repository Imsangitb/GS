"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/app/components/PageHeader';
import FloatingBackButton from '@/app/components/FloatingBackButton';

// Mock order data structure
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
};

// In a real app, this would come from an API call
const mockOrders: Order[] = [
  {
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
    ]
  },
  {
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
    ]
  },
  {
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
    ]
  }
];

const OrdersPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoading && !user) {
      router.push('/auth/signin?redirect=/account/orders');
      return;
    }

    // In a real application, you would fetch orders from an API
    // For now, we'll use mock data with a timeout to simulate loading
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsOrdersLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user, isLoading, router]);

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

  if (isLoading || isOrdersLoading) {
    return (
      <>
        <PageHeader
          title="Your Orders"
          subtitle="Track and manage your purchases"
          gradient={true}
        />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-5">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Your Orders"
        subtitle="Track and manage your purchases"
        gradient={true}
      />
      <FloatingBackButton href="/account" label="Back to Account" />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4" />
              </svg>
              <h2 className="text-xl font-medium mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">When you place an order, it will appear here</p>
              <Link href="/shop" className="inline-block bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {/* Developer stats banner */}
            <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Your Developer Stats</h2>
                  <p className="text-gray-300 text-sm">Based on your purchase history</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center">
                  <div className="mr-6">
                    <p className="text-gray-300 text-xs mb-1">Total Orders</p>
                    <p className="text-xl font-bold">{orders.length}</p>
                  </div>
                  <div className="mr-6">
                    <p className="text-gray-300 text-xs mb-1">Points Earned</p>
                    <p className="text-xl font-bold">150</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs mb-1">Status</p>
                    <p className="text-xl font-bold">Explorer</p>
                  </div>
                </div>
              </div>
            </div>
            
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                      <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-4 rounded-md transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 -mx-6 px-6 my-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">+{order.items.length - 3} more</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">
                      Total: <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                    </p>
                    {order.trackingNumber && (
                      <p className="text-gray-600 text-sm mt-1">
                        Tracking: <span className="font-medium text-black">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  
                  {order.status === 'shipped' && (
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-sm text-gray-600">Estimated delivery by:</p>
                      <p className="font-medium">
                        {new Date(order.estimatedDelivery || '').toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
                
                {order.status === 'delivered' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-sm font-medium text-black hover:text-gray-700 transition-colors flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Write a Review
                    </button>
                  </div>
                )}
                
                {order.status === 'processing' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600 text-sm">
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Your order is being prepared for shipping.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Developer resources */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Developer Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="#" className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
              <h3 className="font-medium mb-1">Product Documentation</h3>
              <p className="text-sm text-gray-600">Access technical specs and guides for your purchased products.</p>
            </Link>
            <Link href="#" className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
              <h3 className="font-medium mb-1">Submit Product Feedback</h3>
              <p className="text-sm text-gray-600">Help us improve our products with your technical insights.</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;