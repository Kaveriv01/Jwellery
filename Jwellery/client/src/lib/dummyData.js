export const dummyProducts = [
  {
    _id: "dummy_1",
    name: "Aurelia Diamond Pendant",
    slug: "aurelia-diamond-pendant",
    shortDescription: "A breathtaking diamond pendant set in 18k Rose Gold.",
    description: "Experience the epitome of luxury with the Aurelia Diamond Pendant. Crafted meticulously in 18k Rose Gold, it features a brilliant-cut center diamond surrounded by a halo of smaller stones, designed to catch the light from every angle.",
    price: 45000,
    discountPrice: 38999,
    discountPercent: 13,
    category: { name: "Necklaces", slug: "necklaces" },
    images: [
      { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600", isDefault: true },
      { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600" }
    ],
    variants: [{ size: "Standard", color: "Rose Gold", stock: 10 }],
    stock: 10,
    material: "Gold",
    purity: "18K",
    stone: "Diamond",
    ratings: 4.8,
    numReviews: 24,
    isNewArrival: true,
    isFeatured: true
  },
  {
    _id: "dummy_2",
    name: "Celeste Solitaire Ring",
    slug: "celeste-solitaire-ring",
    shortDescription: "Classic elegance with a modern twist.",
    description: "The Celeste Solitaire Ring features a stunning 1-carat diamond set on a sleek platinum band. A timeless symbol of love and sophistication.",
    price: 85000,
    category: { name: "Rings", slug: "rings" },
    images: [
      { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "6", color: "Platinum", stock: 5 }, { size: "7", color: "Platinum", stock: 4 }],
    stock: 9,
    material: "Platinum",
    stone: "Diamond",
    ratings: 4.9,
    numReviews: 56,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    _id: "dummy_3",
    name: "Lumina Gold Hoop Earrings",
    slug: "lumina-gold-hoop-earrings",
    shortDescription: "Textured gold hoops for everyday luxury.",
    description: "These 22k gold hoop earrings offer a perfect balance of traditional craftsmanship and contemporary design. Lightweight yet striking.",
    price: 22000,
    discountPrice: 19500,
    discountPercent: 11,
    category: { name: "Earrings", slug: "earrings" },
    images: [
      { url: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "Standard", color: "Yellow Gold", stock: 15 }],
    stock: 15,
    material: "Gold",
    purity: "22K",
    ratings: 4.5,
    numReviews: 18,
    isNewArrival: true
  },
  {
    _id: "dummy_4",
    name: "Seraphina Emerald Bracelet",
    slug: "seraphina-emerald-bracelet",
    shortDescription: "A statement piece featuring natural emeralds.",
    description: "Adorn your wrist with the Seraphina Emerald Bracelet. Delicately crafted with vibrant emeralds and accents of brilliant diamonds in 14k white gold.",
    price: 110000,
    category: { name: "Bracelets", slug: "bracelets" },
    images: [
      { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "Medium", color: "White Gold", stock: 3 }],
    stock: 3,
    material: "Gold",
    purity: "14K",
    stone: "Emerald",
    ratings: 5.0,
    numReviews: 8,
    isNewArrival: true,
    isFeatured: true
  },
  {
    _id: "dummy_5",
    name: "Royal Sapphire Choker",
    slug: "royal-sapphire-choker",
    shortDescription: "An exquisite bridal choker with deep blue sapphires.",
    description: "The Royal Sapphire Choker is a masterpiece of high jewelry. Hand-selected sapphires rest beautifully against a bed of pavé diamonds.",
    price: 250000,
    discountPrice: 225000,
    discountPercent: 10,
    category: { name: "Necklaces", slug: "necklaces" },
    images: [
      { url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "Standard", color: "White Gold", stock: 1 }],
    stock: 1,
    material: "Gold",
    stone: "Sapphire",
    ratings: 4.7,
    numReviews: 3
  },
  {
    _id: "dummy_6",
    name: "Minimalist Infinity Ring",
    slug: "minimalist-infinity-ring",
    shortDescription: "Subtle and sophisticated.",
    description: "An elegant infinity band crafted in 18k yellow gold, perfect for stacking or wearing on its own.",
    price: 15000,
    category: { name: "Rings", slug: "rings" },
    images: [
      { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "6", color: "Yellow Gold", stock: 20 }, { size: "8", color: "Yellow Gold", stock: 10 }],
    stock: 30,
    material: "Gold",
    purity: "18K",
    ratings: 4.6,
    numReviews: 102,
    isBestSeller: true
  },
  {
    _id: "dummy_7",
    name: "Pearl Drop Cascade Earrings",
    slug: "pearl-drop-cascade-earrings",
    shortDescription: "Lustrous freshwater pearls.",
    description: "A cascade of freshwater pearls descending from diamond-studded hooks. Perfect for evening wear.",
    price: 32000,
    discountPrice: 28000,
    discountPercent: 12,
    category: { name: "Earrings", slug: "earrings" },
    images: [
      { url: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "Standard", color: "Silver", stock: 8 }],
    stock: 8,
    material: "Silver",
    stone: "Pearl",
    ratings: 4.9,
    numReviews: 45
  },
  {
    _id: "dummy_8",
    name: "Vintage Filigree Cuff",
    slug: "vintage-filigree-cuff",
    shortDescription: "A statement piece inspired by heritage designs.",
    description: "This cuff bracelet features intricate filigree workmanship in 22k gold, showcasing traditional artisanal techniques.",
    price: 89000,
    category: { name: "Bracelets", slug: "bracelets" },
    images: [
      { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", isDefault: true }
    ],
    variants: [{ size: "Adjustable", color: "Yellow Gold", stock: 4 }],
    stock: 4,
    material: "Gold",
    purity: "22K",
    ratings: 5.0,
    numReviews: 12,
    isTrending: true
  }
];
