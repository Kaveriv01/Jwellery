const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['order', 'payment', 'promo', 'system', 'review'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Deep link to relevant page
    },
    // Reference to related entity
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  { timestamps: true }
);

// ── Index for fast user notification fetch ─────────────────────────────────────
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
