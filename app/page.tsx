import { FC } from 'react';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import NewsletterSection from './components/NewsletterSection';

// Sample data
const categories = [
  { 
    id: 1, 
    name: "Accessories", 
    image: "/categories/accessories.jpg",
    gradient: "from-blue-100 to-blue-300"
  },
  { 
    id: 2, 
    name: "Clothing", 
    image: "/categories/clothing.jpg",
    gradient: "from-red-100 to-red-300"
  },
  { 
    id: 3, 
    name: "Home", 
    image: "/categories/home.jpg",
    gradient: "from-green-100 to-green-300"
  },
];

const featuredProducts = [
  { 
    id: 1, 
    name: "Premium Watch", 
    price: 129.99, 
    image: "/products/watch.jpg",
    isSale: true,
    originalPrice: 159.99 
  },
  { 
    id: 2, 
    name: "Leather Wallet", 
    price: 49.99, 
    image: "/products/wallet.jpg" 
  },
  { 
    id: 3, 
    name: "Minimalist Backpack", 
    price: 89.99, 
    image: "/products/backpack.jpg" 
  },
  { 
    id: 4, 
    name: "Scented Candle", 
    price: 29.99, 
    image: "/products/candle.jpg",
    isSale: true,
    originalPrice: 39.99 
  },
];

const HomePage: FC = () => {
  return (
    <>
      <HeroSection 
        title="Welcome to GLOSSIFY STORE"
        subtitle="Discover our curated collection of premium products designed to elevate your lifestyle."
        ctaText="Shop Now"
        ctaLink="/shop"
      />
      
      <CategorySection 
        title="Featured Categories"
        categories={categories}
      />
      
      <FeaturedProducts 
        title="Featured Products"
        products={featuredProducts}
      />
      
      <NewsletterSection 
        title="Stay Updated"
        subtitle="Subscribe to our newsletter for new product announcements, style guides, and exclusive offers."
        buttonText="Subscribe"
        placeholderText="Enter your email"
        promoText="Get 10% off your first order when you subscribe!"
      />
    </>
  );
};

export default HomePage;