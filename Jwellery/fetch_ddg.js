const https = require('https');
const fs = require('fs');
const path = require('path');

const getHTML = (url) => new Promise((res, rej) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (r) => {
    let data = '';
    r.on('data', chunk => data += chunk);
    r.on('end', () => res(data));
  }).on('error', rej);
});

const downloadImage = (url, dest) => new Promise((res, rej) => {
  // Use a different user agent for downloading to avoid 403s
  const options = new URL(url);
  options.headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
  
  const req = (url.startsWith('https') ? https : require('http')).get(options, (r) => {
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
  req.setTimeout(10000, () => req.abort());
});

async function searchDuckDuckGoImages(query) {
  // Step 1: Get vqd token
  const tokenUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iar=images&iax=images&ia=images`;
  const tokenHtml = await getHTML(tokenUrl);
  const vqdMatch = tokenHtml.match(/vqd=([a-zA-Z0-9-]+)/);
  if (!vqdMatch) throw new Error('Could not find VQD token');
  const vqd = vqdMatch[1];

  // Step 2: Search images
  const searchUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`;
  const searchResult = await getHTML(searchUrl);
  const data = JSON.parse(searchResult);
  
  if (data && data.results && data.results.length > 0) {
    // Filter out problematic domains (like Pinterest which often blocks hotlinking)
    const valid = data.results.filter(r => !r.image.includes('pinterest') && !r.image.includes('lookaside') && r.image.endsWith('.jpg'));
    return valid.length > 0 ? valid[0].image : data.results[0].image;
  }
  return null;
}

async function run() {
  const outDir = path.join(__dirname, 'client', 'public', 'images', 'jewelry', 'necklaces');
  fs.mkdirSync(outDir, { recursive: true });

  const tasks = [
    { name: 'necklace-banner.webp', query: 'elegant woman wearing luxury gold necklace jewelry editorial site:unsplash.com' },
    { name: 'necklace-01.webp', query: 'solitaire diamond pendant gold necklace isolated white background site:unsplash.com' },
    { name: 'necklace-02.webp', query: 'delicate gold chain necklace white background site:unsplash.com' },
    { name: 'necklace-03.webp', query: 'diamond pendant necklace luxury jewelry white background' },
    { name: 'necklace-04.webp', query: 'minimalist gold necklace jewelry product shot' },
    { name: 'necklace-05.webp', query: 'pearl gold necklace jewelry white background' },
    { name: 'necklace-06.webp', query: 'emerald gold pendant necklace jewelry' },
    { name: 'necklace-07.webp', query: 'layered gold necklace jewelry isolated' },
    { name: 'necklace-08.webp', query: 'diamond gold necklace premium white background' },
  ];

  for (const task of tasks) {
    try {
      console.log(`Searching DDG for: ${task.query}`);
      const url = await searchDuckDuckGoImages(task.query);
      if (url) {
        console.log(`Downloading ${task.name} from ${url}`);
        await downloadImage(url, path.join(outDir, task.name));
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
