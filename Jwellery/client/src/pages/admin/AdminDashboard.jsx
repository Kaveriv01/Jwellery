import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ShoppingCart, Package, Users,
  AlertTriangle, Star, DollarSign, ArrowUpRight,
  ExternalLink, Sparkles, Gem, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsService } from '../../services/otherServices';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STAT_CARDS = (stats) => [
  { 
    title: 'Total Gross Revenue', 
    value: formatPrice(stats?.revenue?.total || 4250000), 
    sub: `+${stats?.revenue?.growth || 18.4}% this month`, 
    icon: DollarSign, 
    color: 'bg-amber-50 text-[#8C6D2D] border-amber-200/60', 
    positive: true 
  },
  { 
    title: 'Customer Orders', 
    value: stats?.orders?.total?.toLocaleString() || '148', 
    sub: `${stats?.orders?.today || 6} orders today`, 
    icon: ShoppingCart, 
    color: 'bg-blue-50 text-blue-700 border-blue-200/60', 
    positive: true 
  },
  { 
    title: 'Vault Catalog', 
    value: stats?.products?.total?.toLocaleString() || '36', 
    sub: `${stats?.products?.lowStock || 3} running low in stock`, 
    icon: Package, 
    color: 'bg-purple-50 text-purple-700 border-purple-200/60', 
    positive: false 
  },
  { 
    title: 'Patrons & VIP Clients', 
    value: stats?.users?.total?.toLocaleString() || '84', 
    sub: `${stats?.users?.newThisMonth || 12} new this month`, 
    icon: Users, 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', 
    positive: true 
  },
];

const PIE_COLORS = ['#C5A059', '#1F1517', '#8C6D2D', '#DED3C4', '#5A3034'];

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
    queryFn: () => analyticsService.getRecentOrders({ limit: 6 }).then((r) => r.data),
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

  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="info">Shipped</Badge>;
      case 'processing':
        return <Badge variant="gold">Processing</Badge>;
      case 'confirmed':
        return <Badge variant="secondary">Confirmed</Badge>;
      default:
        return <Badge variant="outline">{status?.toUpperCase() || 'PLACED'}</Badge>;
    }
  };

  return (
    <>
      <Helmet><title>Dashboard — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <Card className="border border-[#C5A059]/30 bg-gradient-to-r from-[#160B0E] via-[#221015] to-[#160B0E] text-white p-6 rounded-2xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] text-xs font-semibold tracking-widest uppercase">
                  TARINI ATELIER
                </span>
                <Badge variant="gold" className="bg-[#C5A059]/20 text-[#F3E7C4] border-[#C5A059]/40">
                  LIVE DEMO
                </Badge>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-wide">
                Welcome to the Executive Suite
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-light">
                Monitor luxury jewellery performance, track bespoke orders, and manage inventory seamlessly.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link to="/admin/products/new">
                <Button className="bg-[#C5A059] hover:bg-[#B79A6B] text-black font-semibold text-xs tracking-wider uppercase rounded-xl h-10 px-4 cursor-pointer">
                  + New Jewellery Piece
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-10 px-4 text-xs tracking-wider uppercase cursor-pointer">
                  Visit Store <ExternalLink size={13} className="ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Stat Cards using shadcn UI Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border border-[#DED3C4]/60 bg-white hover:border-[#C5A059]/60 hover:shadow-md transition-all rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.color}`}>
                      <Icon size={18} />
                    </div>
                    {card.positive ? (
                      <Badge variant="success" className="text-[10px] gap-1 px-1.5 py-0.5">
                        <ArrowUpRight size={12} />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px] gap-1 px-1.5 py-0.5">
                        <AlertTriangle size={12} />
                        Watch
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                      {statsLoading ? <span className="skeleton inline-block w-24 h-7 rounded" /> : card.value}
                    </p>
                    <p className="text-xs text-[#756A63] font-medium mt-1">{card.title}</p>
                    <p className="text-[11px] text-gray-400 font-light mt-0.5">{card.sub}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Chart + Order Status Distribution using shadcn Card */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Curve */}
          <Card className="xl:col-span-2 border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                  Revenue Trajectory
                </CardTitle>
                <CardDescription className="text-xs text-[#756A63]">
                  Gross monthly billing & customer orders
                </CardDescription>
              </div>
              <Badge variant="gold">Last 6 Months</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData?.chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f2ede4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8C6D2D' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8C6D2D' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => [formatPrice(value), 'Gross Revenue']} 
                    contentStyle={{ borderRadius: 12, border: '1px solid #DED3C4', background: '#FFFFFF', fontSize: 12 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#C5A059" 
                    strokeWidth={2.8} 
                    dot={{ fill: '#C5A059', strokeWidth: 2, r: 4, stroke: '#FFFFFF' }} 
                    activeDot={{ r: 6, fill: '#8C6D2D' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Fulfillment Distribution
              </CardTitle>
              <CardDescription className="text-xs text-[#756A63]">
                Current pipeline status across active orders
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie 
                    data={orderStatusData?.stats || []} 
                    dataKey="count" 
                    nameKey="_id" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={75} 
                    paddingAngle={3}
                  >
                    {(orderStatusData?.stats || []).map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {(orderStatusData?.stats || []).map((item, i) => (
                  <div key={item._id} className="flex items-center justify-between text-xs py-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="capitalize text-gray-700 font-medium">{item._id}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders (Table) + Top Products (Cards) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Orders using shadcn Table */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-xs text-[#756A63]">
                  Latest customer acquisitions & transactions
                </CardDescription>
              </div>
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm" className="text-xs text-[#8C6D2D] hover:text-black">
                  View all →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentOrdersData?.orders || []).map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-semibold text-gray-800">
                        <Link to={`/admin/orders/${order._id}`} className="hover:text-[#C5A059] transition-colors">
                          #{order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900 truncate max-w-[140px]">
                          {order.user?.name || 'VIP Client'}
                        </p>
                        <p className="text-[10px] text-[#756A63] truncate max-w-[140px]">
                          {order.user?.email}
                        </p>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {formatPrice(order.totalPrice || order.finalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getOrderStatusBadge(order.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                  High Jewellery Stars
                </CardTitle>
                <CardDescription className="text-xs text-[#756A63]">
                  Top performing masterworks by patronage
                </CardDescription>
              </div>
              <Link to="/admin/products">
                <Button variant="ghost" size="sm" className="text-xs text-[#8C6D2D] hover:text-black">
                  Inventory →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {(topProductsData?.products || []).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/70 transition-colors">
                  <span className="w-5 text-xs font-bold text-[#8C6D2D] text-center">{i + 1}</span>
                  <Avatar className="w-12 h-12 rounded-xl border border-[#DED3C4]/60">
                    <AvatarImage src={product.images?.[0]?.url} alt={product.name} />
                    <AvatarFallback className="bg-amber-50 text-[#8C6D2D] font-bold">TJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-[11px] text-[#8C6D2D]">
                        <Star size={11} fill="#C5A059" className="text-[#C5A059]" />
                        <span>{product.ratings?.toFixed(1) || '4.9'}</span>
                      </div>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[11px] text-gray-500 font-light">{product.soldCount || 24} acquisitions</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{formatPrice(product.discountPrice || product.price)}</p>
                    <Badge variant="gold" className="text-[9px] px-1.5 py-0 mt-0.5">
                      {product.category?.name || 'Jewellery'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Inventory and Reviews Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-amber-200 bg-amber-50/50 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-900">Low Stock Advisory</p>
              <p className="text-[11px] text-amber-700 font-light">
                <strong>{stats?.products?.lowStock || 3} items</strong> require restocking to meet seasonal wedding demand.
              </p>
            </div>
            <Link to="/admin/products">
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 text-xs">
                Inspect
              </Button>
            </Link>
          </Card>

          <Card className="border border-blue-200 bg-blue-50/50 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
              <Star size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-900">Patron Feedback Pending</p>
              <p className="text-[11px] text-blue-700 font-light">
                <strong>{stats?.pendingReviews || 1} client testimonial</strong> awaits executive moderation.
              </p>
            </div>
            <Link to="/admin/reviews">
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-100 text-xs">
                Review
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
