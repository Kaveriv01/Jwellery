const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Product = require('./server/models/Product'); // Assuming this path

async function checkProduct() {
  await mongoose.connect(process.env.MONGODB_URI);
  const product = await Product.findOne({ name: 'Diamond Solitaire Pendant' });
  console.log(JSON.stringify(product, null, 2));
  mongoose.disconnect();
}
checkProduct();
