const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, cancelOrder, requestReturn,
  getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

// User routes
router.post('/', optionalAuth, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/my-orders/:id', optionalAuth, getOrderById);
router.post('/my-orders/:id/cancel', protect, cancelOrder);
router.post('/my-orders/:id/return', protect, requestReturn);

// Admin routes
router.get('/admin', protect, adminOnly, getAllOrders);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
