const mongoose = require('mongoose');

const id1 = new mongoose.Types.ObjectId();
const id2 = id1.toString();

console.log(id1.toString() === id2); // Should be true

const WishlistSchema = new mongoose.Schema({
  items: [{ product: mongoose.Schema.Types.ObjectId }]
});
const Wishlist = mongoose.model('WishlistTest', WishlistSchema);

const w = new Wishlist({ items: [{ product: id1 }] });
console.log(w.items[0].product.toString() === id2); // Should be true
