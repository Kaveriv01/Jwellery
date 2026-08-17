import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const CATEGORIES = [
  { id: 'necklaces', name: 'Necklaces', image: '/images/home/cat-necklaces-new.png' },
  { id: 'earrings', name: 'Earrings', image: '/images/home/cat-earrings-new.png' },
  { id: 'rings', name: 'Rings', image: '/images/home/cat-rings-new.png' },
  { id: 'bracelets', name: 'Bracelets', image: '/images/home/cat-bracelets-new.png' },
  { id: 'stackables', name: 'Stackables', image: '/images/home/cat-stackables-new.png' },
  { id: 'gifts', name: 'Gifts', image: '/images/home/cat-gifts-new.png' }
];

export default function ShopByCategory() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="py-16 lg:py-20 bg-[#F9F9F9] overflow-hidden">
      <div className="container-luxury max-w-[1400px]">
        <motion.div 
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.h2 className="text-[16px] lg:text-[18px] text-[#111] font-bold tracking-[0.05em] uppercase" style={{ fontFamily: 'inherit' }}>
            Shop By Category
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants} className="h-full">
              <Link 
                to={`/category/${cat.id}`} 
                className="group block relative w-full aspect-square overflow-hidden bg-[#F7F5F1]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Text content */}
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 text-center flex flex-col items-center justify-end">
                  <h3 className="text-white text-[12px] lg:text-[14px] font-bold tracking-[0.1em] mb-1 group-hover:-translate-y-1 transition-transform duration-500 uppercase">
                    {cat.name}
                  </h3>
                  <span className="text-white/80 text-[10px] uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
