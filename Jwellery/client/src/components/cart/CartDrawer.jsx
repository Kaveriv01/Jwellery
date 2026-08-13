import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getProductImage } from '../../lib/utils';

// ── Global cart drawer state (simple store) ────────────────────────────────────
let _setOpen;
export const openCartDrawer = () => _setOpen?.(true);
export const closeCartDrawer = () => _setOpen?.(false);

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const { cart, summary, updateItem, removeItem, applyCoupon, removeCoupon } = useCart();
  const { isAuthenticated } = useAuth();

  // Register global opener
  useEffect(() => { _setOpen = setOpen; return () => { _setOpen = undefined; }; }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon({ code: couponInput });
      setCouponInput('');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EFE8DC]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#C6A15B]" strokeWidth={1.5} />
                <h2 className="font-light tracking-wide text-xl text-[#1E1E1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Cart</h2>
                {summary.totalItems > 0 && (
                  <span className="w-5 h-5 bg-[#C6A15B] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {summary.totalItems}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:rotate-90 transition-all duration-300 text-[#1E1E1E] hover:text-[#C6A15B]">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#FAF8F3]">
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} strokeWidth={1} className="text-gray-300 mb-6" />
                  <p className="text-[#6D6254] font-medium tracking-wide mb-6">Login to view your cart</p>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-gold rounded-sm px-8 py-3 text-xs tracking-widest uppercase shadow-md hover:shadow-lg transition-shadow">Login</Link>
                </div>
              ) : cart.items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} strokeWidth={1} className="text-gray-300 mb-6" />
                  <p className="font-medium text-[#1E1E1E] mb-2 tracking-wide">Your cart is empty</p>
                  <p className="text-xs text-[#6D6254] mb-8 tracking-wide">Add something beautiful!</p>
                  <Link to="/products" onClick={() => setOpen(false)} className="btn-gold rounded-sm px-8 py-3 text-xs tracking-widest uppercase shadow-md hover:shadow-lg transition-shadow">Shop Now</Link>
                </div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <CartItem
                        key={item._id}
                        item={item}
                        onUpdate={(qty) => updateItem({ itemId: item._id, quantity: qty })}
                        onRemove={() => removeItem(item._id)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Free shipping progress */}
                  {summary.amountForFreeShipping > 0 && (
                    <motion.div variants={itemVariant} className="bg-white border border-[#EFE8DC] rounded-sm p-4 mt-6">
                      <p className="text-[11px] text-[#6D6254] mb-3 tracking-wide">
                        Add <span className="font-semibold text-[#C6A15B]">{formatPrice(summary.amountForFreeShipping)}</span> more for FREE shipping!
                      </p>
                      <div className="h-1 bg-[#FAF8F3] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((summary.subtotal - (summary.couponDiscount || 0)) / 999) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-[#C6A15B] rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                  {summary.amountForFreeShipping === 0 && (
                    <motion.div variants={itemVariant} className="bg-green-50/50 border border-green-100 rounded-sm p-4 text-center mt-6">
                      <p className="text-xs text-green-600 font-medium tracking-wide">✨ You've unlocked FREE shipping!</p>
                    </motion.div>
                  )}

                  {/* Coupon */}
                  <motion.div variants={itemVariant} className="pt-2">
                    {cart.coupon?.code ? (
                      <div className="flex items-center justify-between bg-white border border-green-100 rounded-sm p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <Tag size={16} className="text-green-600" />
                          <div>
                            <span className="block text-xs font-semibold text-green-700 tracking-wide">{cart.coupon.code} applied</span>
                            <span className="text-[10px] text-green-600 font-medium">-{formatPrice(cart.coupon.discountAmount)}</span>
                          </div>
                        </div>
                        <button onClick={removeCoupon} className="text-xs text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest font-semibold text-[10px]">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 bg-white border border-[#EFE8DC] text-xs px-4 py-3 outline-none focus:border-[#C6A15B] transition-colors rounded-sm tracking-wide text-[#1E1E1E]"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="bg-[#1E1E1E] text-white px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C6A15B] transition-colors disabled:opacity-50 rounded-sm"
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Summary + CTA */}
            {isAuthenticated && cart.items?.length > 0 && (
              <div className="border-t border-[#EFE8DC] px-6 py-6 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs text-[#6D6254] tracking-wide">
                    <span>Subtotal</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  {summary.couponDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 tracking-wide">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(summary.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-[#6D6254] tracking-wide">
                    <span>Shipping</span>
                    <span className={summary.shippingCharge === 0 ? 'text-green-600 font-medium tracking-wide' : ''}>
                      {summary.shippingCharge === 0 ? 'FREE' : formatPrice(summary.shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#6D6254] tracking-wide">
                    <span>GST (3%)</span>
                    <span>{formatPrice(summary.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#1E1E1E] text-lg pt-4 border-t border-[#EFE8DC]">
                    <span>Total</span>
                    <motion.span 
                      key={summary.totalPrice} 
                      initial={{ scale: 1.1, color: '#C6A15B' }} 
                      animate={{ scale: 1, color: '#1E1E1E' }} 
                      transition={{ duration: 0.3 }}
                    >
                      {formatPrice(summary.totalPrice)}
                    </motion.span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="w-full bg-[#1E1E1E] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#C6A15B] transition-colors rounded-sm shadow-md group relative overflow-hidden"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[20deg]" />
                  Proceed to Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="block text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-[#6D6254] hover:text-[#C6A15B] transition-colors mt-4"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Cart Item sub-component ────────────────────────────────────────────────────
function CartItem({ item, onUpdate, onRemove }) {
  const { product, quantity, price, discountPrice, variant } = item;
  if (!product) return null;

  const image = getProductImage(product.images);
  const effectivePrice = discountPrice || price;

  return (
    <motion.div 
      layout
      variants={itemVariant}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="flex gap-4 bg-white rounded-sm border border-[#EFE8DC] p-3 shadow-sm hover:shadow-md transition-shadow group/item"
    >
      <Link to={`/products/${product.slug}`} className="flex-shrink-0 w-20 h-24 overflow-hidden rounded-sm relative">
        <img src={image} alt={product.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col py-1">
        <Link to={`/products/${product.slug}`}>
          <p className="text-xs font-medium text-[#1E1E1E] leading-snug line-clamp-2 hover:text-[#C6A15B] transition-colors">{product.name}</p>
        </Link>
        <div className="mt-1 mb-auto">
          {variant?.size && <p className="text-[10px] text-[#6D6254] tracking-wide">Size: {variant.size}</p>}
          {variant?.color && <p className="text-[10px] text-[#6D6254] tracking-wide">Color: {variant.color}</p>}
        </div>
        <div className="flex items-end justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-1 border border-[#EFE8DC] rounded-sm bg-[#FAF8F3]">
            <button
              onClick={() => quantity > 1 && onUpdate(quantity - 1)}
              disabled={quantity <= 1}
              className="p-1.5 text-[#6D6254] hover:text-[#1E1E1E] disabled:opacity-30 transition-colors"
            >
              <Minus size={12} strokeWidth={2} />
            </button>
            <motion.span 
              key={quantity}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-6 text-center text-xs font-medium text-[#1E1E1E]"
            >
              {quantity}
            </motion.span>
            <button
              onClick={() => onUpdate(quantity + 1)}
              className="p-1.5 text-[#6D6254] hover:text-[#1E1E1E] transition-colors"
            >
              <Plus size={12} strokeWidth={2} />
            </button>
          </div>
          {/* Price + Remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#1E1E1E]">{formatPrice(effectivePrice * quantity)}</span>
            <button onClick={onRemove} className="text-gray-300 hover:text-red-500 hover:scale-110 transition-all duration-300" aria-label="Remove item">
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
