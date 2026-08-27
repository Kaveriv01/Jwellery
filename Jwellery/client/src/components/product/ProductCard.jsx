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
    <div className="group flex flex-col h-full bg-[#FFFDFC] border border-[#E8E1D7] transition-all duration-[300ms]">
      
      {/* Main Image Container (Portrait 4:5) */}
      <div className="relative overflow-hidden bg-[#FFFDFC] w-full" style={{ aspectRatio: '4/5' }}>
        <Link to={`/products/${slug}`} className="block w-full h-full relative">
          
          <img
            src={displayImages[0]}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain p-2 md:p-4 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            onError={(e) => { e.target.src = fallbackImg; }}
          />

          {/* Hover Image Crossfade */}
          {hasHoverImage && (
            <img
              src={displayImages[1]}
              alt={name}
              className="absolute inset-0 w-full h-full object-contain p-2 md:p-4 opacity-0 transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 hidden md:block"
              onError={(e) => { e.target.src = fallbackImg; }}
            />
          )}

          {/* Optional Badge */}
          {(isNewArrival || isBestSeller) && (
             <div className="absolute top-3 left-3 z-10 pointer-events-none">
               <span className="text-[9px] font-bold text-[#77716A] uppercase tracking-[0.15em] font-sans">
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
            className="w-8 h-8 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label="Add to Wishlist"
          >
            <Heart 
              size={18} 
              strokeWidth={wishlisted ? 0 : 1.2} 
              className={`transition-all duration-300 ${wishlisted ? 'fill-[#B39A6B] text-[#B39A6B]' : 'text-[#292725] group-hover:text-[#B39A6B]'}`} 
            />
          </button>
        </div>
      </div>

      {/* Info & Action Section */}
      <div className="flex flex-col flex-1 px-4 py-4 md:py-5 border-t border-[#E8E1D7]/50">
        
        <Link to={`/products/${slug}`} className="block mb-2">
          {/* Reserved height for product name ensures price alignment */}
          <h3 className="text-[13px] md:text-[14px] text-[#292725] font-[500] leading-snug tracking-wide hover:text-[#B39A6B] transition-colors font-sans min-h-[38px] md:min-h-[42px] line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 flex-wrap mb-4 font-sans">
          <span className="text-[14px] md:text-[15px] font-[500] text-[#292725]">
            {formatPrice(effectivePrice)}
          </span>
          {discountPrice && (
            <span className="text-[12px] md:text-[13px] text-[#77716A] line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-1">
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock || isAddingLocal}
            className={`w-full py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center font-sans
              ${isOutOfStock 
                ? 'bg-[#F2EEE7] text-[#77716A] cursor-not-allowed' 
                : addSuccess 
                  ? 'bg-[#B39A6B] text-[#FFFDFC]' 
                  : 'bg-transparent border border-[#E8E1D7] text-[#292725] hover:bg-[#F7F4EF] hover:-translate-y-0.5'
              }
            `}
          >
            {isOutOfStock ? 'Out Of Stock' : isAddingLocal ? 'Adding...' : addSuccess ? '✓ Added' : 'Add To Bag'}
          </button>
        </div>
      </div>
      
    </div>
  );
});

export default ProductCard;
