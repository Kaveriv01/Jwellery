import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Eye, ShoppingCart, Filter } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../lib/utils';
import { ORDER_STATUSES } from '../../constants';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

export default function AdminOrders() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', status, search, page],
    queryFn: () => orderService.getAllOrders({ status, search, page, limit }).then((r) => r.data),
    keepPreviousData: true,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

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
      <Helmet><title>Order Pipeline — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
                Bespoke Order Pipeline
              </h1>
              <Badge variant="gold" className="text-[10px]">
                {orders.length} Orders
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
              Track, inspect, and update customer fulfillment pipelines with tamper-proof security tracking.
            </p>
          </div>
        </div>

        {/* Toolbar Card */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#756A63]" />
              <Input
                type="text"
                placeholder="Search by order ID (#TRN-...), name, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-10 bg-gray-50/50 border-[#DED3C4] text-xs rounded-xl focus-visible:ring-[#C5A059]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="h-10 px-3 bg-gray-50/50 border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059] cursor-pointer"
              >
                <option value="">All Fulfillment Statuses</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Orders Table Card using shadcn Table */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <ShoppingCart size={40} className="text-[#C5A059]/40 mx-auto mb-3" />
              <p className="text-gray-900 font-medium text-sm">No orders matching your criteria</p>
              <p className="text-xs text-[#756A63] mt-1 font-light">All current store orders will be listed here.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Patron / Client</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Valuation</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Fulfillment Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o._id} className="hover:bg-amber-50/20">
                      <TableCell className="font-semibold text-gray-900 font-mono text-xs">
                        #{o.orderNumber}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900 text-xs">{o.shippingAddress?.fullName || o.user?.name}</p>
                        <p className="text-[10px] text-[#756A63] font-light">{o.user?.email}</p>
                      </TableCell>
                      <TableCell className="text-xs text-[#756A63]">
                        {formatDate(o.createdAt)}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 text-xs">
                        {formatPrice(o.totalPrice || o.finalAmount)}
                      </TableCell>
                      <TableCell>
                        {o.paymentStatus === 'paid' ? (
                          <Badge variant="success" className="text-[10px]">PAID</Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">PENDING</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getOrderStatusBadge(o.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/orders/${o._id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs border-[#C5A059]/40 text-[#8C6D2D] hover:bg-[#C5A059] hover:text-black">
                            <Eye size={12} className="mr-1" /> Inspect
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#DED3C4]/60 px-6 py-3.5 bg-gray-50/50">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="text-xs"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-[#756A63] font-medium">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
