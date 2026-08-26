import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingCart, Package, Users,
  AlertTriangle, Star, DollarSign, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { analyticsService } from '../../services/otherServices';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';

const STAT_CARDS = (stats) => [
  { title: 'Total Revenue', value: formatPrice(stats?.revenue?.total || 0), sub: `+${stats?.revenue?.growth || 0}% this month`, icon: DollarSign, color: 'bg-yellow-50 text-yellow-600', positive: true },
  { title: 'Total Orders', value: stats?.orders?.total?.toLocaleString() || '0', sub: `${stats?.orders?.today || 0} today`, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', positive: true },
  { title: 'Total Products', value: stats?.products?.total?.toLocaleString() || '0', sub: `${stats?.products?.lowStock || 0} low stock`, icon: Package, color: 'bg-purple-50 text-purple-600', positive: false },
  { title: 'Total Customers', value: stats?.users?.total?.toLocaleString() || '0', sub: `${stats?.users?.newThisMonth || 0} new this month`, icon: Users, color: 'bg-green-50 text-green-600', positive: true },
];

const PIE_COLORS = ['#C5A059', '#1a1a1a', '#6b7280', '#d64040', '#e07c3c'];

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => analyticsService.getDashboardStats().then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: () => analyticsService.getRevenueChart({ months: 6 }).then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const { data: recentOrdersData } = useQuery({
    queryKey: ['recent-orders-admin'],
    queryFn: () => analyticsService.getRecentOrders({ limit: 8 }).then((r) => r.data),
    staleTime: 2 * 60_000,
  });

  const { data: orderStatusData } = useQuery({
    queryKey: ['order-status-stats'],
    queryFn: () => analyticsService.getOrderStatusStats().then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const { data: topProductsData } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => analyticsService.getTopProducts({ limit: 5 }).then((r) => r.data),
    staleTime: 10 * 60_000,
  });

  const stats = statsData?.stats;
  const cards = STAT_CARDS(stats);

  return (
    <>
      <Helmet><title>Dashboard — Admin | Jwellery</title></Helmet>

      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon size={18} />
                  </div>
                  {card.positive ? (
                    <ArrowUpRight size={16} className="text-green-500" />
                  ) : (
                    <AlertTriangle size={16} className="text-orange-400" />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-0.5">
                  {statsLoading ? <span className="skeleton inline-block w-20 h-7 rounded" /> : card.value}
                </p>
                <p className="text-xs text-gray-500 font-medium mb-1">{card.title}</p>
                <p className="text-[11px] text-gray-400">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Chart + Order Status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Revenue chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueData?.chart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [formatPrice(value), 'Revenue']} labelStyle={{ fontSize: 12 }} contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#C5A059" strokeWidth={2.5} dot={{ fill: '#C5A059', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order status pie */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-5">Order Status</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={orderStatusData?.stats || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {(orderStatusData?.stats || []).map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {(orderStatusData?.stats || []).map((item, i) => (
                <div key={item._id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="capitalize text-gray-600">{item._id}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders + Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Recent orders */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-xs text-[#C5A059] hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {(recentOrdersData?.orders || []).map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">#{order.orderNumber}</p>
                    <p className="text-[11px] text-gray-400 truncate">{order.user?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                    <p className="text-xs font-semibold text-gray-900 mt-0.5">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
              ))}
              {!recentOrdersData?.orders?.length && (
                <p className="text-sm text-gray-400 text-center py-4">No recent orders.</p>
              )}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Top Products</h2>
              <a href="/admin/products" className="text-xs text-[#C5A059] hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {(topProductsData?.products || []).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-gray-400">{i + 1}.</span>
                  <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="#C5A059" className="text-[#C5A059]" />
                      <span className="text-[10px] text-gray-400">{product.ratings?.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-400">{product.soldCount || 0} sold</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-800 flex-shrink-0">{formatPrice(product.discountPrice || product.price)}</span>
                </div>
              ))}
              {!topProductsData?.products?.length && (
                <p className="text-sm text-gray-400 text-center py-4">No data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {stats?.products?.lowStock > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-orange-500 flex-shrink-0" />
            <p className="text-sm text-orange-700">
              <strong>{stats.products.lowStock} products</strong> are running low on stock. <a href="/admin/products?lowStock=true" className="underline">Review inventory</a>
            </p>
          </motion.div>
        )}
        {stats?.pendingReviews > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
            <Star size={20} className="text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              <strong>{stats.pendingReviews} reviews</strong> are pending approval. <a href="/admin/reviews" className="underline">Moderate now</a>
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
