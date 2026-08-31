const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client/src');

const replacements = [
  // Typography
  { regex: /text-\[#292725\]/g, replace: 'text-[#2A2020]' },
  { regex: /text-\[#111111\]/g, replace: 'text-[#2A2020]' },
  { regex: /text-\[#1A1A1A\]/g, replace: 'text-[#2A2020]' },
  { regex: /text-\[#403D39\]/g, replace: 'text-[#2A2020]' },
  { regex: /text-\[#A8A196\]/g, replace: 'text-[#756A63]' },
  { regex: /text-gray-500/g, replace: 'text-[#756A63]' },
  { regex: /text-gray-400/g, replace: 'text-[#756A63]' },
  { regex: /text-gray-600/g, replace: 'text-[#756A63]' },
  { regex: /text-\[#B39A6B\]/g, replace: 'text-[#B79A6B]' },
  { regex: /hover:text-\[#B39A6B\]/g, replace: 'hover:text-[#B79A6B]' },
  { regex: /text-\[#D83636\]/g, replace: 'text-[#5A3034]' },
  
  // Backgrounds
  { regex: /bg-\[#F8F5EF\]/g, replace: 'bg-[#FAF7F2]' },
  { regex: /bg-\[#F7F4EF\]/g, replace: 'bg-[#FAF7F2]' },
  { regex: /bg-\[#F2EEE7\]/g, replace: 'bg-[#FAF7F2]' },
  { regex: /bg-\[#F8F8F8\]/g, replace: 'bg-[#FAF7F2]' },
  { regex: /bg-\[#F9F9F9\]/g, replace: 'bg-[#FAF7F2]' },
  { regex: /bg-\[#FAFAFA\]/g, replace: 'bg-[#FAF7F2]' },
  { regex: /bg-\[#292725\]/g, replace: 'bg-[#5A3034]' },
  { regex: /bg-black/g, replace: 'bg-[#3E2024]' },
  { regex: /hover:bg-black/g, replace: 'hover:bg-[#3E2024]' },
  { regex: /hover:bg-\[#292725\]/g, replace: 'hover:bg-[#3E2024]' },
  { regex: /bg-\[#1A1A1A\]/g, replace: 'bg-[#211719]' },
  { regex: /bg-\[#111111\]/g, replace: 'bg-[#211719]' },
  { regex: /bg-\[#0F172A\]/g, replace: 'bg-[#211719]' },
  { regex: /bg-\[#B39A6B\]/g, replace: 'bg-[#B79A6B]' },
  
  // Borders
  { regex: /border-\[#403D39\]/g, replace: 'border-[#DED3C4]' },
  { regex: /border-\[#292725\]/g, replace: 'border-[#5A3034]' },
  { regex: /border-\[#B39A6B\]/g, replace: 'border-[#B79A6B]' },
  { regex: /border-gray-100/g, replace: 'border-[#DED3C4]' },
  { regex: /border-gray-200/g, replace: 'border-[#DED3C4]' },
  { regex: /border-gray-300/g, replace: 'border-[#DED3C4]' },
  { regex: /border-\[#E8E1D7\]/g, replace: 'border-[#DED3C4]' },
  
  // Special Fills/Strokes
  { regex: /fill="#B39A6B"/g, replace: 'fill="#B79A6B"' },
  { regex: /fill="currentColor"/g, replace: 'fill="currentColor"' }, // keep
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Done.");
