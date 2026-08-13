import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Package, MapPin, CreditCard, Phone } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';
import { toast } from 'sonner';

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id).then((r) => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (reason) => orderService.cancelOrder(id, { reason }),
    onSuccess: () => { toast.success('Order cancelled.'); queryClient.invalidateQueries(['order', id]); },
    onError: () => toast.error('Cannot cancel this order.'),
  });

  const order = data?.order;

  if (isLoading) return <div className="container-luxury py-12"><div className="skeleton h-96 rounded-2xl" /></div>;
  if (!order) return <div className="container-luxury py-20 text-center text-gray-500">Order not found.</div>;

  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const currentStatusIdx = ORDER_STATUSES.indexOf(order.status);

  return (
    <>
      <Helmet><title>Order #{order.orderNumber} — Jwellery</title></Helmet>
      <div className="container-luxury py-8 max-w-4xl">
        <button onClick={() => navigate('/profile/orders')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
            {order.status.toUpperCase()}
          </span>
        </div>

        {/* Tracking stepper */}
        {!['cancelled', 'returned', 'refunded'].includes(order.status) && (
          <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
            {ORDER_STATUSES.map((status, i) => (
              <div key={status} className="flex items-center">
                <div className={`flex flex-col items-center gap-1 ${i <= currentStatusIdx ? 'text-[#c9a84c]' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${i <= currentStatusIdx ? 'border-[#c9a84c] bg-[#fdf9ee]' : 'border-gray-200'}`}>
                    {i < currentStatusIdx ? '✓' : <span className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <span className="text-[10px] capitalize whitespace-nowrap">{status}</span>
                </div>
                {i < ORDER_STATUSES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 min-w-[30px] ${i < currentStatusIdx ? 'bg-[#c9a84c]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Package size={16} /> Items ({order.items?.length})</h2>
            {order.items?.map((item) => (
              <div key={item._id} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                  {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                  {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm text-gray-900 whitespace-nowrap">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Price Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.couponDiscount)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}</span></div>
                <div className="flex justify-between text-gray-600"><span>GST</span><span>{formatPrice(order.gstAmount)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span className="text-[#c9a84c]">{formatPrice(order.totalPrice)}</span></div>
              </div>
            </div>

            {/* Address */}
            {order.shippingAddress && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1"><MapPin size={14} /> Delivery Address</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Phone size={11} /> {order.shippingAddress.phone}</p>
              </div>
            )}

            {/* Payment */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-1"><CreditCard size={14} /> Payment</h3>
              <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}>
                {order.paymentStatus?.toUpperCase()}
              </span>
            </div>

            {/* Cancel */}
            {canCancel && (
              <button
                onClick={() => { if (confirm('Are you sure you want to cancel this order?')) cancelMutation.mutate('Customer requested cancellation'); }}
                disabled={cancelMutation.isPending}
                className="w-full btn-outline-gold rounded-xl py-2.5 text-sm text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
