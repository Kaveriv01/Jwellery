const express = require('express');
const router = express.Router();
const {
  getBanners, getAllBanners, createBanner, updateBanner, deleteBanner,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { uploadBannerImages } = require('../middleware/upload');

router.get('/', getBanners);
router.get('/admin', protect, adminOnly, getAllBanners);
router.post('/', protect, adminOnly, uploadBannerImages, createBanner);
router.put('/:id', protect, adminOnly, uploadBannerImages, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
