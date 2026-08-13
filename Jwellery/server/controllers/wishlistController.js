const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ── Get Wishlist ───────────────────────────────────────────────────────────────
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice ratings numReviews stock isActive',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    // Filter out deleted/inactive products
    wishlist.items = wishlist.items.filter((item) => item.product && item.product.isActive);
    await wishlist.save();

    res.status(200).json({ success: true, wishlist, count: wishlist.items.length });
  } catch (error) {
    next(error);
  }
};

// ── Toggle Wishlist (Add / Remove) ─────────────────────────────────────────────
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

    const isWishlisted = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (isWishlisted) {
      wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== productId
      );
      await wishlist.save();
      return res.status(200).json({
        success: true,
        message: 'Removed from wishlist.',
        isWishlisted: false,
        wishlistCount: wishlist.items.length,
      });
    } else {
      wishlist.items.unshift({ product: productId });
      await wishlist.save();
      return res.status(200).json({
        success: true,
        message: 'Added to wishlist.',
        isWishlisted: true,
        wishlistCount: wishlist.items.length,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ── Move Wishlist Item to Cart ─────────────────────────────────────────────────
exports.moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is out of stock.' });
    }

    // Add to cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (!existingItem) {
      cart.items.push({
        product: productId,
        quantity: 1,
        price: product.price,
        discountPrice: product.discountPrice,
      });
      await cart.save();
    }

    // Remove from wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({ success: true, message: 'Moved to cart.' });
  } catch (error) {
    next(error);
  }
};

// ── Clear Wishlist ─────────────────────────────────────────────────────────────
exports.clearWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(200).json({ success: true, message: 'Wishlist cleared.' });
  } catch (error) {
    next(error);
  }
};

// ── Check if product is wishlisted ────────────────────────────────────────────
exports.checkWishlistStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isWishlisted = wishlist
      ? wishlist.items.some((item) => item.product.toString() === productId)
      : false;

    res.status(200).json({ success: true, isWishlisted });
  } catch (error) {
    next(error);
  }
};
