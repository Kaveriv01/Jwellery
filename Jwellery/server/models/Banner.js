const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
    },
    subtitle: { type: String, trim: true },
    description: { type: String },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    // Optional mobile image
    mobileImage: {
      public_id: { type: String },
      url: { type: String },
    },
    link: { type: String }, // CTA URL
    linkText: { type: String, default: 'Shop Now' },
    type: {
      type: String,
      enum: ['hero', 'offer', 'category', 'popup'],
      default: 'hero',
    },
    position: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
