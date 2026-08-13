const mongoose = require('mongoose');

// ── Sub-schema: Address snapshot in Order ─────────────────────────────────────
const addressSnapshotSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

// ── Sub-schema: Ordered Item ───────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    size: String,
    color: String,
    material: String,
  },
  sku: String,
  // Per-item status for partial returns
  returnRequested: { type: Boolean, default: false },
  returnStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected', 'completed'],
    default: 'none',
  },
});

// ── Sub-schema: Status Timeline ───────────────────────────────────────────────
const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestId: { type: String },
    guestEmail: { type: String },
    items: [orderItemSchema],
    shippingAddress: addressSnapshotSchema,
    billingAddress: addressSnapshotSchema,
    // ── Pricing ───────────────────────────────────────────────────────────────
    itemsPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    giftWrapCharge: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    // ── Coupon ────────────────────────────────────────────────────────────────
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
    // ── Gift Wrap ─────────────────────────────────────────────────────────────
    giftWrap: {
      enabled: { type: Boolean, default: false },
      message: { type: String },
    },
    // ── Payment ───────────────────────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ['cod', 'razorpay', 'stripe'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paidAt: { type: Date },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    // ── Order Status ──────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
      ],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    // ── Delivery ──────────────────────────────────────────────────────────────
    deliveryOption: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard',
    },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    // ── Tracking ──────────────────────────────────────────────────────────────
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    // ── Cancellation / Return ─────────────────────────────────────────────────
    cancelReason: { type: String },
    returnReason: { type: String },
    refundAmount: { type: Number },
    refundedAt: { type: Date },
    // ── Invoice ───────────────────────────────────────────────────────────────
    invoiceNumber: { type: String },
    invoiceUrl: { type: String },
    // ── Admin notes ───────────────────────────────────────────────────────────
    adminNote: { type: String },
  },
  { timestamps: true }
);

// ── Pre-save: generate order number ───────────────────────────────────────────
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `JWL${Date.now().toString().slice(-6)}${String(count + 1).padStart(4, '0')}`;
    this.invoiceNumber = `INV-${this.orderNumber}`;

    // Record initial status
    this.statusHistory.push({ status: this.status });
  }
  next();
});

// ── Method: update status with history ────────────────────────────────────────
orderSchema.methods.updateStatus = async function (newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({ status: newStatus, note });
  if (newStatus === 'delivered') this.deliveredAt = Date.now();
  await this.save();
};

module.exports = mongoose.model('Order', orderSchema);
