import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Star, Shield, Truck, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, Package, Plus, Minus, Check, MapPin, ChevronDown, Play, X
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 skeleton aspect-square rounded-[2px]" />
          <div className="lg:col-span-5 space-y-4">
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
        <nav className="text-[10px] lg:text-[11px] text-[#1F1517] mb-8 flex items-center gap-2 uppercase tracking-widest font-medium">
          <span className="hover:text-[#C5A059] cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} className="text-[#1F1517]/40" />
          <span className="hover:text-[#C5A059] cursor-pointer transition-colors" onClick={() => navigate('/products')}>All Jewelry</span>
          {category && (
            <><ChevronRight size={10} className="text-[#1F1517]/40" /><span className="hover:text-[#C5A059] cursor-pointer transition-colors" onClick={() => navigate(`/category/${category.slug}`)}>{category.name}</span></>
          )}
          <ChevronRight size={10} className="text-[#1F1517]/40" />
          <span className="text-[#1F1517]/60 truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          {/* ── Images (Left Column span-7) ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row gap-4 h-full">
            
            {/* Desktop Vertical Thumbnails (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col gap-4 overflow-y-auto hide-scrollbar w-[80px] xl:w-[100px] flex-shrink-0">
              {mediaItems.map((media, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelectedImage(i)}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-full aspect-square flex-shrink-0 border-[1.5px] rounded-[2px] overflow-hidden transition-all ${selectedImage === i ? 'border-[#1F1517]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  {media.type === 'video' ? (
                    <>
                      <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-contain p-1" />
                      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center">
                        <Play size={14} fill="white" className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={media.url} className="w-full h-full object-contain p-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Main Large Image */}
            <div className="relative w-full aspect-square lg:aspect-auto lg:h-[700px] bg-[#FDFBF7] flex items-center justify-center group overflow-hidden border border-[#FDFBF7] rounded-[2px] cursor-crosshair">
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
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-[400ms] ease-out group-hover:scale-[1.15]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    onClick={() => setIsFullscreen(true)}
                  />
                )}
              </AnimatePresence>
              
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#1F1517] text-[#F7F3EA] text-[9px] font-medium px-3 py-1.5 uppercase tracking-widest rounded-[2px] pointer-events-none">
                  {discountPercent}% OFF
                </span>
              )}
              
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#FDFBF7] flex items-center justify-center text-[#1F1517]/70 hover:text-[#C5A059] transition-colors shadow-sm z-10 opacity-0 group-hover:opacity-100"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Mobile Horizontal Thumbnails (Hidden on desktop) */}
            <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar mt-2">
              {mediaItems.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 flex-shrink-0 snap-start border-[1.5px] rounded-[2px] overflow-hidden transition-all ${selectedImage === i ? 'border-[#1F1517]' : 'border-transparent opacity-60'}`}
                >
                  {media.type === 'video' ? (
                    <>
                      <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-contain p-1" />
                      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center">
                        <Play size={10} fill="white" className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={media.url} className="w-full h-full object-contain p-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Info (Right Column span-5) ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block mb-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Tarini Jewellers</span>
              <h1 className="text-[28px] md:text-[34px] text-[#1F1517] font-bold uppercase tracking-[0.1em] leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</h1>
              
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1 text-[12px] text-[#1F1517]">
                  <span className="flex items-center text-[#1F1517] gap-1"><Star size={12} fill="#C5A059" className="text-[#C5A059]" /> <span className="font-bold">{ratings > 0 ? ratings.toFixed(1) : '5.0'}</span></span>
                  <span className="mx-1 text-gray-300">|</span>
                  <span className="underline cursor-pointer hover:text-[#C5A059] transition-colors">{numReviews > 0 ? numReviews : 126} Reviews</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[24px] lg:text-[28px] font-bold text-[#1F1517]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{formatPrice(effectivePrice)}</span>
                {discountPrice && (
                  <span className="text-[14px] text-gray-500 line-through font-medium">{formatPrice(price)}</span>
                )}
              </div>
              
              {shortDescription && (
                <p className="text-[14px] text-[#1F1517]/80 leading-relaxed font-light mt-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  "{shortDescription}"
                </p>
              )}
            </div>

            {/* Selectors */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              {uniqueSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1F1517]">Size</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                        className={`w-12 h-12 flex items-center justify-center text-[12px] font-bold rounded-[2px] border transition-all ${
                          selectedVariant.size === size 
                            ? 'border-[#1F1517] bg-[#1F1517] text-white' 
                            : 'border-gray-200 bg-white text-[#1F1517] hover:border-[#C5A059]'
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
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1F1517] mb-3">Metal / Color</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                        className={`px-5 py-2.5 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider rounded-[2px] border transition-all ${
                          selectedVariant.color === color 
                            ? 'border-[#1F1517] bg-[#1F1517] text-white' 
                            : 'border-gray-200 bg-white text-[#1F1517] hover:border-[#C5A059]'
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
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1F1517] mb-3">Quantity</label>
                <div className="inline-flex items-center border border-gray-200 rounded-[2px] bg-white w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-10 flex items-center justify-center text-[#1F1517] hover:text-[#C5A059] transition-colors"><Minus size={14} /></button>
                  <span className="flex-1 text-center text-[13px] font-bold text-[#1F1517]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-10 flex items-center justify-center text-[#1F1517] hover:text-[#C5A059] transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="mt-6 border border-gray-200 p-4 rounded-[2px]">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1F1517] mb-3">
                <Truck size={14} /> Check Delivery Availability
              </label>
              <div className="flex border border-gray-200 rounded-[2px] overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-3 text-[12px] font-medium text-[#1F1517] outline-none bg-white"
                />
                <button onClick={checkPincode} className="px-6 bg-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.1em] text-[#1F1517] hover:bg-[#C5A059] hover:text-white transition-colors border-l border-gray-200">
                  Check
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-[#1F1517]/70 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Check size={12} className="text-[#C5A059]" /> Free shipping</span>
                <span className="flex items-center gap-1.5"><Check size={12} className="text-[#C5A059]" /> Secure packaging</span>
                <span className="flex items-center gap-1.5"><Check size={12} className="text-[#C5A059]" /> Easy returns</span>
                <span className="flex items-center gap-1.5"><Check size={12} className="text-[#C5A059]" /> Authentic Tarini</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-[#1F1517] border border-[#1F1517] text-white text-[11px] font-bold uppercase tracking-[0.15em] py-4 flex items-center justify-center gap-2 transition-all hover:bg-black rounded-[2px] disabled:opacity-60"
              >
                {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </motion.button>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 bg-white hover:bg-[#FDFBF7] text-[#1F1517] text-[11px] font-bold uppercase tracking-[0.15em] py-4 flex items-center justify-center transition-all border border-[#1F1517] rounded-[2px] disabled:opacity-60"
                >
                  Buy Now
                </motion.button>
                <button 
                  onClick={() => toggleWishlist({ productId: _id })}
                  className="w-[50px] border border-gray-200 rounded-[2px] flex items-center justify-center text-[#1F1517] hover:border-[#C5A059] hover:text-[#C5A059] transition-all group"
                  aria-label="Wishlist"
                >
                  <Heart size={18} className={`transition-transform group-hover:scale-110 ${wishlisted ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
                </button>
                <button className="w-[50px] border border-gray-200 rounded-[2px] flex items-center justify-center text-[#1F1517] hover:border-[#C5A059] hover:text-[#C5A059] transition-all group">
                  <Share2 size={18} className="transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <AccordionItem title="PRODUCT DETAILS" isOpen={openAccordion === 'details'} onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}>
                <div className="text-[13px] text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
                  {description}
                  <div className="mt-4 grid grid-cols-2 gap-y-3 text-[12px]">
                    {sku && <div><span className="font-semibold text-gray-800">SKU:</span> {sku}</div>}
                    {material && <div><span className="font-semibold text-gray-800">Material:</span> {material}</div>}
                    {purity && <div><span className="font-semibold text-gray-800">Purity:</span> {purity}</div>}
                    {stone && <div><span className="font-semibold text-gray-800">Stone:</span> {stone}</div>}
                  </div>
                </div>
              </AccordionItem>
              
              <AccordionItem title="MATERIAL & CARE" isOpen={openAccordion === 'care'} onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}>
                <div className="text-[13px] text-gray-600 leading-relaxed font-light">
                  Store your jewellery in a soft pouch or box to avoid scratches. Keep away from chemicals, perfumes, and water to maintain its luster.
                </div>
              </AccordionItem>

              <AccordionItem title="SHIPPING & DELIVERY" isOpen={openAccordion === 'delivery'} onClick={() => setOpenAccordion(openAccordion === 'delivery' ? '' : 'delivery')}>
                <div className="text-[13px] text-gray-600 leading-relaxed font-light space-y-2">
                  <p>🚚 Free standard shipping on all orders.</p>
                  <p>⚡ Express delivery available at checkout.</p>
                </div>
              </AccordionItem>

              <AccordionItem title="RETURNS & EXCHANGE" isOpen={openAccordion === 'returns'} onClick={() => setOpenAccordion(openAccordion === 'returns' ? '' : 'returns')}>
                <div className="text-[13px] text-gray-600 leading-relaxed font-light space-y-2">
                  <p>🔄 Hassle-free 30-day returns and exchanges on unused items with original tags.</p>
                </div>
              </AccordionItem>
            </div>
            
          </div>
        </div>

        {/* ── Pre Footer Banner ─────────────────────────────────────────── */}
        <div className="w-full bg-[#4A0712] relative overflow-hidden mt-32 md:h-[350px] flex rounded-[2px]">
          <div className="flex flex-col md:flex-row items-stretch justify-between relative z-10 w-full px-0 md:px-12">
            <div className="flex items-center justify-center gap-6 md:gap-16 flex-1 py-12 md:py-0 relative z-20">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#C5A059] flex items-center justify-center text-[#C5A059] bg-[#4A0712] relative">
                  <Shield size={24} strokeWidth={1.2} />
                </div>
                <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.15em] uppercase">Anti-Tarnish</span>
              </div>
              <div className="w-[1px] h-12 bg-[#C5A059]/30 hidden md:block"></div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#C5A059] flex items-center justify-center text-[#C5A059] bg-[#4A0712] relative">
                  <span className="text-xl font-semibold text-[#C5A059]">18<span className="text-xs font-medium">Kt</span></span>
                </div>
                <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.15em] uppercase">Thick Plating</span>
              </div>
              <div className="w-[1px] h-12 bg-[#C5A059]/30 hidden md:block"></div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#C5A059] flex items-center justify-center text-[#C5A059] bg-[#4A0712] relative">
                  <Heart size={24} strokeWidth={1.2} />
                </div>
                <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.15em] uppercase">Skin Safe</span>
              </div>
            </div>
            <div className="flex-1 relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A0712] via-[#4A0712]/70 to-transparent z-10" />
              <img src="https://i.pinimg.com/originals/b7/c5/40/b7c540989f6b4d372d6fc713d2f95fc7.jpg" alt="Quality Assurance" className="absolute inset-0 w-full h-full object-cover object-[center_20%]" />
            </div>
          </div>
        </div>

        {/* ── You May Also Like / Related Products ──────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[24px] md:text-[30px] font-bold uppercase tracking-[0.1em] text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>You May Also Like</h2>
              <Link to={`/category/${category?.slug || 'all'}`} className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1F1517] hover:text-[#C5A059] transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        {/* ── Complete The Look ──────────────────────────── */}
        {relatedProducts.length > 4 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[24px] md:text-[30px] font-bold uppercase tracking-[0.1em] text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Complete The Look</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(4, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        {/* ── Customer Reviews ──────────────────────────────────────────── */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.1em] text-[#1F1517] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-[#C5A059]">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(ratings) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[14px] font-bold text-[#1F1517]">{ratings > 0 ? ratings.toFixed(1) : '5.0'} / 5</span>
              <span className="text-[12px] text-gray-500 font-medium">({numReviews > 0 ? numReviews : 126} reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsData?.reviews?.length === 0 ? (
              <p className="text-center col-span-full text-[13px] text-gray-500 py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviewsData?.reviews?.map((review) => (
                <div key={review._id} className="border border-gray-100 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FDFBF7] flex items-center justify-center text-[#1F1517] font-bold uppercase text-[13px]">
                          {review.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1F1517]">{review.user?.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex text-[#C5A059]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    {review.title && <h4 className="font-bold text-[#1F1517] text-[13px] mb-2">{review.title}</h4>}
                    <p className="text-[13px] text-gray-600 font-light leading-relaxed mb-4">{review.comment}</p>
                  </div>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] font-bold uppercase tracking-widest mt-2 pt-4 border-t border-gray-100">
                      <Check size={12} strokeWidth={3} /> Verified Buyer
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Recently Viewed ──────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <div className="text-center mb-10">
              <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.1em] text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).reverse().map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

      </div>

      {/* ── Fullscreen Viewer ───────────────────────────────────────── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-[14px] font-bold text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</span>
              <button onClick={() => setIsFullscreen(false)} className="text-[#1F1517] hover:text-[#C5A059] transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center bg-[#FDFBF7] relative overflow-hidden">
              <button 
                onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1))}
                className="absolute left-4 lg:left-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-[#C5A059] z-10"
              ><ChevronLeft size={20} /></button>
              
              <img src={mediaItems[selectedImage]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="max-w-[90vw] max-h-[75vh] object-contain mix-blend-multiply" />
              
              <button 
                onClick={() => setSelectedImage((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 lg:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-[#C5A059] z-10"
              ><ChevronRight size={20} /></button>
            </div>
            <div className="h-32 bg-white border-t border-gray-100 flex items-center justify-center gap-4 px-6 overflow-x-auto">
              {mediaItems.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 flex-shrink-0 border-[2px] transition-colors ${selectedImage === i ? 'border-[#1F1517]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={media.url} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky Mobile Purchase Bar ───────────────────────────────── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 px-5 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[60] flex items-center justify-between lg:hidden"
          >
            <div className="flex flex-col truncate pr-4">
              <span className="text-[16px] font-bold text-[#1F1517] truncate" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{formatPrice(effectivePrice)}</span>
              {discountPrice && <span className="text-[11px] text-gray-500 line-through">{formatPrice(price)}</span>}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className="bg-[#1F1517] text-[#F7F3EA] text-[11px] font-bold uppercase tracking-[0.15em] px-10 py-3.5 rounded-[2px] whitespace-nowrap active:scale-95 transition-transform"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-gray-100">
      <button className="w-full py-5 flex items-center justify-between text-left focus:outline-none group" onClick={onClick}>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1F1517] group-hover:text-[#C5A059] transition-colors">{title}</span>
        <ChevronDown size={14} className={`text-[#1F1517]/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
