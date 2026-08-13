const express = require('express');
const router = express.Router();
const {
  register, verifyOTP, resendOTP, login, logout,
  refreshToken, forgotPassword, resetPassword, getMe, changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
