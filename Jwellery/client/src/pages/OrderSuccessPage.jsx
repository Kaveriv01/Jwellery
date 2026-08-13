import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate } from '../lib/utils';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id).then((r) => r.data),
  });

  const order = data?.order;

  return (
    <>
      <Helmet><title>Order Placed — Jwellery</title></Helmet>
      <div className="container-luxury py-16 text-center max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-serif text-4xl text-gray-900 mb-3">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Thank you for shopping with Jwellery.</p>
          {order && (
            <p className="text-[#c9a84c] font-semibold mb-6">Order #{order.orderNumber}</p>
          )}
          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 space-y-3">
            {order?.items?.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
              </div>
            ))}
            {order && (
              <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#c9a84c]">{formatPrice(order.totalPrice)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/profile/orders/${id}`} className="btn-gold rounded-xl flex items-center justify-center gap-2 py-3 px-6">
              <Package size={16} /> Track Order
            </Link>
            <Link to="/products" className="btn-outline-gold rounded-xl flex items-center justify-center gap-2 py-3 px-6">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
