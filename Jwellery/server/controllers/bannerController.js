const Banner = require('../models/Banner');
const { deleteCloudinaryImage } = require('../middleware/upload');

// ── Get Active Banners ─────────────────────────────────────────────────────────
exports.getBanners = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;

    const now = new Date();
    filter.$or = [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: null, endDate: null },
      { startDate: { $lte: now }, endDate: null },
    ];

    const banners = await Banner.find(filter).sort({ position: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, banners });
  } catch (error) { next(error); }
};

// ── Admin: Get All Banners ─────────────────────────────────────────────────────
exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ position: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, banners });
  } catch (error) { next(error); }
};

// ── Admin: Create Banner ───────────────────────────────────────────────────────
exports.createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, description, link, linkText, type, position, startDate, endDate } = req.body;

    if (!req.files?.image?.[0]) {
      return res.status(400).json({ success: false, message: 'Banner image is required.' });
    }

    const image = { public_id: req.files.image[0].filename, url: req.files.image[0].path };
    const mobileImage = req.files?.mobileImage?.[0]
      ? { public_id: req.files.mobileImage[0].filename, url: req.files.mobileImage[0].path }
      : {};

    const banner = await Banner.create({
      title, subtitle, description, image, mobileImage,
      link, linkText, type, position: position ? Number(position) : 0,
      startDate: startDate || null,
      endDate: endDate || null,
    });

    res.status(201).json({ success: true, message: 'Banner created.', banner });
  } catch (error) { next(error); }
};

// ── Admin: Update Banner ───────────────────────────────────────────────────────
exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });

    if (req.files?.image?.[0]) {
      await deleteCloudinaryImage(banner.image.public_id);
      banner.image = { public_id: req.files.image[0].filename, url: req.files.image[0].path };
    }
    if (req.files?.mobileImage?.[0]) {
      await deleteCloudinaryImage(banner.mobileImage?.public_id);
      banner.mobileImage = { public_id: req.files.mobileImage[0].filename, url: req.files.mobileImage[0].path };
    }

    Object.assign(banner, req.body);
    await banner.save();

    res.status(200).json({ success: true, message: 'Banner updated.', banner });
  } catch (error) { next(error); }
};

// ── Admin: Delete Banner ───────────────────────────────────────────────────────
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
    await deleteCloudinaryImage(banner.image.public_id);
    if (banner.mobileImage?.public_id) await deleteCloudinaryImage(banner.mobileImage.public_id);
    await banner.deleteOne();
    res.status(200).json({ success: true, message: 'Banner deleted.' });
  } catch (error) { next(error); }
};
