export const APP_NAME = 'TARINI';
export const APP_TAGLINE = 'Timeless Luxury Jewellery';
export const APP_DESCRIPTION = 'Elegant. Timeless. Luxury. Indian Heritage meets Modern Fashion.';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
export const APP_INSTAGRAM = '@tarini.jewellery';

export const NAV_CATEGORIES = [
  {
    label: 'Rings',
    slug: 'rings',
    image: '/images/rings-banner.png',
    subcategories: [
      { label: 'Diamond Rings', slug: 'diamond-rings' },
      { label: 'Gold Rings', slug: 'gold-rings' },
      { label: 'Silver Rings', slug: 'silver-rings' },
      { label: 'Engagement Rings', slug: 'engagement-rings' },
    ],
  },
  {
    label: 'Necklaces',
    slug: 'necklaces',
    image: '/images/necklace-banner-floral.png',
    subcategories: [
      { label: 'Gold Chains', slug: 'gold-chains' },
      { label: 'Pendants', slug: 'pendants' },
      { label: 'Mangalsutra', slug: 'mangalsutra' },
      { label: 'Diamond Necklaces', slug: 'diamond-necklaces' },
    ],
  },
  {
    label: 'Earrings',
    slug: 'earrings',
    image: '/images/banner-earrings.png',
    subcategories: [
      { label: 'Studs', slug: 'studs' },
      { label: 'Jhumkas', slug: 'jhumkas' },
      { label: 'Hoops', slug: 'hoops' },
      { label: 'Drop Earrings', slug: 'drop-earrings' },
    ],
  },
  {
    label: 'Bracelets',
    slug: 'bracelets',
    image: '/images/banner-bracelets.png',
    subcategories: [
      { label: 'Bangles', slug: 'bangles' },
      { label: 'Tennis Bracelets', slug: 'tennis-bracelets' },
      { label: 'Charm Bracelets', slug: 'charm-bracelets' },
    ],
  },
  {
    label: 'Collections',
    slug: 'collections',
    image: '/images/banner-collections.png',
    subcategories: [
      { label: 'Bridal Collection', slug: 'wedding' },
      { label: 'Daily Wear', slug: 'daily-wear' },
      { label: 'Men\'s', slug: 'men' },
      { label: 'Gift Sets', slug: 'gift-sets' },
    ],
  },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Top Rated' },
];

export const MATERIAL_OPTIONS = ['Gold', 'Silver', 'Platinum', 'Stainless Steel', 'Brass'];
export const GENDER_OPTIONS = ['Women', 'Men', 'Kids', 'Unisex'];
export const OCCASION_OPTIONS = ['Wedding', 'Daily Wear', 'Festive', 'Party', 'Office', 'Gift'];
export const STONE_OPTIONS = ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Cubic Zirconia', 'None'];

export const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 – ₹5,000', min: 2500, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: 999999 },
];

export const ORDER_STATUSES = [
  'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded',
];

export const DELIVERY_OPTIONS = [
  { value: 'standard', label: 'Standard Delivery', days: '5-7 business days', price: 99, free: true },
  { value: 'express', label: 'Express Delivery', days: '2-3 business days', price: 199, free: false },
];

export const PAYMENT_METHODS = [
  { value: 'razorpay', label: 'Razorpay', description: 'Cards, UPI, Net Banking, Wallets' },
  { value: 'stripe', label: 'Montserratnational Card', description: 'Visa, Mastercard, Amex' },
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives' },
];

export const ADDRESS_TYPES = ['home', 'work', 'other'];

export const GST_RATE = 0.03;
export const FREE_SHIPPING_THRESHOLD = 999;
export const GIFT_WRAP_CHARGE = 99;

export const SOCIAL_GALLERY = [
  {
    id: 'sg-1',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    title: 'Signature Diamonds',
    category: 'Necklaces',
    photographer: 'Sabrianna',
    photographerUrl: 'https://unsplash.com/@sabrianna',
    sourceUrl: 'https://unsplash.com/photos/a784e5dc4c8f',
    featured: true,
  },
  {
    id: 'sg-2',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    title: 'Golden Hour',
    category: 'Bracelets',
    photographer: 'Siora',
    photographerUrl: 'https://unsplash.com/@siora',
    sourceUrl: 'https://unsplash.com/photos/460bfbe1220a',
  },
  {
    id: 'sg-3',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    title: 'Everyday Elegance',
    category: 'Earrings',
    photographer: 'Kateryna Hliznitsova',
    photographerUrl: 'https://unsplash.com/@kateryna',
    sourceUrl: 'https://unsplash.com/photos/ab7c9ab60908',
  },
  {
    id: 'sg-4',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    title: 'The Promise',
    category: 'Rings',
    photographer: 'Zoe',
    photographerUrl: 'https://unsplash.com/@zoe',
    sourceUrl: 'https://unsplash.com/photos/247f67b3557e',
  },
  {
    id: 'sg-5',
    image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80',
    title: 'Stacked Luxury',
    category: 'Rings',
    photographer: 'Cornelia Ng',
    photographerUrl: 'https://unsplash.com/@cornelia',
    sourceUrl: 'https://unsplash.com/photos/e4c3d3fd629d',
  },
  {
    id: 'sg-6',
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80',
    title: 'Editorial Styling',
    category: 'Editorial',
    photographer: 'Taylor Smith',
    photographerUrl: 'https://unsplash.com/@taylor',
    sourceUrl: 'https://unsplash.com/photos/7b38e7cfac36',
  },
  {
    id: 'sg-7',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
    title: 'Modern Details',
    category: 'Lifestyle',
    photographer: 'Jessie',
    photographerUrl: 'https://unsplash.com/@jessie',
    sourceUrl: 'https://unsplash.com/photos/37ac01994b2a',
  },
  {
    id: 'sg-8',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    title: 'Minimalist Grace',
    category: 'Lifestyle',
    photographer: 'Evelyn',
    photographerUrl: 'https://unsplash.com/@evelyn',
    sourceUrl: 'https://unsplash.com/photos/7a88fb7ce338',
  },
  {
    id: 'sg-9',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
    title: 'Heirloom Pieces',
    category: 'Pendants',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    sourceUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e',
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The quality is absolutely stunning! My diamond ring exceeded all my expectations. The packaging was luxurious and delivery was super fast. TARINI has redefined jewellery shopping for me.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    initials: 'PS',
    verified: true,
    purchase: 'Solitaire Diamond Ring',
  },
  {
    id: 2,
    name: 'Anjali Mehta',
    location: 'Delhi',
    rating: 5,
    text: 'I bought a necklace as a wedding gift and everyone asked where I got it from. The craftsmanship is truly world-class. Each piece feels like a museum artifact.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    initials: 'AM',
    verified: true,
    purchase: 'Gold Layered Necklace',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    location: 'Bangalore',
    rating: 5,
    text: 'Bought earrings for my wife\'s anniversary and she was absolutely thrilled! The certificate of authenticity gives such confidence. Will always shop from TARINI.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    initials: 'RV',
    verified: true,
    purchase: 'Pearl Drop Earrings',
  },
  {
    id: 4,
    name: 'Deepika Nair',
    location: 'Chennai',
    rating: 5,
    text: 'Excellent collection and the customer service was outstanding. The rose gold bracelet I ordered is even more beautiful in person. Packaging is gift-ready perfection!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    initials: 'DN',
    verified: true,
    purchase: 'Rose Gold Bracelet',
  },
  {
    id: 5,
    name: 'Meera Krishnan',
    location: 'Hyderabad',
    rating: 5,
    text: 'The bridal set I ordered for my wedding was beyond perfect. Every guest complimented the intricate craftsmanship. TARINI made my most special day even more magical.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    initials: 'MK',
    verified: true,
    purchase: 'Bridal Jewellery Set',
  },
];

export const OCCASIONS = [
  { id: 1, label: 'Wedding', slug: 'wedding', image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600&h=700&fit=crop', color: 'from-rose-900/70' },
  { id: 2, label: 'Anniversary', slug: 'anniversary', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop', color: 'from-amber-900/70' },
  { id: 3, label: 'Festival', slug: 'festive', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=700&fit=crop', color: 'from-orange-900/70' },
  { id: 4, label: 'Daily Wear', slug: 'daily-wear', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=700&fit=crop', color: 'from-stone-900/70' },
  { id: 5, label: 'Office', slug: 'office', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=700&fit=crop', color: 'from-slate-900/70' },
  { id: 6, label: 'Birthday', slug: 'birthday', image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=600&h=700&fit=crop', color: 'from-pink-900/70' },
  { id: 7, label: 'Luxury Gifts', slug: 'gift-sets', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=700&fit=crop', color: 'from-yellow-900/70' },
];

export const CRAFT_HIGHLIGHTS = [
  { value: '25+', label: 'Years of Craft' },
  { value: '10K+', label: 'Pieces Created' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '100%', label: 'BIS Certified' },
];

export const NEWSLETTER_PERKS = [
  'Early access to new collections',
  'Exclusive member discounts',
  'Styling tips & lookbooks',
  'Birthday surprise offers',
];

export const TRUST_FEATURES = [
  { icon: 'award', title: 'BIS Hallmarked', desc: 'Certified purity on all gold & silver jewellery' },
  { icon: 'truck', title: 'Free Shipping', desc: 'On all orders above ₹999' },
  { icon: 'rotate-ccw', title: '7-Day Returns', desc: 'Hassle-free returns & exchanges' },
  { icon: 'shield', title: 'Secure Payments', desc: 'SSL encrypted checkout. 100% safe.' },
];
