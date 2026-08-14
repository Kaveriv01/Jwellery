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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#FAF6EE] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-[#B59A68]" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-[32px] text-[#3A0508] mb-3 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Order Placed!</h1>
          <p className="text-[#756B62] text-[15px] font-light mb-2">Thank you for shopping with Tarini Jewellers.</p>
          {order && (
            <p className="text-[#B59A68] text-[11px] font-medium tracking-[0.12em] uppercase mb-6">Order #{order.orderNumber}</p>
          )}
          <div className="bg-[#FAF6EE]/30 border border-[#FAF6EE] rounded-[2px] p-6 text-left mb-8 space-y-3">
            {order?.items?.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 rounded-[2px] object-contain p-1 bg-[#FAF6EE] border border-[#FAF6EE]" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#332B27]">{item.name}</p>
                  <p className="text-[11px] text-[#756B62]/80">Qty: {item.quantity}</p>
                </div>
                <p className="text-[13px] font-medium text-[#3A0508]">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
              </div>
            ))}
            {order && (
              <div className="pt-3 border-t border-[#FAF6EE] flex justify-between font-normal text-[#3A0508]">
                <span>Total</span>
                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/profile/orders/${id}`} className="bg-[#3A0508] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 px-6 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#B59A68] flex items-center justify-center gap-2">
              <Package size={14} /> Track Order
            </Link>
            <Link to="/products" className="border border-[#FAF6EE] bg-white text-[#3A0508] hover:bg-[#FAF6EE] py-3.5 px-6 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[2px] transition-all flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

