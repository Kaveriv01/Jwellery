const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { deleteCloudinaryImage } = require('../middleware/upload');

// ── Get All Categories ─────────────────────────────────────────────────────────
exports.getCategories = async (req, res, next) => {
  try {
    const { parent, active } = req.query;

    const filter = {};
    if (parent === 'null' || parent === 'root') filter.parent = null;
    else if (parent) filter.parent = parent;
    if (active !== undefined) filter.isActive = active === 'true';

    const categories = await Category.find(filter)
      .populate('parent', 'name slug')
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    // Add product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isActive: true });
        return { ...cat, productCount: count };
      })
    );

    res.status(200).json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

// ── Get Category by Slug ───────────────────────────────────────────────────────
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: category._id, isActive: true })
      .select('name slug image')
      .lean();

    const productCount = await Product.countDocuments({ category: category._id, isActive: true });

    res.status(200).json({ success: true, category: { ...category.toObject(), productCount }, subcategories });
  } catch (error) {
    next(error);
  }
};

// ── Create Category (Admin) ────────────────────────────────────────────────────
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parent, displayOrder, metaTitle, metaDescription } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const image = req.file
      ? { public_id: req.file.filename, url: req.file.path }
      : { public_id: '', url: '' };

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parent: parent || null,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
      metaTitle,
      metaDescription,
    });

    res.status(201).json({ success: true, message: 'Category created.', category });
  } catch (error) {
    next(error);
  }
};

// ── Update Category (Admin) ────────────────────────────────────────────────────
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    if (req.file) {
      await deleteCloudinaryImage(category.image.public_id);
      category.image = { public_id: req.file.filename, url: req.file.path };
    }

    const updates = { ...req.body };
    if (updates.name && updates.name !== category.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    Object.assign(category, updates);
    await category.save();

    res.status(200).json({ success: true, message: 'Category updated.', category });
  } catch (error) {
    next(error);
  }
};

// ── Delete Category (Admin) ────────────────────────────────────────────────────
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete. ${productCount} product(s) belong to this category.`,
      });
    }

    await deleteCloudinaryImage(category.image.public_id);
    await category.deleteOne();

    res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
};
