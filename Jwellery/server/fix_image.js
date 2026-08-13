const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');
const https = require('https');
const fs = require('fs');

async function fixProduct() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const product = await Product.findOne({ name: 'Diamond Solitaire Pendant' });
  if (product) {
    product.images = [{
      url: '/images/products/pendant_diamond.jpg',
      public_id: 'diamond_pendant_1',
      isDefault: true
    }];
    await product.save();
    console.log('Product DB updated to local image.');
  }
  
  mongoose.disconnect();

  const file = fs.createWriteStream('../client/public/images/products/pendant_diamond.jpg');
  https.get('https://images.unsplash.com/photo-1596944924616-7b38e7cfac36', function(response) {
    if (response.statusCode === 301 || response.statusCode === 302) {
      https.get(response.headers.location, function(res2) {
        res2.pipe(file);
      });
    } else {
      response.pipe(file);
    }
    file.on('finish', () => {
      file.close();
      console.log('Image downloaded from Unsplash.');
    });
  });
}

fixProduct();
