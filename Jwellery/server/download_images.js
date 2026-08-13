const fs = require('fs');
const path = require('path');
const axios = require('axios');

const publicDir = path.join(__dirname, '../client/public/images/products');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const images = {
  'ring_solitaire.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=90',
  'necklace_sapphire.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=90',
  'earrings_hoop.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=90',
  'bracelet_tennis.jpg': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=90',
  'mangalsutra.jpg': 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=90',
  'pendant_diamond.jpg': 'https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=800&q=90',
  'bangles.jpg': 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=90',
  'ring_side_1.jpg': 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&q=90',
  'ring_halo_1.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90',
  'ring_emerald_1.jpg': 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=90',
  'ring_pear_1.jpg': 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=90',
};

async function download(url, dest) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });
    
    const writer = fs.createWriteStream(dest);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    throw err;
  }
}

async function downloadAll() {
  for (const [filename, url] of Object.entries(images)) {
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, path.join(publicDir, filename));
      console.log(`Downloaded ${filename} successfully!`);
    } catch (e) {
      console.error(`Failed to download ${filename}:`, e.message);
    }
  }
  console.log('All downloads finished.');
}

downloadAll();
