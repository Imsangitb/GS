"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
};

const HeroSection = ({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) => {
  const [animatedText, setAnimatedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const techTerms = ['Developers', 'Engineers', 'Coders', 'Tech Enthusiasts'];
  
  // Text typing animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (textIndex < techTerms.length) {
        const term = techTerms[textIndex];
        let charIndex = 0;
        
        const typeInterval = setInterval(() => {
          if (charIndex <= term.length) {
            setAnimatedText(term.substring(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            
            // Pause before erasing
            setTimeout(() => {
              let eraseIndex = term.length;
              
              const eraseInterval = setInterval(() => {
                if (eraseIndex >= 0) {
                  setAnimatedText(term.substring(0, eraseIndex));
                  eraseIndex--;
                } else {
                  clearInterval(eraseInterval);
                  setTextIndex((prevIndex) => (prevIndex + 1) % techTerms.length);
                }
              }, 50);
            }, 1500);
          }
        }, 100);
      }
    }, 3500);
    
    return () => clearInterval(interval);
  }, [textIndex]);

  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-slate-800 text-white py-28">
      {/* Tech-inspired pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{backgroundImage: 'url("/patterns/circuit-board.svg")', backgroundSize: '500px'}}
      ></div>
      
      {/* Animated accent elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-teal-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block px-4 py-1 bg-teal-600/20 rounded-full text-teal-400 font-mono mb-6">
          &lt;code&gt; Fashion Redefined &lt;/code&gt;
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white">
          {title}
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-teal-400 min-h-[2.5rem]">
          For {animatedText}<span className="animate-pulse">|</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          {subtitle}
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Link 
            href={ctaLink} 
            className="inline-block px-10 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-md transition-all transform hover:scale-105 shadow-lg"
          >
            {ctaText}
          </Link>
          
          <Link 
            href="/categories" 
            className="inline-block px-10 py-4 bg-transparent border border-teal-500 text-teal-400 hover:bg-teal-900/30 font-semibold rounded-md transition-all"
          >
            Explore Categories
          </Link>
        </div>
        
        {/* Tech features highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="text-teal-400 mb-2 text-lg font-mono">01</div>
            <div className="font-semibold">Tech-integrated Design</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="text-teal-400 mb-2 text-lg font-mono">02</div>
            <div className="font-semibold">Developer Comfort</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="text-teal-400 mb-2 text-lg font-mono">03</div>
            <div className="font-semibold">Sustainable Materials</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;