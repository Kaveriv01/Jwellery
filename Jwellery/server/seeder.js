const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env') });

// ── Categories ─────────────────────────────────────────────────────────────────
const sampleCategories = [
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Timeless engagement rings, solitaires and bands',
    isActive: true,
    displayOrder: 1,
    image: { url: '/images/products/ring_solitaire.jpg' }
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Elegant diamond necklaces and pendants',
    isActive: true,
    displayOrder: 2,
    image: { url: '/images/products/necklace_sapphire.jpg' }
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Gold studs, drop earrings and hoops',
    isActive: true,
    displayOrder: 3,
    image: { url: '/images/products/earrings_hoop.jpg' }
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Luxurious bangles and tennis bracelets',
    isActive: true,
    displayOrder: 4,
    image: { url: '/images/products/bracelet_tennis.jpg' }
  },
  {
    name: 'Mangalsutra',
    slug: 'mangalsutra',
    description: 'Traditional and modern mangalsutra designs',
    isActive: true,
    displayOrder: 5,
    image: { url: '/images/products/mangalsutra.jpg' }
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    description: 'Diamond and gold pendants for every occasion',
    isActive: true,
    displayOrder: 6,
    image: { url: '/images/products/pendant_diamond.jpg' }
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    description: 'Gold and diamond bangles',
    isActive: true,
    displayOrder: 7,
    image: { url: '/images/products/bangles.jpg' }
  },
];

// ── Products ───────────────────────────────────────────────────────────────────
const sampleProducts = (catIds) => [

  // ── DIAMOND RINGS (8 products) ──────────────────────────────────────────────
  {
    name: 'Classic Solitaire Diamond Ring',
    slug: 'classic-solitaire-diamond-ring',
    sku: 'RNG-DIA-SOL-001',
    description: 'An iconic 18K white gold ring showcasing a brilliant 0.50-carat round cut GIA certified diamond. The perfect symbol of eternal love with a classic four-prong setting.',
    shortDescription: '18K White Gold | 0.50ct GIA Diamond | Four-Prong Setting',
    price: 125000,
    discountPrice: 112500,
    stock: 15,
    category: catIds['rings'],
    material: 'Gold',
    purity: '18K',
    weight: 3.8,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'solitaire', 'engagement', 'gold', 'gia certified'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: true,
    ratings: 4.9,
    numReviews: 128,
    images: [
      { public_id: 'diamond_ring_sol_1', url: '/images/products/ring_solitaire.jpg', isDefault: true, alt: 'Classic Solitaire Diamond Ring' },
      { public_id: 'diamond_ring_sol_2', url: '/images/products/ring_side_1.jpg', isDefault: false, alt: 'Classic Solitaire Diamond Ring Side View' }
    ]
  },
  {
    name: 'Halo Diamond Engagement Ring',
    slug: 'halo-diamond-engagement-ring',
    sku: 'RNG-DIA-HAL-002',
    description: 'A breathtaking halo-set engagement ring featuring a 0.75-carat cushion-cut diamond surrounded by a luminous halo of micro-pavé diamonds in 18K yellow gold. Includes free engraving.',
    shortDescription: '18K Yellow Gold | 0.75ct Cushion Diamond | Halo Setting',
    price: 185000,
    discountPrice: 166500,
    stock: 10,
    category: catIds['rings'],
    material: 'Gold',
    purity: '18K',
    weight: 4.2,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'halo', 'engagement', 'yellow gold', 'gia certified', 'cushion cut'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isTrending: true,
    ratings: 4.8,
    numReviews: 94,
    images: [
      { public_id: 'diamond_ring_hal_1', url: '/images/products/ring_halo_1.jpg', isDefault: true, alt: 'Halo Diamond Engagement Ring' },
      { public_id: 'diamond_ring_hal_2', url: '/images/products/ring_emerald_1.jpg', isDefault: false, alt: 'Halo Diamond Ring Close Up' }
    ]
  },
  {
    name: 'Princess Cut Diamond Ring',
    slug: 'princess-cut-diamond-ring',
    sku: 'RNG-DIA-PRI-003',
    description: 'Modern and brilliant, this princess-cut diamond ring in 14K rose gold captures light from every angle. A contemporary choice for the fashion-forward bride.',
    shortDescription: '14K Rose Gold | 0.60ct Princess Cut | Channel Setting',
    price: 145000,
    discountPrice: 130500,
    stock: 8,
    category: catIds['rings'],
    material: 'Gold',
    purity: '14K',
    weight: 3.5,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'princess cut', 'rose gold', 'engagement', 'gia certified'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isTrending: true,
    ratings: 4.9,
    numReviews: 76,
    images: [
      { public_id: 'diamond_ring_pri_1', url: '/images/products/ring_pear_1.jpg', isDefault: true, alt: 'Princess Cut Diamond Ring' },
      { public_id: 'diamond_ring_pri_2', url: '/images/products/ring_solitaire.jpg', isDefault: false, alt: 'Princess Cut Diamond Ring Side' }
    ]
  },
  {
    name: 'Diamond Eternity Band Ring',
    slug: 'diamond-eternity-band-ring',
    sku: 'RNG-DIA-ETR-004',
    description: 'A stunning full-eternity band featuring 0.30-carat total weight round brilliant diamonds in a classic shared-prong setting. Crafted in 18K white gold for a timeless look.',
    shortDescription: '18K White Gold | 0.30ct TW Diamonds | Full Eternity',
    price: 89000,
    discountPrice: 80100,
    stock: 20,
    category: catIds['rings'],
    material: 'Gold',
    purity: '18K',
    weight: 3.0,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'eternity band', 'white gold', 'daily wear', 'stacking'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isTrending: false,
    ratings: 4.7,
    numReviews: 63,
    images: [
      { public_id: 'diamond_ring_etr_1', url: '/images/products/ring_side_1.jpg', isDefault: true, alt: 'Diamond Eternity Band' },
      { public_id: 'diamond_ring_etr_2', url: '/images/products/ring_emerald_1.jpg', isDefault: false, alt: 'Diamond Eternity Band Side' }
    ]
  },
  {
    name: 'Marquise Diamond Cocktail Ring',
    slug: 'marquise-diamond-cocktail-ring',
    sku: 'RNG-DIA-MRQ-005',
    description: 'Bold and sophisticated, this 1.0-carat marquise-cut diamond cocktail ring in 18K white gold makes an unforgettable statement. Perfect for formal events and celebrations.',
    shortDescription: '18K White Gold | 1.0ct Marquise Diamond | Statement Ring',
    price: 220000,
    discountPrice: 198000,
    stock: 6,
    category: catIds['rings'],
    material: 'Gold',
    purity: '18K',
    weight: 5.5,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Party',
    tags: ['diamond', 'marquise', 'cocktail ring', 'luxury', 'statement', 'gia certified'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    isTrending: false,
    ratings: 4.8,
    numReviews: 41,
    images: [
      { public_id: 'diamond_ring_mrq_1', url: '/images/products/ring_halo_1.jpg', isDefault: true, alt: 'Marquise Diamond Cocktail Ring' },
      { public_id: 'diamond_ring_mrq_2', url: '/images/products/ring_pear_1.jpg', isDefault: false, alt: 'Marquise Diamond Ring Side View' }
    ]
  },
  {
    name: 'Pear Shape Diamond Ring',
    slug: 'pear-shape-diamond-ring',
    sku: 'RNG-DIA-PER-006',
    description: 'Elegant and unique, this pear-shaped diamond ring in 18K yellow gold is the perfect blend of tradition and modern style. The teardrop shape creates an elongating effect on the finger.',
    shortDescription: '18K Yellow Gold | 0.70ct Pear Diamond | Solitaire Setting',
    price: 165000,
    discountPrice: 148500,
    stock: 9,
    category: catIds['rings'],
    material: 'Gold',
    purity: '18K',
    weight: 3.9,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'pear shape', 'yellow gold', 'engagement', 'gia certified', 'teardrop'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isTrending: false,
    ratings: 4.9,
    numReviews: 55,
    images: [
      { public_id: 'diamond_ring_per_1', url: '/images/products/ring_pear_1.jpg', isDefault: true, alt: 'Pear Shape Diamond Ring' },
      { public_id: 'diamond_ring_per_2', url: '/images/products/ring_halo_1.jpg', isDefault: false, alt: 'Pear Diamond Ring Close Up' }
    ]
  },
  {
    name: 'Emerald Cut Diamond Ring',
    slug: 'emerald-cut-diamond-ring',
    sku: 'RNG-DIA-EMR-007',
    description: 'Refined and sophisticated, this 0.80-carat emerald-cut diamond ring in platinum showcases the stone\'s clarity like no other cut. Art-deco inspired step-cut facets create a mesmerising mirror effect.',
    shortDescription: 'Platinum | 0.80ct Emerald Cut | Step-Cut Facets',
    price: 195000,
    discountPrice: 175500,
    stock: 7,
    category: catIds['rings'],
    material: 'Platinum',
    purity: '950',
    weight: 6.1,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'emerald cut', 'platinum', 'engagement', 'gia certified', 'step cut'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isTrending: true,
    ratings: 4.8,
    numReviews: 33,
    images: [
      { public_id: 'diamond_ring_emr_1', url: '/images/products/ring_emerald_1.jpg', isDefault: true, alt: 'Emerald Cut Diamond Ring' },
      { public_id: 'diamond_ring_emr_2', url: '/images/products/ring_side_1.jpg', isDefault: false, alt: 'Emerald Cut Ring Side View' }
    ]
  },
  {
    name: 'Three Stone Diamond Ring',
    slug: 'three-stone-diamond-ring',
    sku: 'RNG-DIA-TRS-008',
    description: 'Representing your past, present, and future — this breathtaking three-stone diamond ring features a 0.60-carat round center diamond flanked by two 0.30-carat side stones in 18K white gold.',
    shortDescription: '18K White Gold | 1.20ct TW | Past Present Future',
    price: 245000,
    discountPrice: 220500,
    stock: 5,
    category: catIds['rings'],
    material: 'Gold',
    purity: '18K',
    weight: 5.0,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['diamond', 'three stone', 'white gold', 'engagement', 'gia certified', 'trilogy'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: false,
    ratings: 5.0,
    numReviews: 22,
    images: [
      { public_id: 'diamond_ring_trs_1', url: '/images/products/ring_side_1.jpg', isDefault: true, alt: 'Three Stone Diamond Ring' },
      { public_id: 'diamond_ring_trs_2', url: '/images/products/ring_solitaire.jpg', isDefault: false, alt: 'Three Stone Ring Close Up' }
    ]
  },

  // ── OTHER PRODUCTS ──────────────────────────────────────────────────────────
  {
    name: 'Royal Sapphire Pendant Necklace',
    slug: 'royal-sapphire-pendant-necklace',
    sku: 'NEC-SAP-002',
    description: 'A mesmerizing pear-shaped blue sapphire pendant surrounded by a halo of micro-pave diamonds on a 16-inch platinum chain.',
    shortDescription: 'Blue Sapphire and Diamond Halo Necklace',
    price: 95000,
    discountPrice: 89000,
    stock: 8,
    category: catIds['necklaces'],
    material: 'Platinum',
    purity: '950',
    weight: 5.2,
    stone: 'Sapphire',
    gender: 'Women',
    occasion: 'Gift',
    tags: ['sapphire', 'pendant', 'necklace', 'diamond halo'],
    isFeatured: true,
    isNewArrival: true,
    ratings: 4.8,
    numReviews: 47,
    images: [
      { public_id: 'sample_necklace_1', url: '/images/products/necklace_sapphire.jpg', isDefault: true, alt: 'Royal Sapphire Pendant Necklace' }
    ]
  },
  {
    name: '18K Yellow Gold Hoop Earrings',
    slug: '18k-yellow-gold-hoop-earrings',
    sku: 'EAR-HOP-003',
    description: 'Classic high-polish hoops crafted from solid 18K yellow gold. Simple, light, and perfect for daily luxury.',
    shortDescription: 'Solid 18K Gold Daily Hoops',
    price: 32000,
    stock: 25,
    category: catIds['earrings'],
    material: 'Gold',
    purity: '18K',
    weight: 4.1,
    gender: 'Women',
    occasion: 'Daily Wear',
    tags: ['gold', 'hoops', 'earrings', 'daily wear'],
    isBestSeller: true,
    ratings: 4.6,
    numReviews: 89,
    images: [
      { public_id: 'sample_earrings_1', url: '/images/products/earrings_hoop.jpg', isDefault: true, alt: '18K Gold Hoop Earrings' }
    ]
  },
  {
    name: 'Emerald Cut Tennis Bracelet',
    slug: 'emerald-cut-tennis-bracelet',
    sku: 'BRC-TEN-004',
    description: 'A stunning continuous line of matching emerald-cut natural diamonds set in premium white gold.',
    shortDescription: 'Emerald Cut Diamond Tennis Bracelet',
    price: 240000,
    discountPrice: 215000,
    stock: 5,
    category: catIds['bracelets'],
    material: 'Gold',
    purity: '18K',
    weight: 9.5,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Party',
    tags: ['diamond', 'tennis bracelet', 'emerald cut', 'party'],
    isFeatured: true,
    isBestSeller: true,
    ratings: 4.9,
    numReviews: 35,
    images: [
      { public_id: 'sample_bracelet_1', url: '/images/products/bracelet_tennis.jpg', isDefault: true, alt: 'Emerald Cut Tennis Bracelet' }
    ]
  },
  {
    name: 'Diamond Solitaire Pendant',
    slug: 'diamond-solitaire-pendant',
    sku: 'PEN-DIA-001',
    description: 'A perfectly proportioned 0.25-carat diamond solitaire pendant in 18K white gold on a 16-inch chain. Delicate elegance for every day.',
    shortDescription: '0.25ct Diamond | 18K White Gold Chain',
    price: 45000,
    discountPrice: 40500,
    stock: 30,
    category: catIds['pendants'],
    material: 'Gold',
    purity: '18K',
    weight: 2.1,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Daily Wear',
    tags: ['diamond', 'pendant', 'solitaire', 'daily wear'],
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    ratings: 4.7,
    numReviews: 61,
    images: [
      { public_id: 'pendant_dia_1', url: '/images/products/pendant_diamond.jpg', isDefault: true, alt: 'Diamond Solitaire Pendant' }
    ]
  },
  {
    name: 'Gold Mangalsutra with Diamond',
    slug: 'gold-mangalsutra-with-diamond',
    sku: 'MNG-DIA-001',
    description: 'A contemporary mangalsutra combining traditional design with modern elegance. Features a diamond-studded gold pendant on a black bead chain.',
    shortDescription: 'Diamond Studded | 22K Gold | Black Bead Chain',
    price: 68000,
    discountPrice: 61200,
    stock: 12,
    category: catIds['mangalsutra'],
    material: 'Gold',
    purity: '22K',
    weight: 7.5,
    stone: 'Diamond',
    gender: 'Women',
    occasion: 'Wedding',
    tags: ['mangalsutra', 'diamond', 'gold', 'wedding', 'traditional'],
    isFeatured: false,
    isBestSeller: true,
    ratings: 4.8,
    numReviews: 53,
    images: [
      { public_id: 'mangalsutra_1', url: '/images/products/mangalsutra.jpg', isDefault: true, alt: 'Gold Mangalsutra with Diamond' }
    ]
  },
];

// ── Seed Function ──────────────────────────────────────────────────────────────
const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI is missing from server/.env');

    await mongoose.connect(mongoUri);
    console.log('📡 Connected to MongoDB for seeding...');

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('🧹 Cleared existing categories and products.');

    // Seed Categories
    const createdCats = await Category.insertMany(sampleCategories);
    console.log(`✅ ${createdCats.length} categories inserted.`);

    // Map slug → _id
    const catIds = {};
    createdCats.forEach((cat) => { catIds[cat.slug] = cat._id; });

    // Seed Products
    const products = sampleProducts(catIds);
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully.`);
    console.log(`   └─ 8 Diamond Rings`);
    console.log(`   └─ 1 Sapphire Necklace`);
    console.log(`   └─ 1 Gold Hoop Earrings`);
    console.log(`   └─ 1 Tennis Bracelet`);
    console.log(`   └─ 1 Diamond Pendant`);
    console.log(`   └─ 1 Gold Mangalsutra`);

    await mongoose.disconnect();
    console.log('\n🎉 Seeding complete! Your database is ready.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
