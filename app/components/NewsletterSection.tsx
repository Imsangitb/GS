"use client"

import { FormEvent, useState } from 'react';

type NewsletterSectionProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  placeholderText?: string;
  promoText?: string;
};

const NewsletterSection = ({
  title = "Stay Updated",
  subtitle = "Subscribe to our newsletter for new product announcements, style guides, and exclusive offers.",
  buttonText = "Subscribe",
  placeholderText = "Enter your email",
  promoText = "Get 10% off your first order when you subscribe!"
}: NewsletterSectionProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gray-900 text-white relative">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{backgroundImage: 'url("/patterns/subtle-dots.svg")', backgroundSize: '20px'}}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{title}</h2>
          <p className="text-gray-300 mb-10 text-lg">
            {subtitle}
          </p>
          
          {!success ? (
            <>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholderText} 
                  className="flex-1 px-5 py-4 rounded-md focus:outline-none text-gray-800 border-2 border-transparent focus:border-teal-400 transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  className={`px-8 py-4 bg-teal-600 hover:bg-teal-700 rounded-md font-medium transition-colors ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : buttonText}
                </button>
              </form>
              
              {error && (
                <p className="text-red-400 mt-4">{error}</p>
              )}
            </>
          ) : (
            <div className="bg-teal-700 p-6 rounded-md">
              <p className="text-white text-lg">Thank you for subscribing! Check your email for confirmation.</p>
            </div>
          )}
          
          <p className="text-gray-400 text-sm mt-6">
            {promoText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;