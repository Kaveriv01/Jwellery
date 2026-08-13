const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// ── Dashboard Stats ────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      todayOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalUsers,
      newUsersThisMonth,
      pendingReviews,
    ] = await Promise.all([
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 5, $gt: 0 }, isActive: true }),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Review.countDocuments({ status: 'pending' }),
    ]);

    const totalRev = totalRevenue[0]?.total || 0;
    const monthRev = monthRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMonthRev > 0 ? (((monthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1) : 100;

    res.status(200).json({
      success: true,
      stats: {
        revenue: { total: totalRev, thisMonth: monthRev, lastMonth: lastMonthRev, growth: revenueGrowth },
        orders: { total: totalOrders, today: todayOrders, pending: pendingOrders },
        products: { total: totalProducts, lowStock: lowStockProducts },
        users: { total: totalUsers, newThisMonth: newUsersThisMonth },
        pendingReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Revenue Chart (last 12 months) ────────────────────────────────────────────
exports.getRevenueChart = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chart = revenueData.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      orders: item.orders,
    }));

    res.status(200).json({ success: true, chart });
  } catch (error) { next(error); }
};

// ── Top Products ───────────────────────────────────────────────────────────────
exports.getTopProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1, ratings: -1 })
      .limit(limit)
      .select('name slug images price soldCount ratings numReviews stock')
      .lean();

    res.status(200).json({ success: true, products: topProducts });
  } catch (error) { next(error); }
};

// ── Top Categories ─────────────────────────────────────────────────────────────
exports.getTopCategories = async (req, res, next) => {
  try {
    const topCategories = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', { $ifNull: ['$items.discountPrice', '$items.price'] }] } },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { categoryName: '$category.name', totalSold: 1, revenue: 1 } },
    ]);

    res.status(200).json({ success: true, categories: topCategories });
  } catch (error) { next(error); }
};

// ── Recent Orders ──────────────────────────────────────────────────────────────
exports.getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderNumber user totalPrice status paymentMethod createdAt')
      .lean();
    res.status(200).json({ success: true, orders });
  } catch (error) { next(error); }
};

// ── Order Status Distribution ──────────────────────────────────────────────────
exports.getOrderStatusStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, stats });
  } catch (error) { next(error); }
};
