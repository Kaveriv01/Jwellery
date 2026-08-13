const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

/**
 * Admin-specific routes that don't fit other controllers.
 * All routes require authentication + admin role.
 */
router.use(protect, adminOnly);

// Admin dashboard summary (delegates to analytics)
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Admin API is healthy.', admin: req.user.name });
});

module.exports = router;
