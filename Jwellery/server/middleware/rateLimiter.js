const rateLimit = require('express-rate-limit');

/**
 * Strict rate limiter for authentication routes.
 * Limits to 10 requests per IP per 15 minutes.
 */
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter.
 * Limits to 200 requests per IP per 15 minutes.
 */
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * OTP rate limiter — max 5 OTP requests per 10 minutes.
 */
exports.otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 10 minutes.',
  },
});
