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

  // Update Lumina Gold Hoop Earrings
  await Product.updateOne(
    { name: /Lumina Gold Hoop Earrings/i },
    { $set: { images: [{ public_id: 'local_hoop', url: '/images/products/earring-hoop.png' }] } }
  );
  
  // Update Pearl Drop Cascade
  await Product.updateOne(
    { name: /Pearl Drop Cascade/i },
    { $set: { images: [{ public_id: 'local_pearl', url: '/images/products/earring-pearl.png' }] } }
  );
  
  // Update Diamond Cluster Studs
  await Product.updateOne(
    { name: /Diamond Cluster Studs/i },
    { $set: { images: [{ public_id: 'local_stud', url: '/images/products/earring-stud.png' }] } }
  );

  console.log('Products updated successfully');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
