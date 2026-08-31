const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/components/home/ShopByCategory.jsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('ScatteredReveal')) {
  content = content.replace(
    /import \{ motion \} from 'framer-motion';/,
    `import { motion } from 'framer-motion';\nimport ScatteredReveal from '../animations/ScatteredReveal';`
  );
}

content = content.replace(
  /<motion\.div \n\s*key=\{cat\.id\} \n\s*initial=\{\{ opacity: 0, y: 15 \}\}\n\s*whileInView=\{\{ opacity: 1, y: 0 \}\}\n\s*viewport=\{\{ once: true, amount: 0\.1 \}\}\n\s*transition=\{\{ delay: index \* 0\.1, duration: 0\.6, ease: "easeOut" \}\}\n\s*>/g,
  `<ScatteredReveal key={cat.id} index={index}>`
);

content = content.replace(
  /<\/Link>\n\s*<\/motion\.div>/g,
  `</Link>\n              </ScatteredReveal>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated ShopByCategory.jsx with ScatteredReveal");
