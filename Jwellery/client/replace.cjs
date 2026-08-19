const fs = require('fs');
const path = require('path');

function replaceColors(filePath, replaces) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replacement] of replaces) {
        content = content.replace(new RegExp(search, 'g'), replacement);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${path.basename(filePath)}`);
}

const clientDir = path.join(__dirname, 'src');

replaceColors(path.join(clientDir, 'pages', 'ProductDetailPage.jsx'), [
    ['#3A0508', '#35050D'],
    ['#220306', '#4A0712'],
    ['#B59A68', '#C7A56A']
]);

console.log('All updates complete.');
