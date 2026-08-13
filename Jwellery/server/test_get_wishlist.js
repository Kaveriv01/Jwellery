const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Wishlist = require('./models/Wishlist');
const User = require('./models/User');

async function testGet() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne();
  
  try {
    let wishlist = await Wishlist.findOne({ user: user._id }).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice ratings numReviews stock isActive',
    });

    wishlist.items = wishlist.items.filter((item) => item.product && item.product.isActive);
    await wishlist.save();
    console.log('Saved successfully');
  } catch(e) {
    console.error('Error saving:', e.message);
  }
  
  mongoose.disconnect();
}
testGet();
