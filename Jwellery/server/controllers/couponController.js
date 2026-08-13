const Coupon = require('../models/Coupon');

// ── Get All Coupons (Admin) ────────────────────────────────────────────────────
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, coupons });
  } catch (error) { next(error); }
};

// ── Create Coupon (Admin) ──────────────────────────────────────────────────────
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error) { next(error); }
};

// ── Update Coupon (Admin) ──────────────────────────────────────────────────────
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.status(200).json({ success: true, message: 'Coupon updated.', coupon });
  } catch (error) { next(error); }
};

// ── Delete Coupon (Admin) ──────────────────────────────────────────────────────
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.status(200).json({ success: true, message: 'Coupon deleted.' });
  } catch (error) { next(error); }
};

// ── Validate Coupon (Public – shows discount info without applying) ─────────────
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(400).json({ success: false, message: 'Invalid coupon code.' });
    if (Date.now() > coupon.expiryDate) return res.status(400).json({ success: false, message: 'Coupon has expired.' });
    if (subtotal < coupon.minimumPurchase) {
      return res.status(400).json({ success: false, message: `Minimum purchase ₹${coupon.minimumPurchase} required.` });
    }

    let discount = coupon.discountType === 'percentage'
      ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscountAmount || Infinity)
      : coupon.discountValue;

    res.status(200).json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: Math.round(discount) } });
  } catch (error) { next(error); }
};
