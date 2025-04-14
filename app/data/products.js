// Product data with images
const products = [
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
  }
];

// Helper function to get a product by ID
export function getProductById(id) {
  return products.find(product => product.id === id);
}

// Helper function to get related products (same category but different ID)
export function getRelatedProducts(id, limit = 3) {
  const product = getProductById(id);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== id)
    .slice(0, limit);
}

export default products;