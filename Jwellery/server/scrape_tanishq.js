const https = require('https');

https.get('https://www.tanishq.co.in/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/static\.titan\.co\.in\/[^\"]+\.(jpg|png|webp)/g);
    if (matches) {
      console.log([...new Set(matches)].slice(0, 10));
    } else {
      console.log("No images found");
    }
  });
}).on('error', err => console.log(err.message));
