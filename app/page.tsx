import { FC } from 'react';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import NewsletterSection from './components/NewsletterSection';
import products from './data/products';

// Tech-focused categories
const categories = [
  { 
    id: 1, 
    name: "Functional Clothing", 
    image: "/categories/accessories.jpg", // Placeholder until we have proper images
    gradient: "from-blue-500 to-indigo-700",
    description: "Engineered apparel with hidden tech features"
  },
  { 
    id: 2, 
    name: "Accessories", 
    image: "/categories/clothing.jpg", // Placeholder until we have proper images
    gradient: "from-teal-400 to-teal-600",
    description: "Tech-enhanced tools for your everyday carry"
  },
  { 
    id: 3, 
    name: "Merchandise", 
    image: "/categories/home.jpg", // Placeholder until we have proper images
    gradient: "from-gray-800 to-gray-900",
    description: "Show your developer pride with our geeky designs"
  },
  { 
    id: 4, 
    name: "Footwear", 
    image: "/categories/home.jpg", // Placeholder until we have proper images
    gradient: "from-green-500 to-green-700",
    description: "Optimized comfort for long coding sessions"
  },
];

// Filter to get tech-focused products for the featured section
const techProducts = products.filter(product => 
  ['Developer Tech Hoodie', 'Tech Backpack Pro', 'Algorithm T-Shirt', 'Developer Comfort Sneakers', 'Anti-Glare Tech Glasses']
  .includes(product.name)
).slice(0, 4);

const HomePage: FC = () => {
  return (
    <>
      <HeroSection 
        title="TECH MEETS STYLE"
        subtitle="Premium functional apparel and accessories designed specifically for developers and engineers."
        ctaText="Explore Collection"
        ctaLink="/shop"
        techFocus={true} // This would be a property you might need to add to the HeroSection component
      />
      
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Built For Developers, By Developers</h2>
          <p className="text-center max-w-2xl mx-auto text-gray-600">
            Every product in our collection is meticulously designed to enhance the developer lifestyle, 
            combining functionality, sustainability, and tech-inspired aesthetics.
          </p>
        </div>
      </div>
      
      <CategorySection 
        title="Shop By Category"
        categories={categories}
        techThemed={true} // This would be a property you might need to add to the CategorySection component
      />
      
      <FeaturedProducts 
        title="Developer Essentials"
        products={techProducts}
        tagline="Functional gear that enhances your coding experience"
      />
      
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-white">
          <h2 className="text-xl font-bold mb-4">Our Sustainability Commitment</h2>
          <p className="mb-6">We're committed to sustainable practices with eco-friendly materials, minimal packaging, and responsible manufacturing.</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">80%</div>
              <div className="text-sm text-gray-300">Recycled Materials</div>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">100%</div>
              <div className="text-sm text-gray-300">Plastic-Free Shipping</div>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">5%</div>
              <div className="text-sm text-gray-300">Profits to Tech Education</div>
            </div>
          </div>
        </div>
      </div>
      
      <NewsletterSection 
        title="Join Our Developer Community"
        subtitle="Subscribe for product releases, coding resources, and special offers exclusive to our tech community."
        buttonText="Subscribe"
        placeholderText="Enter your email"
        promoText="Get 15% off your first tech purchase when you subscribe!"
      />
    </>
  );
};

export default HomePage;