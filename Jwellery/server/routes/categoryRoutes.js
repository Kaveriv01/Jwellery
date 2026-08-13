const express = require('express');
const router = express.Router();
const {
  getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { uploadCategoryImage } = require('../middleware/upload');

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, adminOnly, uploadCategoryImage, createCategory);
router.put('/:id', protect, adminOnly, uploadCategoryImage, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
