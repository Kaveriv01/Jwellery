const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jwellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const db = mongoose.connection.db;
  const collection = db.collection('carts');
  
  // List indexes
  const indexes = await collection.indexes();
  console.log('Current indexes on carts:', indexes);
  
  // Look for unique index on user
  for (const index of indexes) {
    if (index.unique && index.key.user) {
      console.log('Found unique index on user, dropping:', index.name);
      await collection.dropIndex(index.name);
      console.log('Dropped successfully.');
    }
  }

  // Also check if there's any other unique constraint causing "User already exists" or similar.
  // Wait, could the error be coming from somewhere else? Let's print out what other collections exist and their indexes.
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
