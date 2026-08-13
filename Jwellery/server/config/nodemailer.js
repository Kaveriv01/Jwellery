const nodemailer = require('nodemailer');

/**
 * Create a reusable Nodemailer transport using Gmail SMTP.
 * For production, consider using SendGrid/Mailgun instead.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Verify the transporter connection on startup (optional, dev only).
 */
if (process.env.NODE_ENV === 'development') {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email transporter error:', error.message);
    } else {
      console.log('✅ Email transporter ready');
    }
  });
}

module.exports = transporter;
