const express = require('express');
const router = express.Router();
const {
  getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.post('/validate', protect, validateCoupon);
router.get('/', protect, adminOnly, getAllCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
