const axios = require('axios');
const http = require('http');

async function check() {
  const agent = new http.Agent({ keepAlive: false });
  // Wait, I need auth to get wishlist. 
  // Let me just query the db directly.
  const mongoose = require('mongoose');
  require('dotenv').config({ path: './.env' });
  await mongoose.connect(process.env.MONGO_URI);
  const Wishlist = require('./models/Wishlist');
  const User = require('./models/User');
  const user = await User.findOne();
  if(!user) { console.log('No user'); process.exit(); }
  let wishlist = await Wishlist.findOne({ user: user._id }).populate('items.product');
  console.log(JSON.stringify(wishlist.items, null, 2));
  mongoose.disconnect();
}
check();
