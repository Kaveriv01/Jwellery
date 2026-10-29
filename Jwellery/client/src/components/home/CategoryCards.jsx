import { Link } from 'react-router-dom';

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
          <h2 className="font-cinzel text-2xl md:text-3xl lg:text-4xl text-[#1F1517] font-normal tracking-[0.06em] uppercase mb-2">
            Shop by Category
          </h2>
          <p className="font-montserrat text-[10px] md:text-[12px] tracking-[0.2em] uppercase text-[#756A63]">
            Discover our luxury collections
          </p>
        </div>
        
        {/* Mobile: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              className="group relative aspect-[9/16] md:aspect-auto md:h-[450px] lg:h-[500px] overflow-hidden rounded-[2px] bg-[#FAF8F5]"
            >
              <Link to={`/category/${cat.id}`} className="block w-full h-full relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Text positioned at the bottom, calm luxury aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-8 text-center pointer-events-none">
                  <span 
                    style={{ 
                      textShadow: "0px 2px 6px rgba(0,0,0,0.6)" 
                    }} 
                    className="font-cinzel text-white text-2xl sm:text-3xl md:text-4xl font-normal tracking-wider uppercase mb-2 drop-shadow-xl"
                  >
                    {cat.name}
                  </span>
                  <div className="hidden md:block">
                    <span 
                      style={{ 
                        textShadow: "0px 1px 2px rgba(0,0,0,0.6)"
                      }}
                      className="font-montserrat text-white text-[10px] font-semibold uppercase tracking-[0.2em] border-b border-white pb-0.5 inline-block drop-shadow-md"
                    >
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
