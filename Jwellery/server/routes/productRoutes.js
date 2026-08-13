const express = require('express');
const router = express.Router();
const {
  getProducts, getProductBySlug, getProductById, createProduct,
  updateProduct, deleteProduct, deleteProductImage,
  searchProducts, getFeaturedProducts, getDiamondRings, toggleProductStatus,
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { uploadProductImages } = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/diamond-rings', getDiamondRings);  // Homepage diamond rings section
router.get('/search', searchProducts);
router.get('/slug/:slug', optionalAuth, getProductBySlug);

// Admin routes
router.post('/', protect, adminOnly, uploadProductImages, createProduct);
router.get('/admin/:id', protect, adminOnly, getProductById);
router.put('/:id', protect, adminOnly, uploadProductImages, updateProduct);
router.patch('/:id/toggle-status', protect, adminOnly, toggleProductStatus);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:productId/images/:imageId', protect, adminOnly, deleteProductImage);

module.exports = router;
