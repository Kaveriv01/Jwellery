const slugify = require('slugify');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { deleteCloudinaryImage } = require('../middleware/upload');

/**
 * Build query filters from request query params.
 * Supports: category, material, stone, gender, occasion, price range,
 *           featured/trending/bestseller flags, and full-text search.
 */
const buildProductQuery = (query) => {
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.material) filter.material = query.material;
  if (query.stone) filter.stone = query.stone;
  if (query.gender) filter.gender = query.gender;
  if (query.occasion) filter.occasion = query.occasion;
  if (query.isFeatured === 'true') filter.isFeatured = true;
  if (query.isTrending === 'true') filter.isTrending = true;
  if (query.isBestSeller === 'true') filter.isBestSeller = true;
  if (query.isNewArrival === 'true') filter.isNewArrival = true;

  // Price range
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  // Availability
  if (query.inStock === 'true') filter.stock = { $gt: 0 };

  // Full-text search
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

/**
 * Build sort object from sortBy query param.
 */
const buildSortQuery = (sortBy) => {
  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    popularity: { soldCount: -1 },
    rating: { ratings: -1 },
    featured: { isFeatured: -1, createdAt: -1 },
  };
  return sorts[sortBy] || { createdAt: -1 };
};

// ── Get All Products (with filtering, sorting, pagination) ─────────────────────
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = buildProductQuery(req.query);
    const sort = buildSortQuery(req.query.sortBy);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .select('-__v')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    console.log(`[getProducts] Filter:`, filter, `Found:`, total);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Product by Slug ─────────────────────────────────────────────────
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save({ validateBeforeSave: false });

    // Add to recently viewed if user is logged in
    if (req.user) {
      await req.user.addToRecentlyViewed(product._id);
    }

    // Fetch related products (same category, excluding current)
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .select('name slug images price discountPrice ratings numReviews')
      .limit(6)
      .lean();

    res.status(200).json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Product by ID (admin) ──────────────────────────────────────────
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ── Create Product (Admin) ─────────────────────────────────────────────────────
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name, description, shortDescription, price, discountPrice,
      category, subcategory, stock, sku, material, purity, weight,
      stone, gender, occasion, tags, isFeatured, isTrending,
      isBestSeller, isNewArrival, variants, metaTitle, metaDescription,
    } = req.body;

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Check slug uniqueness
    const slugExists = await Product.findOne({ slug });
    const finalSlug = slugExists
      ? `${slug}-${Date.now().toString().slice(-4)}`
      : slug;

    // Process uploaded images from Cloudinary
    const images = req.files
      ? req.files.map((file, idx) => ({
          public_id: file.filename,
          url: file.path,
          alt: name,
          isDefault: idx === 0,
        }))
      : [];

    // Parse variants if sent as JSON string
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      shortDescription,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category,
      subcategory: subcategory || undefined,
      stock: Number(stock),
      sku,
      material,
      purity,
      weight: weight ? Number(weight) : undefined,
      stone,
      gender,
      occasion,
      tags: parsedTags,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isTrending: isTrending === 'true' || isTrending === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      variants: parsedVariants,
      images,
      metaTitle,
      metaDescription,
    });

    res.status(201).json({ success: true, message: 'Product created successfully.', product });
  } catch (error) {
    next(error);
  }
};

// ── Update Product (Admin) ─────────────────────────────────────────────────────
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, idx) => ({
        public_id: file.filename,
        url: file.path,
        alt: req.body.name || product.name,
        isDefault: product.images.length === 0 && idx === 0,
      }));
      product.images.push(...newImages);
    }

    // Parse and update fields
    const updates = { ...req.body };
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = JSON.parse(updates.tags);
    }
    if (updates.variants && typeof updates.variants === 'string') {
      updates.variants = JSON.parse(updates.variants);
    }

    // Regenerate slug if name changes
    if (updates.name && updates.name !== product.name) {
      const newSlug = slugify(updates.name, { lower: true, strict: true });
      const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
      updates.slug = slugExists ? `${newSlug}-${Date.now().toString().slice(-4)}` : newSlug;
    }

    Object.assign(product, updates);
    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully.', product });
  } catch (error) {
    next(error);
  }
};

// ── Delete Product Image (Admin) ───────────────────────────────────────────────
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { productId, imageId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const image = product.images.find((img) => img._id.toString() === imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    await deleteCloudinaryImage(image.public_id);
    product.images = product.images.filter((img) => img._id.toString() !== imageId);

    // If removed was default, set first remaining as default
    if (image.isDefault && product.images.length > 0) {
      product.images[0].isDefault = true;
    }

    await product.save();
    res.status(200).json({ success: true, message: 'Image deleted.', product });
  } catch (error) {
    next(error);
  }
};

// ── Delete Product (Admin) ─────────────────────────────────────────────────────
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Delete all Cloudinary images
    for (const image of product.images) {
      await deleteCloudinaryImage(image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Search Products ────────────────────────────────────────────────────────────
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters.' });
    }

    const products = await Product.find({
      $text: { $search: q },
      isActive: true,
    })
      .select('name slug images price discountPrice ratings category')
      .populate('category', 'name slug')
      .limit(Number(limit))
      .lean();

    res.status(200).json({ success: true, products, count: products.length });
  } catch (error) {
    next(error);
  }
};

// ── Get Featured/Trending/BestSeller Products ──────────────────────────────────
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const [featured, trending, bestSellers, newArrivals] = await Promise.all([
      Product.find({ isFeatured: true, isActive: true }).select('name slug images price discountPrice ratings numReviews').limit(limit).lean(),
      Product.find({ isTrending: true, isActive: true }).select('name slug images price discountPrice ratings numReviews').limit(limit).lean(),
      Product.find({ isBestSeller: true, isActive: true }).select('name slug images price discountPrice ratings numReviews').limit(limit).lean(),
      Product.find({ isNewArrival: true, isActive: true }).select('name slug images price discountPrice ratings numReviews').sort({ createdAt: -1 }).limit(limit).lean(),
    ]);

    res.status(200).json({ success: true, featured, trending, bestSellers, newArrivals });
  } catch (error) {
    next(error);
  }
};

// ── Get Diamond Rings (Homepage Section) ──────────────────────────────────────
exports.getDiamondRings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const sortBy = req.query.sortBy || 'newest'; // newest | price-low | price-high | rating | popularity

    const sortMap = {
      newest:     { createdAt: -1 },
      'price-low':  { price: 1 },
      'price-high': { price: -1 },
      rating:     { ratings: -1 },
      popularity: { soldCount: -1 },
    };
    const sort = sortMap[sortBy] || { createdAt: -1 };

    const filter = {
      isActive: true,
      stone: 'Diamond',
      // Match both "Rings" category slug and any category with rings in name
    };

    // Optionally filter by category slug if provided
    if (req.query.category) {
      const Category = require('../models/Category');
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) filter.category = cat._id;
    } else {
      // Default: find the Rings category and filter by it
      const Category = require('../models/Category');
      const ringCat = await Category.findOne({ slug: 'rings' });
      if (ringCat) filter.category = ringCat._id;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .select('name slug images price discountPrice discountPercent ratings numReviews stock material purity stone isFeatured isNewArrival isTrending isBestSeller')
        .sort(sort)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      total,
      message: `${products.length} diamond rings fetched.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Toggle Stock Status (Admin) ────────────────────────────────────────────────
exports.toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    product.isActive = !product.isActive;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'}.`,
      isActive: product.isActive,
    });
  } catch (error) {
    next(error);
  }
};
