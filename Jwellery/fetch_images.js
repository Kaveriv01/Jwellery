const https = require('https');
const fs = require('fs');
const path = require('path');

const getHTML = (url) => new Promise((res, rej) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (r) => {
    let data = '';
    r.on('data', chunk => data += chunk);
    r.on('end', () => res(data));
  }).on('error', rej);
});

const downloadImage = (url, dest) => new Promise((res, rej) => {
  https.get(url, (r) => {
    if (r.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      r.pipe(file);
      file.on('finish', () => { file.close(); res(dest); });
    } else {
      rej(new Error(`Failed to download ${url}: ${r.statusCode}`));
    }
  }).on('error', rej);
});

async function scrapeImages(query, limit = 1) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  const html = await getHTML(url);
  // Match standard Unsplash image URLs
  const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"'\\]+/g;
  const matches = html.match(regex);
  if (!matches) return [];
  
  // Filter for unique URLs and avoid small thumbnails
  const uniqueUrls = [...new Set(matches)].filter(u => u.includes('w=') && !u.includes('profile-') && !u.includes('premium_photo'));
  
  // Clean up the URLs to get high quality versions
  return uniqueUrls.slice(0, limit).map(u => {
    // Replace width params with our desired size
    return u.replace(/&w=\d+/, '&w=1200').replace(/&q=\d+/, '&q=80') + '&fmt=webp';
  });
}

async function run() {
  const outDir = path.join(__dirname, 'client', 'public', 'images', 'jewelry', 'necklaces');
  fs.mkdirSync(outDir, { recursive: true });

  const tasks = [
    { name: 'necklace-banner.webp', query: 'woman wearing delicate gold necklace', limit: 3 },
    { name: 'necklace-01.webp', query: 'gold solitaire pendant necklace', limit: 1 },
    { name: 'necklace-02.webp', query: 'delicate gold chain necklace', limit: 1 },
    { name: 'necklace-03.webp', query: 'diamond pendant necklace', limit: 1 },
    { name: 'necklace-04.webp', query: 'minimal gold necklace', limit: 1 },
    { name: 'necklace-05.webp', query: 'pearl gold necklace', limit: 1 },
    { name: 'necklace-06.webp', query: 'emerald gold pendant necklace', limit: 1 },
    { name: 'necklace-07.webp', query: 'layered gold necklace', limit: 1 },
    { name: 'necklace-08.webp', query: 'diamond gold necklace', limit: 1 },
  ];

  for (const task of tasks) {
    try {
      console.log(`Searching for: ${task.query}`);
      const urls = await scrapeImages(task.query, task.limit);
      if (urls.length > 0) {
        // Use the last one if multiple to add variety, especially for the banner
        const urlToUse = urls[urls.length - 1]; 
        console.log(`Downloading ${task.name} from ${urlToUse}`);
        await downloadImage(urlToUse, path.join(outDir, task.name));
        console.log(`Successfully saved ${task.name}`);
      } else {
        console.log(`No images found for ${task.query}`);
      }
    } catch (e) {
      console.error(`Failed on ${task.name}: ${e.message}`);
    }
  }
}

run();
