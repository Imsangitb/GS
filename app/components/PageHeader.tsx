"use client";

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  gradient?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  centered = true,
  gradient = false 
}) => {
  return (
    <div className={`py-16 ${gradient ? 'bg-gradient-to-r from-gray-50 to-gray-100' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className={`${centered ? 'text-center' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;