const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token (15 minutes by default).
 * @param {string} userId - The user's MongoDB ObjectId
 * @param {string} role - User role ('user' | 'admin')
 */
exports.generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Generate a long-lived refresh token (7 days by default).
 */
exports.generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Verify a refresh token. Returns decoded payload or throws.
 */
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Attach tokens as HTTP-only cookies on the response.
 * @param {object} res - Express response object
 * @param {string} accessToken
 * @param {string} refreshToken
 */
exports.setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE) || 7;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh', // Only sent for refresh endpoint
  });
};

/**
 * Clear auth cookies (used on logout).
 */
exports.clearTokenCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth/refresh',
  });
};
