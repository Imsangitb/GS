"use client";

import Link from 'next/link';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
};

const HeroSection = ({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-r from-gray-50 to-gray-100 py-28">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{backgroundImage: 'url("/patterns/subtle-dots.svg")', backgroundSize: '20px'}}
      ></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <Link 
          href={ctaLink} 
          className="inline-block px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-all transform hover:scale-105 shadow-lg"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;