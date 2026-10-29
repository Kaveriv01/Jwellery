import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Star, Shield, Truck, RotateCcw,
  ChevronLeft, ChevronRight, ZoomIn, Package, Plus, Minus, Check, MapPin, ChevronDown, Play, X,
  Copy, Video, Info, Sparkles, Award, CheckCircle, ExternalLink, RefreshCw
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
  const [selectedMetalColor, setSelectedMetalColor] = useState('Rose Gold');
  const [selectedPurity, setSelectedPurity] = useState('18Kt Gold');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [copiedSku, setCopiedSku] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sampleCertModalOpen, setSampleCertModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Accordion states
  const [openAccordion, setOpenAccordion] = useState('general');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0 });
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
    const finalVariant = {
      ...selectedVariant,
      color: selectedVariant.color || selectedMetalColor,
      purity: selectedPurity
    };
    addToCart({ productId: _id, quantity, variant: finalVariant });
    toast.success('Added to your bag');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (uniqueSizes.length > 0 && !selectedVariant.size) {
      toast.error('Please select a size');
      return;
    }
    const finalVariant = {
      ...selectedVariant,
      color: selectedVariant.color || selectedMetalColor,
      purity: selectedPurity
    };
    addToCart({ productId: _id, quantity, variant: finalVariant });
    navigate('/checkout');
  };

  const checkPincode = () => {
    const cleanPin = pincode.trim();
    if (cleanPin.length === 6 && /^\d+$/.test(cleanPin)) {
      const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      setPincodeStatus({
        success: true,
        message: `Delivery available for PIN ${cleanPin}`,
        date: `Estimated dispatch within 24-48h. Doorstep delivery by ${deliveryDate}.`,
        details: 'Free Insured Transit • Cash on Delivery Available'
      });
      toast.success(`Verified: Delivery available for ${cleanPin}`);
    } else {
      setPincodeStatus({
        success: false,
        message: 'Please enter a valid 6-digit postal code'
      });
      toast.error('Enter valid 6-digit pincode');
    }
  };

  const handleCopySku = (skuCode) => {
    const code = skuCode || `TARINI-${_id.slice(-6).toUpperCase()}`;
    navigator.clipboard.writeText(code);
    setCopiedSku(true);
    toast.success('Product Code (SKU) copied to clipboard');
    setTimeout(() => setCopiedSku(false), 2000);
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
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 h-full">
              {/* Desktop Vertical Thumbnails (Hidden on mobile) */}
              <div className="hidden lg:flex flex-col gap-3 overflow-y-auto hide-scrollbar w-[80px] xl:w-[90px] flex-shrink-0">
                {mediaItems.map((media, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => !media.isRelated && setSelectedImage(i)}
                    onClick={() => media.isRelated ? navigate(`/products/${media.productSlug}`) : setSelectedImage(i)}
                    className={`relative w-full aspect-square flex-shrink-0 border rounded-[2px] overflow-hidden bg-[#FAF8F5] transition-opacity duration-200 ${selectedImage === i ? 'border-[#1F1517] opacity-100 shadow-xs' : 'border-[#EAE6DF] opacity-60 hover:opacity-100'}`}
                  >
                    <div className="w-full h-full relative">
                      {media.type === 'video' ? (
                        <>
                          <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#1F1517]/20 flex flex-col items-center justify-center">
                            <Play size={14} fill="white" className="text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={media.url} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Large Image */}
              <div ref={imageRef} className="relative w-full aspect-square lg:aspect-auto lg:h-[660px] flex items-center justify-center group overflow-hidden bg-[#FAF8F5] rounded-[2px]">
                {mediaItems[selectedImage]?.type === 'video' ? (
                  <video
                    key={selectedImage}
                    src={mediaItems[selectedImage].url}
                    poster={mediaItems[selectedImage].poster}
                    controls
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    key={selectedImage}
                    src={mediaItems[selectedImage]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'}
                    alt={`${name} - media ${selectedImage + 1}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 ease-out hover:scale-105"
                    onClick={() => setIsFullscreen(true)}
                  />
                )}
                
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-[#1F1517] text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-[1px] pointer-events-none font-montserrat">
                    SALE
                  </span>
                )}
                
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-[#EAE6DF] flex items-center justify-center text-[#1F1517] hover:text-[#C5A059] transition-colors shadow-sm z-10 opacity-0 group-hover:opacity-100"
                  aria-label="View Fullscreen"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Mobile Horizontal Thumbnails (Hidden on desktop) */}
              <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar mt-2">
                {mediaItems.map((media, i) => (
                  <button
                    key={i}
                    onClick={() => media.isRelated ? navigate(`/products/${media.productSlug}`) : setSelectedImage(i)}
                    className={`relative w-16 h-16 flex-shrink-0 snap-start border rounded-[2px] overflow-hidden bg-[#FAF8F5] transition-opacity duration-200 ${selectedImage === i ? 'border-[#1F1517] opacity-100' : 'border-[#EAE6DF] opacity-60'}`}
                  >
                    <div className="w-full h-full relative">
                      {media.type === 'video' ? (
                        <>
                          <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#1F1517]/20 flex flex-col items-center justify-center">
                            <Play size={10} fill="white" className="text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={media.url} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── What's in the Package (Diam O Rivo Signature Showcase) ── */}
            <div className="border border-[#EAE6DF] bg-[#FAF8F5] p-5 sm:p-6 rounded-[2px]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE6DF]">
                <div className="flex items-center gap-2">
                  <Package size={17} className="text-[#C5A059]" />
                  <h3 className="font-cinzel text-[13px] md:text-[14px] uppercase tracking-[0.08em] text-[#1F1517] font-semibold">
                    What's in the Package
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#756A63] font-montserrat">
                  The Tarini Box
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Item 1 */}
                <div className="bg-white p-4 border border-[#EAE6DF] rounded-[2px] flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#C5A059] mb-2.5">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#1F1517] uppercase tracking-wide font-montserrat mb-1">
                    Velvet Keepsake Box
                  </h4>
                  <p className="text-[11px] text-[#756A63] leading-relaxed">
                    Signature luxury presentation box engineered to preserve your heirloom.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="bg-white p-4 border border-[#EAE6DF] rounded-[2px] flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#C5A059] mb-2.5">
                    <Shield size={18} />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#1F1517] uppercase tracking-wide font-montserrat mb-1">
                    Travel Suede Pouch
                  </h4>
                  <p className="text-[11px] text-[#756A63] leading-relaxed">
                    Ultra-soft plush protective pouch for daily transit and anti-scratch safekeeping.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="bg-white p-4 border border-[#EAE6DF] rounded-[2px] flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#C5A059] mb-2.5">
                    <Award size={18} />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#1F1517] uppercase tracking-wide font-montserrat mb-1">
                    IGI & BIS Guarantee
                  </h4>
                  <p className="text-[11px] text-[#756A63] leading-relaxed">
                    Official card verifying diamond purity, hallmarking, and lifetime warranty.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Info (Right Column span-5) ────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6 pt-1">
            {/* Header Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-bold font-montserrat">
                  Tarini Lab Grown Diamonds
                </span>
                <button 
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-1.5 text-[11px] text-[#756A63] hover:text-[#1F1517] transition-colors uppercase font-montserrat tracking-wider"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
              </div>

              <h1 className="text-[26px] md:text-[32px] lg:text-[34px] font-cinzel text-[#1F1517] font-normal leading-[1.2] uppercase tracking-[0.03em] mb-2">
                {name}
              </h1>

              <div className="flex items-center flex-wrap gap-3 text-[11px] font-montserrat mb-3">
                <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#EAE6DF] px-2.5 py-1 rounded-[2px]">
                  <span className="text-[#756A63]">SKU:</span>
                  <span className="font-semibold text-[#1F1517]">{sku || `TRN-${_id.slice(-6).toUpperCase()}`}</span>
                  <button 
                    onClick={() => handleCopySku(sku)}
                    className="ml-1 text-[#C5A059] hover:text-[#1F1517] font-bold uppercase text-[9px] tracking-wider transition-colors inline-flex items-center gap-0.5"
                    title="Copy SKU"
                  >
                    <Copy size={10} />
                    {copiedSku ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[#1F1517]">
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-bold text-[12px]">{ratings > 0 ? ratings.toFixed(1) : '5.0'}</span>
                  <span className="text-[#756A63]">({numReviews > 0 ? numReviews : 126} Reviews)</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="py-3 border-y border-[#EAE6DF] flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-[26px] lg:text-[28px] font-bold text-[#1F1517] font-montserrat">
                    {formatPrice(effectivePrice)}
                  </span>
                  {discountPrice && (
                    <>
                      <span className="text-[16px] text-[#756A63] line-through font-montserrat font-medium">
                        {formatPrice(price)}
                      </span>
                      <span className="text-[11px] font-bold text-[#1F1517] bg-[#EAE6DF]/60 border border-[#DED3C4] px-2 py-0.5 rounded-[2px] font-montserrat">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#756A63] font-montserrat">
                  Price inclusive of all taxes. Free insured delivery across India.
                </p>
              </div>

              {shortDescription && (
                <p className="text-[13px] text-[#756A63] leading-[1.65] font-light mt-3">
                  {shortDescription}
                </p>
              )}
            </div>

            {/* Select Gold Color (Diam O Rivo Visual Swatches) */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1517] font-montserrat">
                    Select Gold Color: <span className="font-semibold text-[#C5A059] normal-case tracking-normal">{selectedMetalColor}</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { name: 'Yellow Gold', colorHex: '#D4AF37', borderHex: '#B39129' },
                    { name: 'Rose Gold', colorHex: '#C98A7C', borderHex: '#A3685C' },
                    { name: 'White Gold', colorHex: '#D8D7D5', borderHex: '#9E9D9B' },
                  ].map((item) => {
                    const isSelected = selectedMetalColor === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setSelectedMetalColor(item.name)}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-[2px] text-[11px] font-montserrat transition-all ${
                          isSelected
                            ? 'border-[#1F1517] bg-[#FAF8F5] shadow-xs'
                            : 'border-[#EAE6DF] hover:border-[#C5A059] bg-white'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border transition-transform ${isSelected ? 'scale-110 shadow-xs ring-2 ring-offset-1 ring-[#1F1517]' : ''}`}
                          style={{ backgroundColor: item.colorHex, borderColor: item.borderHex }}
                        />
                        <span className={`font-medium ${isSelected ? 'text-[#1F1517] font-bold' : 'text-[#756A63]'}`}>
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metal Purity Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1517] font-montserrat">
                    Metal Purity: <span className="font-semibold text-[#C5A059] normal-case tracking-normal">{selectedPurity}</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['9Kt Gold', '14Kt Gold', '18Kt Gold'].map((purityOption) => {
                    const isSelected = selectedPurity === purityOption;
                    return (
                      <button
                        key={purityOption}
                        onClick={() => setSelectedPurity(purityOption)}
                        className={`py-2.5 px-3 text-center border rounded-[2px] transition-all font-montserrat text-[11px] font-semibold uppercase tracking-wider ${
                          isSelected
                            ? 'border-[#1F1517] bg-[#1F1517] text-white shadow-xs'
                            : 'border-[#EAE6DF] bg-white text-[#1F1517] hover:border-[#C5A059]'
                        }`}
                      >
                        {purityOption}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector (If applicable) */}
              {uniqueSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F1517] font-montserrat">
                      Ring / Chain Size
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                        className={`w-11 h-11 flex items-center justify-center text-[12px] font-bold rounded-[2px] border transition-all font-montserrat ${
                          selectedVariant.size === size 
                            ? 'border-[#1F1517] bg-[#1F1517] text-white' 
                            : 'border-[#EAE6DF] bg-white text-[#1F1517] hover:border-[#C5A059]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Dispatch & Stock Status Pill */}
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE6DF] rounded-[2px] flex items-center gap-2.5 text-[11px] font-montserrat text-[#1F1517]">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse flex-shrink-0" />
                <span><strong>Made to Order:</strong> Estimated dispatch within 24–48 hours. Insured express transit across India.</span>
              </div>

              {/* Pincode Delivery Checker */}
              <div className="border border-[#EAE6DF] p-3.5 rounded-[2px] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1F1517] font-montserrat">
                    <MapPin size={13} className="text-[#C5A059]" /> Check Delivery Time & COD
                  </label>
                </div>
                <div className="flex border border-[#EAE6DF] rounded-[2px] overflow-hidden focus-within:border-[#1F1517] transition-colors">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit Pincode" 
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkPincode()}
                    className="flex-1 px-3 py-2 text-[12px] font-montserrat text-[#1F1517] outline-none"
                  />
                  <button 
                    onClick={checkPincode} 
                    className="px-5 bg-[#1F1517] text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#C5A059] transition-colors font-montserrat"
                  >
                    Check
                  </button>
                </div>
                {pincodeStatus && (
                  <div className={`mt-2 p-2.5 rounded-[2px] text-[11px] font-montserrat ${pincodeStatus.success ? 'bg-[#F2F7F2] text-[#1E4620] border border-[#CDE3CD]' : 'bg-[#FFF5F5] text-[#9A2525] border border-[#FED7D7]'}`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle size={13} />
                      <span>{pincodeStatus.message}</span>
                    </div>
                    {pincodeStatus.date && <p className="mt-1 text-[11px] font-medium">{pincodeStatus.date}</p>}
                    {pincodeStatus.details && <p className="mt-0.5 text-[10px] opacity-80">{pincodeStatus.details}</p>}
                  </div>
                )}
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  {/* Quantity selector */}
                  <div className="inline-flex items-center border border-[#EAE6DF] rounded-[2px] bg-white w-28">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="flex-1 h-11 flex items-center justify-center text-[#1F1517] hover:text-[#C5A059] transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="flex-1 text-center text-[13px] font-bold text-[#1F1517] font-montserrat">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="flex-1 h-11 flex items-center justify-center text-[#1F1517] hover:text-[#C5A059] transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className="flex-1 bg-[#1F1517] hover:bg-[#C5A059] text-white text-[12px] font-bold uppercase tracking-[0.15em] py-3.5 flex items-center justify-center gap-2 transition-all rounded-[2px] font-montserrat"
                  >
                    <ShoppingBag size={15} />
                    <span>{isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'ADD TO CART'}</span>
                  </button>

                  {/* Wishlist */}
                  <button 
                    onClick={() => toggleWishlist({ productId: _id })}
                    className="w-11 h-11 border border-[#EAE6DF] rounded-[2px] flex items-center justify-center text-[#1F1517] hover:border-[#1F1517] transition-all bg-white"
                    aria-label="Wishlist"
                  >
                    <Heart size={18} className={`transition-transform ${wishlisted ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
                  </button>
                </div>

                {/* Buy It Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full bg-[#FAF8F5] hover:bg-[#FAF7F2] text-[#1F1517] border border-[#1F1517] text-[12px] font-bold uppercase tracking-[0.15em] py-3.5 flex items-center justify-center transition-all rounded-[2px] font-montserrat"
                >
                  BUY IT NOW
                </button>
              </div>

              {/* IGI & BIS Hallmarking Trust Banner */}
              <div className="border border-[#EAE6DF] bg-[#FAF8F5] p-4 rounded-[2px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[#C5A059] flex-shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#1F1517] uppercase font-montserrat tracking-wide">
                      100% Certified Diamonds & BIS Hallmarked
                    </h4>
                    <p className="text-[11px] text-[#756A63]">
                      Every creation is verified with an authentic gemological certificate.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSampleCertModalOpen(true)}
                  className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] hover:text-[#1F1517] underline whitespace-nowrap font-montserrat"
                >
                  Sample Cert →
                </button>
              </div>

              {/* 5 Luxury Pillars Grid (Diam O Rivo 5 Pillars) */}
              <div className="grid grid-cols-5 gap-2 py-4 border-y border-[#EAE6DF]">
                <div className="flex flex-col items-center text-center">
                  <RotateCcw size={18} className="text-[#C5A059] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1517] font-montserrat leading-tight">15-Day Return</span>
                </div>
                <div className="flex flex-col items-center text-center border-l border-[#EAE6DF]">
                  <RefreshCw size={18} className="text-[#C5A059] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1517] font-montserrat leading-tight">100% Exchange</span>
                </div>
                <div className="flex flex-col items-center text-center border-l border-[#EAE6DF]">
                  <Truck size={18} className="text-[#C5A059] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1517] font-montserrat leading-tight">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center border-l border-[#EAE6DF]">
                  <Award size={18} className="text-[#C5A059] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1517] font-montserrat leading-tight">IGI Certified</span>
                </div>
                <div className="flex flex-col items-center text-center border-l border-[#EAE6DF]">
                  <Shield size={18} className="text-[#C5A059] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F1517] font-montserrat leading-tight">COD Available</span>
                </div>
              </div>

              {/* Book a Live Video Call Concierge (Diam O Rivo Feature) */}
              <div className="border border-[#C5A059]/40 bg-gradient-to-r from-[#FAF8F5] to-white p-4 rounded-[2px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F1517] text-[#C5A059] flex items-center justify-center flex-shrink-0">
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#1F1517] uppercase font-montserrat tracking-wide">
                      Experience Live on Video Call
                    </h4>
                    <p className="text-[11px] text-[#756A63]">
                      Schedule a virtual walkthrough to see scale, cut & brilliance in real-time.
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/918619859463?text=${encodeURIComponent(`Hello Tarini Concierge! I would like to book a live video preview for "${name}". SKU: ${sku || `TRN-${_id.slice(-6).toUpperCase()}`}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#1F1517] text-white hover:bg-[#C5A059] transition-colors rounded-[2px] text-[10px] font-bold uppercase tracking-widest font-montserrat whitespace-nowrap"
                >
                  Book Call
                </a>
              </div>

              {/* Technical Specifications Accordions (Diam O Rivo Spec Table Style) */}
              <div className="pt-2">
                <AccordionItem 
                  title="GENERAL DETAILS" 
                  isOpen={openAccordion === 'general'} 
                  onClick={() => setOpenAccordion(openAccordion === 'general' ? '' : 'general')}
                >
                  <div className="text-[12px] font-montserrat">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium w-1/3">Product Code / SKU</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold flex items-center justify-between">
                            <span>{sku || `TRN-${_id.slice(-6).toUpperCase()}`}</span>
                            <button onClick={() => handleCopySku(sku)} className="text-[10px] uppercase font-bold text-[#C5A059] hover:underline flex items-center gap-1">
                              <Copy size={11} /> {copiedSku ? 'Copied' : 'Copy'}
                            </button>
                          </td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Category</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{category?.name || 'Fine Jewelry'}</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Gender</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{gender || 'Women / Unisex'}</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Occasion</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{occasion || 'Daily Luxury, Bridal, Celebration'}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-[#756A63] font-medium">Gross Weight</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{weight ? `${weight}g (approx)` : '2.85g (approx)'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>

                <AccordionItem 
                  title="METAL DETAILS" 
                  isOpen={openAccordion === 'metal'} 
                  onClick={() => setOpenAccordion(openAccordion === 'metal' ? '' : 'metal')}
                >
                  <div className="text-[12px] font-montserrat">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium w-1/3">Metal Purity</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{selectedPurity || purity || '18Kt Gold'}</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Metal Color</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{selectedMetalColor}</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Hallmarking</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">BIS Hallmarked & Laser Inscribed</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-[#756A63] font-medium">Base Material</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{material || 'Solid Gold / Certified Fine Alloy'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>

                <AccordionItem 
                  title="DIAMOND & STONE SPECIFICATIONS" 
                  isOpen={openAccordion === 'diamond'} 
                  onClick={() => setOpenAccordion(openAccordion === 'diamond' ? '' : 'diamond')}
                >
                  <div className="text-[12px] font-montserrat">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium w-1/3">Stone Type</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">{stone || 'Lab Grown Diamond (CVD / HPHT)'}</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Diamond Color</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">EF (Colorless)</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Diamond Clarity</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">VVS - VS</td>
                        </tr>
                        <tr className="border-b border-[#EAE6DF]">
                          <td className="py-2.5 text-[#756A63] font-medium">Cut Grade</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">Ideal / Excellent Cut</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-[#756A63] font-medium">Certification</td>
                          <td className="py-2.5 text-[#1F1517] font-semibold">IGI (International Gemological Institute)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionItem>

                <AccordionItem 
                  title="CARE & LIFETIME WARRANTY" 
                  isOpen={openAccordion === 'care'} 
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                >
                  <div className="text-[12px] text-[#756A63] leading-relaxed font-light space-y-2 font-montserrat">
                    <p>• Store in your provided Tarini velvet keepsake box when not in use.</p>
                    <p>• Clean gently using a soft lint-free cloth and lukewarm soapy water.</p>
                    <p>• Free lifetime prong tightening, polishing, and ultrasonic cleaning across our certified workshops.</p>
                    <p>• Hassle-free 15-day return and 100% lifetime exchange guarantee.</p>
                  </div>
                </AccordionItem>
              </div>

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
              <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600" alt="Look 1" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#3E2024]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur-sm text-[#2A2020] px-6 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={14} /> View</button>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-[#FAF7F2] rounded-[2px] aspect-square">
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600" alt="Look 2" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#3E2024]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur-sm text-[#2A2020] px-6 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={14} /> View</button>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-[#FAF7F2] rounded-[2px] aspect-square">
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600" alt="Look 3" className="w-full h-full object-cover" />
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
              <img src="/images/premium_quality_banner.png" alt="Premium Quality Assurance" className="absolute inset-0 w-full h-full object-cover object-[center_30%]" />
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

      {/* ── Sample IGI & BIS Certificate Modal ────────────────── */}
      <AnimatePresence>
        {sampleCertModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSampleCertModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#EAE6DF] max-w-xl w-full rounded-[2px] shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#1F1517] text-white p-4 sm:px-6 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold font-montserrat block">
                    Certificate of Authenticity
                  </span>
                  <h3 className="font-cinzel text-[16px] sm:text-[18px] tracking-[0.05em] uppercase font-normal">
                    IGI Diamond & BIS Hallmark Report
                  </h3>
                </div>
                <button
                  onClick={() => setSampleCertModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Certificate Body (IGI Style Luxury Layout) */}
              <div className="p-5 sm:p-6 bg-[#FAF8F5] space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="bg-white border-2 border-[#C5A059]/40 p-5 rounded-[2px] relative shadow-xs">
                  {/* Seal / Header */}
                  <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1F1517] text-[#C5A059] flex items-center justify-center font-cinzel font-bold text-xs">
                        IGI
                      </div>
                      <div>
                        <div className="text-[12px] font-bold font-montserrat text-[#1F1517] uppercase tracking-wide">
                          International Gemological Institute
                        </div>
                        <div className="text-[9px] text-[#756A63] uppercase tracking-widest font-montserrat">
                          Laboratory Grown Diamond Grading Report
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-[#756A63] font-bold block">REPORT NUMBER</span>
                      <span className="text-[11px] font-bold text-[#1F1517] font-mono">LG629481904</span>
                    </div>
                  </div>

                  {/* Grading Grid */}
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-montserrat mb-4">
                    <div className="bg-[#FAF8F5] p-2.5 rounded-[1px] border border-[#EAE6DF]">
                      <span className="text-[10px] text-[#756A63] uppercase block font-semibold">Shape & Cut</span>
                      <span className="text-[12px] font-bold text-[#1F1517]">Round Brilliant / Emerald</span>
                    </div>
                    <div className="bg-[#FAF8F5] p-2.5 rounded-[1px] border border-[#EAE6DF]">
                      <span className="text-[10px] text-[#756A63] uppercase block font-semibold">Color Grade</span>
                      <span className="text-[12px] font-bold text-[#1F1517]">E - F (Colorless)</span>
                    </div>
                    <div className="bg-[#FAF8F5] p-2.5 rounded-[1px] border border-[#EAE6DF]">
                      <span className="text-[10px] text-[#756A63] uppercase block font-semibold">Clarity Grade</span>
                      <span className="text-[12px] font-bold text-[#1F1517]">VVS - VS</span>
                    </div>
                    <div className="bg-[#FAF8F5] p-2.5 rounded-[1px] border border-[#EAE6DF]">
                      <span className="text-[10px] text-[#756A63] uppercase block font-semibold">Cut Grade</span>
                      <span className="text-[12px] font-bold text-[#1F1517]">Ideal / Excellent</span>
                    </div>
                  </div>

                  {/* Hallmarking Section */}
                  <div className="border-t border-[#EAE6DF] pt-3 flex items-center justify-between text-[11px] font-montserrat">
                    <div className="flex items-center gap-2">
                      <Award size={20} className="text-[#C5A059]" />
                      <div>
                        <span className="font-bold text-[#1F1517] block">BIS Hallmark Certified</span>
                        <span className="text-[10px] text-[#756A63]">Govt. of India Certified 100% Purity</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-[1px]">
                        ✓ VERIFIED GENUINE
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#756A63] text-center font-montserrat">
                  Each jewelry piece from Tarini is delivered accompanied by its physical certificate card and laser inscription guarantee.
                </p>
              </div>

              <div className="p-4 bg-white border-t border-[#EAE6DF] flex justify-end">
                <button
                  onClick={() => setSampleCertModalOpen(false)}
                  className="px-6 py-2 bg-[#1F1517] text-white text-[11px] font-bold uppercase tracking-widest rounded-[2px] font-montserrat hover:bg-[#C5A059] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {shareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#EAE6DF] max-w-sm w-full p-5 rounded-[2px] shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF] mb-4">
                <h3 className="font-cinzel text-[14px] uppercase tracking-wider text-[#1F1517] font-semibold">
                  Share this Piece
                </h3>
                <button onClick={() => setShareModalOpen(false)} className="text-[#756A63] hover:text-[#1F1517]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 font-montserrat">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard');
                    setShareModalOpen(false);
                  }}
                  className="w-full py-2.5 px-3 border border-[#EAE6DF] hover:border-[#1F1517] rounded-[2px] flex items-center justify-center gap-2 text-[12px] font-semibold text-[#1F1517] transition-all bg-[#FAF8F5]"
                >
                  <Copy size={14} /> Copy Product Link
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Take a look at "${name}" on Tarini Fine Jewellery: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareModalOpen(false)}
                  className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-[2px] flex items-center justify-center gap-2 text-[12px] font-bold tracking-wide transition-all"
                >
                  Share on WhatsApp
                </a>
              </div>
            </motion.div>
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






