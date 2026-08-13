const User = require('../models/User');
const Order = require('../models/Order');
const Address = require('../models/Address');
const Notification = require('../models/Notification');
const { deleteCloudinaryImage } = require('../middleware/upload');

// ── Update Profile ─────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      await deleteCloudinaryImage(user.avatar.public_id);
      user.avatar = { public_id: req.file.filename, url: req.file.path };
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Profile updated.', user });
  } catch (error) { next(error); }
};

// ── Get User Addresses ─────────────────────────────────────────────────────────
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) { next(error); }
};

// ── Add Address ────────────────────────────────────────────────────────────────
exports.addAddress = async (req, res, next) => {
  try {
    const { isDefault, ...rest } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({ ...rest, user: req.user._id, isDefault: isDefault || false });
    res.status(201).json({ success: true, message: 'Address added.', address });
  } catch (error) { next(error); }
};

// ── Update Address ─────────────────────────────────────────────────────────────
exports.updateAddress = async (req, res, next) => {
  try {
    const { isDefault, ...rest } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...rest, isDefault: isDefault || false },
      { new: true, runValidators: true }
    );

    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });

    res.status(200).json({ success: true, message: 'Address updated.', address });
  } catch (error) { next(error); }
};

// ── Delete Address ─────────────────────────────────────────────────────────────
exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });
    res.status(200).json({ success: true, message: 'Address deleted.' });
  } catch (error) { next(error); }
};

// ── Set Default Address ────────────────────────────────────────────────────────
exports.setDefaultAddress = async (req, res, next) => {
  try {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });
    res.status(200).json({ success: true, message: 'Default address set.', address });
  } catch (error) { next(error); }
};

// ── Get Notifications ──────────────────────────────────────────────────────────
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) { next(error); }
};

// ── Mark Notification as Read ──────────────────────────────────────────────────
exports.markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) { next(error); }
};

// ── Admin: Get All Users ───────────────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = { role: 'user' };
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// ── Admin: Deactivate / Activate User ─────────────────────────────────────────
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, isActive: user.isActive });
  } catch (error) { next(error); }
};

// ── Admin: Delete User ─────────────────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) { next(error); }
};
