const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  content = content.replace(/TARNI/g, 'TARINI');
  content = content.replace(/Tarni/g, 'Tarini');
  content = content.replace(/tarni/g, 'tarini');
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
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir('c:\\Users\\Admin\\Downloads\\Jwellery\\Jwellery\\client\\src');
