const mongoose = require('mongoose');

const mongoURI = 'mongodb://kaverivalve_db_user:Kaveri_51@ac-nhifdx4-shard-00-00.agktaic.mongodb.net:27017,ac-nhifdx4-shard-00-01.agktaic.mongodb.net:27017,ac-nhifdx4-shard-00-02.agktaic.mongodb.net:27017/jwellery?ssl=true&replicaSet=atlas-kcigvg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ecommercestore';

const validImageIds = {
  ring: '1599643478518-a784e5dc4c8f', // Diamond ring
  necklace: '1515562141207-7a88fb7ce338', // Diamond necklace
  earring: '1535632066927-ab7c9ab60908', // Diamond earrings
  bracelet: '1611591437281-460bfbe1220a' // Gold bracelet
};

function generateImageSet(id) {
  // We simulate 4 different angles of the same product by using the same high-res Unsplash image
  // but applying different Unsplash Image API transformations (cropping, zooming) to create 
  // Main View, Close-Up View, and Alternate crops.
  const baseUrl = `https://images.unsplash.com/photo-${id}`;
  return [
    { public_id: `${id}-main`, url: `${baseUrl}?auto=format&fit=crop&q=80&w=800&h=800` }, // Main
    { public_id: `${id}-zoom1`, url: `${baseUrl}?auto=format&fit=crop&q=80&w=800&h=800&rect=100,100,600,600` }, // Detail/Close-up
    { public_id: `${id}-zoom2`, url: `${baseUrl}?auto=format&fit=crop&q=80&w=800&h=800&rect=200,200,400,400` }, // Macro
    { public_id: `${id}-wide`, url: `${baseUrl}?auto=format&fit=crop&q=80&w=800&h=800&rect=0,0,1000,1000` } // Wide/Lifestyle
  ];
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  
  const productSchema = new mongoose.Schema({ name: String, images: Array, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } }, { strict: false });
  const categorySchema = new mongoose.Schema({ name: String, slug: String }, { strict: false });

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

  const ringImages = generateImageSet(validImageIds.ring);
  const necklaceImages = generateImageSet(validImageIds.necklace);
  const earringImages = generateImageSet(validImageIds.earring);
  const braceletImages = generateImageSet(validImageIds.bracelet);

  const products = await Product.find({}).populate('category');
  let updatedCount = 0;
  
  for (const product of products) {
    if (product.name.includes('Aurelia Diamond Pendant')) continue;
    
    const catName = product.category ? product.category.name.toLowerCase() : '';
    let newImages = ringImages; // default fallback
    
    if (catName.includes('necklace') || product.name.toLowerCase().includes('necklace') || product.name.toLowerCase().includes('pendant')) {
      newImages = necklaceImages;
    } else if (catName.includes('earring') || product.name.toLowerCase().includes('earring')) {
      newImages = earringImages;
    } else if (catName.includes('bracelet') || product.name.toLowerCase().includes('bracelet')) {
      newImages = braceletImages;
    }
    
    await Product.updateOne({ _id: product._id }, { $set: { images: newImages } });
    updatedCount++;
  }

  console.log(`Successfully mapped strict 4-image sets (Main, Detail, Macro, Wide) for ${updatedCount} products based purely on their specific category.`);
  process.exit();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
