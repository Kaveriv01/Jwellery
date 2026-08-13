const https = require('https');

https.get('https://palmonas.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /https:\/\/[^"'\s]*shraddha[^"'\s]*\.(?:jpg|webp|png|jpeg)/gi;
    const matches = data.match(regex) || [];
    console.log(Array.from(new Set(matches)));
  });
});

