import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const CATEGORIES = [
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Elegant rings and everyday statement pieces.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=90'
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Delicate layers and timeless silhouettes.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=90'
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'From everyday studs to statement drops.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=90'
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Minimal pieces designed to stack beautifully.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=90'
  }
];

export default function ShopByCategory() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 }
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

  const eyebrowReveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const dividerReveal = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="container-luxury py-20 lg:py-28 overflow-hidden">
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.span variants={eyebrowReveal} className="text-[#B59A68] text-[9px] lg:text-[10px] tracking-[0.20em] uppercase mb-3 block font-medium">
          CURATED COLLECTIONS
        </motion.span>
        <motion.h2 variants={headingReveal} className="text-[23px] sm:text-[27px] lg:text-[32px] text-[#3A0508] font-normal tracking-wide mb-[16px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shop by Category
        </motion.h2>
        <motion.div style={{ originX: 0.5 }} variants={dividerReveal} className="w-12 h-[1px] bg-[#B59A68] mx-auto" />
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.slug} variants={itemVariants} className="h-full">
            <Link 
              to={`/category/${cat.slug}`} 
              className="group block relative overflow-hidden bg-[#FAF6EE] border border-[#FAF6EE] hover:border-[#B59A68]/30 rounded-[3px] transition-all duration-[450ms] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(58,5,8,0.02)] z-10 h-full flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF6EE]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#3A0508]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms]" />
              </div>
              
              <div className="p-6 bg-white border-t border-[#FAF6EE]/50 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-[#3A0508] text-[13px] lg:text-[15px] font-normal tracking-wide mb-1 flex items-center justify-between transition-colors duration-[450ms] group-hover:text-[#3A0508]/90" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <span>{cat.name}</span>
                    <FiArrowRight className="text-[#B59A68] transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" size={16} />
                  </h3>
                  <div className="w-8 h-[1px] bg-[#B59A68] my-2 transition-all duration-500 group-hover:w-16 group-hover:bg-[#3A0508]" />
                  <p className="text-[#756B62] text-[11px] lg:text-[12px] font-light tracking-wide leading-relaxed mt-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
