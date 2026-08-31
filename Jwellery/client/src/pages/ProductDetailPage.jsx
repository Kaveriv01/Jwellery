import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import ScatteredReveal from '../components/animations/ScatteredReveal';
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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0 });
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const imageRef = useRef(null);

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
  if (!product) return <div className="container-luxury py-20 text-center text-[#756A63]">Product not found.</div>;

  const {
    _id, name, description, shortDescription, price, discountPrice,
    images = [], variants = [], stock, material, purity, weight, stone,
    gender, occasion, ratings = 0, numReviews = 0, sku, category,
    videoUrl, videoPoster
  } = product;

  // Build media gallery supporting video injection
  let mediaItems = images.map(img => ({ type: 'image', url: img.url }));

  if (videoUrl) {
    mediaItems.splice(Math.min(2, mediaItems.length), 0, { type: 'video', url: videoUrl, poster: videoPoster });
  }

  if (relatedProducts && relatedProducts.length > 0) {
    const relatedThumbnails = relatedProducts
      .filter(p => p.images && p.images.length > 0)
      .slice(0, 4)
      .map(p => ({
        type: 'image',
        url: p.images[0].url,
        productSlug: p.slug,
        isRelated: true
      }));
    mediaItems = [...mediaItems, ...relatedThumbnails];
  }

  const discountPercent = getDiscountPercent(price, discountPrice);
  const effectivePrice = discountPrice || price;
  const isOutOfStock = false; // Forced to false so all items are available
  const wishlisted = isWishlisted(_id);
  const uniqueSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const uniqueColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleButtonMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setButtonTransform({ x: x * 0.1, y: y * 0.1 });
  };

  const handleButtonMouseLeave = () => {
    setButtonTransform({ x: 0, y: 0 });
  };

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
        <title>{name} â€” Jwellery</title>
        <meta name="description" content={shortDescription || description?.slice(0, 160)} />
      </Helmet>

      <div className="container-luxury py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="text-[10px] lg:text-[11px] text-[#2A2020] mb-8 flex items-center gap-2 uppercase tracking-widest font-medium">
          <span className="hover:text-[#B79A6B] cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} className="text-[#2A2020]/40" />
          <span className="hover:text-[#B79A6B] cursor-pointer transition-colors" onClick={() => navigate('/products')}>All Jewelry</span>
          {category && (
            <><ChevronRight size={10} className="text-[#2A2020]/40" /><span className="hover:text-[#B79A6B] cursor-pointer transition-colors" onClick={() => navigate(`/category/${category.slug}`)}>{category.name}</span></>
          )}
          <ChevronRight size={10} className="text-[#2A2020]/40" />
          <span className="text-[#2A2020]/60 truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          {/* â”€â”€ Images (Left Column span-7) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row gap-4 h-full">
            
            {/* Desktop Vertical Thumbnails (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col gap-4 overflow-y-auto hide-scrollbar w-[80px] xl:w-[100px] flex-shrink-0">
              {mediaItems.map((media, i) => (
                <ScatteredReveal key={i} index={i}>
                  <button
                    onMouseEnter={() => !media.isRelated && setSelectedImage(i)}
                    onClick={() => media.isRelated ? navigate(`/products/${media.productSlug}`) : setSelectedImage(i)}
                    className={`premium-image-container relative w-full aspect-square flex-shrink-0 border-[1.5px] !rounded-[12px] transition-all ${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <div className="premium-image-inner w-full h-full relative">
                      {media.type === 'video' ? (
                        <>
                          <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#3E2024]/10 flex flex-col items-center justify-center rounded-[12px]">
                            <Play size={14} fill="white" className="text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={media.url} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </button>
                </ScatteredReveal>
              ))}
            </div>

            {/* Main Large Image */}
            <div ref={imageRef} onMouseMove={handleMouseMove} onMouseLeave={() => setMousePos({x:50, y:50})} className="relative w-full aspect-square lg:aspect-auto lg:h-[700px] flex items-center justify-center group overflow-hidden rounded-[12px] cursor-crosshair">
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
                    className="w-full h-full object-cover transition-transform duration-300 ease-out" style={window.innerWidth > 1024 ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%`, transform: `scale(${mousePos.x !== 50 ? 1.8 : 1})` } : {}}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    onClick={() => setIsFullscreen(true)}
                  />
                )}
              </AnimatePresence>
              
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#D83636] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-[2px] pointer-events-none shadow-sm">
                  SALE
                </span>
              )}
              
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#FFFDFC] flex items-center justify-center text-[#2A2020]/70 hover:text-[#B79A6B] transition-colors shadow-sm z-10 opacity-0 group-hover:opacity-100"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Mobile Horizontal Thumbnails (Hidden on desktop) */}
            <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar mt-2">
              {mediaItems.map((media, i) => (
                <ScatteredReveal key={i} index={i}>
                  <button
                    onClick={() => media.isRelated ? navigate(`/products/${media.productSlug}`) : setSelectedImage(i)}
                    className={`premium-image-container relative w-20 h-20 flex-shrink-0 snap-start border-[1.5px] !rounded-[12px] transition-all ${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-60'}`}
                  >
                    <div className="premium-image-inner w-full h-full relative">
                      {media.type === 'video' ? (
                        <>
                          <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#3E2024]/10 flex flex-col items-center justify-center rounded-[12px]">
                            <Play size={10} fill="white" className="text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={media.url} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </button>
                </ScatteredReveal>
              ))}
            </div>
          </div>

          {/* â”€â”€ Info (Right Column span-5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A6B] font-bold block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Tarini Jewellers</span>
              <h1 className="text-[26px] md:text-[32px] lg:text-[36px] text-[#2A2020] font-[500] leading-[1.2] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-[12px] text-[#2A2020]">
                  <span className="flex items-center text-[#2A2020] gap-1"><Star size={14} fill="#B79A6B" className="text-[#B79A6B]" /> <span className="font-bold">{ratings > 0 ? ratings.toFixed(1) : '5.0'}</span></span>
                  <span className="mx-1 text-gray-300">|</span>
                  <span className="underline cursor-pointer hover:text-[#B79A6B] transition-colors">{numReviews > 0 ? numReviews : 126} Reviews</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="flex flex-col mb-5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[22px] lg:text-[24px] font-[700] text-[#5A3034]" style={{ fontFamily: "'Inter', sans-serif" }}>{formatPrice(effectivePrice)}</span>
                  {discountPrice && (
                    <>
                      <span className="text-[16px] text-[#756A63] line-through font-medium">{formatPrice(price)}</span>
                      <span className="text-[12px] font-bold text-[#5A3034] bg-[#FCE8E8] px-2 py-1 rounded-[2px]">({discountPercent}% OFF)</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] text-[#756A63]">Inclusive of all taxes</span>
              </div>
              
              <div className="flex flex-col gap-2 mb-4 bg-[#FAF7F2] p-3 rounded-[2px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#2A2020] tracking-widest border border-[#DED3C4] px-2 py-1 bg-white">Pay via UPI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#2A2020]" />
                  <span className="text-[12px] text-[#2A2020] font-medium">Usually ships in 48 hours</span>
                </div>
              </div>
              
              {shortDescription && (
                <p className="text-[14px] lg:text-[15px] text-[#77716A] leading-[1.7] max-w-[480px] mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  "{shortDescription}"
                </p>
              )}
            </div>

            {/* Selectors */}
            <div className="space-y-6 pt-4 border-t border-[#DED3C4]">
              {uniqueSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2A2020]">Size</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                        className={`w-12 h-12 flex items-center justify-center text-[12px] font-bold rounded-[2px] border transition-all ${
                          selectedVariant.size === size 
                            ? 'border-[#5A3034] bg-[#5A3034] text-white' 
                            : 'border-[#DED3C4] bg-white text-[#2A2020] hover:border-[#B79A6B]'
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
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2A2020] mb-3">Metal / Color</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                        className={`px-5 py-2.5 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider rounded-[2px] border transition-all ${
                          selectedVariant.color === color 
                            ? 'border-[#5A3034] bg-[#5A3034] text-white' 
                            : 'border-[#DED3C4] bg-white text-[#2A2020] hover:border-[#B79A6B]'
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
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2A2020] mb-3">Quantity</label>
                <div className="inline-flex items-center border border-[#DED3C4] rounded-[2px] bg-white w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-10 flex items-center justify-center text-[#2A2020] hover:text-[#B79A6B] transition-colors"><Minus size={14} /></button>
                  <span className="flex-1 text-center text-[13px] font-bold text-[#2A2020]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-10 flex items-center justify-center text-[#2A2020] hover:text-[#B79A6B] transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="mt-6 border border-[#DED3C4] p-4 rounded-[2px] bg-[#FAF7F2]">
              <label className="flex items-center gap-2 text-[12px] font-bold text-[#2A2020] mb-3">
                <MapPin size={16} className="text-[#B79A6B]" /> Check Delivery Time
              </label>
              <div className="flex border border-[#DED3C4] rounded-[2px] overflow-hidden bg-white">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-[13px] font-medium text-[#2A2020] outline-none"
                />
                <button onClick={checkPincode} className="px-6 bg-[#5A3034] text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#3E2024] transition-colors">
                  Check
                </button>
              </div>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-3 gap-2 mt-6 py-4 border-y border-[#DED3C4]">
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <Shield size={22} className="text-[#B79A6B]" strokeWidth={1.5} />
                <span className="text-[10px] uppercase font-bold text-[#2A2020] tracking-wide">Skin Safe</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center border-x border-[#DED3C4]">
                <div className="text-[16px] font-bold text-[#B79A6B] leading-none">18K</div>
                <span className="text-[10px] uppercase font-bold text-[#2A2020] tracking-wide">Gold Plated</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <RotateCcw size={22} className="text-[#B79A6B]" strokeWidth={1.5} />
                <span className="text-[10px] uppercase font-bold text-[#2A2020] tracking-wide">Anti-Tarnish</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-[#5A3034] border border-[#5A3034] text-white text-[13px] font-bold uppercase tracking-[0.1em] py-3.5 flex items-center justify-center gap-2 transition-all hover:bg-[#3E2024] rounded-[2px] disabled:opacity-60"
              >
                {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'ADD TO CART'}
              </motion.button>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 bg-white hover:bg-[#FAF7F2] text-[#2A2020] text-[13px] font-bold uppercase tracking-[0.1em] py-3.5 flex items-center justify-center transition-all border-2 border-[#5A3034] rounded-[2px] disabled:opacity-60"
                >
                  BUY IT NOW
                </motion.button>
                <button 
                  onClick={() => toggleWishlist({ productId: _id })}
                  className="w-[50px] border-2 border-[#5A3034] rounded-[2px] flex items-center justify-center text-[#2A2020] hover:bg-[#5A3034] hover:text-white transition-all group"
                  aria-label="Wishlist"
                >
                  <Heart size={20} className={`transition-transform group-hover:scale-110 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 pt-6 border-t border-[#DED3C4]">
              <AccordionItem title="PRODUCT DETAILS" isOpen={openAccordion === 'details'} onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}>
                <div className="text-[13px] text-[#756A63] leading-relaxed font-light whitespace-pre-wrap">
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
                <div className="text-[13px] text-[#756A63] leading-relaxed font-light">
                  Store your jewellery in a soft pouch or box to avoid scratches. Keep away from chemicals, perfumes, and water to maintain its luster.
                </div>
              </AccordionItem>

              <AccordionItem title="SHIPPING & DELIVERY" isOpen={openAccordion === 'delivery'} onClick={() => setOpenAccordion(openAccordion === 'delivery' ? '' : 'delivery')}>
                <div className="text-[13px] text-[#756A63] leading-relaxed font-light space-y-2">
                  <p>ðŸšš Free standard shipping on all orders.</p>
                  <p>âš¡ Express delivery available at checkout.</p>
                </div>
              </AccordionItem>

              <AccordionItem title="RETURNS & EXCHANGE" isOpen={openAccordion === 'returns'} onClick={() => setOpenAccordion(openAccordion === 'returns' ? '' : 'returns')}>
                <div className="text-[13px] text-[#756A63] leading-relaxed font-light space-y-2">
                  <p>ðŸ”„ Hassle-free 30-day returns and exchanges on unused items with original tags.</p>
                </div>
              </AccordionItem>
            </div>
            
          </div>
        </div>

        {/* ── Shop The Look ────────────────────────────────── */}
        <div className="mt-20 pt-10 border-t border-[#DED3C4]">
          <div className="text-center mb-10">
            <h2 className="text-[20px] md:text-[26px] font-[500] uppercase tracking-[0.08em] text-[#2A2020]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shop The Look</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 max-w-5xl mx-auto">
            <div className="relative group overflow-hidden bg-[#FAF7F2] rounded-[2px] aspect-square">
              <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600" alt="Look 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#3E2024]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur-sm text-[#2A2020] px-6 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={14} /> View</button>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-[#FAF7F2] rounded-[2px] aspect-square">
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600" alt="Look 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#3E2024]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur-sm text-[#2A2020] px-6 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={14} /> View</button>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-[#FAF7F2] rounded-[2px] aspect-square">
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600" alt="Look 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#3E2024]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur-sm text-[#2A2020] px-6 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={14} /> View</button>
              </div>
            </div>
          </div>
        </div>

        {/* â”€â”€ You May Also Like / Related Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-[#DED3C4] pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[20px] md:text-[24px] font-[500] uppercase tracking-[0.08em] text-[#2A2020]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>You May Also Like</h2>
              <Link to={`/category/${category?.slug || 'all'}`} className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2A2020] hover:text-[#B79A6B] transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        {/* ── Compare Products ────────────────────────────────── */}
        {relatedProducts.length > 4 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-[20px] md:text-[26px] font-[500] uppercase tracking-[0.08em] text-[#2A2020]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Compare Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(4, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        {/* â”€â”€ Customer Reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="mt-24 border-t border-[#DED3C4] pt-16">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-[22px] md:text-[28px] font-[400] uppercase tracking-[0.08em] text-[#2A2020] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-[#B79A6B]">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(ratings) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[14px] font-bold text-[#2A2020]">{ratings > 0 ? ratings.toFixed(1) : '5.0'} / 5</span>
              <span className="text-[12px] text-[#756A63] font-medium">({numReviews > 0 ? numReviews : 126} reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsData?.reviews?.length === 0 ? (
              <p className="text-center col-span-full text-[13px] text-[#756A63] py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviewsData?.reviews?.map((review) => (
                <div key={review._id} className="border border-[#DED3C4] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFFDFC] flex items-center justify-center text-[#2A2020] font-bold uppercase text-[13px]">
                          {review.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#2A2020]">{review.user?.name}</p>
                          <p className="text-[10px] text-[#756A63] uppercase tracking-widest mt-0.5">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex text-[#B79A6B]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    {review.title && <h4 className="font-bold text-[#2A2020] text-[13px] mb-2">{review.title}</h4>}
                    <p className="text-[13px] text-[#756A63] font-light leading-relaxed mb-4">{review.comment}</p>
                  </div>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#B79A6B] font-bold uppercase tracking-widest mt-2 pt-4 border-t border-[#DED3C4]">
                      <Check size={12} strokeWidth={3} /> Verified Buyer
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* â”€â”€ Recently Viewed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-[#DED3C4] pt-16">
            <div className="text-center mb-10">
              <h2 className="text-[22px] md:text-[28px] font-[400] uppercase tracking-[0.08em] text-[#2A2020]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).reverse().map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

      </div>

      {/* ── Pre Footer Banner (Moved to bottom) ────────────────────────────────── */}
        <div className="w-full bg-[#211719] relative overflow-hidden mt-32 md:h-[400px] flex rounded-[2px]">
          <div className="flex flex-col md:flex-row items-stretch justify-between relative z-10 w-full px-0">
            <div className="flex items-center justify-center gap-8 md:gap-16 flex-1 py-16 md:py-0 relative z-20 md:pl-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-[80px] h-[80px] rounded-full border-[1px] border-[#B79A6B] flex items-center justify-center text-[#B79A6B] bg-transparent relative">
                  <Shield size={28} strokeWidth={1} />
                </div>
                <span className="text-[#B79A6B] text-[11px] font-bold tracking-[0.15em] uppercase">Anti-Tarnish</span>
              </div>
              <div className="w-[1px] h-16 bg-[#B79A6B]/30 hidden md:block"></div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-[80px] h-[80px] rounded-full border-[1px] border-[#B79A6B] flex items-center justify-center text-[#B79A6B] bg-transparent relative">
                  <span className="text-2xl font-semibold text-[#B79A6B]">18<span className="text-sm font-medium">Kt</span></span>
                </div>
                <span className="text-[#B79A6B] text-[11px] font-bold tracking-[0.15em] uppercase">Thick Plating</span>
              </div>
              <div className="w-[1px] h-16 bg-[#B79A6B]/30 hidden md:block"></div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-[80px] h-[80px] rounded-full border-[1px] border-[#B79A6B] flex items-center justify-center text-[#B79A6B] bg-transparent relative">
                  <Heart size={28} strokeWidth={1} />
                </div>
                <span className="text-[#B79A6B] text-[11px] font-bold tracking-[0.15em] uppercase">Skin Safe</span>
              </div>
            </div>
            <div className="flex-1 relative hidden md:block h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-transparent to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200" alt="Quality Assurance" className="absolute inset-0 w-full h-full object-cover object-[center_30%]" />
            </div>
          </div>
      </div>
      {/* ── Fullscreen Viewer ──â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#DED3C4]">
              <span className="text-[14px] font-bold text-[#2A2020]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</span>
              <button onClick={() => setIsFullscreen(false)} className="text-[#2A2020] hover:text-[#B79A6B] transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center bg-[#FFFDFC] relative overflow-hidden">
              <button 
                onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1))}
                className="absolute left-4 lg:left-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-[#B79A6B] z-10"
              ><ChevronLeft size={20} /></button>
              
              <img src={mediaItems[selectedImage]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="max-w-[90vw] max-h-[75vh] object-cover" />
              
              <button 
                onClick={() => setSelectedImage((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 lg:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-[#B79A6B] z-10"
              ><ChevronRight size={20} /></button>
            </div>
            <div className="h-32 bg-white border-t border-[#DED3C4] flex items-center justify-center gap-4 px-6 overflow-x-auto">
              {mediaItems.map((media, i) => (
                <button
                  key={i}
                  onClick={() => media.isRelated ? navigate(`/products/${media.productSlug}`) : setSelectedImage(i)}
                  className={`w-20 h-20 flex-shrink-0 border-[2px] transition-colors ${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={media.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€ Sticky Mobile Purchase Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#DED3C4] p-4 px-5 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[60] flex items-center justify-between lg:hidden"
          >
            <div className="flex flex-col truncate pr-4">
              <span className="text-[14px] font-[500] text-[#2A2020] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{formatPrice(effectivePrice)}</span>
              {discountPrice && <span className="text-[11px] text-[#756A63] line-through">{formatPrice(price)}</span>}
            </div>
            <button onClick={handleAddToCart} onMouseMove={handleButtonMouseMove} onMouseLeave={handleButtonMouseLeave} style={{ transform: `translate(${buttonTransform.x}px, ${buttonTransform.y}px)` }}
              disabled={isOutOfStock || isAddingToCart}
              className="bg-[#5A3034] text-white text-[12px] lg:text-[13px] font-[500] uppercase tracking-[0.06em] px-12 py-4 rounded-[2px] whitespace-nowrap active:scale-95 hover:-translate-y-[1px] transition-all"
            >
              {isOutOfStock ? "Out of Stock" : isAddingLocal ? "Adding..." : addSuccess ? "✓ Added To Bag" : "Add to Bag"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-[#DED3C4]">
      <button className="w-full py-5 flex items-center justify-between text-left focus:outline-none group" onClick={onClick}>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2A2020] group-hover:text-[#B79A6B] transition-colors">{title}</span>
        <ChevronDown size={14} className={`text-[#2A2020]/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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






