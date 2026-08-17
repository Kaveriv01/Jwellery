import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'CHAIN',
    slug: 'chain',
    image: 'https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=600&q=90'
  },
  {
    name: 'RING',
    slug: 'ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f679f427d?w=600&q=90'
  },
  {
    name: 'ACCESSORIES',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a8efd3c3336?w=600&q=90'
  },
  {
    name: 'BRACELETS',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=90'
  },
  {
    name: 'BANGLES',
    slug: 'bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=90'
  },
  {
    name: 'PEARL JEWELERY',
    slug: 'pearl',
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cf0d22?w=600&q=90'
  }
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
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="container-luxury py-20 lg:py-28 overflow-hidden bg-white">
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.span className="text-[#B59A68] text-[11px] tracking-[0.25em] uppercase mb-3 block font-semibold">
          OUR COLLECTION
        </motion.span>
        {/* Decorative element from design */}
        <div className="w-4 h-4 mx-auto mb-2 opacity-50">
           <svg viewBox="0 0 24 24" fill="none" stroke="#B59A68" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
        <motion.h2 className="text-[32px] sm:text-[38px] lg:text-[46px] text-[#4A4A4A] font-normal tracking-wide mb-[16px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Gorgeous Collections
        </motion.h2>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-10 px-4 lg:px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.slug} variants={itemVariants} className="flex flex-col items-center">
            <Link 
              to={`/category/${cat.slug}`} 
              className="group flex flex-col items-center"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-6 bg-[#FAF6EE] shadow-sm border-[4px] border-white group-hover:border-[#F0EBE1] transition-colors duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <h3 className="text-[#4A4A4A] text-[13px] lg:text-[14px] font-medium tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-[#B59A68]">
                {cat.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-16 flex justify-center">
        <Link
          to="/products"
          className="inline-block bg-[#4A4A4A] text-white px-10 py-3 text-[12px] font-medium tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#2A2A2A]"
        >
          View All
        </Link>
      </div>
    </div>
  );
}
