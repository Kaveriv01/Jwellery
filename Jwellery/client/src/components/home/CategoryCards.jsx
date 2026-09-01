import { Link } from 'react-router-dom';
import ScatteredReveal from '../animations/ScatteredReveal';

const CATEGORIES = [
  { id: 'necklaces', name: 'Necklaces', image: '/images/cat-necklace-floral.png' },
  { id: 'earrings', name: 'Earrings', image: '/images/cat-earrings.png' },
  { id: 'rings', name: 'Rings', image: '/images/cat-rings-floral.png' },
  { id: 'bracelets', name: 'Bracelets', image: '/images/cat-bracelet.png' },
];

export default function CategoryCards() {
  return (
    <div className="w-full bg-[#FDFBF7] py-12 md:py-16 border-b border-[#EAE6DF]/50">
      <div className="container-luxury max-w-[1400px] px-4 md:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl md:text-4xl text-[#1F1517] font-medium tracking-wide mb-3">
            Shop by Category
          </h2>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif" }} className="text-[10px] md:text-sm tracking-widest uppercase text-[#1F1517]">
            Discover our luxury collections
          </p>
        </div>
        
        {/* Mobile: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {CATEGORIES.map((cat, index) => (
            <ScatteredReveal 
              key={cat.id} 
              index={index}
              className="premium-image-container group relative aspect-[9/16] md:aspect-auto md:h-[450px] lg:h-[500px]"
            >
              <Link to={`/category/${cat.id}`} className="premium-image-inner block w-full h-full relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Text positioned at the bottom, perfectly clear image with no gradient */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 text-center pointer-events-none rounded-[20px]">
                  <span 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif",
                      textShadow: "0px 2px 5px rgba(0,0,0,0.6)" 
                    }} 
                    className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-2 md:mb-4 transition-transform duration-500 group-hover:-translate-y-2 drop-shadow-xl"
                  >
                    {cat.name}
                  </span>
                  <div className="overflow-hidden hidden md:block">
                    <span 
                      style={{ 
                        fontFamily: "'Nunito Sans', sans-serif",
                        textShadow: "0px 1px 2px rgba(0,0,0,0.6)"
                      }}
                      className="text-white text-[11px] font-semibold uppercase tracking-[0.15em] border-b border-white pb-1 inline-block transform translate-y-[200%] group-hover:translate-y-0 transition-transform duration-500 ease-out drop-shadow-md"
                    >
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            </ScatteredReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
