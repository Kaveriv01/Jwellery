const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/**
 * Create a Cloudinary storage engine for a given folder and allowed formats.
 * @param {string} folder - The Cloudinary folder to upload to.
 * @param {string[]} formats - Allowed file formats.
 */
const createStorage = (folder, formats = ['jpg', 'jpeg', 'png', 'webp']) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `jwellery/${folder}`,
      allowed_formats: formats,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    },
  });
};

// ── File Filter ────────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// ── Upload instances ───────────────────────────────────────────────────────────

/** Product image upload (max 6 images, each 5MB) */
exports.uploadProductImages = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array('images', 6);

/** Banner image upload (max 2: desktop + mobile) */
exports.uploadBannerImages = multer({
  storage: createStorage('banners'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]);

/** Avatar upload (single) */
exports.uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
}).single('avatar');

/** Category image upload (single) */
exports.uploadCategoryImage = multer({
  storage: createStorage('categories'),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter,
}).single('image');

/** Review image upload (max 3) */
exports.uploadReviewImages = multer({
  storage: createStorage('reviews'),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter,
}).array('images', 3);

/**
 * Helper: Delete a Cloudinary asset by public_id
 */
exports.deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error.message);
  }
};
