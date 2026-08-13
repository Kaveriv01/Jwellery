const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verifies the JWT access token from HTTP-only cookie or
 * Authorization header (Bearer token). Attaches the user to req.user.
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try to get token from HTTP-only cookie
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // 2. Fallback: Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude sensitive fields)
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
    }
    next(error);
  }
};

/**
 * Optional auth — attaches user if token is present, but does NOT block the request.
 * Useful for routes like product detail where guest users should also have access.
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    }
    next();
  } catch {
    next(); // Silently continue even if token is invalid
  }
};
