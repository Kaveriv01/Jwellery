const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [1, 'Discount value must be at least 1'],
    },
    // Maximum discount cap when type is 'percentage'
    maxDiscountAmount: { type: Number },
    minimumPurchase: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    // Per-user usage limit
    perUserLimit: {
      type: Number,
      default: 1,
    },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      },
    ],
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Restrict to specific categories or products
    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ],
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],
  },
  { timestamps: true }
);

// ── Virtual: is coupon currently valid ────────────────────────────────────────
couponSchema.virtual('isValid').get(function () {
  const now = Date.now();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.expiryDate &&
    (this.usageLimit === null || this.usageCount < this.usageLimit)
  );
});

module.exports = mongoose.model('Coupon', couponSchema);
