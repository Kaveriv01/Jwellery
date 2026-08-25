const mongoose = require('mongoose');
require('dotenv').config();

const updates = [
  {
    name: 'Celeste Solitaire Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&q=90'
  },
  {
    name: 'Minimalist Infinity Band',
    url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&fit=crop&q=90'
  },
  {
    name: 'Vintage Emerald Cut Ring',
    url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&fit=crop&q=90'
  },
  {
    name: 'Rose Gold Pave Ring',
    url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&fit=crop&q=90'
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = mongoose.connection.collection('products');
  for (const update of updates) {
    await Product.updateOne(
      { name: update.name },
      { $set: { 'images.0.url': update.url } }
    );
  }
  console.log('Fixed wrong ring images in DB!');
  process.exit(0);
}).catch(console.error);
