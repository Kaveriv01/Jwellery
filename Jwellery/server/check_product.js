const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');

async function dumpProducts() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({}, 'name images');
  console.log(JSON.stringify(products, null, 2));
  mongoose.disconnect();
}
dumpProducts();
