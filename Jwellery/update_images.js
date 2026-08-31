const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/AboutPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Section 2: cat-ring-hands
content = content.replace(
  /<div className="aspect-\[3\/4\] overflow-hidden w-full max-w-md mx-auto lg:max-w-none shadow-lg">\s*<img\s*src="\/images\/cat-ring-hands\.png"\s*alt="Jewellery That Tells Your Story"\s*className="w-full h-full object-cover hover:scale-105 transition-transform duration-\[2s\] ease-out"\s*\/>\s*<\/div>/g,
  `<div className="premium-image-container aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
                <div className="premium-image-inner">
                  <img src="/images/cat-ring-hands.png" alt="Jewellery That Tells Your Story" className="w-full h-full object-cover" />
                </div>
              </div>`
);

// Section 5: Tradition vs Modernity
content = content.replace(
  /<div className="aspect-\[4\/5\] overflow-hidden w-full shadow-lg">\s*<img src="\/images\/necklace-banner\.jpg" alt="Traditional Indian Jewellery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-\[2s\] ease-out" \/>\s*<\/div>/g,
  `<div className="premium-image-container aspect-[4/5] w-full">
              <div className="premium-image-inner">
                <img src="/images/necklace-banner.jpg" alt="Traditional Indian Jewellery" className="w-full h-full object-cover" />
              </div>
            </div>`
);

content = content.replace(
  /<div className="aspect-\[4\/5\] overflow-hidden w-full shadow-lg">\s*<img src="\/images\/earrings-banner\.jpg" alt="Modern Luxury Jewellery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-\[2s\] ease-out" \/>\s*<\/div>/g,
  `<div className="premium-image-container aspect-[4/5] w-full">
              <div className="premium-image-inner">
                <img src="/images/earrings-banner.jpg" alt="Modern Luxury Jewellery" className="w-full h-full object-cover" />
              </div>
            </div>`
);

// Section 8: Materials & Quality
content = content.replace(
  /<div className="relative aspect-square overflow-hidden group shadow-lg">\s*<img src=\{item\.img\} alt=\{item\.title\} className="w-full h-full object-cover transition-transform duration-\[2s\] group-hover:scale-105" \/>\s*<div className="absolute inset-0 bg-\[#3E2024\]\/20 group-hover:bg-\[#3E2024\]\/40 transition-colors duration-500" \/>\s*<div className="absolute inset-0 flex items-center justify-center">\s*<h3 className="text-white text-\[20px\] md:text-\[28px\] lg:text-\[36px\] font-medium tracking-wide drop-shadow-md" style=\{\{ fontFamily: "'Cormorant Garamond', serif" \}\}>\s*\{item\.title\}\s*<\/h3>\s*<\/div>\s*<\/div>/g,
  `<div className="premium-image-container aspect-square group">
                  <div className="premium-image-inner relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#3E2024]/20 group-hover:bg-[#3E2024]/40 transition-colors duration-500 rounded-[20px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-[20px] md:text-[28px] lg:text-[36px] font-medium tracking-wide drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>`
);

// Section 9: Editorial
// Find all aspect-[4/5] overflow-hidden shadow-md containing an img
content = content.replace(
  /<div className="aspect-\[4\/5\] overflow-hidden shadow-md">\s*<img src="([^"]+)" className="w-full h-full object-cover hover:scale-105 transition-transform duration-\[2s\] ease-out" alt="([^"]+)" \/>\s*<\/div>/g,
  `<div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="$1" className="w-full h-full object-cover" alt="$2" />
                </div>
              </div>`
);

// Section 10: Categories
content = content.replace(
  /<Link to=\{cat\.link\} className="group block relative aspect-\[4\/5\] overflow-hidden shadow-sm">\s*<img src=\{cat\.img\} alt=\{cat\.name\} className="absolute inset-0 w-full h-full object-cover transition-transform duration-\[1\.5s\] ease-out group-hover:scale-105" \/>([\s\S]*?)<\/Link>/g,
  `<Link to={cat.link} className="premium-image-container block aspect-[4/5] group">
                  <div className="premium-image-inner relative w-full h-full">
                    <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
$1                  </div>
                </Link>`
);


fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated AboutPage.jsx");
