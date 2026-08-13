const fs = require('fs');

const file = 'c:/Users/Admin/Downloads/Jwellery/Jwellery/server/controllers/cartController.js';
let content = fs.readFileSync(file, 'utf8');

// Add helper
const helper = `
const getCartQuery = (req) => {
  if (req.user) return { user: req.user._id };
  const guestId = req.headers['x-guest-id'] || req.cookies?.guestId;
  if (!guestId) throw new Error('Guest ID is required for unauthenticated users');
  return { guestId };
};
`;

content = content.replace('const Coupon = require(\'../models/Coupon\');\n', 'const Coupon = require(\'../models/Coupon\');\n' + helper);

// Replace `{ user: req.user._id }` in findOne, create, findOneAndUpdate
content = content.replace(/\{ user: req\.user\._id \}/g, 'getCartQuery(req)');

// Fix coupon apply logic for guests
const couponLogicOld = `    // Check per-user limit
    const userUsage = coupon.usedBy.filter((u) => u.user.toString() === req.user._id.toString());
    if (userUsage.length >= coupon.perUserLimit) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon.' });
    }`;

const couponLogicNew = `    // Check per-user limit
    if (req.user) {
      const userUsage = coupon.usedBy.filter((u) => u.user.toString() === req.user._id.toString());
      if (userUsage.length >= coupon.perUserLimit) {
        return res.status(400).json({ success: false, message: 'You have already used this coupon.' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Please login to apply coupons.' });
    }`;

content = content.replace(couponLogicOld, couponLogicNew);

fs.writeFileSync(file, content);
console.log('Done');
