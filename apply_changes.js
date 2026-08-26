const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

// 1. Global color replacement
walkDir('./Jwellery/client/src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace charcoal with midnight espresso
    content = content.replace(/#22181C/gi, '#1F1517');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});

// 2. Navbar.jsx specific
const navPath = './Jwellery/client/src/components/layout/Navbar.jsx';
let navContent = fs.readFileSync(navPath, 'utf8');
navContent = navContent.replace(/#5C1D24/gi, '#1F1517').replace(/#111/gi, '#1F1517');
fs.writeFileSync(navPath, navContent, 'utf8');

// 3. ProductCard.jsx specific
const cardPath = './Jwellery/client/src/components/product/ProductCard.jsx';
let cardContent = fs.readFileSync(cardPath, 'utf8');
cardContent = cardContent.replace(
  '<div className="group flex flex-col h-full bg-transparent transition-all duration-300 pb-4">',
  '<div className="group flex flex-col h-full bg-transparent transition-all duration-300 pb-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[4px]">'
);
cardContent = cardContent.replace(
  '<div className="relative overflow-hidden bg-transparent mb-3" style={{ aspectRatio: \'1/1\' }}>',
  '<div className="relative overflow-hidden bg-transparent mb-3 rounded-t-[4px]" style={{ aspectRatio: \'1/1\' }}>'
);
cardContent = cardContent.replace(
  '<div className="flex flex-col flex-1 px-1 mt-1">',
  '<div className="flex flex-col flex-1 px-2 mt-1">'
);
cardContent = cardContent.replace(
  'font-[500] leading-snug',
  'font-semibold leading-snug'
);
cardContent = cardContent.replace(
  'font-bold text-[#1F1517]',
  'font-[800] text-[#1F1517]'
);
fs.writeFileSync(cardPath, cardContent, 'utf8');

// 4. ProductDetailPage.jsx specific
const pdpPath = './Jwellery/client/src/pages/ProductDetailPage.jsx';
let pdpContent = fs.readFileSync(pdpPath, 'utf8');

// Fix typography
pdpContent = pdpContent.replace(
  'font-[400] leading-tight tracking-wide',
  'font-bold uppercase tracking-[0.1em] leading-tight'
);
pdpContent = pdpContent.replace(
  /font-normal tracking-wide/g,
  'font-bold uppercase tracking-[0.1em]'
);
pdpContent = pdpContent.replace(
  /font-normal text/g,
  'font-bold uppercase tracking-[0.1em] text'
);
pdpContent = pdpContent.replace(
  /<h2 className="text-\[24px\] md:text-\[32px\] text/g,
  '<h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.1em] text'
);

// Inject static images
const staticImagesStr = `
  // Override database images with static high-end square luxury images for the Tira Beauty layout
  const mediaItems = [
    { type: 'image', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800&h=800' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1605100804763-247f67b4549e?auto=format&fit=crop&q=80&w=800&h=800' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800&h=800' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1584377334016-464803e036f6?auto=format&fit=crop&q=80&w=800&h=800' }
  ];

  if (videoUrl) {`;

pdpContent = pdpContent.replace(
  /const mediaItems = images\.map\(img => \(\{ type: 'image', url: img\.url \}\)\);\s*if \(videoUrl\) \{/g,
  staticImagesStr
);

fs.writeFileSync(pdpPath, pdpContent, 'utf8');

// 5. Fix index.css body color
const cssPath = './Jwellery/client/src/index.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(
  'background-color: #FDFBF7;\n  color: #22181C;',
  'background-color: #FDFBF7;\n  color: #1F1517;'
);
fs.writeFileSync(cssPath, cssContent, 'utf8');

console.log("Applied all changes successfully!");
