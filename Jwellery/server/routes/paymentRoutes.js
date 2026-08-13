const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder, verifyRazorpayPayment,
  createStripePaymentIntent, stripeWebhook,
  initiateRefund, getMyPayments,
} = require('../controllers/paymentController');
const { protect, optionalAuth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

// Stripe webhook (raw body — registered in app.js before json middleware)
router.post('/webhook/stripe', stripeWebhook);

// User routes
router.post('/razorpay/create-order', optionalAuth, createRazorpayOrder);
router.post('/razorpay/verify', optionalAuth, verifyRazorpayPayment);
router.post('/stripe/create-intent', optionalAuth, createStripePaymentIntent);
router.get('/my-payments', protect, getMyPayments);

// Admin routes
router.post('/refund', protect, adminOnly, initiateRefund);

module.exports = router;
