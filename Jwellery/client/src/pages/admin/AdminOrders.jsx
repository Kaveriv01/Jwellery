import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Eye, ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';
import { ORDER_STATUSES } from '../../constants';

export default function AdminOrders() {
  const queryClient = useQueryClient();
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

  return (
    <>
      <Helmet><title>Orders Manager — Admin | Jwellery</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage customer fulfillment pipelines</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search order number..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-gold pl-9 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="input-gold text-sm w-full sm:w-40 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
            <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Total</th>
                    <th className="py-4 px-6">Payment</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-800">#{o.orderNumber}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-800">{o.shippingAddress?.fullName || o.user?.name}</p>
                        <p className="text-xs text-gray-400">{o.user?.email}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{formatPrice(o.totalPrice)}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          o.paymentStatus === 'paid'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {o.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(o.status)}`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/admin/orders/${o._id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg text-[#c9a84c] inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye size={15} /> Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#c9a84c] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#c9a84c] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
