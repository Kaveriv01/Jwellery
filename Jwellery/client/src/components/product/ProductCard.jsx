import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { openCartDrawer } from '../cart/CartDrawer';
import ProductQuickViewModal from './ProductQuickViewModal';

const getFallbackImage = (categoryObj, productName) => {
  const catName = categoryObj?.name?.toLowerCase() || productName?.toLowerCase() || '';
  if (catName.includes('ring')) return '/images/cat-ring.png';
  if (catName.includes('earring')) return '/images/cat-earrings.png';
  if (catName.includes('necklace')) return '/images/cat-necklace.png';
  if (catName.includes('bracelet')) return '/images/cat-bracelet.png';
  return '/images/cat-necklace-floral.png';
};

const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist();
  const navigate = useNavigate();

  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

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
    <div className="group flex flex-col h-full bg-transparent">
      
      {/* Main Image Container (Portrait 4:5, Calm Luxury Presentation) */}
      <div className="relative bg-[#FAF8F5] w-full overflow-hidden rounded-[2px]" style={{ aspectRatio: '4/5' }}>
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
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 hidden md:block"
              onError={(e) => { e.target.src = fallbackImg; }}
            />
          )}

          {/* Optional Badge */}
          {(isNewArrival || isBestSeller) && (
             <div className="absolute top-3 left-3 z-10 pointer-events-none">
               <span className="text-[9px] font-bold text-[#1F1517] uppercase tracking-[0.15em] font-sans bg-white/90 px-2.5 py-1 rounded-[1px] border border-[#EAE6DF]/60">
                 {isBestSeller ? 'Bestseller' : 'New In'}
               </span>
             </div>
          )}
        </Link>

        {/* Wishlist & Quick View Actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={handleWishlistToggle}
            disabled={isToggling}
            className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white text-[#1F1517] rounded-full shadow-sm transition-all duration-200"
            aria-label="Add to Wishlist"
          >
            <Heart 
              size={15} 
              strokeWidth={wishlisted ? 0 : 1.5} 
              className={wishlisted ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#1F1517]'} 
            />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-[#1F1517] hover:text-white text-[#1F1517] rounded-full shadow-sm transition-all duration-200"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={14} strokeWidth={1.75} />
          </button>
        </div>

        {/* Clean Fade-In Add to Bag & Quick View Overlay on image */}
        <div className="absolute bottom-0 left-0 w-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto hidden lg:flex">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="w-1/3 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 flex items-center justify-center font-sans bg-[#C5A059] text-[#160B0E] hover:bg-[#d8b56f]"
          >
            <Eye size={13} className="mr-1" /> Quick View
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock || isAddingLocal}
            className={`w-2/3 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 flex items-center justify-center font-sans ${isOutOfStock ? "bg-[#1F1517]/80 text-white cursor-not-allowed" : addSuccess ? "bg-emerald-700 text-white" : "bg-[#1F1517] text-white hover:bg-[#2A2020]"}`}
          >
            {isOutOfStock ? "Out Of Stock" : isAddingLocal ? "Adding..." : addSuccess ? "✓ Added" : "Add To Bag"}
          </button>
        </div>
      </div>

      {/* Info Section (No Button here) */}
      <div className="flex flex-col flex-1 px-1 mt-3">
        
        <Link to={`/products/${slug}`} className="block mb-1">
          {/* Reserved height for product name ensures price alignment */}
          <h3 className="text-[13px] sm:text-[14px] text-[#1F1517] font-normal leading-snug tracking-wider hover:text-[#C5A059] transition-colors font-cinzel uppercase min-h-[42px] line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 flex-wrap font-montserrat">
          <span className="text-[14px] font-bold text-[#1F1517]">
            {formatPrice(effectivePrice)}
          </span>
          {discountPrice && (
            <span className="text-[12px] text-[#756A63] line-through font-medium">
              {formatPrice(price)}
            </span>
          )}
        </div>

      </div>

      {/* Shadcn Quick View Dialog Modal */}
      <ProductQuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </div>
  );
});

export default ProductCard;
