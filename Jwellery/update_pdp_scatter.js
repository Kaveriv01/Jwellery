const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/ProductDetailPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add ScatteredReveal import
if (!content.includes('ScatteredReveal')) {
  content = content.replace(
    /import \{ motion, AnimatePresence \} from 'framer-motion';/,
    `import { motion, AnimatePresence } from 'framer-motion';\nimport ScatteredReveal from '../components/animations/ScatteredReveal';`
  );
}

// Replace desktop thumbnails
content = content.replace(
  /<button\s*key=\{i\}\s*onMouseEnter=\{\(\) => setSelectedImage\(i\)\}\s*onClick=\{\(\) => setSelectedImage\(i\)\}\s*className=\{\`premium-image-container relative w-full aspect-square flex-shrink-0 border-\[1\.5px\] !rounded-\[12px\] transition-all \$\{selectedImage === i \? 'border-\[#5A3034\]' : 'border-transparent opacity-60 hover:opacity-100'\}\`\}\s*>/g,
  `<ScatteredReveal key={i} index={i}>\n                <button\n                  onMouseEnter={() => setSelectedImage(i)}\n                  onClick={() => setSelectedImage(i)}\n                  className={\`premium-image-container relative w-full aspect-square flex-shrink-0 border-[1.5px] !rounded-[12px] transition-all \${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-60 hover:opacity-100'}\`}\n                >`
);

content = content.replace(
  /<\/div>\s*<\/button>\s*\}\)\}\s*<\/div>\s*\{\/\* Main Large Image/g,
  `</div>\n                </button>\n              </ScatteredReveal>\n              ))}\n            </div>\n\n            {/* Main Large Image`
);

// Replace mobile thumbnails
content = content.replace(
  /<button\s*key=\{i\}\s*onClick=\{\(\) => setSelectedImage\(i\)\}\s*className=\{\`premium-image-container relative w-20 h-20 flex-shrink-0 snap-start border-\[1\.5px\] !rounded-\[12px\] transition-all \$\{selectedImage === i \? 'border-\[#5A3034\]' : 'border-transparent opacity-60 hover:opacity-100'\}\`\}\s*>/g,
  `<ScatteredReveal key={i} index={i}>\n                <button\n                  onClick={() => setSelectedImage(i)}\n                  className={\`premium-image-container relative w-20 h-20 flex-shrink-0 snap-start border-[1.5px] !rounded-[12px] transition-all \${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-60 hover:opacity-100'}\`}\n                >`
);

content = content.replace(
  /<\/div>\s*<\/button>\s*\}\)\}\s*<\/div>\s*<\/div>\s*\{\/\* â”€â”€ Details/g,
  `</div>\n                </button>\n              </ScatteredReveal>\n              ))}\n            </div>\n          </div>\n\n          {/* ── Details`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated ProductDetailPage.jsx with ScatteredReveal");
