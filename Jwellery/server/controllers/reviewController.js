const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { deleteCloudinaryImage } = require('../middleware/upload');

// ── Create Review ──────────────────────────────────────────────────────────────
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, orderId } = req.body;

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      status: 'delivered',
      'items.product': productId,
    });

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const images = req.files
      ? req.files.map((f) => ({ public_id: f.filename, url: f.path }))
      : [];

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      order: orderId,
      rating: Number(rating),
      title,
      comment,
      images,
      isVerifiedPurchase: !!hasPurchased,
      status: 'pending', // Requires admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted. It will appear after admin approval.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Product Reviews ────────────────────────────────────────────────────────
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const rating = req.query.rating ? Number(req.query.rating) : undefined;

    const filter = { product: productId, status: 'approved' };
    if (rating) filter.rating = rating;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    // Rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(productId), status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      reviews,
      ratingStats,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ── Vote Helpful ───────────────────────────────────────────────────────────────
exports.voteHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    const alreadyVoted = review.helpfulVotedBy.includes(req.user._id);
    if (alreadyVoted) {
      review.helpfulVotedBy = review.helpfulVotedBy.filter(
        (uid) => uid.toString() !== req.user._id.toString()
      );
      review.helpfulVotes -= 1;
    } else {
      review.helpfulVotedBy.push(req.user._id);
      review.helpfulVotes += 1;
    }

    await review.save();
    res.status(200).json({ success: true, helpfulVotes: review.helpfulVotes, voted: !alreadyVoted });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Get All Reviews ─────────────────────────────────────────────────────
exports.getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name email')
        .populate('product', 'name slug images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Update Review Status ────────────────────────────────────────────────
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    // Recalculate product ratings
    await Review.calcAverageRatings(review.product);

    res.status(200).json({ success: true, message: `Review ${status}.`, review });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Delete Review ───────────────────────────────────────────────────────
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    for (const img of review.images) await deleteCloudinaryImage(img.public_id);
    const productId = review.product;
    await review.deleteOne();
    await Review.calcAverageRatings(productId);

    res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};
