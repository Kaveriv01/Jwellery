const mongoose = require('mongoose');

const mongoURI = 'mongodb://kaverivalve_db_user:Kaveri_51@ac-nhifdx4-shard-00-00.agktaic.mongodb.net:27017,ac-nhifdx4-shard-00-01.agktaic.mongodb.net:27017,ac-nhifdx4-shard-00-02.agktaic.mongodb.net:27017/jwellery?ssl=true&replicaSet=atlas-kcigvg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ecommercestore';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB Connected');
  
  const productSchema = new mongoose.Schema({
    name: String,
    images: Array,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  }, { strict: false });

  const categorySchema = new mongoose.Schema({
    name: String,
    slug: String
  }, { strict: false });

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

  // High-end Unsplash Square Images
  const luxuryRingImages = [
    { public_id: 'r1', url: 'https://images.unsplash.com/photo-1605100804763-247f67b4549e?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'r2', url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'r3', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'r4', url: 'https://images.unsplash.com/photo-1584377334016-464803e036f6?auto=format&fit=crop&q=80&w=800&h=800' }
  ];

  const luxuryNecklaceImages = [
    { public_id: 'n1', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'n2', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'n3', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'n4', url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=800' }
  ];

  const luxuryEarringImages = [
    { public_id: 'e1', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'e2', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'e3', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'e4', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800&h=800' }
  ];

  const luxuryBraceletImages = [
    { public_id: 'b1', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'b2', url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'b3', url: 'https://images.unsplash.com/photo-1605100804763-247f67b4549e?auto=format&fit=crop&q=80&w=800&h=800' },
    { public_id: 'b4', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800&h=800' }
  ];

  const products = await Product.find({}).populate('category');
  
  for (const product of products) {
    if (product.name.includes('Aurelia Diamond Pendant')) {
       // Skip the one we manually set earlier so it keeps its unique images
       continue;
    }
    
    const catName = product.category ? product.category.name.toLowerCase() : '';
    let newImages = luxuryRingImages;
    
    if (catName.includes('necklace') || product.name.toLowerCase().includes('necklace') || product.name.toLowerCase().includes('pendant')) {
      newImages = luxuryNecklaceImages;
    } else if (catName.includes('earring') || product.name.toLowerCase().includes('earring')) {
      newImages = luxuryEarringImages;
    } else if (catName.includes('bracelet') || product.name.toLowerCase().includes('bracelet')) {
      newImages = luxuryBraceletImages;
    }
    
    await Product.updateOne({ _id: product._id }, { $set: { images: newImages } });
  }

  console.log(`Updated ${products.length} products with square luxury Unsplash images!`);
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
