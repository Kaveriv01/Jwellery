require('dotenv').config();
const mongoose = require('mongoose');

const categories = {
  Rings: '6a7b0ac053e8e3bbea4602fd',
  Earrings: '6a7b0ac053e8e3bbea4602fe',
  Necklaces: '6a7b0ac053e8e3bbea4602ff',
  Bracelets: '6a7b0ac053e8e3bbea460300'
};

const newProducts = [
  // RINGS
  {
    name: 'The Solitaire Eternity Ring',
    sku: 'RNG-SOL-' + Math.floor(Math.random()*10000),
    slug: 'solitaire-eternity-ring-' + Math.floor(Math.random()*10000),
    description: 'A breathtaking solitaire ring surrounded by a delicate eternity band, crafted in 18K solid gold.',
    shortDescription: '18K Gold | Signature Diamond Collection',
    price: 45000,
    discountPrice: 38900,
    category: categories.Rings,
    stock: 10,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1570530704940-5b53e839e9fb?q=80&w=2803&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1628151016839-a9c40212f4ac?q=80&w=2787&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Vintage Emerald Cut Ring',
    sku: 'RNG-VIN-' + Math.floor(Math.random()*10000),
    slug: 'vintage-emerald-cut-ring-' + Math.floor(Math.random()*10000),
    description: 'An elegant vintage-inspired ring featuring a flawless emerald cut center stone.',
    shortDescription: '18K White Gold | Vintage Collection',
    price: 65000,
    discountPrice: 59999,
    category: categories.Rings,
    stock: 5,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1628151016839-a9c40212f4ac?q=80&w=2787&auto=format&fit=crop' }
    ]
  },
  // NECKLACES
  {
    name: 'Celestial Diamond Choker',
    sku: 'NCK-CEL-' + Math.floor(Math.random()*10000),
    slug: 'celestial-diamond-choker-' + Math.floor(Math.random()*10000),
    description: 'A stunning choker necklace featuring scattered diamonds resembling a starry night.',
    shortDescription: '18K Yellow Gold | Celestial Collection',
    price: 125000,
    discountPrice: 110000,
    category: categories.Necklaces,
    stock: 3,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2787&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Baroque Pearl Drop Pendant',
    sku: 'NCK-PRL-' + Math.floor(Math.random()*10000),
    slug: 'baroque-pearl-drop-pendant-' + Math.floor(Math.random()*10000),
    description: 'A unique baroque pearl suspended from a delicate gold chain.',
    shortDescription: '14K Gold | Pearl Collection',
    price: 32000,
    category: categories.Necklaces,
    stock: 12,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2787&auto=format&fit=crop' }
    ]
  },
  // EARRINGS
  {
    name: 'Lumina Gold Hoop Earrings',
    sku: 'EAR-LUM-' + Math.floor(Math.random()*10000),
    slug: 'lumina-gold-hoops-' + Math.floor(Math.random()*10000),
    description: 'Thick, bold hollow gold hoops designed for everyday luxury.',
    shortDescription: '18K Gold Plated | Everyday Essentials',
    price: 18500,
    discountPrice: 15000,
    category: categories.Earrings,
    stock: 25,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1635767798638-3e252820c7cc?q=80&w=2818&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2787&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Diamond Cluster Studs',
    sku: 'EAR-DIA-' + Math.floor(Math.random()*10000),
    slug: 'diamond-cluster-studs-' + Math.floor(Math.random()*10000),
    description: 'Brilliant diamond cluster studs that catch the light from every angle.',
    shortDescription: '18K White Gold | Signature Diamond',
    price: 85000,
    category: categories.Earrings,
    stock: 8,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1635767798638-3e252820c7cc?q=80&w=2818&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2787&auto=format&fit=crop' }
    ]
  },
  // BRACELETS
  {
    name: 'Tennis Diamond Bracelet',
    sku: 'BRC-TEN-' + Math.floor(Math.random()*10000),
    slug: 'tennis-diamond-bracelet-' + Math.floor(Math.random()*10000),
    description: 'A classic tennis bracelet featuring 4 carats of flawless diamonds.',
    shortDescription: '18K White Gold | Heritage Collection',
    price: 250000,
    discountPrice: 220000,
    category: categories.Bracelets,
    stock: 2,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2787&auto=format&fit=crop' }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  for (const product of newProducts) {
    product.createdAt = new Date();
    product.updatedAt = new Date();
    await db.collection('products').insertOne(product);
  }
  console.log('Seeded ' + newProducts.length + ' luxury products successfully!');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});


