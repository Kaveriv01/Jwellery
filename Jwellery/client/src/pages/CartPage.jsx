import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, X } from 'lucide-react';
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
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-[2px]" />)}
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-luxury py-24 text-center max-w-md mx-auto">
        <ShoppingBag size={48} strokeWidth={1} className="text-[#B59A68]/40 mx-auto mb-5" />
        <h1 className="text-[24px] sm:text-[28px] text-[#3A0508] font-normal mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your cart is empty</h1>
        <p className="text-[#756B62] text-[14px] font-light mb-8">Add some beautiful jewelry to get started.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#3A0508] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] px-8 py-3.5 transition-all duration-[250ms] border-b-2 border-transparent hover:border-[#B59A68] rounded-[2px]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Cart — Tarini Jewellers</title></Helmet>
      <div className="container-luxury py-12">
        <h1 className="text-[26px] sm:text-[30px] text-[#3A0508] mb-8 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item._id} item={item} onUpdate={(qty) => updateItem({ itemId: item._id, quantity: qty })} onRemove={() => removeItem(item._id)} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#FAF6EE]/30 border border-[#FAF6EE] rounded-[2px] p-6 sticky top-24 space-y-4">
              <h2 className="text-[18px] text-[#3A0508] font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Order Summary</h2>

              {/* Coupon */}
              {cart.coupon?.code ? (
                <div className="flex items-center justify-between bg-[#FAF6EE] border border-[#B59A68]/30 rounded-[2px] p-3">
                  <div className="flex items-center gap-2 text-xs text-[#3A0508]">
                    <Tag size={12} />
                    <span className="font-medium">{cart.coupon.code}</span>
                    <span className="text-[#756B62]">(-{formatPrice(cart.coupon.discountAmount)})</span>
                  </div>
                  <button onClick={removeCoupon}><X size={12} className="text-red-400 hover:text-red-600" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className="input-gold flex-1 py-2 text-[13px] bg-transparent rounded-[2px]" />
                  <button onClick={handleApplyCoupon} disabled={couponLoading} className="px-4 py-2 text-[10px] uppercase tracking-wider font-semibold border border-[#FAF6EE] rounded-[2px] bg-white text-[#3A0508] hover:bg-[#FAF6EE] transition-colors whitespace-nowrap">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}

              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between text-[#756B62]"><span>Subtotal ({summary.totalItems} items)</span><span className="font-medium text-[#332B27]">{formatPrice(summary.subtotal)}</span></div>
                {summary.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span className="font-medium">-{formatPrice(summary.couponDiscount)}</span></div>}
                <div className="flex justify-between text-[#756B62]">
                  <span>Shipping</span>
                  <span className={summary.shippingCharge === 0 ? 'text-[#B59A68] font-medium' : 'font-medium text-[#332B27]'}>{summary.shippingCharge === 0 ? 'FREE' : formatPrice(summary.shippingCharge)}</span>
                </div>
                {summary.giftWrapCharge > 0 && <div className="flex justify-between text-[#756B62]"><span>Gift Wrap</span><span className="font-medium text-[#332B27]">{formatPrice(summary.giftWrapCharge)}</span></div>}
                <div className="flex justify-between text-[#756B62]"><span>GST (3%)</span><span className="font-medium text-[#332B27]">{formatPrice(summary.gstAmount)}</span></div>
                <div className="flex justify-between font-normal text-[#3A0508] text-base pt-3 border-t border-[#FAF6EE]">
                  <span>Total</span>
                  <span className="font-medium text-[#3A0508]">{formatPrice(summary.totalPrice)}</span>
                </div>
              </div>

              {summary.savings > 0 && (
                <div className="bg-green-50/50 rounded-[2px] p-3 text-center text-xs text-green-700">
                  🎉 You're saving <strong>{formatPrice(summary.savings)}</strong> on this order!
                </div>
              )}

              <motion.button
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-[#3A0508] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 flex items-center justify-center gap-2 transition-all duration-[250ms] border-b-2 border-transparent hover:border-[#B59A68] rounded-[2px]"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </motion.button>

              <button
                onClick={() => navigate('/products')}
                className="text-[11px] uppercase tracking-wider text-[#756B62] hover:text-[#3A0508] text-center block w-full transition-colors mt-2"
              >
                Continue Shopping
              </button>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-4 bg-[#FAF6EE]/10 border border-[#FAF6EE] rounded-[2px] p-4 transition-all duration-[250ms]">
      <Link to={`/products/${product.slug}`} className="flex-shrink-0 bg-[#FAF6EE] p-2 border border-[#FAF6EE] rounded-[2px] w-20 h-20 sm:w-24 sm:h-24">
        <img src={image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link to={`/products/${product.slug}`}>
              <h3 className="font-normal text-[#332B27] text-[14px] leading-snug hover:text-[#3A0508] transition-colors">{product.name}</h3>
            </Link>
            <button onClick={onRemove} className="text-[#756B62]/50 hover:text-red-400 flex-shrink-0 transition-colors"><Trash2 size={15} /></button>
          </div>
          {variant?.size && <p className="text-xs text-[#756B62] mt-0.5">Size: {variant.size}</p>}
          {variant?.color && <p className="text-xs text-[#756B62]">Color: {variant.color}</p>}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[#FAF6EE] rounded-[2px] overflow-hidden bg-white">
            <button onClick={() => quantity > 1 && onUpdate(quantity - 1)} disabled={quantity <= 1} className="px-3 py-1 text-[#756B62] hover:bg-[#FAF6EE] disabled:opacity-40"><Minus size={11} /></button>
            <span className="w-8 text-center text-[13px] font-medium text-[#332B27]">{quantity}</span>
            <button onClick={() => onUpdate(quantity + 1)} className="px-3 py-1 text-[#756B62] hover:bg-[#FAF6EE]"><Plus size={11} /></button>
          </div>
          <span className="font-medium text-[#3A0508] text-[14px]">{formatPrice(effectivePrice * quantity)}</span>
        </div>
      </div>
    </motion.div>
  );
}

