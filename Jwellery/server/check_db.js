const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jwellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const categories = await Category.find({});
  console.log('Categories:', categories.map(c => ({ id: c._id, name: c.name, slug: c.slug, isActive: c.isActive })));

  const products = await Product.find({});
  console.log('Total Products:', products.length);
  if (products.length > 0) {
    console.log('Sample Product:', { name: products[0].name, category: products[0].category, isActive: products[0].isActive });
  }
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
