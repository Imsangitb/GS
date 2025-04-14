"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FloatingBackButtonProps {
  href: string;
}

const FloatingBackButton = ({ href }: FloatingBackButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link 
        href={href} 
        className="tech-float-btn flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 shadow-lg hover:bg-gray-800 transition-all transform hover:scale-110 group"
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="circuit-pattern-small w-full h-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-teal-400" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  );
};

export default FloatingBackButton;