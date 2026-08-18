import { useState } from 'react';
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
  const [selectedVariant, setSelectedVariant] = useState({ size: '', color: '' });
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
            {[...Array(6)].map((_, i) => <div key={i} className={`skeleton h-${i === 0 ? 8 : 4} rounded`} />)}
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
          <span className="hover:text-[#3A0508] cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} className="text-[#756B62]/60" />
          <span className="hover:text-[#3A0508] cursor-pointer" onClick={() => navigate('/products')}>All Jewelry</span>
          {category && (
            <><ChevronRight size={10} className="text-[#756B62]/60" /><span className="hover:text-[#3A0508] cursor-pointer" onClick={() => navigate(`/category/${category.slug}`)}>{category.name}</span></>
          )}
          <ChevronRight size={10} className="text-[#756B62]/60" />
          <span className="text-[#3A0508] truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 xl:gap-16">
          {/* ── Images ───────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#FAF6EE] flex items-center justify-center group overflow-hidden border border-[#FAF6EE] rounded-[2px]">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]?.url || '/placeholder.jpg'}
                alt={`${name} - image ${selectedImage + 1}`}
                className="w-full h-full object-contain p-10 mix-blend-multiply"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#3A0508] text-[#F7F3EA] text-[9px] font-medium px-2.5 py-1 uppercase tracking-widest rounded-[2px]">
                  {discountPercent}% OFF
                </span>
              )}
              
              {/* Heart Icon Overlay */}
              <button
                onClick={() => toggleWishlist({ productId: _id })}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#FAF6EE] flex items-center justify-center text-[#3A0508]/70 hover:text-[#B59A68] transition-colors shadow-sm"
              >
                <Heart size={18} className={wishlisted ? 'fill-[#B59A68] text-[#B59A68]' : ''} />
              </button>

              {/* Dots Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${selectedImage === i ? 'bg-[#3A0508] w-4' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Info ─────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div>
              <h1 className="text-[22px] md:text-[25px] lg:text-[28px] text-[#3A0508] font-normal leading-tight tracking-wide mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                {numReviews > 0 ? (
                  <div className="flex items-center gap-1 text-[13px] text-[#756B62]">
                    <span className="flex items-center text-[#B59A68]"><Star size={13} fill="currentColor" /> <span className="ml-1 font-medium">{ratings.toFixed(1)}</span></span>
                    <span className="mx-1">•</span>
                    <span className="underline cursor-pointer hover:text-[#3A0508] transition-colors">Read {numReviews} Reviews</span>
                  </div>
                ) : (
                  <span className="text-[13px] text-[#756B62]/60">No reviews yet</span>
                )}
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="text-[20px] lg:text-[24px] font-medium text-[#3A0508]">{formatPrice(effectivePrice)}</span>
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
                <button onClick={checkPincode} className="px-6 text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] text-[#3A0508] hover:text-[#B59A68] border-l border-[#FAF6EE] transition-colors">
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
                            ? 'border-[#3A0508] bg-[#3A0508] text-white' 
                            : 'border-[#FAF6EE] bg-white text-[#332B27] hover:border-[#B59A68]'
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
                            ? 'border-[#3A0508] bg-[#3A0508] text-white' 
                            : 'border-[#FAF6EE] bg-white text-[#332B27] hover:border-[#B59A68]'
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
                    className="w-10 h-10 flex items-center justify-center text-[#756B62] hover:text-[#3A0508] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-[13px] font-medium text-[#332B27]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#756B62] hover:text-[#3A0508] transition-colors"
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
                className="flex-1 bg-white border border-[#3A0508] text-[#3A0508] text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] py-4 flex items-center justify-center gap-2 transition-all duration-[250ms] hover:bg-[#FAF6EE] rounded-[2px] disabled:opacity-60"
              >
                <ShoppingBag size={15} />
                {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </motion.button>
              
              <motion.button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 bg-[#3A0508] hover:bg-[#220306] text-[#F7F3EA] text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] py-4 flex items-center justify-center transition-all duration-[250ms] border border-[#3A0508] hover:border-[#220306] rounded-[2px] disabled:opacity-60"
              >
                Buy Now
              </motion.button>
            </div>

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
                <Truck size={22} strokeWidth={1} className="text-[#B59A68]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#332B27]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw size={22} strokeWidth={1} className="text-[#B59A68]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#332B27]">30 Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield size={22} strokeWidth={1} className="text-[#B59A68]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#332B27]">Lifetime Exchange</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* ── Style It With & Complete Your Look ──────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-20">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#FAF6EE] pb-4">
                <h2 className="text-[20px] lg:text-[24px] font-normal tracking-wide text-[#3A0508]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Style It With</h2>
                <Link to="/products" className="text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] text-[#756B62] hover:text-[#3A0508] border-b border-transparent hover:border-[#3A0508] pb-0.5 transition-all duration-300">View All</Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#FAF6EE] pb-4">
                <h2 className="text-[20px] lg:text-[24px] font-normal tracking-wide text-[#3A0508]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Complete Your Look</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).reverse().map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#FAF6EE] pb-4">
                <h2 className="text-[20px] lg:text-[24px] font-normal tracking-wide text-[#3A0508]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recently Viewed</h2>
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
            <h2 className="text-[23px] sm:text-[27px] lg:text-[32px] font-normal tracking-wide text-[#3A0508] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Customer Reviews</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-[#B59A68]">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill={i < Math.round(ratings) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[13px] font-medium text-[#3A0508]">{ratings.toFixed(1)} / 5</span>
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
                        <div className="w-10 h-10 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#3A0508] font-bold uppercase border border-[#FAF6EE] text-[13px]">
                          {review.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#332B27]">{review.user?.name}</p>
                          <p className="text-[10px] text-[#756B62]/80 uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex text-[#B59A68]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    {review.title && <h4 className="font-medium text-[#332B27] text-sm mb-2">{review.title}</h4>}
                    <p className="text-[13px] text-[#756B62] font-light leading-relaxed mb-4">{review.comment}</p>
                  </div>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-[10px] text-[#B59A68] font-medium uppercase tracking-widest mt-2 pt-4 border-t border-[#FAF6EE]">
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
      <div className="w-full bg-[#220306] relative overflow-hidden mt-20 md:h-[400px] flex">
        <div className="container-luxury flex flex-col md:flex-row items-stretch justify-between relative z-10 w-full px-0 md:px-8">
          
          {/* Left Side - Icons */}
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-1 py-16 md:py-0 relative z-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-[85px] h-[85px] rounded-full border-[1.5px] border-[#B59A68] flex items-center justify-center text-[#B59A68] bg-[#220306] shadow-[0_0_15px_rgba(181,154,104,0.15)] relative">
                <div className="absolute inset-1 rounded-full border border-[#B59A68]/30"></div>
                <Shield size={30} strokeWidth={1.2} />
              </div>
              <span className="text-[#B59A68] text-[11px] font-medium tracking-[0.12em] uppercase">Anti-Tarnish</span>
            </div>
            
            <div className="w-[1px] h-12 bg-[#B59A68]/30 hidden md:block"></div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-[85px] h-[85px] rounded-full border-[1.5px] border-[#B59A68] flex items-center justify-center text-[#B59A68] bg-[#220306] shadow-[0_0_15px_rgba(181,154,104,0.15)] relative">
                <div className="absolute inset-1 rounded-full border border-[#B59A68]/30"></div>
                <span className="text-2xl font-semibold text-[#B59A68]">18<span className="text-sm font-medium">Kt</span></span>
              </div>
              <span className="text-[#B59A68] text-[11px] font-medium tracking-[0.12em] uppercase">Thick Plating</span>
            </div>
            
            <div className="w-[1px] h-12 bg-[#B59A68]/30 hidden md:block"></div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-[85px] h-[85px] rounded-full border-[1.5px] border-[#B59A68] flex items-center justify-center text-[#B59A68] bg-[#220306] shadow-[0_0_15px_rgba(181,154,104,0.15)] relative">
                <div className="absolute inset-1 rounded-full border border-[#B59A68]/30"></div>
                <Heart size={30} strokeWidth={1.2} />
              </div>
              <span className="text-[#B59A68] text-[11px] font-medium tracking-[0.12em] uppercase">Skin Safe</span>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex-1 relative hidden md:block">
            {/* Gradient Overlay for smooth blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#220306] via-[#220306]/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#220306] via-transparent to-transparent z-10" />
            <img 
              src="https://i.pinimg.com/originals/b7/c5/40/b7c540989f6b4d372d6fc713d2f95fc7.jpg" 
              alt="Shraddha Kapoor" 
              className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
            />
          </div>
        </div>
      </div>
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
