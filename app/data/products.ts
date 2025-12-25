// Product data for Glossify Store

// Define TypeScript interfaces for product data structure
export interface TechSpecs {
  material?: string;
  pocketCapacity?: string;
  sustainabilityRating: number;
  capacity?: string;
  laptopSize?: string;
  waterResistance?: string;
  soleTech?: string;
  weight?: string;
  blueLight?: string;
  uvProtection?: string;
  frameWeight?: string;
  printMethod?: string;
  printTech?: string;
  paperWeight?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  features: string[];
  colors: string[];
  sizes?: string[];
  details: string;
  care: string; 
  images: string[];
  techSpecs?: TechSpecs;
}

// Initialize products array with type safety
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Wallet',
    price: 59.99,
    description: 'Handcrafted genuine leather wallet with multiple card slots and a sleek design.',
    category: 'Accessories',
    inStock: true,
    features: [
      'Genuine full-grain leather',
      'RFID blocking technology',
      'Multiple card slots',
      'Bifold design',
      'Handcrafted with care'
    ],
    colors: ['Brown', 'Black', 'Tan'],
    details: 'This premium wallet is crafted from the finest full-grain leather, designed to develop a beautiful patina over time. The wallet includes RFID blocking technology to protect your cards from unauthorized scanning.',
    care: 'Wipe clean with a damp cloth. Apply leather conditioner occasionally to maintain suppleness.',
    images: [
      '/images/wallet-1.jpg',
      '/images/wallet-2.jpg',
      '/images/wallet-3.jpg'
    ]
  },
  {
    id: '2',
    name: 'Minimalist Desk Lamp',
    price: 79.99,
    description: 'Modern desk lamp with adjustable brightness and elegant, minimalist design.',
    category: 'Home',
    inStock: true,
    features: [
      'Touch-sensitive controls',
      'Three brightness levels',
      'Adjustable arm and head',
      'Energy-efficient LED',
      'USB charging port'
    ],
    colors: ['White', 'Black', 'Silver'],
    details: 'This elegant desk lamp combines form and function with its sleek design and practical features. The touch-sensitive controls allow for easy adjustment of brightness, while the flexible arm and head let you direct light exactly where you need it.',
    care: 'Dust regularly with a soft cloth. Avoid using harsh cleaning chemicals.',
    images: [
      '/images/lamp-1.jpg',
      '/images/lamp-2.jpg',
      '/images/lamp-3.jpg'
    ]
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    description: 'Soft, breathable organic cotton t-shirt with a classic fit.',
    category: 'Clothing',
    inStock: true,
    features: [
      '100% organic cotton',
      'Breathable fabric',
      'Sustainably produced',
      'Classic fit',
      'Pre-shrunk'
    ],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: 'Our organic cotton t-shirts are made from 100% certified organic cotton, grown without harmful pesticides or fertilizers. The fabric is soft, breathable, and designed to last through repeated washing.',
    care: 'Machine wash cold with like colors. Tumble dry low. Do not bleach.',
    images: [
      '/images/tshirt-1.jpg',
      '/images/tshirt-2.jpg',
      '/images/tshirt-3.jpg'
    ]
  },
  {
    id: '4',
    name: 'Ceramic Pour-Over Coffee Set',
    price: 64.99,
    description: 'Complete pour-over coffee brewing set made from high-quality ceramic.',
    category: 'Kitchen',
    inStock: true,
    features: [
      'Handcrafted ceramic dripper',
      'Glass serving carafe',
      'Reusable metal filter',
      'Includes coffee scoop',
      'Elegant design'
    ],
    colors: ['White', 'Black', 'Terracotta'],
    details: 'Elevate your morning coffee ritual with this beautiful ceramic pour-over set. The set includes a handcrafted ceramic dripper, glass serving carafe, and a reusable stainless steel filter that brings out the full flavor of your coffee while being environmentally friendly.',
    care: 'Dishwasher safe. Hand washing recommended for ceramic dripper.',
    images: [
      '/images/coffee-1.jpg',
      '/images/coffee-2.jpg',
      '/images/coffee-3.jpg'
    ]
  },
  {
    id: '5',
    name: 'Merino Wool Scarf',
    price: 49.99,
    description: 'Luxuriously soft merino wool scarf that provides warmth without bulk.',
    category: 'Accessories',
    inStock: true,
    features: [
      'Premium merino wool',
      'Lightweight and warm',
      'Naturally breathable',
      'Generous length',
      'Versatile styling options'
    ],
    colors: ['Gray', 'Navy', 'Burgundy', 'Camel'],
    details: 'This premium merino wool scarf offers exceptional warmth and comfort without bulk. The natural properties of merino wool make it breathable, moisture-wicking, and odor-resistant, perfect for daily wear in cooler weather.',
    care: 'Hand wash in cold water with mild detergent. Lay flat to dry.',
    images: [
      '/images/scarf-1.jpg',
      '/images/scarf-2.jpg',
      '/images/scarf-3.jpg'
    ]
  },
  {
    id: '6',
    name: 'Leather Notebook Cover',
    price: 39.99,
    description: 'Refillable leather cover for standard A5 notebooks with pocket for cards and notes.',
    category: 'Office',
    inStock: false,
    features: [
      'Full-grain leather',
      'Fits standard A5 notebooks',
      'Interior pockets for cards',
      'Pen holder',
      'Handcrafted stitching'
    ],
    colors: ['Brown', 'Black', 'Tan'],
    details: 'This refillable leather notebook cover transforms an ordinary notebook into an elegant writing companion. Crafted from full-grain leather, it will develop a rich patina over time. The cover includes interior pockets for cards and loose papers, as well as a loop to securely hold your favorite pen.',
    care: 'Wipe clean with a damp cloth. Apply leather conditioner occasionally to maintain suppleness.',
    images: [
      '/images/notebook-1.jpg',
      '/images/notebook-2.jpg',
      '/images/notebook-3.jpg'
    ]
  },
  {
    id: '7',
    name: 'Developer Tech Hoodie',
    price: 89.99,
    description: 'Ergonomic hoodie designed specifically for developers with integrated tech features.',
    category: 'Functional Clothing',
    inStock: true,
    features: [
      'Hidden cable routing system',
      'Integrated headphone loops',
      'Extra-large kangaroo pocket for devices',
      'Breathable, wrinkle-resistant fabric',
      'Thumb holes for keyboard comfort'
    ],
    colors: ['Black', 'Dark Gray', 'Navy Blue'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: 'Our Developer Tech Hoodie is designed with the modern programmer in mind. Features include a hidden cable management system that routes your headphone wires through the hood and down the sides, thumb holes to keep sleeves in place while typing, and an oversized kangaroo pocket perfectly sized for tablets or small laptops.',
    care: 'Machine wash cold. Tumble dry low. Remove promptly to prevent wrinkles.',
    images: [
      '/images/tshirt-1.jpg', // Using t-shirt images as placeholder
      '/images/tshirt-2.jpg',
      '/images/tshirt-3.jpg'
    ],
    techSpecs: {
      material: '65% cotton, 30% polyester, 5% elastane',
      pocketCapacity: 'Fits devices up to 11 inches',
      sustainabilityRating: 4
    }
  },
  {
    id: '8',
    name: 'Tech Backpack Pro',
    price: 129.99,
    description: 'Modular backpack with anti-theft features and integrated charging ports for the modern developer.',
    category: 'Accessories',
    inStock: true,
    features: [
      'USB charging port with power bank pocket',
      'RFID-protected pocket for valuables',
      'Padded laptop compartment (fits up to 17")',
      'Hidden zipper design for security',
      'Water-resistant material'
    ],
    colors: ['Black', 'Gray', 'Midnight Blue'],
    details: 'The Tech Backpack Pro is the ultimate carry solution for developers on the go. The bag features a dedicated, padded laptop compartment, an integrated USB charging port connected to a power bank pocket (power bank not included), and RFID-protected pockets for your most sensitive items.',
    care: 'Spot clean with mild detergent and water. Air dry only.',
    images: [
      '/images/notebook-1.jpg', // Using notebook images as placeholder
      '/images/notebook-2.jpg',
      '/images/notebook-3.jpg'
    ],
    techSpecs: {
      capacity: '30L',
      laptopSize: 'Up to 17 inches',
      waterResistance: 'IPX4 rating',
      sustainabilityRating: 4
    }
  },
  {
    id: '9',
    name: 'Algorithm T-Shirt',
    price: 34.99,
    description: 'Comfortable cotton t-shirt featuring a stylish, algorithm-inspired pattern design.',
    category: 'Merchandise',
    inStock: true,
    features: [
      '100% organic cotton',
      'Algorithm visualization design',
      'Breathable fabric',
      'Classic fit',
      'Pre-shrunk'
    ],
    colors: ['White/Black Print', 'Black/Neon Print', 'Gray/Blue Print'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: "Showcase your love for elegant code with our Algorithm T-Shirt. The unique design visualizes a sorting algorithm in an aesthetically pleasing pattern that's subtle enough for everyday wear but recognizable to fellow developers. Made from 100% organic cotton for maximum comfort during long coding sessions.",
    care: 'Machine wash cold with like colors. Tumble dry low. Do not bleach.',
    images: [
      '/images/tshirt-1.jpg',
      '/images/tshirt-2.jpg',
      '/images/tshirt-3.jpg'
    ],
    techSpecs: {
      material: '100% organic cotton',
      printMethod: 'Eco-friendly water-based ink',
      sustainabilityRating: 5
    }
  },
  {
    id: '10',
    name: 'Developer Comfort Sneakers',
    price: 119.99,
    description: 'Lightweight, ergonomic sneakers designed for all-day comfort while sitting or standing at your desk.',
    category: 'Footwear',
    inStock: true,
    features: [
      'Memory foam insoles',
      'Breathable mesh upper',
      'Ergonomic arch support',
      'Anti-fatigue cushioning',
      'Non-marking soles'
    ],
    colors: ['Black/Gray', 'All Black', 'Navy/White'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    details: "Developed specifically for the unique needs of developers and tech professionals, these sneakers provide exceptional comfort whether you're sitting at your desk for hours or using a standing desk.",
    care: 'Remove insoles and wash separately by hand. Clean outer shoe with damp cloth and mild soap. Air dry only.',
    images: [
      '/images/wallet-1.jpg', // Using wallet images as placeholder
      '/images/wallet-2.jpg',
      '/images/wallet-3.jpg'
    ],
    techSpecs: {
      soleTech: 'Dual-density EVA',
      weight: '8.5 oz per shoe (size 10)',
      sustainabilityRating: 3
    }
  },
  {
    id: '11',
    name: 'Anti-Glare Tech Glasses',
    price: 89.99,
    description: 'Stylish glasses with blue light filtering and anti-glare technology for extended screen time.',
    category: 'Accessories',
    inStock: true,
    features: [
      'Blue light filtering lenses',
      'Anti-glare coating',
      'Lightweight frame',
      'Spring hinges for comfort',
      'Includes protective case'
    ],
    colors: ['Matte Black', 'Tortoise Shell', 'Clear/Silver'],
    details: 'Protect your eyes during long coding sessions with our Anti-Glare Tech Glasses. Designed specifically for developers who spend extended hours in front of screens, these glasses filter harmful blue light and reduce glare to minimize eye strain and fatigue.',
    care: 'Clean with the included microfiber cloth. Avoid using paper products on lenses.',
    images: [
      '/images/scarf-1.jpg', // Using scarf images as placeholder
      '/images/scarf-2.jpg',
      '/images/scarf-3.jpg'
    ],
    techSpecs: {
      blueLight: 'Filters 40% of harmful blue light',
      uvProtection: '100% UVA/UVB',
      frameWeight: '18g',
      sustainabilityRating: 4
    }
  },
  {
      id: '12',
      name: 'Tech-inspired Minimalist Poster',
      price: 24.99,
      description: 'Clean, modern poster featuring motivational coding quotes and circuit-inspired design elements.',
      category: 'Merchandise',
      inStock: true,
      features: [
          'High-quality print on matte paper',
          'Motivational developer quote',
          'Circuit board design elements',
          'Multiple size options',
          'Minimalist aesthetic'
      ],
      sizes: ['11x17"', '18x24"', '24x36"'],
      details: 'Add some inspiration to your workspace with our Tech-inspired Minimalist Poster. Each design features a motivational quote relevant to developers, elegantly integrated with circuit-inspired graphical elements.',
      care: 'Frame under glass to protect. Avoid direct sunlight to prevent fading.',
      images: [
          '/images/coffee-1.jpg', // Using coffee set images as placeholder
          '/images/coffee-2.jpg',
          '/images/coffee-3.jpg'
      ],
      techSpecs: {
          paperWeight: '230gsm',
          printTech: 'Archival quality ink',
          sustainabilityRating: 4
      },
      colors: []
  }
];

// Helper function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

// Helper function to get related products (same category but different ID)
export function getRelatedProducts(id: string, limit: number = 3): Product[] {
  const product = getProductById(id);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== id)
    .slice(0, limit);
}

// Helper function to get products by category
export function getProductsByCategory(category: string, limit: number | null = null): Product[] {
  const filteredProducts = products.filter(product => product.category === category);
  return limit ? filteredProducts.slice(0, limit) : filteredProducts;
}

// Helper function to get all product categories
export function getAllCategories(): string[] {
  const categories = [...new Set(products.map(product => product.category))];
  return categories;
}

// Get featured products
export function getFeaturedProducts(limit: number = 4): Product[] {
  // For now, we're just returning the first few products
  // In a real app, you might have a "featured" flag on certain products
  return products.slice(0, limit);
}

// Search products by term
export function searchProducts(term: string): Product[] {
  const searchTerm = term.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

export default products;