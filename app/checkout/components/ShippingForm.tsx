"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '../../context/AuthContext';

// New address validation service mock (would be replaced with actual API)
interface AddressValidationResult {
  valid: boolean;
  suggestedAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Would be replaced with actual API call
const validateAddress = async (address: string, city: string, state: string, zipCode: string, country: string): Promise<AddressValidationResult> => {
  // This is a mock function - in production, you'd call a real address validation API
  // like Google Places API, Shippo Address Validation, or EasyPost
  return new Promise(resolve => {
    setTimeout(() => {
      // Updated for Indian PIN code validation (6 digits)
      if (zipCode.length === 6 && /^\d{6}$/.test(zipCode)) {
        resolve({ valid: true });
      } else {
        resolve({
          valid: false,
          suggestedAddress: {
            address: address,
            city: city,
            state: state,
            // Ensure PIN code is 6 digits for India
            zipCode: zipCode.length < 6 ? zipCode.padEnd(6, '0') : zipCode.substring(0, 6),
            country: 'India'
          }
        });
      }
    }, 500);
  });
};

interface SavedAddress {
  id: string;
  user_id: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  is_default: boolean;
}

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

type ShippingFormProps = {
  initialData: ShippingInfo;
  onSubmit: (data: ShippingInfo) => void;
};

// List of Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const ShippingForm: React.FC<ShippingFormProps> = ({ initialData, onSubmit }) => {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState<ShippingInfo>({...initialData, country: 'India'});
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [addressSuggestion, setAddressSuggestion] = useState<AddressValidationResult["suggestedAddress"] | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string | null>(null);

  // Fetch user's saved addresses
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!user) return;

      setIsLoadingAddresses(true);
      
      try {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });
          
        if (error) {
          console.error('Error fetching saved addresses:', error);
          return;
        }
        
        // Transform the data to handle zipcode -> zipCode column name difference
        const transformedData = data ? data.map(address => ({
          ...address,
          // Map zipcode (from database) to zipCode (for component)
          zipCode: address.zipcode || '',
        })) : [];
        
        setSavedAddresses(transformedData);
        console.log('Fetched addresses:', transformedData);
      } catch (err) {
        console.error('Failed to fetch saved addresses:', err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchSavedAddresses();
  }, [user, supabase]);

  // New function to handle address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedSavedAddress(addressId);
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    
    if (selectedAddress) {
      setFormData(prev => ({
        ...prev,
        address: selectedAddress.address,
        apartment: selectedAddress.apartment || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: 'India'
      }));
    }
  };

  // New function to save address to database with advanced debugging
  const saveAddress = async () => {
    if (!user) {
      console.log('No user found, cannot save address');
      return;
    }

    try {
      // Create the address object with careful attention to column names
      const addressData = {
        user_id: user.id,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment || null, // Handle undefined values
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipCode, // Note: database column is 'zipcode' (lowercase)
        country: formData.country || 'India',
        is_default: savedAddresses.length === 0
      };

      console.log('DEBUGGING - Address data:', JSON.stringify(addressData, null, 2));
      console.log('DEBUGGING - User ID:', user.id);
      console.log('DEBUGGING - Supabase client initialized:', !!supabase);
      
      // First attempt with detailed error capture
      try {
        const result = await supabase
          .from('user_addresses')
          .insert([addressData]);
        
        // Inspect the full result object for debugging
        console.log('DEBUGGING - Full insert result:', JSON.stringify(result, null, 2));
        
        if (result.error) {
          console.error('DEBUGGING - Error details:', {
            message: result.error.message,
            details: result.error.details,
            hint: result.error.hint,
            code: result.error.code
          });
          
          throw result.error;
        }
        
        console.log('Address inserted successfully, fetching saved addresses');
        
        // Then fetch all addresses to update the UI
        const { data: updatedAddresses, error: fetchError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });
          
        if (fetchError) {
          console.error('Error fetching updated addresses:', fetchError);
          alert('Address saved but could not refresh the address list');
          return;
        }
        
        if (updatedAddresses) {
          // Transform the data to ensure zipCode is properly mapped
          const transformedData = updatedAddresses.map(address => ({
            ...address,
            zipCode: address.zipcode || '',
          }));
          
          console.log('Setting updated addresses:', transformedData);
          setSavedAddresses(transformedData);
          alert('Address saved successfully!');
        } else {
          console.warn('No addresses found after saving');
        }
      } catch (error) {
        const insertError = error as any;
        console.error('DEBUGGING - Insert operation error:', insertError);
        
        // Check for RLS policy violations
        if (insertError.message && insertError.message.includes('policy')) {
          console.error('DEBUGGING - Possible RLS policy violation');
          alert(`Permission error: ${insertError.message}`);
        } else {
          alert(`Error inserting address: ${insertError.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('DEBUGGING - Unexpected error in saveAddress:', err);
      
      // Detailed logging of error object
      console.error('DEBUGGING - Error type:', Object.prototype.toString.call(err));
      console.error('DEBUGGING - Error properties:', Object.getOwnPropertyNames(err));
      
      if (err instanceof Error) {
        console.error('DEBUGGING - Error message:', err.message);
        console.error('DEBUGGING - Error stack:', err.stack);
        alert(`Failed to save address: ${err.message}`);
      } else {
        console.error('DEBUGGING - Unknown error type:', typeof err, err);
        alert('Failed to save address due to an unknown error');
      }
    }
  };

  // New function to handle address validation
  const validateShippingAddress = async (): Promise<boolean> => {
    setIsValidatingAddress(true);
    try {
      const result = await validateAddress(
        formData.address,
        formData.city,
        formData.state,
        formData.zipCode,
        'India' // Always India
      );
      
      if (!result.valid && result.suggestedAddress) {
        setAddressSuggestion(result.suggestedAddress);
        return false;
      }
      
      setAddressSuggestion(null);
      return true;
    } catch (error) {
      console.error('Address validation error:', error);
      return true; // Proceed anyway if the validation service fails
    } finally {
      setIsValidatingAddress(false);
    }
  };

  // Use the suggested address
  const acceptSuggestedAddress = () => {
    if (addressSuggestion) {
      setFormData(prev => ({
        ...prev,
        ...addressSuggestion
      }));
      setAddressSuggestion(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is changed
    if (errors[name as keyof ShippingInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};
    const requiredFields: (keyof ShippingInfo)[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone for Indian number (10 digits)
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    // Validate PIN code (6 digits for India)
    if (formData.zipCode && !/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit PIN code';
    }

    // Update errors state
    setErrors(newErrors);
    
    // Form is valid if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    const isValid = validate();
    if (!isValid) return;
    
    // Validate shipping address
    const isAddressValid = await validateShippingAddress();
    if (!isAddressValid) return;
    
    // Save the address if requested
    if (formData.saveInfo && user) {
      await saveAddress();
    }
    
    // Submit the form
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Saved addresses section */}
      {user && savedAddresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Saved Addresses</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {savedAddresses.map((address) => (
              <div 
                key={address.id}
                className={`border p-4 rounded-md cursor-pointer ${
                  selectedSavedAddress === address.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAddressSelect(address.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="savedAddress" 
                      checked={selectedSavedAddress === address.id} 
                      onChange={() => handleAddressSelect(address.id)} 
                      className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="ml-2 font-medium">
                      {address.is_default ? 'Default Address' : 'Saved Address'}
                    </span>
                  </div>
                </div>
                <div className="ml-6">
                  <p className="text-sm text-gray-700">{address.address}</p>
                  {address.apartment && <p className="text-sm text-gray-700">{address.apartment}</p>}
                  <p className="text-sm text-gray-700">{address.city}, {address.state} {address.zipCode}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button 
              type="button"
              onClick={() => setSelectedSavedAddress(null)}
              className="text-sm text-teal-600 hover:text-teal-800"
            >
              Use a new address
            </button>
          </div>
        </div>
      )}

      {/* Address suggestion alert */}
      {addressSuggestion && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Address Suggestion</h3>
              <p className="text-sm text-yellow-700 mt-1">
                We found a suggested correction for your address. Would you like to use it?
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={acceptSuggestedAddress}
                  className="text-sm font-medium text-yellow-800 hover:text-yellow-900 focus:outline-none"
                >
                  Use suggested address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only show the form fields if no saved address is selected or user chooses a new address */}
      {(selectedSavedAddress === null || !user || savedAddresses.length === 0) && (
        <>
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
          
          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone* (10 digit)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="9876543210"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
          
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.city ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State*
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.state ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
            
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code* (6 digit)
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.zipCode ? 'border-red-300' : 'border-gray-300'}`}
                maxLength={6}
                placeholder="110001"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
          </div>
          
          {/* Country - Fixed to India */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country*
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value="India"
              disabled
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
            />
          </div>
          
          {/* Save information checkbox */}
          {user && (
            <div className="flex items-start">
              <input
                id="saveInfo"
                name="saveInfo"
                type="checkbox"
                checked={formData.saveInfo}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
              />
              <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
                Save this address for future orders
              </label>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 px-6 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;