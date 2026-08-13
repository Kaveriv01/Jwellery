const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      enum: ['razorpay', 'stripe', 'cod'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    // ── Razorpay fields ───────────────────────────────────────────────────────
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    // ── Stripe fields ─────────────────────────────────────────────────────────
    stripePaymentIntentId: { type: String },
    stripeClientSecret: { type: String },
    // ── Refund details ────────────────────────────────────────────────────────
    refundId: { type: String },
    refundAmount: { type: Number },
    refundedAt: { type: Date },
    // ── Raw response (for auditing) ───────────────────────────────────────────
    gatewayResponse: { type: mongoose.Schema.Types.Mixed },
    failureReason: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
