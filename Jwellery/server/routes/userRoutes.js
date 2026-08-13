const express = require('express');
const router = express.Router();
const {
  updateProfile, getAddresses, addAddress, updateAddress,
  deleteAddress, setDefaultAddress, getNotifications,
  markNotificationsRead, getAllUsers, toggleUserStatus, deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { uploadAvatar } = require('../middleware/upload');

// User profile
router.put('/profile', protect, uploadAvatar, updateProfile);

// Addresses
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.patch('/addresses/:id/default', protect, setDefaultAddress);

// Notifications
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/read-all', protect, markNotificationsRead);

// Admin
router.get('/admin', protect, adminOnly, getAllUsers);
router.patch('/admin/:id/toggle-status', protect, adminOnly, toggleUserStatus);
router.delete('/admin/:id', protect, adminOnly, deleteUser);

module.exports = router;
