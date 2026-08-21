import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=90&w=500' },
  { id: 'earrings', name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=90&w=500' },
  { id: 'necklaces', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=90&w=500' },
  { id: 'bracelets', name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=90&w=500' },
  { id: 'pendants', name: 'Pendants', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=90&w=500' },
  { id: 'sets', name: 'Gift Sets', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=90&w=500' },
];

export default function ShopByCategory() {
  return (
    <section className="w-full bg-[#FDFBF7] py-8 md:py-6 mb-0 md:mb-8 border-b border-[#EAE6DF]/50">
      <div className="container-luxury max-w-[1400px] px-4 md:px-0">
        
        {/* Mobile View: 2-column grid of parallel photos */}
        <div className="md:hidden">
          <div className="text-center mb-8">
            <h2 
              className="text-2xl text-[#35050D] font-normal uppercase tracking-[0.15em] mb-3" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Shop By Category
            </h2>
            <div className="w-12 h-[1px] bg-[#C7A56A] mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat, index) => (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              >
                <Link to={`/category/${cat.id}`} className="group block w-full relative overflow-hidden rounded-[8px] bg-[#F8F4EE] aspect-[4/5] shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                    <span 
                      className="text-[12px] text-white font-[500] tracking-[0.15em] uppercase drop-shadow-md"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet View: Original horizontal scrolling circles */}
        <div className="hidden md:block">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar justify-center gap-6 lg:gap-10 pb-4 pt-2 px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            {CATEGORIES.map((cat, index) => (
              <motion.div 
                key={cat.id} 
                className="snap-start shrink-0 flex flex-col items-center group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <Link to={`/category/${cat.id}`} className="flex flex-col items-center">
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-[2px] mb-3 transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-[#C7A56A] group-hover:to-[#E8D09E] bg-transparent">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-[#F8F4EE]">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-[500ms] ease-out group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <span 
                    className="text-[12px] text-[#35050D] font-[600] tracking-[0.08em] uppercase transition-colors group-hover:text-[#C7A56A]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
