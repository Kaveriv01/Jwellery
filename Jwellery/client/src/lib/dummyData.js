export const dummyProducts = [
  // NECKLACES (cat1)
  {
    _id: "dummy_1", name: "Aurelia Diamond Pendant", slug: "aurelia-diamond-pendant",
    shortDescription: "A breathtaking diamond pendant set in 18k Rose Gold.",
    price: 45000, discountPrice: 38999, category: { _id: 'cat1', name: "Necklaces", slug: "necklaces" },
    images: [{ url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true, isFeatured: true
  },
  {
    _id: "dummy_n2", name: "Royal Sapphire Choker", slug: "royal-sapphire-choker",
    shortDescription: "An exquisite bridal choker with deep blue sapphires.",
    price: 250000, category: { _id: 'cat1', name: "Necklaces", slug: "necklaces" },
    images: [{ url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true
  },
  {
    _id: "dummy_n3", name: "Classic Pearl Strands", slug: "classic-pearl-strands",
    shortDescription: "Timeless elegance for every occasion.",
    price: 32000, category: { _id: 'cat1', name: "Necklaces", slug: "necklaces" },
    images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", isDefault: true }]
  },

  // EARRINGS (cat2)
  {
    _id: "dummy_e1", name: "Lumina Gold Hoop Earrings", slug: "lumina-gold-hoop-earrings",
    shortDescription: "Textured gold hoops for everyday luxury.",
    price: 22000, discountPrice: 19500, category: { _id: 'cat2', name: "Earrings", slug: "earrings" },
    images: [{ url: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true
  },
  {
    _id: "dummy_e2", name: "Pearl Drop Cascade", slug: "pearl-drop-cascade",
    shortDescription: "Lustrous freshwater pearls.",
    price: 32000, category: { _id: 'cat2', name: "Earrings", slug: "earrings" },
    images: [{ url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true
  },
  {
    _id: "dummy_e3", name: "Diamond Cluster Studs", slug: "diamond-cluster-studs",
    shortDescription: "Brilliant cut diamonds set in white gold.",
    price: 55000, category: { _id: 'cat2', name: "Earrings", slug: "earrings" },
    images: [{ url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600", isDefault: true }]
  },

  // RINGS (cat3)
  {
    _id: "dummy_r1", name: "Celeste Solitaire Ring", slug: "celeste-solitaire-ring",
    shortDescription: "Classic elegance with a modern twist.",
    price: 85000, category: { _id: 'cat3', name: "Rings", slug: "rings" },
    images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true, isBestSeller: true
  },
  {
    _id: "dummy_r2", name: "Minimalist Infinity Band", slug: "minimalist-infinity-band",
    shortDescription: "Subtle and sophisticated.",
    price: 15000, category: { _id: 'cat3', name: "Rings", slug: "rings" },
    images: [{ url: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isBestSeller: true
  },
  {
    _id: "dummy_r3", name: "Vintage Emerald Cut Ring", slug: "vintage-emerald-cut-ring",
    shortDescription: "A show-stopping emerald surrounded by diamonds.",
    price: 120000, category: { _id: 'cat3', name: "Rings", slug: "rings" },
    images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true, isFeatured: true
  },
  {
    _id: "dummy_r4", name: "Rose Gold Pave Ring", slug: "rose-gold-pave-ring",
    shortDescription: "Dazzling pave diamonds on a thin rose gold band.",
    price: 45000, category: { _id: 'cat3', name: "Rings", slug: "rings" },
    images: [{ url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true
  },

  // BRACELETS (cat4)
  {
    _id: "dummy_b1", name: "Seraphina Emerald Bracelet", slug: "seraphina-emerald-bracelet",
    shortDescription: "A statement piece featuring natural emeralds.",
    price: 110000, category: { _id: 'cat4', name: "Bracelets", slug: "bracelets" },
    images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true, isFeatured: true
  },
  {
    _id: "dummy_b2", name: "Vintage Filigree Cuff", slug: "vintage-filigree-cuff",
    shortDescription: "A statement piece inspired by heritage designs.",
    price: 89000, category: { _id: 'cat4', name: "Bracelets", slug: "bracelets" },
    images: [{ url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isTrending: true
  },
  {
    _id: "dummy_b3", name: "Diamond Tennis Bracelet", slug: "diamond-tennis-bracelet",
    shortDescription: "The ultimate luxury staple.",
    price: 250000, category: { _id: 'cat4', name: "Bracelets", slug: "bracelets" },
    images: [{ url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600", isDefault: true }],
    isNewArrival: true
  }
];
