import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, getProductImage } from '../../lib/utils';
import { toast } from 'sonner';
import { openCartDrawer } from '../cart/CartDrawer';

const ProductCard = memo(function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist();
  const navigate = useNavigate();

  const {
    _id, name, slug, images = [], price, discountPrice,
    stock = 0, isNewArrival, isBestSeller,
  } = product;

  const mainImage = getProductImage(images);
  const hoverImage = images[1]?.url || mainImage;
  const effectivePrice = discountPrice || price;
  const isOutOfStock = false; // Forced to false so all items are available
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
    <div className="group flex flex-col h-full bg-white transition-all duration-300 shadow-[0_2px_10px_rgba(34,24,28,0.04)] hover:shadow-[0_12px_35px_rgba(34,24,28,0.1)] border border-transparent p-4 rounded-md">
      
      {/* Image Container */}
      <Link to={`/products/${slug}`} className="block relative overflow-hidden bg-[#f8f8f8] mb-4 rounded-sm" style={{ aspectRatio: '4/5' }}>
        
        {/* Images with Tanishq Crossfade & Zoom Transition */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={mainImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 ${hasHoverImage ? 'group-hover:opacity-0' : ''}`}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
          />
          {hasHoverImage && (
            <img
              src={hoverImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-1000 ease-out group-hover:opacity-100 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
            />
          )}
        </div>

        {/* Tanishq Style Top-Left Pill Badge */}
        {(isNewArrival || isBestSeller || true) && (
           <div className="absolute top-2 left-2 z-10">
             <div className="bg-[#8b5a2b] text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
               <span>★</span> {isBestSeller ? 'BESTSELLER' : (isNewArrival ? 'NEW ARRIVAL' : 'PURE GOLD')}
             </div>
           </div>
        )}

        {/* Tanishq Style Top-Right Wishlist Button */}
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
        
        {/* Hover Add to Bag Button (Slides up from bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-10 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
           <button 
             onClick={handleAddToCart}
             disabled={isAddingToCart || isOutOfStock}
             className="w-full bg-[#22181C]/95 backdrop-blur-sm text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#22181C] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
             style={{ fontFamily: "'Nunito Sans', sans-serif" }}
           >
             <ShoppingBag size={14} />
             {isOutOfStock ? 'Out Of Stock' : 'Add To Bag'}
           </button>
        </div>

      </Link>

      {/* Info Section (Tanishq Typography) */}
      <div className="flex flex-col flex-1 px-1">
        <Link to={`/products/${slug}`} className="block mb-1.5">
          <h3 className="text-[15px] sm:text-[17px] text-[#22181C] font-bold leading-snug hover:text-[#C5A059] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 flex-wrap mb-1 mt-1">
          <span className="text-[17px] sm:text-[19px] font-bold text-[#22181C]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {formatPrice(effectivePrice)}
          </span>
          {discountPrice && (
            <span className="text-[13px] text-gray-500 line-through font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Small Tanishq style stock alert if out of stock */}
        {isOutOfStock ? (
          <span className="text-[#d9381e] text-[11px] font-[500] tracking-wide mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Currently unavailable
          </span>
        ) : (
          discountPrice && (
            <span className="text-[#8b5a2b] text-[11px] font-[600] tracking-wider mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              ({discountPercent}% OFF)
            </span>
          )
        )}
      </div>
    </div>
  );
});

export default ProductCard;
