import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { openCartDrawer } from '../cart/CartDrawer';

const getFallbackImage = (categoryObj, productName) => {
  const catName = categoryObj?.name?.toLowerCase() || productName?.toLowerCase() || '';
  if (catName.includes('ring')) return '/images/cat-ring.png';
  if (catName.includes('earring')) return '/images/cat-earrings.png';
  if (catName.includes('necklace')) return '/images/cat-necklace.png';
  if (catName.includes('bracelet')) return '/images/cat-bracelet.png';
  return '/images/cat-necklace-floral.png';
};

const ProductCard = memo(function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist();
  const navigate = useNavigate();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const {
    _id, name, slug, images = [], price, discountPrice,
    stock = 0, isNewArrival, isBestSeller, category
  } = product;

  const fallbackImg = getFallbackImage(category, name);
  const displayImages = images.length > 0 ? images.map(img => img.url) : [fallbackImg];
  const thumbnails = displayImages.slice(0, 4);

  const effectivePrice = discountPrice || price;
  const isOutOfStock = false; 
  const wishlisted = isWishlisted(_id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.variants && product.variants.length > 0) {
      toast('Please select an option first');
      navigate(`/products/${slug}`);
      return;
    }
    addToCart({ productId: _id, quantity: 1 });
    toast.success('Added to your cart');
    openCartDrawer();
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist.');
      return;
    }
    toggleWishlist({ productId: _id });
  };

  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const hasHoverImage = images.length > 1;

  return (
    <div className="group flex flex-col h-full bg-transparent transition-all duration-300 pb-4">
      
      {/* Main Image Container (Square 1:1) */}
      <div className="relative overflow-hidden bg-transparent mb-3" style={{ aspectRatio: '1/1' }}>
        <Link to={`/products/${slug}`} className="block w-full h-full relative">
          
          <img
            src={displayImages[activeImageIdx]}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500 ease-in-out"
            onError={(e) => { e.target.src = fallbackImg; }}
          />

          {/* Hover Image Crossfade (Only active if user hasn't clicked a thumbnail manually) */}
          {hasHoverImage && activeImageIdx === 0 && (
            <img
              src={displayImages[1]}
              alt={name}
              className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
              onError={(e) => { e.target.src = fallbackImg; }}
            />
          )}

          {/* Pill Badges */}
          {(isNewArrival || isBestSeller || true) && (
             <div className="absolute top-2 left-2 z-10 pointer-events-none">
               <div className="bg-[#8b5a2b] text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                 <span>★</span> {isBestSeller ? 'BESTSELLER' : (isNewArrival ? 'NEW IN' : 'PURE GOLD')}
               </div>
             </div>
          )}
        </Link>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleWishlistToggle}
            disabled={isToggling}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm flex items-center justify-center transition-all"
            aria-label="Add to Wishlist"
          >
            <Heart size={16} strokeWidth={wishlisted ? 2.5 : 1.5} className={wishlisted ? 'fill-[#8b5a2b] text-[#8b5a2b]' : 'text-gray-600'} />
          </button>
        </div>
        
        {/* Add to Bag Button (Sticky on bottom of image) */}
        <div className="absolute bottom-0 left-0 w-full z-10 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-auto">
           <button 
             onClick={handleAddToCart}
             disabled={isAddingToCart || isOutOfStock}
             className="w-full bg-[#22181C]/95 backdrop-blur-sm text-white py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#22181C] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
             style={{ fontFamily: "'Nunito Sans', sans-serif" }}
           >
             <ShoppingBag size={13} />
             {isOutOfStock ? 'Out Of Stock' : 'Add To Bag'}
           </button>
        </div>
      </div>

      {/* Mini Thumbnail Gallery below the main image */}
      {thumbnails.length > 1 && (
        <div className="flex gap-1.5 mb-3 overflow-x-auto hide-scrollbar px-1">
          {thumbnails.map((imgUrl, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveImageIdx(idx)}
              onClick={() => setActiveImageIdx(idx)}
              className={`relative w-10 h-10 flex-shrink-0 rounded-[2px] overflow-hidden border ${activeImageIdx === idx ? 'border-[#22181C]' : 'border-gray-200'} transition-colors`}
            >
              <img src={imgUrl} alt={`${name} thumbnail ${idx}`} className="w-full h-full object-contain p-0.5" onError={(e) => { e.target.src = fallbackImg; }} />
            </button>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="flex flex-col flex-1 px-1 mt-1">
        <Link to={`/products/${slug}`} className="block mb-1">
          <h3 className="text-[14px] sm:text-[15px] text-[#22181C] font-[500] leading-snug hover:text-[#C5A059] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-[14px] sm:text-[15px] font-bold text-[#22181C]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {formatPrice(effectivePrice)}
          </span>
          {discountPrice && (
            <span className="text-[11px] text-gray-500 line-through font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {formatPrice(price)}
            </span>
          )}
        </div>

        {isOutOfStock ? (
          <span className="text-[#d9381e] text-[10px] font-[500] tracking-wide mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Currently unavailable
          </span>
        ) : (
          discountPrice && (
            <span className="text-[#8b5a2b] text-[10px] font-[600] tracking-wider mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              ({discountPercent}% OFF)
            </span>
          )
        )}
      </div>
    </div>
  );
});

export default ProductCard;
