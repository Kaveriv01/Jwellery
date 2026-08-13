import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Gem, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { productService } from '../../services/productService';

// ── Fallback data (shown while API loads or if no DB products yet) ────────────
const FALLBACK_RINGS = [
  {
    _id: 'f1', name: 'Classic Solitaire Diamond Ring', slug: 'classic-solitaire-diamond-ring',
    price: 125000, discountPrice: 112500, discountPercent: 10,
    ratings: 4.9, numReviews: 128, stock: 15,
    isFeatured: true, isBestSeller: true, isNewArrival: false, isTrending: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f2', name: 'Halo Diamond Engagement Ring', slug: 'halo-diamond-engagement-ring',
    price: 185000, discountPrice: 166500, discountPercent: 10,
    ratings: 4.8, numReviews: 94, stock: 10,
    isFeatured: true, isBestSeller: false, isNewArrival: true, isTrending: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f3', name: 'Princess Cut Diamond Ring', slug: 'princess-cut-diamond-ring',
    price: 145000, discountPrice: 130500, discountPercent: 10,
    ratings: 4.9, numReviews: 76, stock: 8,
    isFeatured: false, isBestSeller: false, isNewArrival: false, isTrending: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f4', name: 'Diamond Eternity Band Ring', slug: 'diamond-eternity-band-ring',
    price: 89000, discountPrice: 80100, discountPercent: 10,
    ratings: 4.7, numReviews: 63, stock: 20,
    isFeatured: false, isBestSeller: false, isNewArrival: false, isTrending: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f5', name: 'Marquise Diamond Cocktail Ring', slug: 'marquise-diamond-cocktail-ring',
    price: 220000, discountPrice: 198000, discountPercent: 10,
    ratings: 4.8, numReviews: 41, stock: 6,
    isFeatured: true, isBestSeller: false, isNewArrival: false, isTrending: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f6', name: 'Pear Shape Diamond Ring', slug: 'pear-shape-diamond-ring',
    price: 165000, discountPrice: 148500, discountPercent: 10,
    ratings: 4.9, numReviews: 55, stock: 9,
    isFeatured: false, isBestSeller: false, isNewArrival: true, isTrending: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f7', name: 'Emerald Cut Diamond Ring', slug: 'emerald-cut-diamond-ring',
    price: 195000, discountPrice: 175500, discountPercent: 10,
    ratings: 4.8, numReviews: 33, stock: 7,
    isFeatured: false, isBestSeller: false, isNewArrival: false, isTrending: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=600&h=600&fit=crop&q=90' },
    ]
  },
  {
    _id: 'f8', name: 'Three Stone Diamond Ring', slug: 'three-stone-diamond-ring',
    price: 245000, discountPrice: 220500, discountPercent: 10,
    ratings: 5.0, numReviews: 22, stock: 5,
    isFeatured: true, isBestSeller: true, isNewArrival: false, isTrending: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&h=600&fit=crop&q=90', isDefault: true },
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=90' },
    ]
  },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded mt-3" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DiamondRingsSection() {
  const [sortBy, setSortBy] = useState('newest');
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['diamond-rings', sortBy],
    queryFn: () => productService.getDiamondRings({ limit: 8, sortBy }).then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  // Use API data if available, otherwise fall back to static Unsplash cards
  const rings = (data?.products?.length > 0) ? data.products : FALLBACK_RINGS;
  const total = data?.total ?? FALLBACK_RINGS.length;

  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const container = { 
    hidden: {}, 
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } 
  };
  
  const item = { 
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } 
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
      className="py-12 sm:py-16 bg-white border-t border-[#FAF6EE] overflow-hidden"
    >
      <div className="container-luxury">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-[2px] h-8 bg-[#560817]" />
            <div>
              <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-normal text-[#560817] leading-tight flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Diamond Rings
                <Gem size={18} className="text-[#B08A45]" />
              </h2>
              <p className="text-[11px] text-[#746760] mt-0.5 font-light">
                GIA Certified · BIS Hallmarked · Free Engraving
                {total > 0 && <span className="ml-1.5 text-[#560817] font-medium">({total} designs)</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#F8F4EC] border border-[#FAF6EE] rounded-[2px] px-3 py-1.5">
              <SlidersHorizontal size={12} className="text-[#746760]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[11px] font-medium text-[#746760] bg-transparent outline-none cursor-pointer tracking-wider font-light"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* View All button */}
            <motion.div
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.12 }}
            >
              <Link
                to="/products?stone=Diamond"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase border border-[#560817] text-[#560817] hover:bg-[#560817] hover:text-white rounded-[2px] px-4 py-1.5 transition-all duration-[250ms] ease-out shadow-sm cursor-pointer"
              >
                View All <ArrowRight size={11} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Promo Banner ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className="relative overflow-hidden rounded-[2px] mb-8 border border-[#FAF6EE]"
          style={{ height: '150px' }}
        >
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&h=400&fit=crop&q=90"
            alt="Diamond Rings Collection"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div>
              <p className="text-[#C8A866] text-[10px] lg:text-[11px] tracking-[0.20em] uppercase font-medium mb-1.5">
                ✦ GIA Certified · Conflict-Free Diamonds
              </p>
              <h3 className="text-white text-[20px] sm:text-[24px] font-normal leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Diamonds That Tell Your Story
              </h3>
              <motion.div
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="w-fit"
              >
                <Link
                  to="/products?stone=Diamond"
                  className="inline-flex items-center gap-1.5 bg-[#560817] text-white text-[10px] lg:text-[11px] font-medium tracking-[0.12em] uppercase rounded-[2px] px-5 py-2.5 transition-all duration-[250ms] ease-out hover:bg-[#3D0610] hover:-translate-y-[2px] shadow-md border-b-2 border-transparent hover:border-[#B08A45] cursor-pointer"
                >
                  Shop All Diamond Rings <ArrowRight size={11} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Product Cards Grid ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {rings.map((ring) => (
              <motion.div key={ring._id} variants={item}>
                <ProductCard product={ring} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Mobile View All ───────────────────────────────────────────────── */}
        <div className="text-center mt-7 sm:hidden">
          <motion.div
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="inline-block"
          >
            <Link
              to="/products?stone=Diamond"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase border border-[#560817] text-[#560817] hover:bg-[#560817] hover:text-white rounded-[2px] px-6 py-2.5 transition-all duration-[250ms] ease-out hover:-translate-y-[2px] cursor-pointer"
            >
              View All Diamond Rings <ArrowRight size={11} />
            </Link>
          </motion.div>
        </div>

        {/* ── Trust Strip ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          className="mt-12 pt-8 border-t border-[#FAF6EE] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        >
          {[
            { label: 'GIA Certified', sub: 'Every Diamond' },
            { label: 'BIS Hallmarked', sub: '18K / 22K Gold' },
            { label: 'Free Engraving', sub: 'On All Rings' },
            { label: 'Lifetime Warranty', sub: 'Quality Promise' },
          ].map(({ label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <div className="w-8 h-8 rounded-full bg-[#F8F4EC] border border-[#FAF6EE] flex items-center justify-center mb-1">
                <Gem size={14} className="text-[#B08A45]" />
              </div>
              <p className="text-[12px] font-medium text-[#181516] tracking-wide">{label}</p>
              <p className="text-[11px] text-[#746760] font-light mt-0.5">{sub}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}
