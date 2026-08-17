const https = require('https');
const fs = require('fs');
const path = require('path');

const getHTML = (url) => new Promise((res, rej) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (r) => {
    if (r.statusCode === 301 || r.statusCode === 302) {
      return getHTML('https://www.pexels.com' + r.headers.location).then(res).catch(rej);
    }
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

async function scrapePexels(query) {
  const url = `https://www.pexels.com/search/${encodeURIComponent(query)}/`;
  const html = await getHTML(url);
  
  // Extract all src attributes
  const regex = /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg[^"']+/g;
  const matches = html.match(regex);
  if (!matches) return null;
  
  // Get the first unique high-res image
  const uniqueUrls = [...new Set(matches)];
  if (uniqueUrls.length === 0) return null;
  
  // Clean up URL to get original/high quality
  let imgUrl = uniqueUrls[0];
  imgUrl = imgUrl.split('?')[0] + '?auto=compress&cs=tinysrgb&w=1200';
  return imgUrl;
}

async function run() {
  const outDir = path.join(__dirname, 'client', 'public', 'images', 'jewelry', 'necklaces');
  fs.mkdirSync(outDir, { recursive: true });

  const tasks = [
    { name: 'necklace-banner.webp', query: 'woman wearing delicate gold necklace' },
    { name: 'necklace-01.webp', query: 'gold pendant necklace' },
    { name: 'necklace-02.webp', query: 'delicate gold chain necklace' },
    { name: 'necklace-03.webp', query: 'diamond pendant necklace jewelry' },
    { name: 'necklace-04.webp', query: 'minimal gold necklace' },
    { name: 'necklace-05.webp', query: 'pearl gold necklace' },
    { name: 'necklace-06.webp', query: 'emerald gold pendant necklace' },
    { name: 'necklace-07.webp', query: 'layered gold necklace jewelry' },
    { name: 'necklace-08.webp', query: 'diamond gold necklace premium' },
  ];

  for (const task of tasks) {
    try {
      console.log(`Searching for: ${task.query}`);
      const url = await scrapePexels(task.query);
      if (url) {
        console.log(`Downloading ${task.name} from ${url}`);
        await downloadImage(url, path.join(outDir, task.name));
        console.log(`Successfully saved ${task.name}`);
      } else {
        console.log(`No images found for ${task.query}, using fallback`);
        // Fallback to picsum if scraper fails
        const seed = task.name.replace('.webp', '');
        await downloadImage(`https://picsum.photos/seed/${seed}/1200/1250`, path.join(outDir, task.name));
      }
    } catch (e) {
      console.error(`Failed on ${task.name}: ${e.message}`);
    }
  }
}

run();
