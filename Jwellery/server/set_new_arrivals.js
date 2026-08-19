const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tarini')
  .then(async () => {
    console.log('Connected to DB');
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    for (const p of products) {
        p.isNewArrival = true;
        await p.save({ validateBeforeSave: false });
    }
    console.log(`Updated ${products.length} products to be new arrivals.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
