const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const RINGS_CATEGORY_ID = '6a7b0ac053e8e3bbea4602fd';

const sampleRings = [
  {
    name: "Elara Gold Ring",
    slug: "elara-gold-ring",
    description: "A timeless 18K gold plated ring crafted to add a subtle touch of elegance to your everyday look.",
    price: 2499,
    discountPrice: 1999,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=90", public_id: "elara-1" }
    ],
    material: "Gold",
    stock: 25,
    ratings: 4.8,
    numReviews: 124,
    variants: [{ size: "5" }, { size: "6" }, { size: "7" }, { size: "8" }],
    isNewArrival: true
  },
  {
    name: "Aira Minimal Ring",
    slug: "aira-minimal-ring",
    description: "Sleek and understated, this minimal ring is perfect for stacking or wearing on its own.",
    price: 1299,
    discountPrice: 999,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&fit=crop&q=90", public_id: "aira-1" }
    ],
    material: "Silver",
    stock: 40,
    ratings: 4.5,
    numReviews: 89,
    variants: [{ size: "6" }, { size: "7" }, { size: "8" }],
    isBestSeller: true
  },
  {
    name: "Tara Solitaire Ring",
    slug: "tara-solitaire-ring",
    description: "A stunning solitaire ring featuring a brilliant-cut center stone set in premium silver.",
    price: 4999,
    discountPrice: 3999,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&fit=crop&q=90", public_id: "tara-1" }
    ],
    material: "Silver",
    stone: "Zirconia",
    stock: 15,
    ratings: 4.9,
    numReviews: 210,
    variants: [{ size: "5" }, { size: "6" }, { size: "7" }],
    isTrending: true
  },
  {
    name: "Veya Stack Ring",
    slug: "veya-stack-ring",
    description: "Create your unique look with this delicately crafted stack ring, designed to layer perfectly.",
    price: 1599,
    discountPrice: 1299,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&fit=crop&q=90", public_id: "veya-1" }
    ],
    material: "Stainless Steel",
    stock: 50,
    ratings: 4.2,
    numReviews: 45,
    variants: [{ size: "6" }, { size: "7" }, { size: "8" }, { size: "9" }]
  },
  {
    name: "Mira Pearl Ring",
    slug: "mira-pearl-ring",
    description: "Elegant and sophisticated, the Mira ring highlights a luminous freshwater pearl.",
    price: 2999,
    discountPrice: 2499,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&fit=crop&q=90", public_id: "mira-1" }
    ],
    material: "Gold",
    stone: "Freshwater Pearl",
    stock: 20,
    ratings: 4.7,
    numReviews: 76,
    variants: [{ size: "6" }, { size: "7" }],
    isFeatured: true
  },
  {
    name: "Ziva Crystal Ring",
    slug: "ziva-crystal-ring",
    description: "Sparkle from every angle with the Ziva ring, intricately encrusted with shimmering crystals.",
    price: 3499,
    discountPrice: 2899,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&q=90", public_id: "ziva-1" }
    ],
    material: "Silver",
    stone: "Crystal",
    stock: 30,
    ratings: 4.6,
    numReviews: 112,
    variants: [{ size: "5" }, { size: "6" }, { size: "8" }]
  },
  {
    name: "Kiara Dome Ring",
    slug: "kiara-dome-ring",
    description: "A bold statement piece, the Kiara dome ring brings contemporary style to any outfit.",
    price: 1999,
    discountPrice: 1799,
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&q=90", public_id: "kiara-1" }
    ],
    material: "Gold",
    stock: 35,
    ratings: 4.4,
    numReviews: 64,
    variants: [{ size: "7" }, { size: "8" }, { size: "9" }]
  },
  {
    name: "Anaya Heart Ring",
    slug: "anaya-heart-ring",
    description: "A delicate heart-shaped design that symbolizes love and grace. Perfect for gifting.",
    price: 2199,
    discountPrice: null, // No discount
    category: RINGS_CATEGORY_ID,
    images: [
      { url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&fit=crop&q=90", public_id: "anaya-1" }
    ],
    material: "Other",
    stock: 12,
    ratings: 4.9,
    numReviews: 180,
    variants: [{ size: "5" }, { size: "6" }, { size: "7" }],
    isTrending: true
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const Product = require('./models/Product');
    
    // Clear previously added sample rings if needed to avoid duplicates
    await Product.deleteMany({ name: { $in: sampleRings.map(r => r.name) } });
    
    // Assign unique SKU to each before inserting
    const ringsWithSku = sampleRings.map((r, i) => ({
      ...r,
      sku: `RING-SEED-${i+1}-${Date.now()}`
    }));
    
    // Insert new rings
    await Product.insertMany(ringsWithSku);
    console.log('Successfully seeded 8 sample rings!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to seed DB', err);
    process.exit(1);
  });
