const express = require('express');
const router = express.Router();
const {
  createReview, getProductReviews, voteHelpful,
  getAllReviews, updateReviewStatus, deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { uploadReviewImages } = require('../middleware/upload');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, uploadReviewImages, createReview);
router.post('/:id/helpful', protect, voteHelpful);

// Admin
router.get('/admin', protect, adminOnly, getAllReviews);
router.patch('/admin/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/admin/:id', protect, adminOnly, deleteReview);

module.exports = router;
