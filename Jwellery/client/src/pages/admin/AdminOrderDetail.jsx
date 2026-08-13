import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, CreditCard, Shield, Clock, Phone } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';
import { ORDER_STATUSES } from '../../constants';
import { toast } from 'sonner';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => orderService.getOrderById(id).then((r) => r.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, note }) => orderService.updateStatus(id, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-order', id]);
      toast.success('Order status updated.');
    },
    onError: () => toast.error('Failed to update status.'),
  });

  const order = data?.order;

  if (isLoading) return <div className="container-luxury py-12"><div className="skeleton h-96 rounded-2xl animate-pulse" /></div>;
  if (!order) return <div className="container-luxury py-20 text-center text-gray-500">Order not found.</div>;

  const handleStatusChange = (e) => {
    updateStatusMutation.mutate({ status: e.target.value, note: 'Status updated by Admin' });
  };

  return (
    <>
      <Helmet><title>Order Details — Admin | Jwellery</title></Helmet>

      <div className="space-y-6 max-w-4xl">
        <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
          <div>
            <h1 className="font-serif text-3xl text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
            <select
              value={order.status}
              onChange={handleStatusChange}
              className="input-gold text-xs py-1.5 w-40 cursor-pointer"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-800">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item._id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 rounded-xl object-cover border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* History Logs */}
            {order.statusHistory?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Status Timeline</h3>
                <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-4 py-2">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-white" />
                      <p className="text-xs font-semibold text-gray-850 capitalize">{h.status}</p>
                      {h.note && <p className="text-xs text-gray-400 mt-0.5">{h.note}</p>}
                      <p className="text-[10px] text-gray-300 mt-0.5">{formatDate(h.updatedAt, { timeStyle: 'short' })}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Address details */}
          <div className="space-y-4">
            {/* Pricing Details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-850 text-sm pb-2 border-b border-gray-100">Pricing</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-650"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-{formatPrice(order.couponDiscount)}</span></div>}
                <div className="flex justify-between text-gray-650"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}</span></div>
                <div className="flex justify-between text-gray-650"><span>GST (3%)</span><span>{formatPrice(order.gstAmount)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t"><span>Total</span><span className="text-[#c9a84c]">{formatPrice(order.totalPrice)}</span></div>
              </div>
            </div>

            {/* Customer Details */}
            {order.shippingAddress && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-850 text-sm pb-2 border-b border-gray-100"><MapPin size={14} className="inline mr-1" /> Delivery Address</h3>
                <p className="text-sm text-gray-700 font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}, ` : ''}{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={11} /> {order.shippingAddress.phone}</p>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-850 text-sm pb-2 border-b border-gray-100"><CreditCard size={14} className="inline mr-1" /> Payment</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-650">{order.paymentMethod}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
