import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { orderService } from '../services/orderService';
import { formatPrice } from '../lib/utils';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id).then((r) => r.data),
  });

  const order = data?.order;

  return (
    <>
      <Helmet><title>Order Placed — Tarini Jewellers</title></Helmet>
      <div className="container-luxury py-20 text-center max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-16 h-16 rounded-full bg-[#FDFBF7] border border-[#FDFBF7] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-[#C5A059]" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-[32px] text-[#22181C] mb-3 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Order Placed!</h1>
          <p className="text-[#22181C] text-[15px] font-light mb-2">Thank you for shopping with Tarini Jewellers.</p>
          {order && (
            <p className="text-[#C5A059] text-[11px] font-medium tracking-[0.12em] uppercase mb-6">Order #{order.orderNumber}</p>
          )}
          <div className="bg-[#FDFBF7]/30 border border-[#FDFBF7] rounded-[2px] p-6 text-left mb-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-[#FDFBF7] pb-4">
              <div>
                <p className="text-[10px] text-[#22181C] uppercase tracking-widest">Order ID</p>
                <p className="text-[13px] font-medium text-[#22181C] uppercase">#{order?.orderNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#22181C] uppercase tracking-widest">Payment</p>
                <p className="text-[13px] font-medium text-[#C5A059] uppercase">Successful</p>
              </div>
              <div>
                <p className="text-[10px] text-[#22181C] uppercase tracking-widest">Order Status</p>
                <p className="text-[13px] font-medium text-[#C5A059] uppercase">Confirmed</p>
              </div>
            </div>

            {/* Address */}
            {order?.shippingAddress && (
              <div className="border-b border-[#FDFBF7] pb-4">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#22181C] mb-2">Delivery Address</h3>
                <p className="text-[13px] text-[#332B27] font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-[13px] text-[#22181C] mt-1">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className="text-[13px] text-[#22181C]">{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="text-[13px] text-[#22181C] mt-1">Mobile: {order.shippingAddress.phone}</p>
              </div>
            )}

            {/* Items */}
            <div className="border-b border-[#FDFBF7] pb-4">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#22181C] mb-3">Order Details</h3>
              <div className="space-y-3">
                {order?.items?.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} alt={item.name} className="w-12 h-12 rounded-[2px] object-contain p-1 bg-[#FDFBF7] border border-[#FDFBF7]" />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[#332B27]">{item.name}</p>
                      <div className="flex gap-2 items-center text-[11px] text-[#22181C]/80 mt-0.5">
                        {item.variant?.size && <span>Size: {item.variant.size}</span>}
                        {item.variant?.color && <span>Finish: {item.variant.color}</span>}
                      </div>
                      <p className="text-[11px] text-[#22181C]/80">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-medium text-[#22181C]">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Details */}
            {order && (
              <div className="pb-2 space-y-2 text-[13px] text-[#22181C]">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#22181C] mb-3">Price Details</h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.itemsPrice)}</span>
                </div>
                {order.shippingPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shippingPrice)}</span>
                  </div>
                )}
                {order.taxPrice > 0 && (
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>{formatPrice(order.taxPrice)}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-[#FDFBF7] flex justify-between font-medium text-[#22181C] text-[15px]">
                  <span>Total Paid</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            )}

            <div className="bg-[#F7F3EA]/50 p-3 text-center border border-[#FDFBF7] rounded-[2px] mt-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#22181C]">Estimated Delivery: 3–7 Business Days</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/profile/orders/${id}`} className="bg-[#22181C] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 px-6 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#C5A059] flex items-center justify-center gap-2">
              <Package size={14} /> Track Order
            </Link>
            <Link to="/products" className="border border-[#FDFBF7] bg-white text-[#22181C] hover:bg-[#FDFBF7] py-3.5 px-6 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[2px] transition-all flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

