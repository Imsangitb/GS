"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import PageHeader from '../components/PageHeader';

// Step components
import ShippingForm from '@/app/checkout/components/ShippingForm';
import PaymentForm from '@/app/checkout/components/PaymentForm';
import OrderSummary from '@/app/checkout/components/OrderSummary';
import OrderConfirmation from '@/app/checkout/components/OrderConfirmation';

// Initialize Stripe - replace with your publishable key in a real app
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Define checkout steps
const CHECKOUT_STEPS = {
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  SUMMARY: 'summary',
  CONFIRMATION: 'confirmation',
};

// Define shipping info type
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

// Define payment info type
type PaymentInfo = {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  savePaymentMethod: boolean;
};

// Initial shipping info
const initialShippingInfo: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  saveInfo: false,
};

// Initial payment info
const initialPaymentInfo: PaymentInfo = {
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  savePaymentMethod: false,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  
  // State for checkout process
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.SHIPPING);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(initialShippingInfo);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(initialPaymentInfo);
  const [orderId, setOrderId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && cart.items.length === 0 && currentStep !== CHECKOUT_STEPS.CONFIRMATION) {
      router.push('/cart');
    }
    
    // If user is logged in, pre-fill email
    if (user && user.email && shippingInfo.email === '') {
      setShippingInfo(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [isLoading, cart.items.length, router, user, shippingInfo.email, currentStep]);
  
  // Handle shipping form submission
  const handleShippingSubmit = (data: ShippingInfo) => {
    setShippingInfo(data);
    setCurrentStep(CHECKOUT_STEPS.PAYMENT);
    window.scrollTo(0, 0);
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (data: PaymentInfo) => {
    setPaymentInfo(data);
    setCurrentStep(CHECKOUT_STEPS.SUMMARY);
    window.scrollTo(0, 0);
  };
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // In development mode, we'll use a simulated checkout process
      if (process.env.NODE_ENV === 'development') {
        // Simulate order processing with a timeout
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Generate a random order ID
        const newOrderId = `GS-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(newOrderId);
        
        // Clear the cart
        clearCart();
        
        // Move to confirmation step
        setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
        window.scrollTo(0, 0);
        return;
      }

      // In production, use real payment processing
      
      // 1. Create a checkout session with Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          shippingInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creating checkout session');
      }

      // 2. If user is authenticated, save order information to database
      if (user) {
        const orderData = {
          id: data.id,
          total: cart.subtotal + 9.99 + (cart.subtotal * 0.08),
          items: cart.items,
          shippingAddress: shippingInfo,
          paymentMethod: {
            cardType: paymentInfo.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
            lastFourDigits: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)
          }
        };

        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            orderData
          }),
        });
      }

      // 3. Store order ID for confirmation page
      setOrderId(data.id);
      
      // 4. Clear the cart
      clearCart();
      
      // 5. Redirect to Stripe checkout or success page
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Move to confirmation step if no redirect URL
        setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error('Error processing order:', error);
      setError(error.message || 'There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle step navigation
  const goToStep = (step: string) => {
    if (step === CHECKOUT_STEPS.PAYMENT && !validateShippingInfo(shippingInfo)) {
      return;
    }
    
    if (step === CHECKOUT_STEPS.SUMMARY && !validatePaymentInfo(paymentInfo)) {
      return;
    }
    
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };
  
  // Validate shipping info
  const validateShippingInfo = (info: ShippingInfo) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    return requiredFields.every(field => info[field as keyof ShippingInfo]);
  };
  
  // Validate payment info
  const validatePaymentInfo = (info: PaymentInfo) => {
    const requiredFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
    return requiredFields.every(field => info[field as keyof PaymentInfo]);
  };
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.SHIPPING:
        return (
          <ShippingForm 
            initialData={shippingInfo} 
            onSubmit={handleShippingSubmit} 
          />
        );
      case CHECKOUT_STEPS.PAYMENT:
        return (
          <PaymentForm 
            initialData={paymentInfo} 
            onSubmit={handlePaymentSubmit}
            onBack={() => goToStep(CHECKOUT_STEPS.SHIPPING)}
          />
        );
      case CHECKOUT_STEPS.SUMMARY:
        return (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            <OrderSummary 
              cart={cart} 
              shippingInfo={shippingInfo}
              paymentInfo={paymentInfo}
              onPlaceOrder={handlePlaceOrder}
              onEditShipping={() => goToStep(CHECKOUT_STEPS.SHIPPING)}
              onEditPayment={() => goToStep(CHECKOUT_STEPS.PAYMENT)}
              isProcessing={isProcessing}
            />
          </>
        );
      case CHECKOUT_STEPS.CONFIRMATION:
        return <OrderConfirmation orderId={orderId} />;
      default:
        return <ShippingForm initialData={shippingInfo} onSubmit={handleShippingSubmit} />;
    }
  };
  
  return (
    <>
      {currentStep !== CHECKOUT_STEPS.CONFIRMATION && (
        <PageHeader
          title="Checkout"
          subtitle="Complete your purchase securely"
          gradient={true}
        />
      )}
      
      <div className="bg-gray-50 py-10 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Progress indicator */}
          {currentStep !== CHECKOUT_STEPS.CONFIRMATION && (
            <div className="mb-10">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === CHECKOUT_STEPS.SHIPPING ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>1</div>
                  <span className="text-sm">Shipping</span>
                </div>
                <div className={`h-1 flex-1 mx-4 ${currentStep !== CHECKOUT_STEPS.SHIPPING ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === CHECKOUT_STEPS.PAYMENT ? 'bg-black text-white' : currentStep === CHECKOUT_STEPS.SUMMARY ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>2</div>
                  <span className="text-sm">Payment</span>
                </div>
                <div className={`h-1 flex-1 mx-4 ${currentStep === CHECKOUT_STEPS.SUMMARY ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === CHECKOUT_STEPS.SUMMARY ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>3</div>
                  <span className="text-sm">Review</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {renderStep()}
              </div>
              
              {/* Developer-focused security assurance */}
              {currentStep !== CHECKOUT_STEPS.CONFIRMATION && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start">
                  <div className="text-gray-600 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Developer-Grade Security</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Your information is protected with end-to-end encryption and our codebase follows 
                      OWASP security best practices. We never store complete payment details.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side - Order summary */}
            {currentStep !== CHECKOUT_STEPS.CONFIRMATION && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  
                  {/* Product list */}
                  <div className="max-h-96 overflow-y-auto mb-6">
                    {cart.items.map((item) => (
                      <div key={`${item.product.id}-${item.color || ''}-${item.size || ''}`} className="flex mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                        <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden">
                          <Image 
                            src={item.product.images[0] || '/placeholder.jpg'} 
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium">{item.product.name}</h3>
                            <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totals */}
                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span>$9.99</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax (estimated)</span>
                      <span>${(cart.subtotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>${(cart.subtotal + 9.99 + cart.subtotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Developer discount callout */}
                  <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Developer Community Perks</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 ml-6">
                      Join our newsletter for exclusive access to beta product drops and additional discounts.
                    </p>
                  </div>
                  
                  {/* Return to cart link */}
                  <div className="mt-6">
                    <Link href="/cart" className="text-gray-600 hover:text-black text-sm flex items-center transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Return to cart
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}