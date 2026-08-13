import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { analyticsService } from '../../services/otherServices';
import { formatPrice } from '../../lib/utils';

export default function AdminAnalytics() {
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: () => analyticsService.getRevenueChart({ months: 12 }).then((r) => r.data),
  });

  const { data: topCategoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-analytics'],
    queryFn: () => analyticsService.getTopCategories().then((r) => r.data),
  });

  const chartData = revenueData?.chart || [];
  const categories = topCategoriesData?.categories || [];

  return (
    <>
      <Helmet><title>Business Performance & Analytics — Admin | Jwellery</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Review store revenue, growth patterns, and category popularity</p>
        </div>

        {/* 12-Month Revenue Area Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 text-base mb-6">Annual Revenue Curve</h2>
          {revenueLoading ? (
            <div className="skeleton h-80 w-full animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0' }} />
                <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category breakdown bar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-base mb-6">Top Categories by Revenue</h2>
            {categoriesLoading ? (
              <div className="skeleton h-60 w-full animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="categoryName" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0' }} />
                  <Bar dataKey="revenue" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 text-base mb-6">Top Categories by Volume (Sold Count)</h2>
            {categoriesLoading ? (
              <div className="skeleton h-60 w-full animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="categoryName" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip formatter={(v) => [v, 'Sold Quantity']} contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0' }} />
                  <Bar dataKey="totalSold" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
