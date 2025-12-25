"use client";

import React, { useState } from 'react';

type PaymentInfo = {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  savePaymentMethod: boolean;
};

type PaymentFormProps = {
  initialData: PaymentInfo;
  onSubmit: (data: PaymentInfo) => void;
  onBack: () => void;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<PaymentInfo>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentInfo, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Format credit card number with spaces
    if (name === 'cardNumber') {
      const digits = value.replace(/\D/g, '').substring(0, 16);
      const groups = [];
      for (let i = 0; i < digits.length; i += 4) {
        groups.push(digits.substring(i, i + 4));
      }
      formattedValue = groups.join(' ');
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const digits = value.replace(/\D/g, '').substring(0, 4);
      if (digits.length > 2) {
        formattedValue = digits.slice(0, 2) + '/' + digits.slice(2);
      } else {
        formattedValue = digits;
      }
    }
    
    // Format CVV to be numeric only
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error when field is changed
    if (errors[name as keyof PaymentInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentInfo, string>> = {};
    
    // Check required fields
    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.cardName) {
      newErrors.cardName = 'Name on card is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = 'Please enter a valid date (MM/YY)';
      } else {
        const numMonth = parseInt(month, 10);
        const numYear = parseInt(year, 10);
        
        if (numMonth < 1 || numMonth > 12) {
          newErrors.expiryDate = 'Please enter a valid month (01-12)';
        } else if (numYear < currentYear || (numYear === currentYear && numMonth < currentMonth)) {
          newErrors.expiryDate = 'Card has expired';
        }
      }
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'Security code is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'Security code must be 3-4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number*
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card*
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.cardName ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date (MM/YY)*
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>
          
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              Security Code (CVV)*
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.cvv ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-start">
          <input
            id="savePaymentMethod"
            name="savePaymentMethod"
            type="checkbox"
            checked={formData.savePaymentMethod}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
          />
          <label htmlFor="savePaymentMethod" className="ml-2 block text-sm text-gray-700">
            Save this payment method for future purchases
          </label>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-6">
        <div className="text-sm text-gray-600">
          <p className="mb-2">🔒 <span className="font-medium">Secure Transaction</span></p>
          <p>Your payment information is encrypted and secure. We do not store your full card details.</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Back to Shipping
        </button>
        
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
        >
          Review Order
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;