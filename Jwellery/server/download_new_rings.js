const fs = require('fs');
const path = require('path');
const axios = require('axios');

const publicDir = path.join(__dirname, '../client/public/images/products');

const ringUrls = [
  // These are known Unsplash jewelry IDs that might be rings, or we just rely on redirects.
  // Actually let's use direct URLs from the previous SOCIAL GALLERY if they are rings.
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
  'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
  // Let's also use source.unsplash.com as a fallback to get more distinct ones
  'https://source.unsplash.com/800x800/?diamond,ring&sig=101',
  'https://source.unsplash.com/800x800/?engagement,ring&sig=102',
  'https://source.unsplash.com/800x800/?wedding,ring&sig=103'
];

async function download(url, dest) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      validateStatus: status => status >= 200 && status < 400
    });
    
    const writer = fs.createWriteStream(dest);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Failed to download ${url}: ${err.message}`);
    throw err;
  }
}

async function downloadAll() {
  for (let i = 0; i < 3; i++) {
    const filename = `new_ring_img_${i+1}.jpg`;
    const url = ringUrls[5 + i];
    console.log(`Downloading ${filename} from ${url}...`);
    try {
      await download(url, path.join(publicDir, filename));
      console.log(`Downloaded ${filename} successfully!`);
    } catch (e) {
      // ignore
    }
  }
}

downloadAll();
