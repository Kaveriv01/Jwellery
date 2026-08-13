const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Wishlist = require('./models/Wishlist');
const User = require('./models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne();
  if(!user) return console.log('no user');
  
  let wishlist = await Wishlist.findOne({ user: user._id }).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice ratings numReviews stock isActive',
    });
    
  console.log(JSON.stringify(wishlist.items, null, 2));
  mongoose.disconnect();
}
test();
