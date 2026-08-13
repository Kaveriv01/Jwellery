import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getProductImage } from '../lib/utils';

/** Stub page factory for remaining pages */
const StubPage = ({ title, desc }) => (
  <div className="container-luxury py-16 text-center max-w-lg mx-auto">
    <h1 className="font-serif text-4xl text-gray-900 mb-3">{title}</h1>
    <p className="text-gray-500">{desc}</p>
  </div>
);

export const WishlistPage = () => {
  const { wishlist, moveToCart, toggleWishlist } = useWishlist();

  if (!wishlist.items?.length) return <div className="container-luxury py-20 text-center"><Heart size={56} className="text-gray-200 mx-auto mb-4" /><h1 className="font-serif text-3xl text-gray-700 mb-2">Your wishlist is empty</h1><p className="text-gray-400 mb-6">Save items you love and shop them later.</p><Link to="/products" className="btn-gold rounded-xl">Discover Jewelry</Link></div>;
  return (
    <div className="container-luxury py-10">
      <h1 className="font-serif text-3xl text-gray-900 mb-8">My Wishlist ({wishlist.items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.items.map(({ product }) => product && (
          <div key={product._id} className="product-card rounded-xl overflow-hidden border border-gray-100">
            <Link to={`/products/${product.slug}`}><img src={getProductImage(product.images)} alt={product.name} className="w-full aspect-[4/5] object-cover" /></Link>
            <div className="p-3">
              <Link to={`/products/${product.slug}`} className="text-sm font-medium text-gray-800 line-clamp-2 block mb-2">{product.name}</Link>
              <p className="text-sm font-bold text-[#c9a84c] mb-3">{formatPrice(product.discountPrice || product.price)}</p>
              <div className="flex gap-2">
                <button onClick={() => moveToCart({ productId: product._id })} className="flex-1 btn-gold rounded-lg py-1.5 text-[10px]">Move to Cart</button>
                <button onClick={() => toggleWishlist({ productId: product._id })} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
