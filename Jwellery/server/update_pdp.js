const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'client', 'src', 'pages', 'ProductDetailPage.jsx');

const code = `import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Star, Shield, Truck, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, Package, Plus, Minus, Check, MapPin, ChevronDown
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/otherServices';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import { formatPrice, getDiscountPercent, formatDate } from '../lib/utils';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [zoomed, setZoomed] = useState(false);
  const [pincode, setPincode] = useState('');
  
  // Accordion states
  const [openAccordion, setOpenAccordion] = useState('details');

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug).then((r) => r.data),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', data?.product?._id],
    queryFn: () => reviewService.getProductReviews(data.product._id, { limit: 10 }).then((r) => r.data),
    enabled: !!data?.product?._id,
  });

  if (isLoading) {
    return (
      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className={\`skeleton h-\${i === 0 ? 8 : 4} rounded\`} />)}
          </div>
        </div>
      </div>
    );
  }

  const { product, relatedProducts = [] } = data || {};
  if (!product) return <div className="container-luxury py-20 text-center text-gray-500">Product not found.</div>;

  const {
    _id, name, description, shortDescription, price, discountPrice,
    images = [], variants = [], stock, material, purity, weight, stone,
    gender, occasion, ratings = 0, numReviews = 0, sku, category,
  } = product;

  const discountPercent = getDiscountPercent(price, discountPrice);
  const effectivePrice = discountPrice || price;
  const isOutOfStock = stock === 0;
  const wishlisted = isWishlisted(_id);
  const uniqueSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const uniqueColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ productId: _id, quantity, variant: selectedVariant });
  };

  const checkPincode = () => {
    if (pincode.length === 6) toast.success('Delivery available by ' + new Date(Date.now() + 3*24*60*60*1000).toDateString());
    else toast.error('Enter valid 6 digit pincode');
  };

  return (
    <>
      <Helmet>
        <title>{name} — Jwellery</title>
        <meta name="description" content={shortDescription || description?.slice(0, 160)} />
      </Helmet>

      <div className="container-luxury py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest font-medium">
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} />
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/products')}>All Jewelry</span>
          {category && (
            <><ChevronRight size={10} /><span className="hover:text-black cursor-pointer" onClick={() => navigate(\`/category/\${category.slug}\`)}>{category.name}</span></>
          )}
          <ChevronRight size={10} />
          <span className="text-black truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 xl:gap-16">
          {/* ── Images ───────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#F9F9F9] flex items-center justify-center group overflow-hidden">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]?.url || '/placeholder.jpg'}
                alt={\`\${name} - image \${selectedImage + 1}\`}
                className="w-full h-full object-contain p-10 mix-blend-multiply"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}
              
              {/* Heart Icon Overlay */}
              <button
                onClick={() => toggleWishlist({ productId: _id })}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'text-red-500' : ''} />
              </button>

              {/* Dots Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={\`w-2 h-2 rounded-full transition-all \${selectedImage === i ? 'bg-black w-4' : 'bg-gray-300'}\`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Info ─────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl text-gray-900 font-medium tracking-wide mb-2">{name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                {numReviews > 0 ? (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="flex items-center text-[#E5B55C]"><Star size={14} fill="currentColor" /> {ratings.toFixed(1)}</span>
                    <span className="mx-1">•</span>
                    <span className="underline cursor-pointer">Read {numReviews} Reviews</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No reviews yet</span>
                )}
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">{formatPrice(effectivePrice)}</span>
                {discountPrice && (
                  <span className="text-base text-gray-400 line-through">{formatPrice(price)}</span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wide">Inclusive of all taxes</p>
            </div>

            {/* Pincode Checker */}
            <div className="bg-[#F8F8F8] p-4 rounded-sm border border-gray-100">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
                <MapPin size={14} /> Check Delivery Date
              </label>
              <div className="flex bg-white border border-gray-200">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
                />
                <button onClick={checkPincode} className="px-6 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-black border-l border-gray-200">
                  Check
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#1C1C1C] hover:bg-black text-white text-sm font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <ShoppingBag size={18} />
              {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'ADD TO CART'}
            </motion.button>

            {/* Accordions */}
            <div className="border-t border-gray-200 mt-8 pt-4 space-y-2">
              <AccordionItem 
                title="Product Details" 
                isOpen={openAccordion === 'details'} 
                onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
              >
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description}
                  <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                    {sku && <div><span className="font-semibold text-gray-800">SKU:</span> {sku}</div>}
                    {material && <div><span className="font-semibold text-gray-800">Material:</span> {material}</div>}
                    {purity && <div><span className="font-semibold text-gray-800">Purity:</span> {purity}</div>}
                    {stone && <div><span className="font-semibold text-gray-800">Stone:</span> {stone}</div>}
                  </div>
                </div>
              </AccordionItem>
              
              <AccordionItem 
                title="Delivery & Returns" 
                isOpen={openAccordion === 'delivery'} 
                onClick={() => setOpenAccordion(openAccordion === 'delivery' ? '' : 'delivery')}
              >
                <div className="text-sm text-gray-600 space-y-2">
                  <p>🚚 Free standard shipping on orders over ₹999.</p>
                  <p>⚡ Express delivery available at checkout.</p>
                  <p>🔄 Hassle-free 30-day returns and exchanges.</p>
                </div>
              </AccordionItem>
            </div>

            {/* Bottom Assurance */}
            <div className="grid grid-cols-3 gap-4 bg-[#FAF9F5] p-5 border border-[#F0EBE0]">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={24} strokeWidth={1} className="text-[#C6A15B]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-700">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw size={24} strokeWidth={1} className="text-[#C6A15B]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-700">30 Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield size={24} strokeWidth={1} className="text-[#C6A15B]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-700">Lifetime Exchange</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* ── Style It With & Complete Your Look ──────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-20">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-xl font-medium tracking-wide text-gray-900">Style It With</h2>
                <Link to="/products" className="text-xs uppercase tracking-widest font-semibold text-gray-500 hover:text-black">View All</Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-xl font-medium tracking-wide text-gray-900">Complete Your Look</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).reverse().map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-xl font-medium tracking-wide text-gray-900">Recently Viewed</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── Customer Reviews ──────────────────────────────────────────── */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium tracking-wide text-gray-900 mb-2">Customer Reviews</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-[#E5B55C]">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(ratings) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-sm font-medium">{ratings.toFixed(1)} / 5</span>
              <span className="text-sm text-gray-400">({numReviews} reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsData?.reviews?.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviewsData?.reviews?.map((review) => (
                <div key={review._id} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold uppercase">
                          {review.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.user?.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex text-[#E5B55C]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    {review.title && <h4 className="font-semibold text-gray-800 text-sm mb-2">{review.title}</h4>}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.comment}</p>
                  </div>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium uppercase tracking-widest mt-2 pt-4 border-t border-gray-50">
                      <Check size={12} /> Verified Buyer
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── Pre Footer Banner ─────────────────────────────────────────── */}
      <div className="w-full bg-[#111111] py-16 relative overflow-hidden mt-20">
        <div className="container-luxury flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="flex items-center gap-10 md:gap-20 justify-center flex-1 py-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full border border-[#C6A15B] flex items-center justify-center text-[#C6A15B]">
                <Shield size={32} strokeWidth={1} />
              </div>
              <span className="text-[#C6A15B] text-xs font-bold uppercase tracking-widest">100% Certified</span>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full border border-[#C6A15B] flex items-center justify-center text-[#C6A15B]">
                <RotateCcw size={32} strokeWidth={1} />
              </div>
              <span className="text-[#C6A15B] text-xs font-bold uppercase tracking-widest">Lifetime Exchange</span>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full border border-[#C6A15B] flex items-center justify-center text-[#C6A15B]">
                <Package size={32} strokeWidth={1} />
              </div>
              <span className="text-[#C6A15B] text-xs font-bold uppercase tracking-widest">Secure Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-gray-200">
      <button 
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-sm font-semibold tracking-wide text-gray-900">{title}</span>
        <ChevronDown size={16} className={\`text-gray-500 transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}\`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync(file, code);
console.log('Successfully updated ProductDetailPage.jsx');
