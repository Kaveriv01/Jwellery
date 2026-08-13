const fs = require('fs');
const path = require('path');

const replacements = {
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=90': '/images/products/ring_solitaire.jpg',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800': '/images/products/ring_solitaire.jpg',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=90': '/images/products/necklace_sapphire.jpg',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800': '/images/products/necklace_sapphire.jpg',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=90': '/images/products/earrings_hoop.jpg',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800': '/images/products/earrings_hoop.jpg',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=90': '/images/products/bracelet_tennis.jpg',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800': '/images/products/bracelet_tennis.jpg',
  'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=90': '/images/products/mangalsutra.jpg',
  'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800': '/images/products/mangalsutra.jpg',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=800&q=90': '/images/products/pendant_diamond.jpg',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=800': '/images/products/pendant_diamond.jpg',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=90': '/images/products/bangles.jpg',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800': '/images/products/bangles.jpg',
  'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&q=90': '/images/products/ring_side_1.jpg',
  'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800': '/images/products/ring_side_1.jpg',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90': '/images/products/ring_halo_1.jpg',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800': '/images/products/ring_halo_1.jpg',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=90': '/images/products/ring_emerald_1.jpg',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800': '/images/products/ring_emerald_1.jpg',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=90': '/images/products/ring_pear_1.jpg',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800': '/images/products/ring_pear_1.jpg'
};

const filesToUpdate = [
  path.join(__dirname, 'seeder.js'),
  path.join(__dirname, '../client/src/components/layout/Footer.jsx')
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [oldUrl, newUrl] of Object.entries(replacements)) {
      content = content.split(oldUrl).join(newUrl);
    }
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
