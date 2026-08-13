const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  content = content.replace(/'Playfair Display'/g, "'Cormorant Garamond'");
  content = content.replace(/"'Playfair Display', serif"/g, "\"'Cormorant Garamond', serif\"");
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir('c:\\Users\\Admin\\Downloads\\Jwellery\\Jwellery\\client\\src');
