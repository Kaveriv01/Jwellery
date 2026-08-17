const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadImage = (url, dest) => new Promise((res, rej) => {
  https.get(url, (r) => {
    if (r.statusCode === 301 || r.statusCode === 302 || r.statusCode === 307 || r.statusCode === 308) {
      return downloadImage(r.headers.location, dest).then(res).catch(rej);
    }
    if (r.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      r.pipe(file);
      file.on('finish', () => { file.close(); res(dest); });
    } else {
      rej(new Error(`Failed to download ${url}: ${r.statusCode}`));
    }
  }).on('error', rej);
});

async function run() {
  const outDir = path.join(__dirname, 'client', 'public', 'images', 'jewelry', 'necklaces');
  fs.mkdirSync(outDir, { recursive: true });

  const images = [
    { name: 'necklace-banner.webp', url: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00bf?q=80&w=1200&auto=format' },
    { name: 'necklace-01.webp', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format' },
    { name: 'necklace-03.webp', url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=1200&auto=format' },
    { name: 'necklace-05.webp', url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format' },
    { name: 'necklace-08.webp', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format' }
  ];

  for (const img of images) {
    try {
      console.log(`Downloading ${img.name}...`);
      await downloadImage(img.url, path.join(outDir, img.name));
      console.log(`Successfully saved ${img.name}`);
    } catch (e) {
      console.error(`Failed on ${img.name}: ${e.message}`);
    }
  }
}

run();
