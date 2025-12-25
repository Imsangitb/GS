"use client";

import React from 'react';
import Image from 'next/image';
import { Cart, CartItem } from '../../context/CartContext';

type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveInfo: boolean;
};

type PaymentInfo = {
  cardName: string;
  cardNumber: string;
  expiryDate: string; // Updated from expDate
  cvv: string;
  savePaymentMethod: boolean; // Updated from billingAddressSame
};

type OrderSummaryProps = {
  cart: Cart;
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  onPlaceOrder: () => void;
  onEditShipping: () => void;
  onEditPayment: () => void;
  isProcessing: boolean;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  shippingInfo,
  paymentInfo,
  onPlaceOrder,
  onEditShipping,
  onEditPayment,
  isProcessing
}) => {
  // Calculate totals
  const subtotal = cart.subtotal;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Format card number for display (show only last 4 digits)
  const formatCardNumber = (cardNum: string) => {
    const digits = cardNum.replace(/\s/g, '');
    return `•••• •••• •••• ${digits.slice(-4)}`;
  };

  const handlePlaceOrder = async () => {
    try {
      // Call the order processing function
      await onPlaceOrder();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      {/* Order Items */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium mb-4">Items ({cart.items.length})</h3>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={`${item.product.id}-${item.color || ''}-${item.size || ''}`} className="flex items-center">
              <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden">
                <Image 
                  src={item.product.images[0] || '/placeholder.jpg'} 
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">{item.product.name}</h4>
                  <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Qty: {item.quantity}</span>
                  {item.color && <span className="ml-2">Color: {item.color}</span>}
                  {item.size && <span className="ml-2">Size: {item.size}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shipping Information */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Shipping</h3>
          <button
            onClick={onEditShipping}
            className="text-sm text-teal-600 hover:text-teal-800"
          >
            Edit
          </button>
        </div>
        
        <div className="space-y-2 text-gray-700">
          <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
          <p>{shippingInfo.address} {shippingInfo.apartment && `, ${shippingInfo.apartment}`}</p>
          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
          <p>{shippingInfo.country}</p>
          <p className="mt-2">{shippingInfo.email}</p>
          <p>{shippingInfo.phone}</p>
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Payment</h3>
          <button
            onClick={onEditPayment}
            className="text-sm text-teal-600 hover:text-teal-800"
          >
            Edit
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="mr-3">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{paymentInfo.cardName}</p>
              <p className="text-gray-600">{formatCardNumber(paymentInfo.cardNumber)}</p>
              <p className="text-gray-600">Expires: {paymentInfo.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium mb-4">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Place Order Button */}
      <div>
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className={`w-full py-3 rounded-md text-white font-medium 
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} 
            transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Order...
            </span>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;