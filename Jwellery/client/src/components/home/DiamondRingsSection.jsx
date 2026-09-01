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
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=90', isDefault: true },
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
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=90' },
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
    <div className="rounded-[2px] border border-[#DED3C4] overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-gray-100" />
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
      className="py-16 sm:py-24 bg-white border-t border-[#FDFBF7] overflow-hidden"
    >
      <div className="container-luxury">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-[2px] h-8 bg-[#1F1517]" />
            <div>
              <h2 className="text-[22px] sm:text-[26px] lg:text-[32px] font-normal text-[#1F1517] leading-tight flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Diamond Rings
                <Gem size={18} className="text-[#C5A059]" />
              </h2>
              <p className="text-[11px] text-[#1F1517] mt-1 font-medium tracking-[0.1em] uppercase" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                GIA Certified · BIS Hallmarked · Free Engraving
                {total > 0 && <span className="ml-1.5 text-[#1F1517] font-semibold">({total} designs)</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#EAE6DF] rounded-[2px] px-3 py-1.5">
              <SlidersHorizontal size={12} className="text-[#746760]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[10px] font-medium text-[#1F1517] bg-transparent outline-none cursor-pointer tracking-[0.1em] uppercase"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
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
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase border border-[#1F1517] text-[#1F1517] hover:bg-[#1F1517] hover:text-white rounded-[2px] px-6 py-2 transition-all duration-[300ms] ease-out shadow-sm cursor-pointer hover:scale-[1.02]"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
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
          className="relative overflow-hidden rounded-[2px] mb-12 border border-[#FDFBF7]"
          style={{ height: '180px' }}
        >
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&h=400&fit=crop&q=90"
            alt="Diamond Rings Collection"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24191A]/80 via-[#24191A]/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div>
              <p className="text-[#C5A059] text-[10px] lg:text-[11px] tracking-[0.20em] uppercase font-medium mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                ✦ GIA Certified · Conflict-Free Diamonds
              </p>
              <h3 className="text-[#FDFBF7] text-[24px] sm:text-[32px] font-normal leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Diamonds That Tell Your Story
              </h3>
              <motion.div
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="w-fit"
              >
                <Link
                  to="/products?stone=Diamond"
                  className="inline-flex items-center gap-1.5 bg-[#4A0712] text-[#FDFBF7] text-[10px] lg:text-[11px] font-medium tracking-[0.12em] uppercase rounded-[2px] px-6 py-3 transition-all duration-[300ms] ease-out hover:bg-[#1F1517] shadow-md cursor-pointer hover:scale-[1.02]"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  Shop All Diamond Rings <ArrowRight size={11} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Product Cards Grid ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
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
          className="mt-16 pt-10 border-t border-[#FDFBF7] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        >
          {[
            { label: 'GIA Certified', sub: 'Every Diamond' },
            { label: 'BIS Hallmarked', sub: '18K / 22K Gold' },
            { label: 'Free Engraving', sub: 'On All Rings' },
            { label: 'Lifetime Warranty', sub: 'Quality Promise' },
          ].map(({ label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#EAE6DF] flex items-center justify-center mb-2 mx-auto">
                <Gem size={16} className="text-[#C5A059]" />
              </div>
              <p className="text-[12px] font-medium text-[#24191A] tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{label}</p>
              <p className="text-[10px] text-[#1F1517] font-light mt-1 tracking-[0.1em] uppercase" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{sub}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}
