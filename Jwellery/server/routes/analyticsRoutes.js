const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getRevenueChart, getTopProducts,
  getTopCategories, getRecentOrders, getOrderStatusStats,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/revenue-chart', getRevenueChart);
router.get('/top-products', getTopProducts);
router.get('/top-categories', getTopCategories);
router.get('/recent-orders', getRecentOrders);
router.get('/order-status', getOrderStatusStats);

module.exports = router;
