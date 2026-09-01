const fs = require('fs');
const path = require('path');

const homeDir = path.join(__dirname, 'src', 'components', 'home');
const homePageFile = path.join(__dirname, 'src', 'pages', 'HomePage.jsx');

const replacements = [
  { regex: /bg-\[\#FDFBF7\]/g, replacement: 'bg-[#1A1512]' },
  { regex: /bg-\[\#FAF7F2\]/g, replacement: 'bg-[#1A1512]' },
  { regex: /bg-\[\#f9f8f6\]/g, replacement: 'bg-[#1A1512]' },
  { regex: /bg-white/g, replacement: 'bg-[#1A1512]' },
  
  { regex: /text-\[\#25221F\]/g, replacement: 'text-[#E8E1D6]' },
  { regex: /text-\[\#1F1517\]/g, replacement: 'text-[#E8E1D6]' },
  { regex: /text-\[\#0a0708\]/g, replacement: 'text-[#E8E1D6]' },
  { regex: /text-gray-900/g, replacement: 'text-[#E8E1D6]' },
  
  { regex: /text-\[\#756A63\]/g, replacement: 'text-[#8A8177]' },
  { regex: /text-\[\#A99D95\]/g, replacement: 'text-[#8A8177]' },
  { regex: /text-gray-600/g, replacement: 'text-[#8A8177]' },
  { regex: /text-gray-500/g, replacement: 'text-[#8A8177]' },
  
  { regex: /text-\[\#B08D57\]/g, replacement: 'text-[#C6A15B]' },
  { regex: /bg-\[\#B08D57\]/g, replacement: 'bg-[#C6A15B]' },
  { regex: /border-\[\#B08D57\]/g, replacement: 'border-[#C6A15B]' },
  
  { regex: /border-\[\#E8DED1\]/g, replacement: 'border-[#C6A15B]/20' },
  { regex: /border-gray-200/g, replacement: 'border-[#C6A15B]/20' }
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(rule => {
    content = content.replace(rule.regex, rule.replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  });
}

processDirectory(homeDir);
processFile(homePageFile);
console.log("Done updating home components to dark luxury theme.");
