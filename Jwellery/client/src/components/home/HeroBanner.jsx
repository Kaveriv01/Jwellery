import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const eyebrowVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };
  const headingVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: shouldReduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] } }
  };
  const descVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: shouldReduceMotion ? 0 : 0.30, ease: [0.22, 1, 0.36, 1] } }
  };
  const ctaVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="relative w-full h-[85vh] lg:h-[80vh] min-h-[500px] flex items-center bg-[#EAE6DF] overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          src="/images/home/hero.jpg"
          alt="Tarini Jewellers Collection"
          className="w-full h-full object-cover object-top lg:object-center"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
        />
      </div>

      {/* Mobile overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EAE6DF] via-[#EAE6DF]/90 to-transparent lg:hidden z-0" />

      {/* Content */}
      <div className="container-luxury relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="show"
          className="flex flex-col items-start max-w-xl"
        >
          {/* Eyebrow */}
          <motion.span variants={eyebrowVariants} className="text-[#111] text-[10px] lg:text-[11px] tracking-[0.15em] uppercase font-bold mb-6 block">
            NEW COLLECTION
          </motion.span>
          
          {/* Main Heading */}
          <motion.h1 variants={headingVariants} className="text-[#111] text-[42px] sm:text-[54px] lg:text-[64px] leading-[1.05] font-normal mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Timeless Beauty.<br />
            <span className="italic">Made to Shine.</span>
          </motion.h1>
          
          {/* Supporting Text */}
          <motion.p variants={descVariants} className="text-[#333] text-[14px] lg:text-[16px] max-w-md font-medium mb-10 leading-relaxed">
            Fine jewellery crafted with precision, passion, and the finest materials.
          </motion.p>
 
          {/* CTAs */}
          <motion.div variants={ctaVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/products?sort=-createdAt"
              className="w-full sm:w-auto block bg-[#111] text-white px-8 py-3.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#333] text-center rounded-sm"
            >
              Shop New In
            </Link>
            <Link
              to="/collections"
              className="w-full sm:w-auto block bg-transparent border border-[#111] text-[#111] px-8 py-3.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#111] hover:text-white text-center rounded-sm"
            >
              Explore Collection
            </Link>
          </motion.div>

          {/* Dots */}
          <motion.div variants={ctaVariants} className="flex items-center gap-2 mt-16">
            <div className="w-2 h-2 rounded-full bg-[#111]" />
            <div className="w-2 h-2 rounded-full bg-[#ccc]" />
            <div className="w-2 h-2 rounded-full bg-[#ccc]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
