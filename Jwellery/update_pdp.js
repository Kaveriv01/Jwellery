const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/ProductDetailPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace desktop thumbnails
content = content.replace(
  /<button\s*key=\{i\}\s*onMouseEnter=\{\(\) => setSelectedImage\(i\)\}\s*onClick=\{\(\) => setSelectedImage\(i\)\}\s*className={`relative w-full aspect-square flex-shrink-0 border-\[1\.5px\] rounded-\[2px\] overflow-hidden transition-all \$\{selectedImage === i \? 'border-\[#5A3034\]' : 'border-transparent opacity-60 hover:opacity-100'\}`}\s*>\s*\{media\.type === 'video' \? \(\s*<>\s*<img src=\{media\.poster \|\| 'https:\/\/images\.unsplash\.com\/photo-[^']+'\} className="w-full h-full object-contain p-1" \/>\s*<div className="absolute inset-0 bg-\[#3E2024\]\/10 flex flex-col items-center justify-center">\s*<Play size=\{14\} fill="white" className="text-white" \/>\s*<\/div>\s*<\/>\s*\) : \(\s*<img src=\{media\.url\} className="w-full h-full object-contain p-1" \/>\s*\)\}\s*<\/button>/g,
  `<button
                  key={i}
                  onMouseEnter={() => setSelectedImage(i)}
                  onClick={() => setSelectedImage(i)}
                  className={\`premium-image-container relative w-full aspect-square flex-shrink-0 border-[1.5px] !rounded-[12px] transition-all \${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-60 hover:opacity-100'}\`}
                >
                  <div className="premium-image-inner w-full h-full relative">
                    {media.type === 'video' ? (
                      <>
                        <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#3E2024]/10 flex flex-col items-center justify-center rounded-[12px]">
                          <Play size={14} fill="white" className="text-white" />
                        </div>
                      </>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                </button>`
);

// Replace mobile thumbnails
content = content.replace(
  /<button\s*key=\{i\}\s*onClick=\{\(\) => setSelectedImage\(i\)\}\s*className={`relative w-20 h-20 flex-shrink-0 snap-start border-\[1\.5px\] rounded-\[2px\] overflow-hidden transition-all \$\{selectedImage === i \? 'border-\[#5A3034\]' : 'border-transparent opacity-60'\}`}\s*>\s*\{media\.type === 'video' \? \(\s*<>\s*<img src=\{media\.poster \|\| 'https:\/\/images\.unsplash\.com\/photo-[^']+'\} className="w-full h-full object-contain p-1" \/>\s*<div className="absolute inset-0 bg-\[#3E2024\]\/10 flex flex-col items-center justify-center">\s*<Play size=\{14\} fill="white" className="text-white" \/>\s*<\/div>\s*<\/>\s*\) : \(\s*<img src=\{media\.url\} className="w-full h-full object-contain p-1" \/>\s*\)\}\s*<\/button>/g,
  `<button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={\`premium-image-container relative w-20 h-20 flex-shrink-0 snap-start border-[1.5px] !rounded-[12px] transition-all \${selectedImage === i ? 'border-[#5A3034]' : 'border-transparent opacity-60 hover:opacity-100'}\`}
                >
                  <div className="premium-image-inner w-full h-full relative">
                    {media.type === 'video' ? (
                      <>
                        <img src={media.poster || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#3E2024]/10 flex flex-col items-center justify-center rounded-[12px]">
                          <Play size={14} fill="white" className="text-white" />
                        </div>
                      </>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                </button>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated ProductDetailPage.jsx");
