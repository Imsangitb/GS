const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper function to create directories recursively
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Helper function to write files
function writeFile(filePath, content) {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`Created file: ${filePath}`);
}

// Creating the base project structure
console.log("Setting up Glossify Store...");

// Header Component
writeFile('components/layout/Header.tsx', `
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white p-4 sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          GlossifyStore
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/shop" className="hover:text-gray-300 transition-colors">
            Shop
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link href="/sustainability" className="hover:text-gray-300 transition-colors">
            Sustainability
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/search" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <Link href="/account" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link href="/cart" className="hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black text-white px-4 py-2">
          <nav className="flex flex-col space-y-3">
            <Link href="/shop" className="block py-1">
              Shop
            </Link>
            <Link href="/about" className="block py-1">
              About
            </Link>
            <Link href="/sustainability" className="block py-1">
              Sustainability
            </Link>
            <div className="pt-2 flex space-x-4 border-t border-gray-700">
              <Link href="/search" className="block p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/account" className="block p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/cart" className="block p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
`);

// Footer Component
writeFile('components/layout/Footer.tsx', `
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">GlossifyStore</h3>
            <p className="mb-4 text-gray-300">
              Tech-inspired fashion for modern developers and engineers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/shop/hoodies" className="text-gray-300 hover:text-white">Hoodies</Link></li>
              <li><Link href="/shop/t-shirts" className="text-gray-300 hover:text-white">T-Shirts</Link></li>
              <li><Link href="/shop/accessories" className="text-gray-300 hover:text-white">Accessories</Link></li>
              <li><Link href="/shop/new-arrivals" className="text-gray-300 hover:text-white">New Arrivals</Link></li>
            </ul>
          </div>
          
          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-gray-300 hover:text-white">Sustainability</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-white">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white">Returns</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 GlossifyStore. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/cookie" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
`);

// Layout file
writeFile('app/layout.tsx', `
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Glossify Store - Tech-Inspired Fashion for Developers',
  description: 'Sustainable, functional clothing and accessories for modern engineers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
`);

// Homepage
writeFile('app/page.tsx', `
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Sample featured products
  const featuredProducts = [
    {
      id: '1',
      name: 'Developer Hoodie',
      price: 59.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Developer+Hoodie',
      sustainabilityScore: 9,
    },
    {
      id: '2',
      name: 'Git Command T-Shirt',
      price: 29.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Git+T-Shirt',
      sustainabilityScore: 8,
    },
    {
      id: '3',
      name: 'Code Editor Beanie',
      price: 24.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Code+Beanie',
      sustainabilityScore: 7,
    },
    {
      id: '4',
      name: 'Mechanical Keyboard Backpack',
      price: 79.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Keyboard+Backpack',
      sustainabilityScore: 9,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Tech-Inspired Fashion for Developers</h1>
            <p className="text-xl mb-8 text-gray-300">Sustainable, functional clothing designed for the modern engineer's lifestyle.</p>
            <Link 
              href="/shop" 
              className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition"
            >
              Shop Collection
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <Image 
                src="https://placehold.co/800x1000/333/white?text=Hero+Product" 
                alt="Developer wearing a tech-inspired hoodie" 
                width={800} 
                height={1000} 
                className="rounded-lg"
              />
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 p-3 rounded-lg">
                <p className="text-sm">Featuring</p>
                <p className="font-semibold">Code Pocket™ Hoodie</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-gray-600 mb-8">Designed by developers, for developers</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={\`/product/\${product.id}\`} className="block">
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      width={600} 
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Eco Score: {product.sustainabilityScore}/10
                    </div>
                  </div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-700">\${product.price.toFixed(2)}</p>
                </Link>
                <button 
                  className="mt-2 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/shop" 
              className="inline-block border border-black px-8 py-3 rounded-md font-medium hover:bg-black hover:text-white transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Sustainability Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold mb-6">Our Commitment to Sustainability</h2>
              <p className="text-xl mb-4">We create products that are as good for the planet as they are for your workflow.</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% recycled materials in all packaging</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Organic cotton and sustainable fabrics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Carbon-neutral shipping worldwide</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>1% of profits donated to open-source projects</span>
                </li>
              </ul>
              <Link 
                href="/sustainability" 
                className="inline-block mt-6 underline text-black font-medium"
              >
                Learn more about our sustainability efforts
              </Link>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="https://placehold.co/800x600/333/white?text=Sustainability" 
                alt="Sustainability illustration" 
                width={800} 
                height={600} 
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* GitHub Integration */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Connect with GitHub</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Link your GitHub account to unlock exclusive developer perks and features based on your contributions to open-source.</p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-black transition flex items-center mx-auto">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
            </svg>
            Connect with GitHub
          </button>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-green-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Exclusive Discounts</h3>
              <p className="text-gray-600">Earn discounts based on your open source contributions and repository stars.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-blue-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Developer Community</h3>
              <p className="text-gray-600">Join a community of like-minded developers who share your passion for quality and design.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-purple-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a4 4 0 00-4-4H8a4 4 0 00-4 4v7h8m4 0v-7a4 4 0 014-4h0a4 4 0 014 4v7h-8m4 0H8" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Limited Edition Products</h3>
              <p className="text-gray-600">Access to limited edition releases available only to active GitHub contributors.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`);

// Basic shop page
writeFile('app/shop/page.tsx', `
import Link from 'next/link';
import Image from 'next/image';

export default function ShopPage() {
  // Sample products data
  const products = [
    {
      id: '1',
      name: 'Developer Hoodie',
      price: 59.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Developer+Hoodie',
      sustainabilityScore: 9,
      category: 'hoodies',
    },
    {
      id: '2',
      name: 'Git Command T-Shirt',
      price: 29.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Git+T-Shirt',
      sustainabilityScore: 8,
      category: 't-shirts',
    },
    {
      id: '3',
      name: 'Code Editor Beanie',
      price: 24.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Code+Beanie',
      sustainabilityScore: 7,
      category: 'accessories',
    },
    {
      id: '4',
      name: 'Mechanical Keyboard Backpack',
      price: 79.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Keyboard+Backpack',
      sustainabilityScore: 9,
      category: 'accessories',
    },
    {
      id: '5',
      name: 'Function Loop Scarf',
      price: 34.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Loop+Scarf',
      sustainabilityScore: 8,
      category: 'accessories',
    },
    {
      id: '6',
      name: 'Debug Mode Joggers',
      price: 49.99,
      imageUrl: 'https://placehold.co/600x800/333/white?text=Debug+Joggers',
      sustainabilityScore: 9,
      category: 'bottoms',
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'hoodies', name: 'Hoodies & Sweatshirts' },
    { id: 't-shirts', name: 'T-Shirts' },
    { id: 'bottoms', name: 'Pants & Shorts' },
    { id: 'accessories', name: 'Accessories' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
      
      <div className="flex flex-col lg:flex-row">
        {/* Filter Sidebar */}
        <aside className="lg:w-1/4 pr-0 lg:pr-8 mb-8 lg:mb-0">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <button className="text-left w-full py-2 px-3 rounded-md hover:bg-gray-200 transition">
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-gray-200 my-6 pt-6">
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Min" 
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                  <span>to</span>
                  <input 
                    type="text" 
                    placeholder="Max" 
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Sustainability Score</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-black mr-2" />
                    <span>7+ Eco Score</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-black mr-2" />
                    <span>8+ Eco Score</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-black mr-2" />
                    <span>9+ Eco Score</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <div className="lg:w-3/4">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{products.length} products</p>
            <div className="flex items-center">
              <span className="mr-2">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>
          
          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="group">
                <Link href={\`/product/\${product.id}\`} className="block">
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      width={600} 
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Eco Score: {product.sustainabilityScore}/10
                    </div>
                  </div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-700">\${product.price.toFixed(2)}</p>
                </Link>
                <button 
                  className="mt-2 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`);

console.log('Setup completed successfully!');
console.log('Run "npm run dev" to start the development server.');