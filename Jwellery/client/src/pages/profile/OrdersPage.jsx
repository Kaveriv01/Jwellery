import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, AlertCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders({ limit: 20 }).then((r) => r.data),
  });

  const orders = data?.orders || [];

  return (
    <>
      <Helmet><title>My Orders — Jwellery</title></Helmet>
      <div className="container-luxury py-10">
        <h1 className="font-serif text-3xl text-gray-900 mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={56} className="text-gray-200 mx-auto mb-4" />
            <p className="font-serif text-2xl text-gray-600 mb-2">No orders yet</p>
            <p className="text-gray-400 mb-6">Your order history will appear here.</p>
            <Link to="/products" className="btn-gold rounded-xl">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/profile/orders/${order._id}`} className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <p className="font-bold text-[#C5A059] mt-1">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {order.items?.slice(0, 3).map((item) => (
                    <img key={item._id} src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">+{order.items.length - 3}</div>
                  )}
                  <p className="text-xs text-gray-500 ml-1">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
