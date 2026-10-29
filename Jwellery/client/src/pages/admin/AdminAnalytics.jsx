import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { analyticsService } from '../../services/otherServices';
import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, Gem, Calendar } from 'lucide-react';

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
      <Helmet><title>Financial & Category Analytics — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
                Financial & Market Intelligence
              </h1>
              <Badge variant="gold" className="text-[10px]">
                Fiscal 2026
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
              Deep dive into seasonal gold demand, gross jewellery revenue trajectories, and category acquisitions.
            </p>
          </div>
        </div>

        {/* 12-Month Revenue Area Chart using shadcn Card */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
          <CardHeader className="p-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Annual Revenue Expansion Curve
              </CardTitle>
              <CardDescription className="text-xs text-[#756A63]">
                Cumulative gross order valuations across all collections
              </CardDescription>
            </div>
            <Badge variant="gold" className="w-fit">
              +18.4% YoY Expansion
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {revenueLoading ? (
              <div className="skeleton h-80 w-full rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f2ede4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8C6D2D' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8C6D2D' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(v) => [formatPrice(v), 'Gross Billing']} 
                    contentStyle={{ borderRadius: 12, border: '1px solid #DED3C4', background: '#FFFFFF', fontSize: 12 }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#C5A059" 
                    strokeWidth={2.8} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category breakdown bar charts using shadcn Tabs & Card */}
        <Tabs defaultValue="revenue" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-gray-900 font-normal">Category Analytics</h2>
            <TabsList>
              <TabsTrigger value="revenue">By Gross Valuation (₹)</TabsTrigger>
              <TabsTrigger value="volume">By Units Acquired</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="revenue">
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="font-serif text-base text-gray-900 font-normal">
                  Category Gross Revenue Contributions
                </CardTitle>
                <CardDescription className="text-xs text-[#756A63]">
                  High jewellery collections ranked by customer gross spending
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f2ede4" />
                    <XAxis dataKey="categoryName" tick={{ fontSize: 11, fill: '#8C6D2D' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#8C6D2D' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(v) => [formatPrice(v), 'Revenue']} 
                      contentStyle={{ borderRadius: 12, border: '1px solid #DED3C4', fontSize: 12 }} 
                    />
                    <Bar dataKey="revenue" fill="#C5A059" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volume">
            <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="font-serif text-base text-gray-900 font-normal">
                  Category Volume Distribution (Units Sold)
                </CardTitle>
                <CardDescription className="text-xs text-[#756A63]">
                  Pieces crafted and delivered across each atelier category
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f2ede4" />
                    <XAxis dataKey="categoryName" tick={{ fontSize: 11, fill: '#8C6D2D' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#8C6D2D' }} />
                    <Tooltip 
                      formatter={(v) => [v, 'Units Acquired']} 
                      contentStyle={{ borderRadius: 12, border: '1px solid #DED3C4', fontSize: 12 }} 
                    />
                    <Bar dataKey="totalSold" fill="#1F1517" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
