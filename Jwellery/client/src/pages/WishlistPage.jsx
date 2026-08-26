import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getProductImage } from '../lib/utils';

export const WishlistPage = () => {
  const { wishlist, moveToCart, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!wishlist.items?.length) {
    return (
      <div className="container-luxury py-24 text-center max-w-md mx-auto">
        <Heart size={48} strokeWidth={1} className="text-[#C5A059]/40 mx-auto mb-4" />
        <h1 className="text-[24px] sm:text-[28px] text-[#1F1517] font-normal mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Your Wishlist is Empty
        </h1>
        <p className="text-[#1F1517] text-[14px] font-light mb-6">
          Save items you love and shop them later.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#1F1517] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] px-8 py-3.5 transition-all duration-[250ms] border-b-2 border-transparent hover:border-[#C5A059] rounded-[2px]"
        >
          Discover Jewelry
        </button>
      </div>
    );
  }

  return (
    <div className="container-luxury py-12">
      <h1 className="text-[26px] sm:text-[30px] text-[#1F1517] mb-8 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        My Wishlist ({wishlist.items.length})
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.items.map(({ product }) => product && (
          <div key={product._id} className="product-card rounded-[2px] overflow-hidden border border-[#FDFBF7] bg-[#FDFBF7]/10 flex flex-col justify-between">
            <div>
              <Link to={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-[#FDFBF7] border-b border-[#FDFBF7] overflow-hidden">
                <img src={getProductImage(product.images)} alt={product.name} className="w-full h-full object-contain p-6 mix-blend-multiply" />
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="text-[13px] text-[#332B27] hover:text-[#1F1517] transition-colors line-clamp-2 block mb-2 font-normal">
                  {product.name}
                </Link>
                <p className="text-[14px] font-medium text-[#1F1517] mb-3">
                  {formatPrice(product.discountPrice || product.price)}
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <div className="flex gap-2">
                <button
                  onClick={() => moveToCart({ productId: product._id })}
                  className="flex-1 bg-[#1F1517] hover:bg-[#220306] text-[#F7F3EA] py-2 text-[10px] font-medium uppercase tracking-[0.12em] rounded-[2px] transition-all"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => toggleWishlist({ productId: product._id })}
                  className="w-8 h-8 border border-[#FDFBF7] rounded-[2px] flex items-center justify-center text-[#1F1517] hover:text-[#1F1517] hover:bg-[#FDFBF7] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

