"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const pathname = usePathname(); // Get current path
  const router = useRouter();
  const { cartItems, toggleCart } = useCart();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Calculate total items in cart
  const cartItemCount = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  
  // Track scroll position to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#account-menu-container') && isAccountMenuOpen) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  // Function to check if link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Navigation links with their paths
  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsAccountMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className={`w-full transition-all duration-300 ${isScrolled ? 'py-3 bg-white shadow-md' : 'py-5 bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`text-xl font-bold transition-all ${isActive('/') ? 'text-teal-600 scale-105' : 'text-gray-900'}`}>
            GLOSSIFY STORE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                href={link.path} 
                className={`transition-all duration-200 ${
                  isActive(link.path) 
                    ? 'text-teal-600 font-bold scale-105 border-b-2 border-teal-600' 
                    : 'text-gray-800 hover:text-teal-600 font-medium'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-5">
            <button 
              className="text-gray-800 hover:text-teal-600 transition-colors relative group"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">Search</span>
            </button>
            
            {/* Account menu */}
            <div id="account-menu-container" className="relative">
              <button 
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="text-gray-800 hover:text-teal-600 transition-colors relative group"
                aria-label="Account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {user ? 'Account' : 'Sign In'}
                </span>
              </button>
              
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountMenuOpen(false)}>
                        My Account
                      </Link>
                      <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountMenuOpen(false)}>
                        My Orders
                      </Link>
                      <Link href="/account/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountMenuOpen(false)}>
                        Wishlist
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountMenuOpen(false)}>
                        Sign In
                      </Link>
                      <Link href="/auth/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountMenuOpen(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleCart}
              className="text-gray-800 hover:text-teal-600 transition-colors relative group"
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">Cart</span>
            </button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-800 hover:text-teal-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden bg-white">
            <div className="flex flex-col space-y-4 py-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  href={link.path} 
                  className={`transition-all ${
                    isActive(link.path) 
                      ? 'text-teal-600 font-bold pl-2 border-l-4 border-teal-600' 
                      : 'text-gray-800 hover:text-teal-600 font-medium'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Account Menu */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <>
                    <div className="mb-2 pl-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block py-2 text-gray-800 hover:text-teal-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block py-2 text-gray-800 hover:text-teal-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="block py-2 text-gray-800 hover:text-teal-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-800"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block py-2 text-gray-800 hover:text-teal-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block py-2 text-gray-800 hover:text-teal-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;