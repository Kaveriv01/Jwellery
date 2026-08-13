const crypto = require('crypto');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies,
} = require('../services/tokenService');
const {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require('../services/emailService');

// ── Register ───────────────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, phone, isEmailVerified: false });

    // Create empty cart and wishlist for new user
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, items: [] });

    // Generate static OTP (123456)
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    // Send OTP email (async, non-blocking) - disabled for now since it's static
    // sendOTPEmail(user, otp).catch(() => {});

    res.status(201).json({
      success: true,
      requiresVerification: true,
      userId: user._id,
      message: 'Registration successful! Please enter verification code 123456.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify OTP ─────────────────────────────────────────────────────────────────
exports.verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    // Static OTP override
    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Use 123456.' });
    }

    const user = await User.findById(userId).select('+otp +otpExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Please log in.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Resend OTP ─────────────────────────────────────────────────────────────────
exports.resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select('+otp +otpExpire');

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });
    
    // Send OTP email (async, non-blocking) - disabled for static OTP
    // sendOTPEmail(user, otp).catch(() => {});

    res.status(200).json({ success: true, message: 'OTP reset to 123456.' });
  } catch (error) {
    next(error);
  }
};

// ── Login ──────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password +refreshToken');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    // If user's email was not verified previously, mark it verified automatically
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.lastLogin = Date.now();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ── Logout ─────────────────────────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    clearTokenCookies(res);

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Refresh Token ──────────────────────────────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token not found.' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      clearTokenCookies(res);
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    next(error);
  }
};

// ── Forgot Password ────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new Error('Email could not be sent. Please try again later.'));
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ─────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.refreshToken = undefined; // Invalidate all sessions
    await user.save();

    clearTokenCookies(res);

    res.status(200).json({ success: true, message: 'Password reset successful. Please log in.' });
  } catch (error) {
    next(error);
  }
};

// ── Get Current User ───────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed.product',
      select: 'name slug images price discountPrice',
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ── Change Password ────────────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    user.refreshToken = undefined; // Log out all other sessions
    await user.save();

    clearTokenCookies(res);

    res.status(200).json({ success: true, message: 'Password changed successfully. Please log in again.' });
  } catch (error) {
    next(error);
  }
};
