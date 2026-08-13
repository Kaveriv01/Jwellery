const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jwellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const products = await Product.find({}).limit(3);
  console.log('Sample Products images:', JSON.stringify(products.map(p => ({ id: p._id, name: p.name, images: p.images })), null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
