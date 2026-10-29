import { dummyProducts } from './dummyData';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'tarini_admin_products',
  CATEGORIES: 'tarini_admin_categories',
  ORDERS: 'tarini_admin_orders',
  CUSTOMERS: 'tarini_admin_customers',
  COUPONS: 'tarini_admin_coupons',
  BANNERS: 'tarini_admin_banners',
  REVIEWS: 'tarini_admin_reviews',
};

// Initial Categories
export const initialCategories = [
  {
    _id: 'cat1',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Bespoke bridal chokers, diamond solitaires, and layered heirloom necklaces.',
    image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500' },
    productCount: 12
  },
  {
    _id: 'cat2',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Solitaire studs, chandelier drop earrings, and modern textured hoops.',
    image: { url: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=500' },
    productCount: 8
  },
  {
    _id: 'cat3',
    name: 'Rings',
    slug: 'rings',
    description: 'Engagement solitaires, eternity bands, and imperial cocktail rings.',
    image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=500' },
    productCount: 14
  },
  {
    _id: 'cat4',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Diamond tennis bracelets, cuffs, and flexible bangle stacks.',
    image: { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500' },
    productCount: 6
  },
  {
    _id: 'cat5',
    name: 'Solitaires',
    slug: 'solitaires',
    description: 'IGI certified diamond solitaires crafted in 18k rose and yellow gold.',
    image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=500' },
    productCount: 9
  }
];

// Enrich dummyProducts with admin fields (SKU, stock, material, stone, etc.)
export const initialProducts = dummyProducts.map((p, idx) => ({
  ...p,
  sku: p.sku || `TAR-${(1000 + idx).toString()}`,
  stock: p.stock !== undefined ? p.stock : (idx % 3 === 0 ? 3 : 18),
  material: p.material || (idx % 2 === 0 ? '18k Yellow Gold' : '18k Rose Gold'),
  stone: p.stone || (idx % 2 === 0 ? 'Certified Diamond' : 'Natural Gemstone'),
  purity: p.purity || '18K',
  gender: p.gender || 'Women',
  isActive: p.isActive !== undefined ? p.isActive : true,
  ratings: 4.8 + ((idx % 3) * 0.1),
  soldCount: (idx + 1) * 8 + 14,
  description: p.description || p.shortDescription || 'Masterfully crafted luxury jewellery from the Tarini atelier, featuring hand-selected stones set in hallmarked gold.',
  createdAt: new Date(Date.now() - (idx * 3 + 1) * 86400000).toISOString(),
}));

// Initial Orders
export const initialOrders = [
  {
    _id: 'ord_1',
    orderNumber: 'TRN-8921',
    user: { _id: 'cust_1', name: 'Aarav Singhania', email: 'aarav.singhania@heritage.in', phone: '+91 98201 12345' },
    items: [
      {
        product: { _id: 'dummy_n2', name: 'Royal Sapphire Choker', sku: 'TAR-1002', price: 250000 },
        quantity: 1,
        price: 250000,
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 250000,
    shippingAmount: 0,
    discountAmount: 15000,
    finalAmount: 235000,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay (Card)',
    shippingAddress: {
      street: '14, Malabar Hill Crest, B.G. Kher Marg',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400006',
      country: 'India'
    },
    trackingNumber: 'BLUEDART-TRN-77821',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: 'ord_2',
    orderNumber: 'TRN-8922',
    user: { _id: 'cust_2', name: 'Meera Kapoor', email: 'meera.k@delhiclub.com', phone: '+91 98110 54321' },
    items: [
      {
        product: { _id: 'dummy_r1', name: 'Celeste Solitaire Ring', sku: 'TAR-1006', price: 85000 },
        quantity: 1,
        price: 85000,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 85000,
    shippingAmount: 0,
    discountAmount: 5000,
    finalAmount: 80000,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'UPI (Google Pay)',
    shippingAddress: {
      street: '88, Golf Links Enclave',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110003',
      country: 'India'
    },
    trackingNumber: 'SEQUEL-VAL-99120',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    _id: 'ord_3',
    orderNumber: 'TRN-8923',
    user: { _id: 'cust_3', name: 'Ananya Deshmukh', email: 'ananya.deshmukh@gmail.com', phone: '+91 97654 32109' },
    items: [
      {
        product: { _id: 'dummy_1', name: 'Aurelia Diamond Pendant', sku: 'TAR-1001', price: 38999 },
        quantity: 1,
        price: 38999,
        image: 'https://images.unsplash.com/photo-1633934542430-0905ccb5f050?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 38999,
    shippingAmount: 0,
    discountAmount: 0,
    finalAmount: 38999,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Net Banking (HDFC)',
    shippingAddress: {
      street: 'B-402, Koregaon Park Plaza',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      country: 'India'
    },
    trackingNumber: 'PROCESSING',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    _id: 'ord_4',
    orderNumber: 'TRN-8924',
    user: { _id: 'cust_4', name: 'Vikramaditya Rathore', email: 'vikram.rathore@jodhpur.org', phone: '+91 99280 98765' },
    items: [
      {
        product: { _id: 'dummy_b3', name: 'Diamond Tennis Bracelet', sku: 'TAR-1011', price: 250000 },
        quantity: 1,
        price: 250000,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 250000,
    shippingAmount: 0,
    discountAmount: 20000,
    finalAmount: 230000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (Amex)',
    shippingAddress: {
      street: 'Heritage Palace Road, Ratanada',
      city: 'Jodhpur',
      state: 'Rajasthan',
      postalCode: '342001',
      country: 'India'
    },
    trackingNumber: 'READY_TO_DISPATCH',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    _id: 'ord_5',
    orderNumber: 'TRN-8925',
    user: { _id: 'cust_5', name: 'Pooja Sharma', email: 'pooja.sharma@outlook.com', phone: '+91 98450 67890' },
    items: [
      {
        product: { _id: 'dummy_e1', name: 'Lumina Gold Hoop Earrings', sku: 'TAR-1004', price: 19500 },
        quantity: 1,
        price: 19500,
        image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 19500,
    shippingAmount: 0,
    discountAmount: 0,
    finalAmount: 19500,
    status: 'placed',
    paymentStatus: 'pending',
    paymentMethod: 'Cash on Delivery (Verified)',
    shippingAddress: {
      street: '22, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    trackingNumber: 'PENDING_VERIFICATION',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  }
];

// Initial Customers
export const initialCustomers = [
  {
    _id: 'cust_1',
    name: 'Aarav Singhania',
    email: 'aarav.singhania@heritage.in',
    phone: '+91 98201 12345',
    role: 'customer',
    tier: 'Platinum VIP',
    totalSpent: 485000,
    ordersCount: 3,
    isActive: true,
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    _id: 'cust_2',
    name: 'Meera Kapoor',
    email: 'meera.k@delhiclub.com',
    phone: '+91 98110 54321',
    role: 'customer',
    tier: 'Gold Elite',
    totalSpent: 265000,
    ordersCount: 4,
    isActive: true,
    createdAt: '2024-02-20T11:30:00.000Z'
  },
  {
    _id: 'cust_3',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@gmail.com',
    phone: '+91 97654 32109',
    role: 'customer',
    tier: 'Silver',
    totalSpent: 124000,
    ordersCount: 2,
    isActive: true,
    createdAt: '2024-03-10T14:15:00.000Z'
  },
  {
    _id: 'cust_4',
    name: 'Vikramaditya Rathore',
    email: 'vikram.rathore@jodhpur.org',
    phone: '+91 99280 98765',
    role: 'customer',
    tier: 'Diamond Connoisseur',
    totalSpent: 840000,
    ordersCount: 5,
    isActive: true,
    createdAt: '2023-11-05T09:00:00.000Z'
  },
  {
    _id: 'cust_5',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@outlook.com',
    phone: '+91 98450 67890',
    role: 'customer',
    tier: 'Regular Member',
    totalSpent: 48000,
    ordersCount: 1,
    isActive: true,
    createdAt: '2024-05-18T16:45:00.000Z'
  }
];

// Initial Coupons
export const initialCoupons = [
  {
    _id: 'cpn_1',
    code: 'TARINI15',
    discountType: 'percentage',
    discountValue: 15,
    minimumPurchase: 50000,
    maxDiscountAmount: 15000,
    usageLimit: 100,
    usedCount: 38,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    _id: 'cpn_2',
    code: 'ROYALGIFT',
    discountType: 'fixed',
    discountValue: 5000,
    minimumPurchase: 75000,
    maxDiscountAmount: 5000,
    usageLimit: 50,
    usedCount: 22,
    expiryDate: '2026-11-30',
    isActive: true
  },
  {
    _id: 'cpn_3',
    code: 'SOLITAIRE10',
    discountType: 'percentage',
    discountValue: 10,
    minimumPurchase: 100000,
    maxDiscountAmount: 25000,
    usageLimit: 30,
    usedCount: 14,
    expiryDate: '2026-10-31',
    isActive: true
  }
];

// Initial Banners
export const initialBanners = [
  {
    _id: 'ban_1',
    title: 'Tarini Heritage Bridal 2026',
    subtitle: 'Eternal Elegance Crafted in Hallmarked Gold',
    description: 'Immerse yourself in our newest bridal high-jewellery showcase.',
    link: '/collections',
    linkText: 'Explore Collection',
    type: 'hero',
    position: 0,
    isActive: true,
    image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1400' }
  },
  {
    _id: 'ban_2',
    title: 'Solitaire Symphony',
    subtitle: 'Certified Diamonds With Exquisite Fire',
    description: 'IGI certified diamond solitaires curated for forever moments.',
    link: '/category/rings',
    linkText: 'Discover Rings',
    type: 'hero',
    position: 1,
    isActive: true,
    image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1400' }
  }
];

// Initial Reviews
export const initialReviews = [
  {
    _id: 'rev_1',
    product: { _id: 'dummy_r1', name: 'Celeste Solitaire Ring' },
    user: { _id: 'cust_2', name: 'Meera Kapoor', email: 'meera.k@delhiclub.com' },
    rating: 5,
    title: 'Breathtaking Brilliance',
    comment: 'The fire and sparkle of this diamond solitaire exceeded my expectations. The certification packet was sealed and complete.',
    status: 'approved',
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'rev_2',
    product: { _id: 'dummy_n2', name: 'Royal Sapphire Choker' },
    user: { _id: 'cust_1', name: 'Aarav Singhania', email: 'aarav.singhania@heritage.in' },
    rating: 5,
    title: 'Royalty Personified',
    comment: 'Purchased for my wife on our anniversary. The deep royal blue hue of the sapphires against 18k gold is simply breathtaking.',
    status: 'approved',
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: 'rev_3',
    product: { _id: 'dummy_1', name: 'Aurelia Diamond Pendant' },
    user: { _id: 'cust_3', name: 'Ananya Deshmukh', email: 'ananya.deshmukh@gmail.com' },
    rating: 4,
    title: 'Subtle and Elegant',
    comment: 'Very delicate and pretty piece. Packaging was pristine with tamper-proof security seals.',
    status: 'pending',
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// Helper to get from storage or fallback
function getFromStorage(key, defaultData) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch {
    return defaultData;
  }
}

// Helper to save to storage
function saveToStorage(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
}

// Storage Accessors
export const adminStore = {
  getProducts: () => getFromStorage(STORAGE_KEYS.PRODUCTS, initialProducts),
  saveProducts: (data) => saveToStorage(STORAGE_KEYS.PRODUCTS, data),

  getCategories: () => getFromStorage(STORAGE_KEYS.CATEGORIES, initialCategories),
  saveCategories: (data) => saveToStorage(STORAGE_KEYS.CATEGORIES, data),

  getOrders: () => {
    const orders = getFromStorage(STORAGE_KEYS.ORDERS, initialOrders);
    return orders.map(o => ({
      ...o,
      totalPrice: o.totalPrice || o.finalAmount || o.totalAmount || 0
    }));
  },
  saveOrders: (data) => saveToStorage(STORAGE_KEYS.ORDERS, data),

  getCustomers: () => getFromStorage(STORAGE_KEYS.CUSTOMERS, initialCustomers),
  saveCustomers: (data) => saveToStorage(STORAGE_KEYS.CUSTOMERS, data),

  getCoupons: () => getFromStorage(STORAGE_KEYS.COUPONS, initialCoupons),
  saveCoupons: (data) => saveToStorage(STORAGE_KEYS.COUPONS, data),

  getBanners: () => getFromStorage(STORAGE_KEYS.BANNERS, initialBanners),
  saveBanners: (data) => saveToStorage(STORAGE_KEYS.BANNERS, data),

  getReviews: () => getFromStorage(STORAGE_KEYS.REVIEWS, initialReviews),
  saveReviews: (data) => saveToStorage(STORAGE_KEYS.REVIEWS, data),

  getAnalytics: () => {
    const orders = adminStore.getOrders();
    const products = adminStore.getProducts();
    const customers = adminStore.getCustomers();
    const reviews = adminStore.getReviews();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.finalAmount || 0), 4250000);
    const lowStockCount = products.filter(p => (p.stock || 0) <= 5).length;
    const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

    return {
      stats: {
        revenue: { total: totalRevenue, growth: 18.4 },
        orders: { total: orders.length + 142, today: 6 },
        products: { total: products.length, lowStock: lowStockCount },
        users: { total: customers.length + 79, newThisMonth: 12 },
        pendingReviews: pendingReviewsCount
      },
      revenueChart: [
        { month: 'Nov', revenue: 2850000, orders: 84 },
        { month: 'Dec', revenue: 3950000, orders: 112 },
        { month: 'Jan', revenue: 3420000, orders: 95 },
        { month: 'Feb', revenue: 4100000, orders: 120 },
        { month: 'Mar', revenue: 4450000, orders: 134 },
        { month: 'Apr', revenue: totalRevenue, orders: 148 }
      ],
      orderStatus: [
        { _id: 'delivered', name: 'Delivered', count: 82, value: 82 },
        { _id: 'shipped', name: 'Shipped', count: 31, value: 31 },
        { _id: 'processing', name: 'Processing', count: 24, value: 24 },
        { _id: 'confirmed', name: 'Confirmed', count: 18, value: 18 },
        { _id: 'placed', name: 'Placed', count: 11, value: 11 }
      ],
      topCategories: [
        { name: 'Necklaces', categoryName: 'Necklaces', count: 58, totalSold: 58, revenue: 1980000 },
        { name: 'Rings', categoryName: 'Rings', count: 44, totalSold: 44, revenue: 1420000 },
        { name: 'Bracelets', categoryName: 'Bracelets', count: 28, totalSold: 28, revenue: 980000 },
        { name: 'Earrings', categoryName: 'Earrings', count: 32, totalSold: 32, revenue: 640000 }
      ]
    };
  }
};
