const express = require('express');
const router = express.Router();
const {
  getCart, addToCart, updateCartItem, removeCartItem,
  clearCart, applyCoupon, removeCoupon, toggleGiftWrap,
} = require('../controllers/cartController');
const { protect, optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/clear', clearCart);
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);
router.post('/gift-wrap', toggleGiftWrap);

module.exports = router;
