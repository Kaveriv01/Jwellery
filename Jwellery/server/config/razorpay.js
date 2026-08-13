const Razorpay = require('razorpay');

/**
 * Razorpay instance initialized with key_id and key_secret from environment.
 * Used for creating orders and verifying payments.
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
