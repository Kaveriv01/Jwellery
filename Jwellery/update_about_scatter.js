const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/AboutPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add ScatteredReveal import
if (!content.includes('ScatteredReveal')) {
  content = content.replace(
    /import FadeUp from '\.\.\/components\/animations\/FadeUp';/,
    `import FadeUp from '../components/animations/FadeUp';\nimport ScatteredReveal from '../components/animations/ScatteredReveal';`
  );
}

// Replace FadeUp surrounding premium-image-container with ScatteredReveal
content = content.replace(
  /<FadeUp(?: delay=\{[^}]+\})?>(?:\s*<div className="premium-image-container[^>]+>[\s\S]*?<\/div>\s*)<\/FadeUp>/g,
  (match) => {
     let inner = match.replace(/<FadeUp(?: delay=\{[^}]+\})?>/g, '').replace(/<\/FadeUp>/g, '');
     return `<ScatteredReveal index={Math.floor(Math.random() * 8)}>${inner}</ScatteredReveal>`;
  }
);

content = content.replace(
  /<FadeUp className="col-span-2 md:col-span-8 md:row-span-2">(?:\s*<div className="premium-image-container[^>]+>[\s\S]*?<\/div>\s*)<\/FadeUp>/g,
  (match) => {
     let inner = match.replace(/<FadeUp className="col-span-2 md:col-span-8 md:row-span-2">/g, '').replace(/<\/FadeUp>/g, '');
     return `<ScatteredReveal index={0} className="col-span-2 md:col-span-8 md:row-span-2">${inner}</ScatteredReveal>`;
  }
);

content = content.replace(
  /<FadeUp delay=\{[^\}]+\} className="col-span-[^>]+">(?:\s*<div className="premium-image-container[^>]+>[\s\S]*?<\/div>\s*)<\/FadeUp>/g,
  (match) => {
     let inner = match.replace(/<FadeUp delay=\{[^\}]+\} className="col-span-[^>]+">/g, '').replace(/<\/FadeUp>/g, '');
     return `<ScatteredReveal index={Math.floor(Math.random() * 8)}>${inner}</ScatteredReveal>`;
  }
);

// We'll leave Section 10 Categories in AboutPage because it's a map
content = content.replace(
  /\{CATEGORIES\.map\(\(cat, index\) => \(\s*<FadeUp key=\{index\} delay=\{index \* 0\.1\} className="group">\s*(<Link[\s\S]*?<\/Link>)\s*<\/FadeUp>\s*\)\)\}/g,
  `{CATEGORIES.map((cat, index) => (
              <ScatteredReveal key={index} index={index} className="group">
                $1
              </ScatteredReveal>
            ))}`
);

// We'll leave Section 8 Materials & Quality in AboutPage because it's a map
content = content.replace(
  /\{MATERIALS\.map\(\(item, index\) => \(\s*<FadeUp key=\{index\} delay=\{index \* 0\.1\}>(?:\s*<div className="premium-image-container[^>]+>[\s\S]*?<\/div>\s*)<\/FadeUp>\s*\)\)\}/g,
  (match) => {
     let inner = match.replace(/<FadeUp key=\{index\} delay=\{index \* 0\.1\}>/g, '').replace(/<\/FadeUp>/g, '');
     return `{MATERIALS.map((item, index) => (\n              <ScatteredReveal key={index} index={index}>\n                ${inner.trim().replace(/^\{MATERIALS\.map\(\(item, index\) => \(/g, '')}\n              </ScatteredReveal>\n            ))}`;
  }
);

// Wait, the materials regex might be tricky, let's just do a simpler replacement
fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated AboutPage.jsx with ScatteredReveal");
