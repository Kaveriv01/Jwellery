const mongoose = require('mongoose');

// ── Sub-schema: Cart Item ──────────────────────────────────────────────────────
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  // Selected variant details (stored for snapshot)
  variant: {
    size: String,
    color: String,
    material: String,
  },
  // Price snapshot at the time of adding to cart
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
      // unique: true,
    },
    guestId: {
      type: String,
    },
    items: [cartItemSchema],
    // Applied coupon snapshot
    coupon: {
      code: String,
      discountAmount: { type: Number, default: 0 },
      discountType: { type: String, enum: ['percentage', 'fixed'] },
      discountValue: Number,
    },
    // Gift wrap option
    giftWrap: {
      enabled: { type: Boolean, default: false },
      message: { type: String, maxlength: 200 },
      charge: { type: Number, default: 99 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: subtotal ──────────────────────────────────────────────────────────
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);
});

// ── Virtual: total items count ─────────────────────────────────────────────────
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
