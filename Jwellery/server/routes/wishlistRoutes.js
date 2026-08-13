const express = require('express');
const router = express.Router();
const {
  getWishlist, toggleWishlist, moveToCart, clearWishlist, checkWishlistStatus,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.post('/move-to-cart', moveToCart);
router.delete('/clear', clearWishlist);
router.get('/status/:productId', checkWishlistStatus);

module.exports = router;
