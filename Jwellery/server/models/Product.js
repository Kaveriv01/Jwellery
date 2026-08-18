const mongoose = require('mongoose');

// ── Sub-schema: Product Variant ───────────────────────────────────────────────
const variantSchema = new mongoose.Schema({
  size: { type: String, trim: true },       // e.g., "6", "7", "8" (ring sizes)
  color: { type: String, trim: true },      // e.g., "Yellow Gold", "Rose Gold"
  material: { type: String, trim: true },   // e.g., "925 Sterling Silver"
  stock: { type: Number, default: 0, min: 0 },
  price: { type: Number },                  // Override base price if needed
  sku: { type: String, unique: true, sparse: true },
});

// ── Sub-schema: Product Image ─────────────────────────────────────────────────
const imageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price must be less than original price',
      },
    },
    discountPercent: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: [imageSchema],
    videoUrl: { type: String, trim: true, default: '' },
    videoPoster: { type: String, trim: true, default: '' },
    variants: [variantSchema],
    // ── Stock & Inventory ─────────────────────────────────────────────────────
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    // ── Product Specifications ─────────────────────────────────────────────────
    material: {
      type: String,
      enum: ['Gold', 'Silver', 'Platinum', 'Stainless Steel', 'Brass', 'Other'],
    },
    purity: { type: String }, // e.g., "92.5% Sterling Silver", "18K Gold"
    weight: { type: Number }, // in grams
    stone: { type: String },  // e.g., "Diamond", "Ruby", "Emerald"
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unisex'],
      default: 'Women',
    },
    occasion: {
      type: String,
      enum: ['Wedding', 'Daily Wear', 'Festive', 'Party', 'Office', 'Gift'],
    },
    // ── Tags & Flags ───────────────────────────────────────────────────────────
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // ── Ratings ────────────────────────────────────────────────────────────────
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    // ── SEO ────────────────────────────────────────────────────────────────────
    metaTitle: { type: String },
    metaDescription: { type: String },
    // ── Counters ───────────────────────────────────────────────────────────────
    soldCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes for fast querying ──────────────────────────────────────────────────
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isTrending: 1, isActive: 1 });

// ── Virtual: effective price ───────────────────────────────────────────────────
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice || this.price;
});

// ── Pre-save: calculate discount percent ──────────────────────────────────────
productSchema.pre('save', function (next) {
  if (this.discountPrice && this.price) {
    this.discountPercent = Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    );
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
