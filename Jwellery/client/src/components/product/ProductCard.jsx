import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, getDiscountPercent, getProductImage } from '../../lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
    toast.success('Added to your bag');
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
      className={`group relative flex flex-col h-full bg-white border border-[#F8F4EE] hover:border-[#EAE6DF] transition-all duration-[400ms] ease-out rounded-[2px] p-3 ${shouldReduceMotion ? '' : 'lg:hover:shadow-sm'}`}
    >
      <Link to={`/products/${slug}`} className="block relative overflow-hidden bg-[#F8F4EC] rounded-[2px]" style={{ aspectRatio: '4/5' }}>
        {/* Main image */}
        <motion.img
          src={mainImage}
          alt={name}
          initial={{ opacity: 0.8, scale: shouldReduceMotion ? 1 : 1.02 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`w-full h-full object-contain transition-all duration-[400ms] ease-out group-hover:opacity-0 ${shouldReduceMotion ? '' : 'group-hover:scale-[1.03]'}`}
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />

        {/* Hover image */}
        {images.length > 1 && (
          <img
            src={hoverImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-[400ms] ease-out opacity-0 group-hover:opacity-100 ${shouldReduceMotion ? '' : 'group-hover:scale-[1.03]'}`}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#F8F4EE]/10 transition-opacity duration-[400ms] ease-out opacity-0 lg:group-hover:opacity-100 hidden lg:block" />

        {/* View Product (Hover) */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center transform transition-all duration-[400ms] ease-out translate-y-[10px] opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 hidden lg:flex">
          <span className="text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.12em] text-[#F8F4EE] bg-[#35050D] px-6 py-2.5 shadow-sm rounded-[2px] transition-all duration-300 hover:bg-[#4A0712] border border-[#35050D]">
            View Details &rarr;
          </span>
        </div>
      </Link>

      {/* Badges */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="absolute top-5 left-5 flex flex-col gap-1.5 z-10 pointer-events-none">
        {isOutOfStock && <span className="bg-[#24191A] text-white text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">Sold Out</span>}
        {!isOutOfStock && isNewArrival && <span className="bg-[#4A0712] text-[#F8F4EE] text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">New</span>}
        {!isOutOfStock && isBestSeller && <span className="bg-[#4A0712] text-[#F8F4EE] text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">Bestseller</span>}
        {!isOutOfStock && !isNewArrival && !isBestSeller && stock > 0 && stock <= 5 && <span className="bg-[#4A0712] text-[#F8F4EE] text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[2px] shadow-sm">Limited</span>}
      </motion.div>

      <div className="pt-4 pb-2 text-center flex flex-col flex-1 bg-transparent px-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <Link to={`/products/${slug}`} className="block mb-1.5">
          <h3 className={`text-[12px] lg:text-[13px] text-[#24191A] font-medium leading-relaxed tracking-wide transition-all duration-[400ms] line-clamp-1 translate-y-0 hover:text-[#4A0712] ${shouldReduceMotion ? '' : 'lg:group-hover:-translate-y-[2px]'}`}>
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-center gap-2">
          <span className="text-[12px] lg:text-[13px] font-semibold text-[#4A0712]">{formatPrice(effectivePrice)}</span>
          {discountPrice && <span className="text-[11px] lg:text-[12px] text-[#756869] font-light line-through">{formatPrice(price)}</span>}
        </div>
        
        {/* Action Buttons below price */}
        <div className="mt-4 flex gap-2 w-full pt-3 border-t border-[#F8F4EE]">
          <button
            onClick={handleWishlistToggle}
            disabled={isToggling}
            className="w-10 h-10 border border-[#F8F4EE] rounded-[2px] flex items-center justify-center text-[#756869] hover:text-[#4A0712] hover:bg-[#F8F4EE] transition-colors"
          >
            <Heart size={16} className={wishlisted ? 'fill-[#4A0712] text-[#4A0712]' : ''} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
            className="flex-1 bg-[#35050D] text-[#F8F4EE] text-[11px] font-medium uppercase tracking-[0.12em] py-2 hover:bg-[#4A0712] rounded-[2px] transition-all duration-300 disabled:opacity-60 hover:scale-[1.02] ease-out"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
