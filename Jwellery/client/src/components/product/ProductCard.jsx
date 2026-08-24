import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
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

  const shouldReduceMotion = useReducedMotion();
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <div
      className="group flex flex-col h-full bg-white transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-transparent hover:border-gray-100 p-2 sm:p-3"
    >
      <Link to={`/products/${slug}`} className="block relative overflow-hidden bg-gray-50/50 mb-3 rounded-[2px]" style={{ aspectRatio: '1/1' }}>
        {/* Main image */}
        <img
          src={mainImage}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:opacity-0 ${shouldReduceMotion ? '' : 'group-hover:scale-105'}`}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
        />

        {/* Hover image */}
        {images.length > 1 && (
          <img
            src={hoverImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 ${shouldReduceMotion ? '' : 'group-hover:scale-105'}`}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
          />
        )}

        {/* GIVA Style Badges */}
        <div className="absolute top-0 left-0 flex flex-col z-10 pointer-events-none items-start">
          {/* Main Gold Ribbon */}
          {(isNewArrival || isBestSeller || true) && (
             <div className="bg-[#D4AF37] text-black text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 uppercase tracking-wider relative shadow-sm">
               {isBestSeller ? 'BESTSELLER' : (isNewArrival ? 'NEW ARRIVAL' : 'PURE GOLD')}
               {/* Triangle Cutout Simulation */}
               <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-b-[10px] sm:border-b-[12px] border-b-transparent border-l-[6px] sm:border-l-[8px] border-l-[#D4AF37]" />
             </div>
          )}
          
          {/* Secondary Badge */}
          {discountPrice && (
            <div className="text-[#E8345E] text-[9px] sm:text-[10px] font-[600] bg-white/95 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 mt-1.5 ml-1 w-fit rounded-[2px] shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-[#111] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 mt-1.5 ml-1 w-fit rounded-[2px] shadow-sm">
              SOLD OUT
            </div>
          )}
        </div>
      </Link>

      {/* Info Section (Left-aligned) */}
      <div className="flex flex-col flex-1 bg-white relative">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className="text-[14px] sm:text-[16px] font-[700] text-[#111]">{formatPrice(effectivePrice)}</span>
            {discountPrice && <span className="text-[12px] sm:text-[13px] text-gray-400 line-through font-medium">{formatPrice(price)}</span>}
          </div>
          <button
            onClick={handleWishlistToggle}
            disabled={isToggling}
            className="text-gray-400 hover:text-[#E8345E] transition-colors"
            aria-label="Add to Wishlist"
          >
            <Heart size={16} className={wishlisted ? 'fill-[#E8345E] text-[#E8345E]' : ''} />
          </button>
        </div>

        <Link to={`/products/${slug}`} className="block mb-4 sm:mb-5">
          <h3 className="text-[12px] sm:text-[14px] text-gray-700 font-[400] leading-snug line-clamp-2 hover:text-[#111] transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {name}
          </h3>
        </Link>
        
        {/* Permanent Add to Cart Button */}
        <div className="mt-auto pt-2 w-full">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
            className="w-full bg-[#E8345E] text-white text-[12px] sm:text-[13px] font-[600] uppercase py-2 sm:py-2.5 rounded-[2px] hover:bg-[#D0264F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {isOutOfStock ? 'Sold Out' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
