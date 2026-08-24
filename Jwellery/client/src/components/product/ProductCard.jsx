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
  const isOutOfStock = stock === 0;
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
    <div className="group flex flex-col h-full bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-transparent p-3 rounded-md">
      
      {/* Image Container */}
      <Link to={`/products/${slug}`} className="block relative overflow-hidden bg-[#f8f8f8] mb-4 rounded-sm" style={{ aspectRatio: '1/1' }}>
        
        {/* Images with Tanishq Slide Transition */}
        <div className="relative w-full h-full flex">
          <img
            src={mainImage}
            alt={name}
            className={`absolute w-full h-full object-cover transition-transform duration-700 ease-in-out ${hasHoverImage ? 'group-hover:-translate-x-full' : ''}`}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
          />
          {hasHoverImage && (
            <img
              src={hoverImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out translate-x-full group-hover:translate-x-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
            />
          )}
        </div>

        {/* Tanishq Style Top-Left Pill Badge */}
        {(isNewArrival || isBestSeller || true) && (
           <div className="absolute top-2 left-2 z-10">
             <div className="bg-[#8b5a2b] text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
        
        {/* Hover Action Buttons (Slide Up Bottom-Right) */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col sm:flex-row gap-2 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto overflow-hidden">
           
           <button 
             onClick={(e) => { e.preventDefault(); navigate(`/products/${slug}`); }}
             className="hidden sm:flex items-center gap-1.5 bg-white text-[#630015] px-3 py-1.5 rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-[11px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
             style={{ fontFamily: "'Montserrat', sans-serif" }}
           >
             <Search size={12} strokeWidth={2.5} /> Similar
           </button>

           <button 
             onClick={handleAddToCart}
             disabled={isAddingToCart || isOutOfStock}
             className="flex items-center gap-1.5 bg-[#630015] text-white px-3 py-1.5 rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-[11px] font-bold uppercase tracking-wider hover:bg-[#82001c] transition-colors disabled:opacity-70"
             style={{ fontFamily: "'Montserrat', sans-serif" }}
           >
             <ShoppingBag size={12} strokeWidth={2.5} /> {isOutOfStock ? 'Sold' : 'Add'}
           </button>
        </div>

      </Link>

      {/* Info Section (Tanishq Typography) */}
      <div className="flex flex-col flex-1 px-1">
        <Link to={`/products/${slug}`} className="block mb-1.5">
          <h3 className="text-[14px] sm:text-[16px] text-gray-800 font-[600] leading-snug line-clamp-2 hover:text-[#8b5a2b] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-[16px] sm:text-[18px] font-[700] text-[#111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {formatPrice(effectivePrice)}
          </span>
          {discountPrice && (
            <span className="text-[12px] text-gray-400 line-through font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Small Tanishq style stock alert if out of stock */}
        {isOutOfStock ? (
          <span className="text-[#d9381e] text-[11px] font-[500] tracking-wide mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Currently unavailable
          </span>
        ) : (
          discountPrice && (
            <span className="text-[#8b5a2b] text-[11px] font-[600] tracking-wider mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              ({discountPercent}% OFF)
            </span>
          )
        )}
      </div>
    </div>
  );
});

export default ProductCard;
