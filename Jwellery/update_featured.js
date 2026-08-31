const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/components/home/FeaturedCollection.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /<motion\.div \n          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0\.1 }} variants={sectionReveal}\n          className="w-full aspect-\[4\/5\] md:aspect-\[16\/9\] lg:aspect-\[21\/9\] relative overflow-hidden group mb-12 lg:mb-16"\n        >\n          <img src="\/images\/editorial\/main\.png" alt="New In Tarini" className="w-full h-full object-cover transition-transform duration-\[2s\] ease-out group-hover:scale-105" \/>\n        <\/motion\.div>/g,
  `<motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionReveal}
          className="premium-image-container w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] mb-12 lg:mb-16 group"
        >
          <div className="premium-image-inner w-full h-full relative">
            <img src="/images/editorial/main.png" alt="New In Tarini" className="w-full h-full object-cover" />
          </div>
        </motion.div>`
);

content = content.replace(
  /<div className="w-full aspect-\[4\/5\] md:aspect-\[16\/9\] lg:aspect-\[2\.35\/1\] overflow-hidden">\s*<img src="([^"]+)" alt="([^"]+)" className="w-full h-full object-cover transition-transform duration-\[2s\] ease-out group-hover:scale-105" \/>\s*<\/div>/g,
  `<div className="premium-image-container w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.35/1]">
               <div className="premium-image-inner w-full h-full relative">
                 <img src="$1" alt="$2" className="w-full h-full object-cover" />
               </div>
            </div>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated FeaturedCollection.jsx");
