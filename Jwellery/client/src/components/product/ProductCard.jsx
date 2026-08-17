import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, getDiscountPercent, getProductImage } from '../../lib/utils';
import { toast } from 'sonner';

const ProductCard = memo(function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist();

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
    addToCart({ productId: _id, quantity: 1 });
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

  return (
    <motion.div
      className={`group relative flex flex-col h-full bg-white border border-[#FAF6EE] hover:border-[#B59A68]/30 transition-all duration-[450ms] ease-out rounded-[2px] p-2.5 ${shouldReduceMotion ? '' : 'lg:hover:-translate-y-[3px] lg:hover:shadow-[0_8px_20px_rgba(58,5,8,0.02)]'}`}
    >
      <Link to={`/products/${slug}`} className="block relative overflow-hidden bg-[#F8F4EC] rounded-[2px]" style={{ aspectRatio: '4/5' }}>
        {/* Main image */}
        <motion.img
          src={mainImage}
          alt={name}
          initial={{ opacity: 0.7, scale: shouldReduceMotion ? 1 : 1.02 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`w-full h-full object-cover transition-all duration-[450ms] ease-out group-hover:opacity-0 lg:group-hover:brightness-95 ${shouldReduceMotion ? '' : 'group-hover:scale-[1.02]'}`}
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />

        {/* Hover image */}
        {images.length > 1 && (
          <img
            src={hoverImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[450ms] ease-out opacity-0 lg:group-hover:brightness-95 group-hover:opacity-100 ${shouldReduceMotion ? '' : 'group-hover:scale-[1.02]'}`}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#F8F4EC]/10 transition-opacity duration-[450ms] ease-out opacity-0 lg:group-hover:opacity-100 hidden lg:block" />

        {/* View Product (Hover) */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center transform transition-all duration-[450ms] ease-out translate-y-[10px] opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 hidden lg:flex">
          <span className="text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] text-[#F7F3EA] bg-[#3A0508]/90 backdrop-blur-sm px-6 py-2.5 shadow-sm rounded-[2px] transition-all duration-300 hover:bg-[#220306] border-b-2 border-transparent hover:border-[#B59A68]">
            View Details &rarr;
          </span>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={isToggling}
        type="button"
        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-[450ms] z-30 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer ${shouldReduceMotion ? '' : 'hover:scale-[1.08] hover:shadow-[0_4px_12px_rgba(86,8,23,0.05)]'}`}
        aria-label="Toggle wishlist"
      >
        <motion.div
          initial={false}
          animate={{ scale: (wishlisted && !shouldReduceMotion) ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none"
        >
          <Heart size={14} className={`transition-colors duration-300 ${wishlisted ? 'fill-[#B59A68] text-[#B59A68] drop-shadow-[0_0_4px_rgba(181,154,104,0.3)]' : 'text-[#3A0508]/70 hover:text-[#B59A68]'}`} />
        </motion.div>
      </button>

      {/* Add to Cart Button (Quick Add) */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || isOutOfStock}
        type="button"
        className={`absolute top-14 right-4 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-[450ms] z-30 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer ${shouldReduceMotion ? '' : 'hover:scale-[1.08] hover:shadow-[0_4px_12px_rgba(86,8,23,0.05)]'} disabled:opacity-50`}
        aria-label="Add to cart"
      >
        <ShoppingBag size={14} className="text-[#3A0508]/70 hover:text-[#B59A68] transition-colors duration-300" />
      </button>

      {/* Badges */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
        {isOutOfStock && <span className="bg-[#332B27] text-white text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">Sold Out</span>}
        {!isOutOfStock && isNewArrival && <span className="bg-[#3A0508] text-white text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">New</span>}
        {!isOutOfStock && isBestSeller && <span className="bg-[#3A0508] text-white text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">Bestseller</span>}
        {!isOutOfStock && !isNewArrival && !isBestSeller && stock > 0 && stock <= 5 && <span className="bg-[#3A0508] text-white text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">Limited</span>}
      </motion.div>

      <div className="pt-4 pb-2 text-center flex flex-col flex-1 bg-transparent">
        <Link to={`/products/${slug}`} className="block mb-2">
          <h3 className={`text-[12px] lg:text-[13px] text-[#332B27] font-medium leading-relaxed tracking-wide transition-all duration-[450ms] line-clamp-1 translate-y-0 hover:text-[#3A0508] ${shouldReduceMotion ? '' : 'lg:group-hover:-translate-y-[2px]'}`}>
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-center gap-2">
          <span className="text-[13px] lg:text-[14px] font-medium text-[#3A0508]">{formatPrice(effectivePrice)}</span>
          {discountPrice && <span className="text-[11px] lg:text-[12px] text-[#756B62] line-through">{formatPrice(price)}</span>}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
