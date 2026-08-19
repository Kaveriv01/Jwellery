import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'necklaces', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=90&w=800' },
  { id: 'earrings', name: 'Earrings', image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=90&w=800' },
  { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=90&w=800' },
  { id: 'bracelets', name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=90&w=800' },
];

export default function CategoryCards() {
  return (
    <div className="w-full bg-[#FAF6EE] py-12 md:py-16 border-b border-[#EAE6DF]/50">
      <div className="container-luxury max-w-[1400px]">
        <div className="text-center mb-10">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl md:text-4xl text-[#35050D] font-medium tracking-wide mb-3">
            Shop by Category
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm tracking-widest uppercase text-[#756B62]">
            Discover our luxury collections
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, index) => (
            <motion.div 
              key={cat.id} 
              className="group relative overflow-hidden h-[350px] md:h-[450px] lg:h-[500px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <Link to={`/category/${cat.id}`} className="block w-full h-full">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-center">
                  <span 
                    style={{ fontFamily: "'Cormorant Garamond', serif" }} 
                    className="text-white text-3xl md:text-4xl font-medium tracking-wide mb-4 transition-transform duration-500 group-hover:-translate-y-2"
                  >
                    {cat.name}
                  </span>
                  <div className="overflow-hidden">
                    <span 
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-white text-[11px] font-semibold uppercase tracking-[0.15em] border-b border-white pb-1 inline-block transform translate-y-[200%] group-hover:translate-y-0 transition-transform duration-500 ease-out"
                    >
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
