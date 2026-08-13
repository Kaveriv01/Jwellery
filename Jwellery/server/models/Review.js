const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
      trim: true,
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    helpfulVotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// ── One review per product per user ───────────────────────────────────────────
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// ── Static: recalculate product ratings after review change ───────────────────
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, status: 'approved' } },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await mongoose.model('Product').findByIdAndUpdate(productId, {
    ratings: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    numReviews: stats.length > 0 ? stats[0].nRating : 0,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.product);
});

module.exports = mongoose.model('Review', reviewSchema);
