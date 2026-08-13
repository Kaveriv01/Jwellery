import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, X, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, getProductImage } from '../lib/utils';
import { useState } from 'react';

export default function CartPage() {
  const {
    cart, summary, updateItem, removeItem,
    applyCoupon, removeCoupon, isLoading,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try { await applyCoupon({ code: couponInput }); setCouponInput(''); }
    finally { setCouponLoading(false); }
  };

  if (isLoading) {
    return (
      <div className="container-luxury py-12">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-luxury py-20 text-center">
        <ShoppingBag size={64} className="text-gray-200 mx-auto mb-5" />
        <h1 className="font-serif text-3xl text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some beautiful jewelry to get started.</p>
        <Link to="/products" className="btn-gold rounded-xl">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Cart — Jwellery</title></Helmet>
      <div className="container-luxury py-10">
        <h1 className="font-serif text-3xl text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item._id} item={item} onUpdate={(qty) => updateItem({ itemId: item._id, quantity: qty })} onRemove={() => removeItem(item._id)} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-gray-900 text-lg">Order Summary</h2>

              {/* Coupon */}
              {cart.coupon?.code ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Tag size={14} />
                    <span className="font-semibold">{cart.coupon.code}</span>
                    <span>(-{formatPrice(cart.coupon.discountAmount)})</span>
                  </div>
                  <button onClick={removeCoupon}><X size={14} className="text-red-400" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className="input-gold flex-1 py-2 text-sm" />
                  <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-outline-gold px-4 py-2 text-xs rounded-lg whitespace-nowrap">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal ({summary.totalItems} items)</span><span>{formatPrice(summary.subtotal)}</span></div>
                {summary.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-{formatPrice(summary.couponDiscount)}</span></div>}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={summary.shippingCharge === 0 ? 'text-green-600 font-medium' : ''}>{summary.shippingCharge === 0 ? 'FREE' : formatPrice(summary.shippingCharge)}</span>
                </div>
                {summary.giftWrapCharge > 0 && <div className="flex justify-between text-gray-600"><span>Gift Wrap</span><span>{formatPrice(summary.giftWrapCharge)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>GST (3%)</span><span>{formatPrice(summary.gstAmount)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#c9a84c]">{formatPrice(summary.totalPrice)}</span>
                </div>
              </div>

              {summary.savings > 0 && (
                <div className="bg-green-50 rounded-xl p-3 text-center text-xs text-green-700">
                  🎉 You're saving <strong>{formatPrice(summary.savings)}</strong> on this order!
                </div>
              )}

              <motion.button
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-gold w-full rounded-xl flex items-center justify-center gap-2 py-3.5"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </motion.button>

              <Link to="/products" className="block text-center text-xs text-gray-400 hover:text-gray-600">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CartItem({ item, onUpdate, onRemove }) {
  const { product, quantity, price, discountPrice, variant } = item;
  if (!product) return null;
  const image = getProductImage(product.images);
  const effectivePrice = discountPrice || price;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
      <Link to={`/products/${product.slug}`} className="flex-shrink-0">
        <img src={image} alt={product.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-800 text-sm leading-snug hover:text-[#c9a84c] transition-colors">{product.name}</h3>
          </Link>
          <button onClick={onRemove} className="text-gray-300 hover:text-red-400 flex-shrink-0 transition-colors"><Trash2 size={16} /></button>
        </div>
        {variant?.size && <p className="text-xs text-gray-400 mt-0.5">Size: {variant.size}</p>}
        {variant?.color && <p className="text-xs text-gray-400">Color: {variant.color}</p>}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => quantity > 1 && onUpdate(quantity - 1)} disabled={quantity <= 1} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40"><Minus size={12} /></button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button onClick={() => onUpdate(quantity + 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100"><Plus size={12} /></button>
          </div>
          <span className="font-bold text-gray-900">{formatPrice(effectivePrice * quantity)}</span>
        </div>
      </div>
    </motion.div>
  );
}
