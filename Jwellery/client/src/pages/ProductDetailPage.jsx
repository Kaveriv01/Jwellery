import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Star, Shield, Truck, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, Package, Plus, Minus, Check, MapPin, ChevronDown, Play
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
  const [selectedVariant, setSelectedVariant] = useState({ size: '', color: '' });
  const [zoomed, setZoomed] = useState(false);
  const [pincode, setPincode] = useState('');
  
  // Accordion states
  const [openAccordion, setOpenAccordion] = useState('details');
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div className="skeleton aspect-[4/5] rounded-[2px]" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className={`skeleton h-${i === 0 ? 8 : 4} rounded-[2px]`} />)}
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
    videoUrl, videoPoster
  } = product;

  // Build media gallery supporting video injection
  const mediaItems = images.map(img => ({ type: 'image', url: img.url }));
  if (videoUrl) {
    mediaItems.splice(Math.min(2, mediaItems.length), 0, { type: 'video', url: videoUrl, poster: videoPoster });
  }

  const discountPercent = getDiscountPercent(price, discountPrice);
  const effectivePrice = discountPrice || price;
  const isOutOfStock = false; // Forced to false so all items are available
  const wishlisted = isWishlisted(_id);
  const uniqueSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const uniqueColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (uniqueSizes.length > 0 && !selectedVariant.size) {
      toast.error('Please select a size');
      return;
    }
    if (uniqueColors.length > 0 && !selectedVariant.color) {
      toast.error('Please select a color/finish');
      return;
    }
    addToCart({ productId: _id, quantity, variant: selectedVariant });
    toast.success('Added to your bag');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (uniqueSizes.length > 0 && !selectedVariant.size) {
      toast.error('Please select a size');
      return;
    }
    if (uniqueColors.length > 0 && !selectedVariant.color) {
      toast.error('Please select a color/finish');
      return;
    }
    addToCart({ productId: _id, quantity, variant: selectedVariant });
    navigate('/checkout');
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
        <nav className="text-[10px] lg:text-[11px] text-[#756B62] mb-6 flex items-center gap-2 uppercase tracking-widest font-medium">
          <span className="hover:text-[#35050D] cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} className="text-[#756B62]/60" />
          <span className="hover:text-[#35050D] cursor-pointer" onClick={() => navigate('/products')}>All Jewelry</span>
          {category && (
            <><ChevronRight size={10} className="text-[#756B62]/60" /><span className="hover:text-[#35050D] cursor-pointer" onClick={() => navigate(`/category/${category.slug}`)}>{category.name}</span></>
          )}
          <ChevronRight size={10} className="text-[#756B62]/60" />
          <span className="text-[#35050D] truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 xl:gap-16">
          {/* ── Images ───────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#FAF6EE] flex items-center justify-center group overflow-hidden border border-[#FAF6EE] rounded-[2px]">
              <AnimatePresence mode="wait">
                {mediaItems[selectedImage]?.type === 'video' ? (
                  <motion.video
                    key={selectedImage}
                    src={mediaItems[selectedImage].url}
                    poster={mediaItems[selectedImage].poster}
                    controls
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                ) : (
                  <motion.img
                    key={selectedImage}
                    src={mediaItems[selectedImage]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'}
                    alt={`${name} - media ${selectedImage + 1}`}
                    className="w-full h-full object-cover mix-blend-multiply"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#35050D] text-[#F7F3EA] text-[9px] font-medium px-2.5 py-1 uppercase tracking-widest rounded-[2px]">
                  {discountPercent}% OFF
                </span>
              )}
              
              {/* Heart Icon Overlay */}
              <button
                onClick={() => toggleWishlist({ productId: _id })}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#FAF6EE] flex items-center justify-center text-[#35050D]/70 hover:text-[#C7A56A] transition-colors shadow-sm z-10"
              >
                <Heart size={18} className={wishlisted ? 'fill-[#C7A56A] text-[#C7A56A]' : ''} />
              </button>
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                {mediaItems.map((media, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 snap-start border-[1.5px] rounded-[2px] overflow-hidden ${selectedImage === i ? 'border-[#35050D]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    {media.type === 'video' ? (
                      <>
                        <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50 mb-1">
                            <Play size={10} fill="white" className="text-white ml-0.5" />
                          </div>
                          <span className="text-[8px] text-white font-medium tracking-widest">VIDEO</span>
                        </div>
                      </>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ─────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div>
              <h1 className="text-[22px] md:text-[25px] lg:text-[28px] text-[#35050D] font-normal leading-tight tracking-wide mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</h1>
              {shortDescription && (
                <p className="text-[12px] md:text-[13px] text-[#756B62] leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {shortDescription}
                </p>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                {numReviews > 0 ? (
                  <div className="flex items-center gap-1 text-[13px] text-[#756B62]">
                    <span className="flex items-center text-[#C7A56A]"><Star size={13} fill="currentColor" /> <span className="ml-1 font-medium">{ratings.toFixed(1)}</span></span>
                    <span className="mx-1">•</span>
                    <span className="underline cursor-pointer hover:text-[#35050D] transition-colors">Read {numReviews} Reviews</span>
                  </div>
                ) : (
                  <span className="text-[13px] text-[#756B62]/60">No reviews yet</span>
                )}
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="text-[20px] lg:text-[24px] font-medium text-[#35050D]">{formatPrice(effectivePrice)}</span>
                {discountPrice && (
                  <span className="text-[14px] lg:text-[16px] text-[#756B62] line-through">{formatPrice(price)}</span>
                )}
              </div>
              <p className="text-[10px] text-[#756B62]/80 mt-1 uppercase tracking-wider">Inclusive of all taxes</p>
            </div>

            {/* Pincode Checker */}
            <div className="bg-[#F7F3EA]/40 p-4 rounded-[2px] border border-[#FAF6EE]">
              <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#756B62] mb-3">
                <MapPin size={13} /> Check Delivery Date
              </label>
              <div className="flex bg-white border border-[#FAF6EE] rounded-[2px]">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-3 text-[13px] text-[#332B27] outline-none bg-transparent"
                />
                <button onClick={checkPincode} className="px-6 text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] text-[#35050D] hover:text-[#C7A56A] border-l border-[#FAF6EE] transition-colors">
                  Check
                </button>
              </div>
            </div>

            {/* Selectors */}
            <div className="space-y-5 pt-2">
              {uniqueSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#332B27]">Select Size</label>
                    <span className="text-[10px] uppercase text-[#756B62] underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                        className={`w-12 h-12 flex items-center justify-center text-[12px] font-medium rounded-[2px] border transition-all ${
                          selectedVariant.size === size 
                            ? 'border-[#35050D] bg-[#35050D] text-white' 
                            : 'border-[#FAF6EE] bg-white text-[#332B27] hover:border-[#C7A56A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {uniqueColors.length > 0 && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#332B27] mb-3">Select Finish</label>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                        className={`px-6 py-3 flex items-center justify-center text-[12px] font-medium rounded-[2px] border transition-all ${
                          selectedVariant.color === color 
                            ? 'border-[#35050D] bg-[#35050D] text-white' 
                            : 'border-[#FAF6EE] bg-white text-[#332B27] hover:border-[#C7A56A]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#332B27] mb-3">Quantity</label>
                <div className="inline-flex items-center border border-[#FAF6EE] rounded-[2px] bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#756B62] hover:text-[#35050D] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-[13px] font-medium text-[#332B27]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#756B62] hover:text-[#35050D] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 bg-white border border-[#35050D] text-[#35050D] text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] py-4 flex items-center justify-center gap-2 transition-all duration-[250ms] hover:bg-[#FAF6EE] rounded-[2px] disabled:opacity-60"
              >
                <ShoppingBag size={15} />
                {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </motion.button>
              
              <motion.button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 bg-[#35050D] hover:bg-[#4A0712] text-[#F7F3EA] text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] py-4 flex items-center justify-center transition-all duration-[250ms] border border-[#35050D] hover:border-[#4A0712] rounded-[2px] disabled:opacity-60"
              >
                Buy Now
              </motion.button>
            </div>

            <button 
              onClick={() => toggleWishlist({ productId: _id })}
              className="mt-4 flex items-center justify-center gap-2 w-full text-[11px] font-medium uppercase tracking-[0.12em] text-[#756B62] hover:text-[#35050D] transition-colors py-2 group"
            >
              <Heart size={14} className={`transition-transform group-hover:scale-110 ${wishlisted ? 'fill-[#35050D] text-[#35050D]' : ''}`} />
              {wishlisted ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}
            </button>

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
            <div className="grid grid-cols-3 gap-4 bg-[#FAF6EE]/50 p-5 border border-[#FAF6EE] rounded-[2px]">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={22} strokeWidth={1} className="text-[#C7A56A]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#332B27]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw size={22} strokeWidth={1} className="text-[#C7A56A]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#332B27]">30 Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield size={22} strokeWidth={1} className="text-[#C7A56A]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#332B27]">Lifetime Exchange</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* ── The Story Section ────────────────────────────────────────── */}
        <div className="mt-32 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="aspect-[4/5] bg-[#FAF6EE] overflow-hidden rounded-[2px]"
            >
              <img src={mediaItems[1]?.url || mediaItems[0]?.url || 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e'} alt="Story" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-[26px] md:text-[32px] text-[#35050D] mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                The {name.split(' ')[0]} Story
              </h2>
              <p className="text-[14px] text-[#756B62] leading-relaxed max-w-md font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {description || `Inspired by the first light of dawn, this piece captures a quiet brilliance through sculpted gold and luminous elements. A delicate expression of light designed to transcend seasons.`}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Crafted For You Section ──────────────────────────────────── */}
        <div className="my-24 border-y border-[#FAF6EE] py-16">
          <div className="text-center mb-12">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#756B62]">Crafted For You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <div className="text-center">
              <span className="text-[10px] text-[#C7A56A] font-medium tracking-[0.2em] mb-3 block">01 — PRECISION</span>
              <p className="text-[12px] text-[#756B62] font-light leading-relaxed">Every stone is carefully selected and precisely set to ensure maximum brilliance and lasting quality.</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#C7A56A] font-medium tracking-[0.2em] mb-3 block">02 — CRAFTSMANSHIP</span>
              <p className="text-[12px] text-[#756B62] font-light leading-relaxed">Each piece is finished by skilled artisans, continuing centuries of fine jewellery traditions.</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#C7A56A] font-medium tracking-[0.2em] mb-3 block">03 — TIMELESSNESS</span>
              <p className="text-[12px] text-[#756B62] font-light leading-relaxed">Designed with restraint and elegance to transcend passing seasons and occasions.</p>
            </div>
          </div>
        </div>

        {/* ── Style It With & Complete Your Look ──────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-20">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#FAF6EE] pb-4">
                <h2 className="text-[20px] lg:text-[24px] font-normal tracking-wide text-[#35050D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Style It With</h2>
                <Link to="/products" className="text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] text-[#756B62] hover:text-[#35050D] border-b border-transparent hover:border-[#35050D] pb-0.5 transition-all duration-300">View All</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#FAF6EE] pb-4">
                <h2 className="text-[20px] lg:text-[24px] font-normal tracking-wide text-[#35050D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Complete Your Look</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {relatedProducts.slice(0, 4).reverse().map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#FAF6EE] pb-4">
                <h2 className="text-[20px] lg:text-[24px] font-normal tracking-wide text-[#35050D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recently Viewed</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── Customer Reviews ──────────────────────────────────────────── */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <h2 className="text-[23px] sm:text-[27px] lg:text-[32px] font-normal tracking-wide text-[#35050D] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Customer Reviews</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-[#C7A56A]">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill={i < Math.round(ratings) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[13px] font-medium text-[#35050D]">{ratings.toFixed(1)} / 5</span>
              <span className="text-[13px] text-[#756B62]/70">({numReviews} reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsData?.reviews?.length === 0 ? (
              <p className="text-center col-span-full text-[13px] text-[#756B62] py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviewsData?.reviews?.map((review) => (
                <div key={review._id} className="bg-[#FAF6EE]/30 border border-[#FAF6EE] p-6 rounded-[2px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#35050D] font-bold uppercase border border-[#FAF6EE] text-[13px]">
                          {review.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#332B27]">{review.user?.name}</p>
                          <p className="text-[10px] text-[#756B62]/80 uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex text-[#C7A56A]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    {review.title && <h4 className="font-medium text-[#332B27] text-sm mb-2">{review.title}</h4>}
                    <p className="text-[13px] text-[#756B62] font-light leading-relaxed mb-4">{review.comment}</p>
                  </div>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-[10px] text-[#C7A56A] font-medium uppercase tracking-widest mt-2 pt-4 border-t border-[#FAF6EE]">
                      <Check size={11} /> Verified Buyer
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── Pre Footer Banner ─────────────────────────────────────────── */}
      <div className="w-full bg-[#4A0712] relative overflow-hidden mt-20 md:h-[400px] flex">
        <div className="container-luxury flex flex-col md:flex-row items-stretch justify-between relative z-10 w-full px-0 md:px-8">
          
          {/* Left Side - Icons */}
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-1 py-16 md:py-0 relative z-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-[85px] h-[85px] rounded-full border-[1.5px] border-[#C7A56A] flex items-center justify-center text-[#C7A56A] bg-[#4A0712] shadow-[0_0_15px_rgba(181,154,104,0.15)] relative">
                <div className="absolute inset-1 rounded-full border border-[#C7A56A]/30"></div>
                <Shield size={30} strokeWidth={1.2} />
              </div>
              <span className="text-[#C7A56A] text-[11px] font-medium tracking-[0.12em] uppercase">Anti-Tarnish</span>
            </div>
            
            <div className="w-[1px] h-12 bg-[#C7A56A]/30 hidden md:block"></div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-[85px] h-[85px] rounded-full border-[1.5px] border-[#C7A56A] flex items-center justify-center text-[#C7A56A] bg-[#4A0712] shadow-[0_0_15px_rgba(181,154,104,0.15)] relative">
                <div className="absolute inset-1 rounded-full border border-[#C7A56A]/30"></div>
                <span className="text-2xl font-semibold text-[#C7A56A]">18<span className="text-sm font-medium">Kt</span></span>
              </div>
              <span className="text-[#C7A56A] text-[11px] font-medium tracking-[0.12em] uppercase">Thick Plating</span>
            </div>
            
            <div className="w-[1px] h-12 bg-[#C7A56A]/30 hidden md:block"></div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-[85px] h-[85px] rounded-full border-[1.5px] border-[#C7A56A] flex items-center justify-center text-[#C7A56A] bg-[#4A0712] shadow-[0_0_15px_rgba(181,154,104,0.15)] relative">
                <div className="absolute inset-1 rounded-full border border-[#C7A56A]/30"></div>
                <Heart size={30} strokeWidth={1.2} />
              </div>
              <span className="text-[#C7A56A] text-[11px] font-medium tracking-[0.12em] uppercase">Skin Safe</span>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex-1 relative hidden md:block">
            {/* Gradient Overlay for smooth blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A0712] via-[#4A0712]/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A0712] via-transparent to-transparent z-10" />
            <img 
              src="https://i.pinimg.com/originals/b7/c5/40/b7c540989f6b4d372d6fc713d2f95fc7.jpg" 
              alt="Shraddha Kapoor" 
              className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
            />
          </div>
        </div>
      </div>

      {/* ── Sticky Mobile Purchase Bar ───────────────────────────────── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#FAF6EE] p-4 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-[60] flex items-center justify-between lg:hidden"
          >
            <div className="flex flex-col truncate pr-4">
              <span className="text-[14px] font-medium text-[#35050D] truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</span>
              <span className="text-[12px] text-[#756B62] font-medium">{formatPrice(effectivePrice)}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className="bg-[#35050D] text-[#F7F3EA] text-[10px] font-medium uppercase tracking-[0.12em] px-8 py-3 rounded-[2px] whitespace-nowrap active:scale-95 transition-transform"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-[#FAF6EE]">
      <button 
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-[13px] font-medium tracking-wide text-[#332B27]">{title}</span>
        <ChevronDown size={15} className={`text-[#756B62]/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
