const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const getCartQuery = (req) => {
  if (req.user) return { user: req.user._id };
  const guestId = req.headers['x-guest-id'] || req.cookies?.guestId;
  if (!guestId) throw new Error('Guest ID is required for unauthenticated users');
  return { guestId };
};

const GST_RATE = 0.03; // 3% GST on jewelry
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING = 99;
const EXPRESS_SHIPPING = 199;
const GIFT_WRAP_CHARGE = 99;

// ── Get Cart ───────────────────────────────────────────────────────────────────
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne(getCartQuery(req)).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock isActive',
    });

    if (!cart) {
      cart = await Cart.create({ 
        ...(req.user ? { user: req.user._id } : { guestId: getCartQuery(req).guestId }),
        items: [] 
      });
    }

    // Remove items where product is inactive or deleted
    const validItems = cart.items.filter(
      (item) => item.product && item.product.isActive
    );
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const summary = computeCartSummary(cart);
    res.status(200).json({ success: true, cart, summary });
  } catch (error) {
    next(error);
  }
};

// ── Add to Cart ────────────────────────────────────────────────────────────────
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant = {} } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available.`,
      });
    }

    let cart = await Cart.findOne(getCartQuery(req));
    if (!cart) {
      cart = await Cart.create({ 
        ...(req.user ? { user: req.user._id } : { guestId: getCartQuery(req).guestId }),
        items: [] 
      });
    }

    // Check if same product + variant already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.size === variant?.size &&
        item.variant?.color === variant?.color
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} unit(s) available.`,
        });
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        variant,
        price: product.price,
        discountPrice: product.discountPrice,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock',
    });

    const summary = computeCartSummary(updatedCart);
    res.status(200).json({ success: true, message: 'Added to cart.', cart: updatedCart, summary });
  } catch (error) {
    next(error);
  }
};

// ── Update Cart Item Quantity ───────────────────────────────────────────────────
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne(getCartQuery(req));
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    const product = await Product.findById(item.product);
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available.`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock',
    });

    const summary = computeCartSummary(updatedCart);
    res.status(200).json({ success: true, cart: updatedCart, summary });
  } catch (error) {
    next(error);
  }
};

// ── Remove Cart Item ───────────────────────────────────────────────────────────
exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne(getCartQuery(req));
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock',
    });

    const summary = computeCartSummary(updatedCart);
    res.status(200).json({ success: true, message: 'Item removed.', cart: updatedCart, summary });
  } catch (error) {
    next(error);
  }
};

// ── Clear Cart ─────────────────────────────────────────────────────────────────
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      getCartQuery(req),
      { items: [], coupon: {}, giftWrap: { enabled: false } }
    );
    res.status(200).json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

// ── Apply Coupon ───────────────────────────────────────────────────────────────
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code.' });
    }

    const now = Date.now();
    if (now < coupon.startDate || now > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: 'Coupon is expired or not yet active.' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
    }

    // Check per-user limit
    if (req.user) {
      const userUsage = coupon.usedBy.filter((u) => u.user && u.user.toString() === req.user._id.toString());
      if (userUsage.length >= coupon.perUserLimit) {
        return res.status(400).json({ success: false, message: 'You have already used this coupon.' });
      }
    }

    const cart = await Cart.findOne(getCartQuery(req)).populate('items.product');
    const subtotal = cart.items.reduce((acc, item) => {
      return acc + (item.discountPrice || item.price) * item.quantity;
    }, 0);

    if (subtotal < coupon.minimumPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minimumPurchase} required for this coupon.`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    cart.coupon = {
      code: coupon.code,
      discountAmount: Math.round(discountAmount),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    };
    await cart.save();

    res.status(200).json({
      success: true,
      message: `Coupon applied! You save ₹${Math.round(discountAmount)}.`,
      discountAmount: Math.round(discountAmount),
      coupon: cart.coupon,
    });
  } catch (error) {
    next(error);
  }
};

// ── Remove Coupon ──────────────────────────────────────────────────────────────
exports.removeCoupon = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(getCartQuery(req), { coupon: {} });
    res.status(200).json({ success: true, message: 'Coupon removed.' });
  } catch (error) {
    next(error);
  }
};

// ── Toggle Gift Wrap ───────────────────────────────────────────────────────────
exports.toggleGiftWrap = async (req, res, next) => {
  try {
    const { enabled, message } = req.body;
    await Cart.findOneAndUpdate(
      getCartQuery(req),
      { giftWrap: { enabled, message, charge: enabled ? GIFT_WRAP_CHARGE : 0 } }
    );
    res.status(200).json({ success: true, message: enabled ? 'Gift wrap added.' : 'Gift wrap removed.' });
  } catch (error) {
    next(error);
  }
};

// ── Helper: Compute Cart Summary ───────────────────────────────────────────────
const computeCartSummary = (cart) => {
  const subtotal = cart.items.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const couponDiscount = cart.coupon?.discountAmount || 0;
  const giftWrapCharge = cart.giftWrap?.enabled ? GIFT_WRAP_CHARGE : 0;
  const afterDiscount = subtotal - couponDiscount;
  const shippingCharge = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const gstAmount = Math.round(afterDiscount * GST_RATE);
  const totalPrice = Math.round(afterDiscount + shippingCharge + gstAmount + giftWrapCharge);

  return {
    subtotal: Math.round(subtotal),
    couponDiscount,
    shippingCharge,
    gstAmount,
    giftWrapCharge,
    totalPrice,
    totalItems: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount),
  };
};

exports.computeCartSummary = computeCartSummary;
