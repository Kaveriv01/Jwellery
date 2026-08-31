const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/components/home/FeaturedCollection.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add ScatteredReveal import
if (!content.includes('ScatteredReveal')) {
  content = content.replace(
    /import ProductCard from '\.\.\/product\/ProductCard';/,
    `import ProductCard from '../product/ProductCard';\nimport ScatteredReveal from '../animations/ScatteredReveal';`
  );
}

// Update ProductCarousel map
content = content.replace(
  /\{products\.map\(\(product\) => \(\s*<div key=\{product\._id\} className="snap-start shrink-0 w-\[75vw\] sm:w-\[45vw\] md:w-\[35vw\] lg:w-\[23vw\]">\s*<ProductCard product=\{product\} \/>\s*<\/div>\s*\)\)\}/g,
  `{products.map((product, index) => (
          <div key={product._id} className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[35vw] lg:w-[23vw]">
            <ProductCard product={product} index={index} />
          </div>
        ))}`
);

// Update ProductSection map
content = content.replace(
  /\{products\.slice\(0, Math\.max\(4, products\.length - \(products\.length % 4\)\)\)\.slice\(0, 8\)\.map\(\(product\) => \(\s*<motion\.div key=\{product\._id\} variants=\{cardVariants\} className="h-full">\s*<ProductCard product=\{product\} \/>\s*<\/motion\.div>\s*\)\)\}/g,
  `{products.slice(0, Math.max(4, products.length - (products.length % 4))).slice(0, 8).map((product, index) => (
              <motion.div key={product._id} variants={cardVariants} className="h-full">
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}`
);

// Update NewArrivals editorial blocks to use ScatteredReveal
content = content.replace(
  /<motion\.div initial="hidden" whileInView="visible" viewport=\{\{ once: true, amount: 0\.1 \}\} variants=\{fadeUp\} className="w-full group">/g,
  `<ScatteredReveal className="w-full group">`
);

content = content.replace(
  /<\/div>\s*<\/motion\.div>/g,
  `</div>\n          </ScatteredReveal>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated FeaturedCollection.jsx with ScatteredReveal");
