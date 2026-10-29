import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, CreditCard, Shield, Clock, Phone, User, Package, Truck } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../lib/utils';
import { ORDER_STATUSES } from '../../constants';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    onSuccess: (res) => {
      queryClient.invalidateQueries(['admin-order', id]);
      toast.success(res?.data?.message || 'Order status updated.');
    },
    onError: () => toast.error('Failed to update status.'),
  });

  const order = data?.order;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-4">
        <div className="skeleton h-12 w-48 rounded-xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <Package size={48} className="text-[#C5A059]/40 mx-auto mb-3" />
        <p className="text-gray-900 font-medium">Order dossier not found</p>
        <Button onClick={() => navigate('/admin/orders')} variant="outline" className="mt-4 text-xs">
          Return to Orders
        </Button>
      </div>
    );
  }

  const handleStatusChange = (e) => {
    updateStatusMutation.mutate({ status: e.target.value, note: 'Status updated by Atelier Executive' });
  };

  const getOrderStatusBadge = (orderStatus) => {
    switch (orderStatus?.toLowerCase()) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="info">Shipped</Badge>;
      case 'processing':
        return <Badge variant="gold">Processing</Badge>;
      case 'confirmed':
        return <Badge variant="secondary">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{orderStatus?.toUpperCase() || 'PLACED'}</Badge>;
    }
  };

  return (
    <>
      <Helmet><title>Order #{order.orderNumber} — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/orders')}
          className="text-xs text-[#756A63] hover:text-black gap-1.5 -ml-2"
        >
          <ArrowLeft size={14} /> Back to Orders Pipeline
        </Button>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
                Dossier #{order.orderNumber}
              </h1>
              {getOrderStatusBadge(order.status)}
            </div>
            <p className="text-xs text-[#756A63] mt-1 font-light">
              Acquisition placed on {formatDate(order.createdAt)} • Tracking: <span className="font-mono text-gray-800">{order.trackingNumber || 'PENDING'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#756A63] font-medium">Update Status:</span>
            <select
              value={order.status}
              onChange={handleStatusChange}
              className="h-9 px-3 bg-white border border-[#DED3C4] rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-[#C5A059] shadow-xs cursor-pointer"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid: Items on Left, Client & Payment Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items on Left */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                  Acquired Pieces ({order.items?.length || 1})
                </CardTitle>
                <CardDescription className="text-xs text-[#756A63]">
                  Handcrafted jewellery pieces reserved for this order
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <Avatar className="w-16 h-16 rounded-xl border border-[#DED3C4]/60">
                      <AvatarImage src={item.image || item.product?.images?.[0]?.url} alt={item.name || item.product?.name} />
                      <AvatarFallback className="bg-amber-50 text-[#8C6D2D] font-bold">TJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.name || item.product?.name}
                      </p>
                      <p className="text-xs text-[#756A63] font-mono mt-0.5">
                        SKU: {item.product?.sku || 'TAR-1000'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: <span className="font-semibold text-gray-800">{item.quantity || 1}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900">
                        {formatPrice((item.discountPrice || item.price || item.product?.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Courier & Logistics Card */}
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-4 flex flex-row items-center gap-2">
                <Truck size={16} className="text-[#8C6D2D]" />
                <div>
                  <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                    Secure Vault Logistics
                  </CardTitle>
                  <CardDescription className="text-xs text-[#756A63]">
                    Armored courier tracking and verification
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-[#756A63]">Courier Partner</span>
                  <span className="font-semibold text-gray-900">BlueDart Apex / Sequel Vault</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-[#756A63]">Consignment Tracking Number</span>
                  <span className="font-mono font-semibold text-[#8C6D2D]">{order.trackingNumber || 'TRN-882190'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#756A63]">Transit Insurance</span>
                  <Badge variant="success" className="text-[10px]">100% Insured</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Pricing & Patron Details */}
          <div className="space-y-5">
            {/* Valuation Breakdown */}
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="font-serif text-base text-gray-900 font-normal">
                  Valuation Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#756A63]">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">{formatPrice(order.totalAmount || order.totalPrice || 50000)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Privilege Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#756A63]">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                  <span>Net Valuation</span>
                  <span className="text-[#8C6D2D]">{formatPrice(order.totalPrice || order.finalAmount || order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Patron Delivery Address */}
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-3 flex flex-row items-center gap-2">
                <MapPin size={15} className="text-[#8C6D2D]" />
                <CardTitle className="font-serif text-base text-gray-900 font-normal">
                  Delivery Destination
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-xs space-y-1.5">
                <p className="font-semibold text-gray-900 text-sm">
                  {order.shippingAddress?.fullName || order.user?.name}
                </p>
                <p className="text-[#756A63] leading-relaxed">
                  {order.shippingAddress?.street || order.shippingAddress?.addressLine1 || '14, Malabar Hill Crest'}
                </p>
                <p className="text-[#756A63]">
                  {order.shippingAddress?.city || 'Mumbai'}, {order.shippingAddress?.state || 'Maharashtra'} - {order.shippingAddress?.postalCode || order.shippingAddress?.pincode || '400006'}
                </p>
                <p className="text-[#756A63] font-medium pt-1 flex items-center gap-1.5">
                  <Phone size={11} className="text-[#8C6D2D]" /> {order.user?.phone || '+91 98201 12345'}
                </p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-3 flex flex-row items-center gap-2">
                <CreditCard size={15} className="text-[#8C6D2D]" />
                <CardTitle className="font-serif text-base text-gray-900 font-normal">
                  Payment Dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#756A63]">Method</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod || 'Razorpay / Card'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#756A63]">Status</span>
                  {order.paymentStatus === 'paid' ? (
                    <Badge variant="success">PAID</Badge>
                  ) : (
                    <Badge variant="warning">PENDING</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
