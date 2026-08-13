const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Address = require('../models/Address');
const Notification = require('../models/Notification');
const { computeCartSummary } = require('./cartController');
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require('../services/emailService');

const GST_RATE = 0.03;
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING = 99;
const EXPRESS_SHIPPING = 199;
const GIFT_WRAP_CHARGE = 99;

// ── Place Order ────────────────────────────────────────────────────────────────
exports.placeOrder = async (req, res, next) => {
  try {
    const {
      shippingAddressId,
      guestAddress,
      guestEmail,
      billingAddressId,
      paymentMethod,
      deliveryOption = 'standard',
      couponCode,
    } = req.body;

    let shippingAddress;
    let billingAddr;

    if (req.user) {
      // Fetch authenticated user's address
      shippingAddress = await Address.findOne({ _id: shippingAddressId, user: req.user._id });
      if (!shippingAddress) {
        return res.status(400).json({ success: false, message: 'Shipping address not found.' });
      }
      billingAddr = billingAddressId
        ? await Address.findOne({ _id: billingAddressId, user: req.user._id })
        : shippingAddress;
    } else {
      // Guest address
      if (!guestAddress) {
        return res.status(400).json({ success: false, message: 'Shipping address is required for guest checkout.' });
      }
      if (!guestEmail) {
        return res.status(400).json({ success: false, message: 'Email is required for guest checkout.' });
      }
      shippingAddress = guestAddress;
      billingAddr = guestAddress;
    }

    // Fetch and validate cart
    const cartQuery = req.user ? { user: req.user._id } : { guestId: req.headers['x-guest-id'] || req.cookies?.guestId };
    const cart = await Cart.findOne(cartQuery).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product.name}" is no longer available.`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of "${product.name}" available.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: item.price,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        variant: item.variant,
        sku: product.sku,
      });
    }

    const summary = computeCartSummary(cart);
    const shippingCharge = deliveryOption === 'express' ? EXPRESS_SHIPPING : summary.shippingCharge;

    // Validate coupon again server-side
    let couponDiscount = 0;
    let couponDoc = null;
    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (couponDoc) couponDiscount = summary.couponDiscount;
    }

    const itemsPrice = summary.subtotal;
    const gstAmount = Math.round((itemsPrice - couponDiscount) * GST_RATE);
    const giftWrapCharge = cart.giftWrap?.enabled ? GIFT_WRAP_CHARGE : 0;
    const totalPrice = Math.round(
      itemsPrice - couponDiscount + shippingCharge + gstAmount + giftWrapCharge
    );

    // Address snapshots
    const toSnapshot = (addr) => ({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
    });

    // Create the order
    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      guestId: !req.user ? (req.headers['x-guest-id'] || req.cookies?.guestId) : undefined,
      guestEmail: !req.user ? guestEmail : undefined,
      items: orderItems,
      shippingAddress: toSnapshot(shippingAddress),
      billingAddress: toSnapshot(billingAddr),
      itemsPrice,
      discountAmount: couponDiscount,
      shippingCharge,
      gstAmount,
      giftWrapCharge,
      totalPrice,
      couponCode: couponDoc?.code,
      couponDiscount,
      giftWrap: cart.giftWrap,
      paymentMethod,
      deliveryOption,
      estimatedDelivery: new Date(
        Date.now() + (deliveryOption === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000
      ),
    });

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Mark coupon as used (if authenticated)
    if (couponDoc && req.user) {
      couponDoc.usageCount += 1;
      couponDoc.usedBy.push({ user: req.user._id, orderId: order._id });
      await couponDoc.save();
    }

    // Clear cart
    cart.items = [];
    cart.coupon = {};
    cart.giftWrap = { enabled: false };
    await cart.save();

    // Create in-app notification (only for logged-in users)
    if (req.user) {
      await Notification.create({
        user: req.user._id,
        title: 'Order Placed! 🎉',
        message: `Your order #${order.orderNumber} has been placed successfully.`,
        type: 'order',
        relatedOrder: order._id,
      });
    }

    // Send confirmation email (non-blocking)
    const orderUser = req.user || { name: shippingAddress.fullName, email: guestEmail };
    sendOrderConfirmationEmail(orderUser, order).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get My Orders ──────────────────────────────────────────────────────────────
exports.getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .select('orderNumber items totalPrice status paymentMethod paymentStatus createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Order ───────────────────────────────────────────────────────────
exports.getOrderById = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    if (req.user) {
      query.$or = [{ user: req.user._id }, { guestId: req.headers['x-guest-id'] || req.cookies?.guestId }];
    } else {
      query.guestId = req.headers['x-guest-id'] || req.cookies?.guestId;
    }

    const order = await Order.findOne(query).populate('items.product', 'name slug images');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ── Cancel Order ───────────────────────────────────────────────────────────────
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }

    await order.updateStatus('cancelled', reason || 'Cancelled by user');
    order.cancelReason = reason;
    await order.save();

    // Notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled.`,
      type: 'order',
      relatedOrder: order._id,
    });

    res.status(200).json({ success: true, message: 'Order cancelled successfully.', order });
  } catch (error) {
    next(error);
  }
};

// ── Request Return ─────────────────────────────────────────────────────────────
exports.requestReturn = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Only delivered orders can be returned.' });
    }

    // 7-day return window
    const deliveredAt = order.deliveredAt || order.updatedAt;
    const daysSinceDelivery = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 7) {
      return res.status(400).json({ success: false, message: 'Return window (7 days) has expired.' });
    }

    await order.updateStatus('returned', reason);
    order.returnReason = reason;
    await order.save();

    res.status(200).json({ success: true, message: 'Return request submitted.', order });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Get All Orders ──────────────────────────────────────────────────────
exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.search) {
      filter.orderNumber = { $regex: req.query.search, $options: 'i' };
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Update Order Status ─────────────────────────────────────────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber, trackingUrl } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;

    await order.updateStatus(status, note);

    // Notify user
    await Notification.create({
      user: order.user._id,
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${order.orderNumber} status updated to ${status}.`,
      type: 'order',
      relatedOrder: order._id,
    });

    // Send status email (non-blocking)
    sendOrderStatusEmail(order.user, order).catch(() => {});

    res.status(200).json({ success: true, message: `Order status updated to ${status}.`, order });
  } catch (error) {
    next(error);
  }
};
