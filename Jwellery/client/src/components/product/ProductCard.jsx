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
    <motion.div
      className={`group relative flex flex-col h-full bg-white transition-all duration-500 ease-out lg:hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] lg:hover:-translate-y-1 p-2 rounded-[4px] border border-transparent hover:border-gray-100`}
    >
      <Link to={`/products/${slug}`} className="block relative overflow-hidden bg-white rounded-[2px]" style={{ aspectRatio: '1/1' }}>
        {/* Main image */}
        <motion.img
          src={mainImage}
          alt={name}
          initial={{ opacity: 0.8 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:opacity-0 ${shouldReduceMotion ? '' : 'group-hover:scale-[1.04]'}`}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
        />

        {/* Hover image */}
        {images.length > 1 && (
          <img
            src={hoverImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 ${shouldReduceMotion ? '' : 'group-hover:scale-[1.04]'}`}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'; }}
          />
        )}

        {/* GIVA Style Badges (Ribbons) */}
        <div className="absolute top-0 left-0 flex flex-col z-10 pointer-events-none items-start">
          {/* Main Gold Ribbon */}
          {(isNewArrival || isBestSeller) && (
             <div className="bg-[#E6C687] text-[#111] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}>
               {isBestSeller ? 'BESTSELLER' : 'NEW ARRIVAL'}
             </div>
          )}
          
          {/* Secondary Badge (like 0% making charges / sale) */}
          {discountPrice && (
            <div className="text-[#D81B60] text-[10px] font-semibold bg-white/90 backdrop-blur-sm px-2 py-1 mt-1 ml-1 rounded-sm shadow-sm w-fit">
              {discountPercent}% OFF
            </div>
          )}

          {isOutOfStock && (
            <div className="bg-[#111] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider mt-1 ml-1 shadow-sm w-fit">
              SOLD OUT
            </div>
          )}
        </div>

        {/* Floating Actions on Hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 lg:translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlistToggle}
            disabled={isToggling}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#111] hover:text-[#B59A68] hover:bg-white transition-colors rounded-full"
            aria-label="Add to Wishlist"
          >
            <Heart size={15} className={wishlisted ? 'fill-[#111] text-[#111]' : ''} />
          </button>
        </div>

        {/* Quick Add Button on Hover */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center lg:opacity-0 group-hover:opacity-100 transition-all duration-300 lg:translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
            className="w-full bg-[#111]/95 backdrop-blur-sm text-white text-[11px] font-[600] uppercase tracking-[0.1em] py-3 shadow-lg hover:bg-[#111] transition-all duration-300 disabled:opacity-60 rounded-[2px]"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      <div className="pt-4 pb-2 flex flex-col flex-1 bg-transparent px-1 text-center">
        <Link to={`/products/${slug}`} className="block mb-1">
          <h3 className="text-[13px] lg:text-[14px] text-gray-800 font-[400] leading-relaxed tracking-wide line-clamp-1 transition-colors hover:text-[#B59A68]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <span className="text-[14px] lg:text-[15px] font-[600] text-[#111]">{formatPrice(effectivePrice)}</span>
          {discountPrice && <span className="text-[12px] lg:text-[13px] text-gray-400 line-through font-medium">{formatPrice(price)}</span>}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
