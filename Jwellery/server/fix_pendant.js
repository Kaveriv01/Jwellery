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
  }, { strict: false });

  const Product = mongoose.model('Product', productSchema);

  const imagesArray = [
    { public_id: 'local_pendant_front', url: '/images/products/pendant-front.png' },
    { public_id: 'local_pendant_angle', url: '/images/products/pendant-angle.png' },
    { public_id: 'local_pendant_macro', url: '/images/products/pendant-macro.png' }
  ];

  // Update Aurelia Diamond Pendant
  await Product.updateOne(
    { name: /Aurelia Diamond Pendant/i },
    { $set: { images: imagesArray } }
  );

  console.log('Pendant updated successfully');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
