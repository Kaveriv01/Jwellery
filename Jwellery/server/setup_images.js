const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const validImageIds = [
  '1611591437281-460bfbe1220a',
  '1599643477877-530eb83abc8e',
  '1629224316810-9d8805b95e76',
  '1535632066927-ab7c9ab60908',
  '1599643478518-a784e5dc4c8f',
  '1515562141207-7a88fb7ce338',
  '1606760227091-3dd870d97f1d',
  '1596944924616-7b38e7cfac36'
];

const destFolder = path.join(__dirname, '../client/public/images/products');

// Helper to download images
const downloadImage = (id) => {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800&h=800`;
    const dest = path.join(destFolder, `${id}.jpg`);
    if (fs.existsSync(dest)) {
      return resolve(dest); // already downloaded
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const mongoURI = 'mongodb://kaverivalve_db_user:Kaveri_51@ac-nhifdx4-shard-00-00.agktaic.mongodb.net:27017,ac-nhifdx4-shard-00-01.agktaic.mongodb.net:27017,ac-nhifdx4-shard-00-02.agktaic.mongodb.net:27017/jwellery?ssl=true&replicaSet=atlas-kcigvg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ecommercestore';

async function main() {
  console.log('Downloading images...');
  for (const id of validImageIds) {
    try {
      await downloadImage(id);
      console.log(`Downloaded ${id}`);
    } catch(e) {
      console.log(`Failed to download ${id}`);
    }
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  
  const productSchema = new mongoose.Schema({ name: String, images: Array, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } }, { strict: false });
  const categorySchema = new mongoose.Schema({ name: String, slug: String }, { strict: false });

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

  const ringImages = [
    { public_id: 'r1', url: `/images/products/${validImageIds[0]}.jpg` },
    { public_id: 'r2', url: `/images/products/${validImageIds[1]}.jpg` },
    { public_id: 'r3', url: `/images/products/${validImageIds[2]}.jpg` },
    { public_id: 'r4', url: `/images/products/${validImageIds[3]}.jpg` }
  ];
  const necklaceImages = [
    { public_id: 'n1', url: `/images/products/${validImageIds[4]}.jpg` },
    { public_id: 'n2', url: `/images/products/${validImageIds[5]}.jpg` },
    { public_id: 'n3', url: `/images/products/${validImageIds[6]}.jpg` },
    { public_id: 'n4', url: `/images/products/${validImageIds[7]}.jpg` }
  ];
  const earringImages = [
    { public_id: 'e1', url: `/images/products/${validImageIds[2]}.jpg` },
    { public_id: 'e2', url: `/images/products/${validImageIds[4]}.jpg` },
    { public_id: 'e3', url: `/images/products/${validImageIds[6]}.jpg` },
    { public_id: 'e4', url: `/images/products/${validImageIds[0]}.jpg` }
  ];
  const braceletImages = [
    { public_id: 'b1', url: `/images/products/${validImageIds[1]}.jpg` },
    { public_id: 'b2', url: `/images/products/${validImageIds[3]}.jpg` },
    { public_id: 'b3', url: `/images/products/${validImageIds[5]}.jpg` },
    { public_id: 'b4', url: `/images/products/${validImageIds[7]}.jpg` }
  ];

  const products = await Product.find({}).populate('category');
  
  for (const product of products) {
    if (product.name.includes('Aurelia Diamond Pendant')) continue;
    
    const catName = product.category ? product.category.name.toLowerCase() : '';
    let newImages = ringImages; // default
    
    if (catName.includes('necklace') || product.name.toLowerCase().includes('necklace') || product.name.toLowerCase().includes('pendant')) {
      newImages = necklaceImages;
    } else if (catName.includes('earring') || product.name.toLowerCase().includes('earring')) {
      newImages = earringImages;
    } else if (catName.includes('bracelet') || product.name.toLowerCase().includes('bracelet')) {
      newImages = braceletImages;
    }
    
    await Product.updateOne({ _id: product._id }, { $set: { images: newImages } });
  }

  console.log(`Updated ${products.length} products with LOCAL square luxury Unsplash images!`);
  process.exit();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
