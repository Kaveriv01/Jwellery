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
    <div className="w-full bg-[#FDFBF7] py-6 mb-8 border-b border-[#EAE6DF]/50">
      <div className="container-luxury max-w-[1400px]">
        {/* Horizontal scroll container */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar justify-start md:justify-center gap-4 sm:gap-6 lg:gap-10 pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0"
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
                {/* Circular Image Container with Gold Ring on Hover */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-[2px] mb-3 transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-[#C7A56A] group-hover:to-[#E8D09E] bg-transparent">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-[#F8F4EE]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-[500ms] ease-out group-hover:scale-110"
                    />
                  </div>
                </div>
                {/* Text Label */}
                <span 
                  className="text-[11px] md:text-[12px] text-[#35050D] font-[600] tracking-[0.08em] uppercase transition-colors group-hover:text-[#C7A56A]"
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
  );
}
