import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
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

  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const {
    _id, name, slug, images = [], price, discountPrice,
    stock = 0, isNewArrival, isBestSeller, category
  } = product;

  const fallbackImg = getFallbackImage(category, name);
  const displayImages = images.length > 0 ? images.map(img => img.url) : [fallbackImg];
  
  const effectivePrice = discountPrice || price;
  const isOutOfStock = false; 
  const wishlisted = isWishlisted(_id);
  const hasHoverImage = displayImages.length > 1;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.variants && product.variants.length > 0) {
      toast('Please select an option first');
      navigate(`/products/${slug}`);
      return;
    }
    
    setIsAddingLocal(true);
    addToCart({ productId: _id, quantity: 1 });
    
    setTimeout(() => {
      setIsAddingLocal(false);
      setAddSuccess(true);
      openCartDrawer();
      setTimeout(() => setAddSuccess(false), 2000);
    }, 400);
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

  return (
    <div className="group flex flex-col h-full bg-transparent transition-all duration-[300ms]">
      
      {/* Main Image Container (Portrait 4:5, Full Bleed) */}
      <div className="premium-image-container relative bg-transparent w-full" style={{ aspectRatio: '4/5' }}>
        <div className="premium-image-inner relative w-full h-full">
          <Link to={`/products/${slug}`} className="block w-full h-full relative">
            
            <img
              src={displayImages[0]}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src = fallbackImg; }}
            />

            {/* Hover Image Crossfade */}
            {hasHoverImage && (
              <img
                src={displayImages[1]}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 hidden md:block"
                onError={(e) => { e.target.src = fallbackImg; }}
              />
            )}

            {/* Optional Badge */}
            {(isNewArrival || isBestSeller) && (
               <div className="absolute top-3 left-3 z-10 pointer-events-none">
                 <span className="text-[9px] font-bold text-[#77716A] uppercase tracking-[0.15em] font-sans bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                   {isBestSeller ? 'Bestseller' : 'New In'}
                 </span>
               </div>
            )}
          </Link>

          {/* Wishlist Icon */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleWishlistToggle}
              disabled={isToggling}
              className="w-8 h-8 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 bg-white/50 hover:bg-white/90 backdrop-blur-sm rounded-full"
              aria-label="Add to Wishlist"
            >
              <Heart 
                size={16} 
                strokeWidth={wishlisted ? 0 : 1.5} 
                className={`transition-all duration-300 ${wishlisted ? 'fill-[#B39A6B] text-[#B79A6B]' : 'text-[#2A2020]'}`} 
              />
            </button>
          </div>

          {/* Hover-Reveal Add to Bag Button overlaying image */}
          <div className="absolute bottom-0 left-0 w-full z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto hidden lg:block">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || isOutOfStock || isAddingLocal}
              className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center font-sans ${isOutOfStock ? "bg-[#3E2024]/80 text-white cursor-not-allowed" : addSuccess ? "bg-[#B79A6B] text-white" : "bg-[#5A3034]/90 backdrop-blur-md text-white hover:bg-[#5A3034]"}`}
            >
              {isOutOfStock ? "Out Of Stock" : isAddingLocal ? "Adding..." : addSuccess ? "✓ Added" : "Add To Bag"}
            </button>
          </div>
        </div>
      </div>

      {/* Info Section (No Button here) */}
      <div className="flex flex-col flex-1 px-1 mt-3">
        
        <Link to={`/products/${slug}`} className="block mb-1">
          {/* Reserved height for product name ensures price alignment */}
          <h3 className="text-[14px] text-[#2A2020] font-[500] leading-snug tracking-wide hover:text-[#B79A6B] transition-colors font-sans min-h-[42px] line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 flex-wrap font-sans">
          <span className="text-[14px] font-[600] text-[#2A2020]">
            {formatPrice(effectivePrice)}
          </span>
          {discountPrice && (
            <span className="text-[13px] text-[#77716A] line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

      </div>
      
    </div>
  );
});

export default ProductCard;
