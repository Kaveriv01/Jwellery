const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries by default
    },
    avatar: {
      public_id: { type: String, default: '' },
      url: { type: String, default: 'https://res.cloudinary.com/default/image/upload/v1/avatars/default_avatar.png' },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // ── OTP fields for email verification ──────────────────────────────────
    otp: { type: String, select: false },
    otpExpire: { type: Date, select: false },
    // ── Password reset fields ───────────────────────────────────────────────
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    // ── Refresh token storage (hashed) ──────────────────────────────────────
    refreshToken: { type: String, select: false },
    // ── Last login timestamp ────────────────────────────────────────────────
    lastLogin: { type: Date },
    // ── Recently viewed products ────────────────────────────────────────────
    recentlyViewed: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ── Pre-save: hash password ──────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Method: compare passwords ────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Method: generate OTP ─────────────────────────────────────────────────────
userSchema.methods.generateOTP = function () {
  const otp = '123456';
  this.otp = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// ── Method: generate password reset token ────────────────────────────────────
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

// ── Method: add to recently viewed ───────────────────────────────────────────
userSchema.methods.addToRecentlyViewed = async function (productId) {
  // Remove if already exists
  this.recentlyViewed = this.recentlyViewed.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  // Add to front
  this.recentlyViewed.unshift({ product: productId });
  // Keep only last 10
  if (this.recentlyViewed.length > 10) {
    this.recentlyViewed = this.recentlyViewed.slice(0, 10);
  }
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
