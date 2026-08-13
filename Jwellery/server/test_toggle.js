const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Wishlist = require('./models/Wishlist');
const User = require('./models/User');
const Product = require('./models/Product');

async function testToggle() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne();
  const product = await Product.findOne();
  const productId = product._id.toString();

  let wishlist = await Wishlist.findOne({ user: user._id });
  if(!wishlist) wishlist = await Wishlist.create({ user: user._id, items: [] });
  
  console.log('Items before:', wishlist.items.length);
  
  const isWishlisted = wishlist.items.some(item => item.product.toString() === productId);
  console.log('isWishlisted:', isWishlisted);
  
  if (isWishlisted) {
    wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
    await wishlist.save();
    console.log('Removed. Items after:', wishlist.items.length);
  } else {
    wishlist.items.unshift({ product: productId });
    await wishlist.save();
    console.log('Added. Items after:', wishlist.items.length);
  }
  
  mongoose.disconnect();
}
testToggle();
