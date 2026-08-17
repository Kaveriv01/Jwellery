require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jwellery';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    
    // Find Necklaces category
    const category = await Category.findOne({ slug: 'necklaces' });
    if (!category) {
      console.log('Necklaces category not found!');
      process.exit(1);
    }

    // Find all products in Necklaces
    const products = await Product.find({ category: category._id });
    console.log(`Found ${products.length} necklace products.`);

    if (products.length === 0) {
      console.log('No necklace products found to update.');
      process.exit(0);
    }

    // Update images for up to 8 products
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const index = (i % 8) + 1; // Cycle 1-8
      const formattedIndex = index.toString().padStart(2, '0');
      
      const newImages = [
        {
          url: `/images/jewelry/necklaces/necklace-${formattedIndex}.webp`,
          public_id: `local_necklace_${formattedIndex}`
        }
      ];

      // Add a hover image if it's the first two (just to demonstrate hover functionality)
      if (index <= 2) {
        newImages.push({
          url: `/images/jewelry/necklaces/necklace-${formattedIndex}-hover.webp`,
          public_id: `local_necklace_${formattedIndex}_hover`
        });
      }

      p.images = newImages;
      await p.save();
      console.log(`Updated product: ${p.name} with image necklace-${formattedIndex}.webp`);
    }

    console.log('Successfully updated all necklace images!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
