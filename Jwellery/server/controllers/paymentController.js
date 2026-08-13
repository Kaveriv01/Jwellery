const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// ── Create Razorpay Order ──────────────────────────────────────────────────────
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const query = { _id: orderId };
    if (req.user) {
      query.user = req.user._id;
    } else {
      query.guestId = req.headers['x-guest-id'] || req.cookies?.guestId;
    }

    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid.' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalPrice * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString(), userId: req.user ? req.user._id.toString() : 'guest' },
    });

    // Create a pending payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user ? req.user._id : undefined,
      amount: order.totalPrice,
      method: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
    });

    order.payment = payment._id;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify Razorpay Payment ────────────────────────────────────────────────────
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        status: 'success',
        razorpayPaymentId,
        razorpaySignature,
        paidAt: Date.now(),
      },
      { new: true }
    );

    // Update order
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (order) {
      order.paymentStatus = 'paid';
      order.paidAt = Date.now();
      if (order.status === 'pending') {
        await order.updateStatus('confirmed', 'Payment received via Razorpay');
      }
      await order.save();
    }

    // Notification
    if (req.user) {
      await Notification.create({
        user: req.user._id,
        title: 'Payment Successful 💳',
        message: `Payment of ₹${order.totalPrice} received for order #${order.orderNumber}.`,
        type: 'payment',
        relatedOrder: order._id,
      });
    }

    res.status(200).json({ success: true, message: 'Payment verified successfully.', order });
  } catch (error) {
    next(error);
  }
};

// ── Create Stripe Payment Intent ───────────────────────────────────────────────
exports.createStripePaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const query = { _id: orderId };
    if (req.user) {
      query.user = req.user._id;
    } else {
      query.guestId = req.headers['x-guest-id'] || req.cookies?.guestId;
    }

    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe expects smallest currency unit
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: req.user ? req.user._id.toString() : 'guest',
      },
    });

    // Create pending payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user ? req.user._id : undefined,
      amount: order.totalPrice,
      method: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
    });

    order.payment = payment._id;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

// ── Stripe Webhook Handler ─────────────────────────────────────────────────────
exports.stripeWebhook = async (req, res, next) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        const payment = await Payment.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          { status: 'success', paidAt: Date.now(), gatewayResponse: intent },
          { new: true }
        );

        if (payment) {
          const order = await Order.findById(payment.order);
          if (order && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            order.paidAt = Date.now();
            await order.updateStatus('confirmed', 'Payment received via Stripe');
            await order.save();
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          {
            status: 'failed',
            failureReason: intent.last_payment_error?.message,
            gatewayResponse: intent,
          }
        );
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: charge.payment_intent },
          { status: 'refunded', refundedAt: Date.now() }
        );
        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

// ── Initiate Refund ────────────────────────────────────────────────────────────
exports.initiateRefund = async (req, res, next) => {
  try {
    const { orderId, reason = 'customer_request' } = req.body;
    const order = await Order.findById(orderId).populate('payment');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Order has not been paid.' });
    }

    const payment = order.payment;
    let refundResult;

    if (payment.method === 'razorpay' && payment.razorpayPaymentId) {
      refundResult = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round(order.totalPrice * 100),
        notes: { reason },
      });
      payment.refundId = refundResult.id;
    } else if (payment.method === 'stripe' && payment.stripePaymentIntentId) {
      refundResult = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        reason,
      });
      payment.refundId = refundResult.id;
    }

    payment.status = 'refunded';
    payment.refundAmount = order.totalPrice;
    payment.refundedAt = Date.now();
    await payment.save();

    order.paymentStatus = 'refunded';
    order.refundAmount = order.totalPrice;
    order.refundedAt = Date.now();
    await order.updateStatus('refunded', `Refund initiated: ${reason}`);

    res.status(200).json({ success: true, message: 'Refund initiated successfully.', refundId: payment.refundId });
  } catch (error) {
    next(error);
  }
};

// ── Get Payment History (User) ─────────────────────────────────────────────────
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('order', 'orderNumber totalPrice status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};
