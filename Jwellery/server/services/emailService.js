const transporter = require('../config/nodemailer');

const FROM = process.env.EMAIL_FROM || 'Jwellery <noreply@jwellery.com>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Generic sendEmail helper.
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: FROM,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

// ── Base email template ────────────────────────────────────────────────────────
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8f6f3; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #c9a84c; margin: 0; font-size: 28px; letter-spacing: 4px; font-weight: 300; }
    .header p { color: #999; margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
    .body { padding: 40px; color: #333; line-height: 1.7; }
    .body h2 { color: #1a1a1a; font-size: 22px; margin-bottom: 16px; }
    .btn { display: inline-block; background: #c9a84c; color: #fff !important; padding: 14px 32px; border-radius: 4px; text-decoration: none; font-weight: 600; letter-spacing: 1px; margin: 24px 0; }
    .otp-box { background: #f8f6f3; border: 2px solid #c9a84c; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-box .otp { font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; }
    .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    .footer { background: #f8f6f3; padding: 24px 40px; text-align: center; color: #999; font-size: 12px; }
    .order-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .order-table th { background: #f8f6f3; padding: 10px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .order-table td { padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .total-row td { font-weight: 700; color: #1a1a1a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💎 JWELLERY</h1>
      <p>Luxury Jewelry & Gemstones</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Jwellery. All rights reserved.</p>
      <p>Questions? <a href="mailto:support@jwellery.com" style="color:#c9a84c;">support@jwellery.com</a></p>
    </div>
  </div>
</body>
</html>`;

// ── Email Senders ──────────────────────────────────────────────────────────────

/**
 * Send OTP for email verification.
 */
exports.sendOTPEmail = async (user, otp) => {
  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email — Jwellery',
    html: emailWrapper(`
      <h2>Hello, ${user.name}! 👋</h2>
      <p>Use the OTP below to verify your email address. This OTP is valid for <strong>10 minutes</strong>.</p>
      <div class="otp-box">
        <p style="margin:0 0 8px; font-size:13px; color:#666; text-transform:uppercase; letter-spacing:1px;">Your OTP</p>
        <div class="otp">${otp}</div>
      </div>
      <p style="color:#999; font-size:13px;">If you did not create an account, please ignore this email.</p>
    `),
  });
};

/**
 * Send password reset email with a reset link.
 */
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request — Jwellery',
    html: emailWrapper(`
      <h2>Password Reset Request</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to set a new password. This link is valid for <strong>30 minutes</strong>.</p>
      <center><a href="${resetUrl}" class="btn">Reset Password</a></center>
      <p style="color:#999; font-size:13px;">If you did not request a password reset, please ignore this email. Your account remains secure.</p>
      <hr class="divider">
      <p style="color:#999; font-size:12px;">Or copy this link: ${resetUrl}</p>
    `),
  });
};

/**
 * Send order confirmation email.
 */
exports.sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">₹${(item.discountPrice || item.price).toLocaleString('en-IN')}</td>
    </tr>`
    )
    .join('');

  await sendEmail({
    to: user.email,
    subject: `Order Confirmed #${order.orderNumber} — Jwellery`,
    html: emailWrapper(`
      <h2>Your order is confirmed! 🎉</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Thank you for shopping with Jwellery. Your order has been placed successfully and is being processed.</p>
      <p><strong>Order #:</strong> ${order.orderNumber}</p>
      <table class="order-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr><td colspan="3"><hr style="border:none;border-top:1px solid #eee;"></td></tr>
          <tr>
            <td colspan="2" style="text-align:right; color:#666;">Subtotal</td>
            <td style="text-align:right;">₹${order.itemsPrice.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:right; color:#666;">Shipping</td>
            <td style="text-align:right;">${order.shippingCharge === 0 ? 'FREE' : '₹' + order.shippingCharge}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2" style="text-align:right;">Total</td>
            <td style="text-align:right; color:#c9a84c;">₹${order.totalPrice.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      <center><a href="${CLIENT_URL}/profile/orders/${order._id}" class="btn">View Order</a></center>
    `),
  });
};

/**
 * Send order status update email.
 */
exports.sendOrderStatusEmail = async (user, order) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    packed: 'Great news! Your order has been packed and is ready for dispatch.',
    shipped: `Your order is on its way! Tracking: ${order.trackingNumber || 'N/A'}`,
    delivered: 'Your order has been delivered. We hope you love it! ✨',
    cancelled: 'Your order has been cancelled as requested.',
    returned: 'Your return request has been initiated.',
    refunded: `Your refund of ₹${order.refundAmount?.toLocaleString('en-IN') || 'N/A'} has been processed.`,
  };

  await sendEmail({
    to: user.email,
    subject: `Order Update #${order.orderNumber} — ${order.status.toUpperCase()}`,
    html: emailWrapper(`
      <h2>Order Update</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>${statusMessages[order.status] || `Your order status has been updated to: ${order.status}`}</p>
      <p><strong>Order #:</strong> ${order.orderNumber}</p>
      <center><a href="${CLIENT_URL}/profile/orders/${order._id}" class="btn">Track Order</a></center>
    `),
  });
};

/**
 * Send welcome email after registration.
 */
exports.sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Jwellery 💎',
    html: emailWrapper(`
      <h2>Welcome, ${user.name}! ✨</h2>
      <p>We're thrilled to have you as part of the Jwellery family. Discover our exclusive collections of handcrafted, certified jewelry.</p>
      <center><a href="${CLIENT_URL}/products" class="btn">Explore Collections</a></center>
      <hr class="divider">
      <p style="color:#999; font-size:13px;">Use code <strong>WELCOME10</strong> on your first purchase for 10% off!</p>
    `),
  });
};
