import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

// Each category uses a completely different, unique image
const CATEGORIES = [
  { id: 'necklaces',  name: 'Necklaces',  image: '/images/home/cat-necklaces-new.png'  },
  { id: 'earrings',   name: 'Earrings',   image: '/images/home/cat-earrings-new.png'   },
  { id: 'rings',      name: 'Rings',      image: '/images/home/cat-rings-new.png'      },
  { id: 'bracelets',  name: 'Bracelets',  image: '/images/home/cat-bracelets-new.png'  },
  { id: 'stackables', name: 'Stackables', image: '/images/home/cat-stackables-new.png' },
  { id: 'gifts',      name: 'Gifts',      image: '/images/home/cat-gifts-new.png'      },
];

export default function ShopByCategory() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container-luxury max-w-[1400px]">
        {/* Section heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            style={{ fontFamily: "'Manrope', sans-serif" }}
            className="text-[#C7A56A] text-[11px] tracking-[0.18em] font-[600] uppercase mb-3 block"
          >
            OUR COLLECTIONS
          </span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[#111] text-[28px] lg:text-[38px] font-[500] tracking-[-0.01em]"
          >
            Shop By Category
          </h2>
        </motion.div>

        {/* 6-column grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants} className="h-full">
              <Link
                to={`/category/${cat.id}`}
                className="group block relative w-full aspect-square overflow-hidden bg-[#EEE9E0] rounded-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Text */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-center flex flex-col items-center justify-end">
                  <h3
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                    className="text-white text-[11px] lg:text-[13px] font-[600] tracking-[0.06em] mb-1 uppercase group-hover:-translate-y-1 transition-transform duration-400"
                  >
                    {cat.name}
                  </h3>
                  <span
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                    className="text-[#C7A56A] text-[9px] uppercase tracking-[0.10em] font-[600] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-400"
                  >
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
