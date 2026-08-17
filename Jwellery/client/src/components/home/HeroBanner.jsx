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
          src="/images/home/hero-new.png"
          alt="Tarini Jewellers Collection"
          className="w-full h-full object-cover object-top lg:object-center"
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
          <motion.span variants={eyebrowVariants} className="text-[#111] text-[11px] lg:text-[12px] tracking-[0.25em] font-bold uppercase mb-5 block">
            NEW COLLECTION
          </motion.span>
          
          {/* Main Headline */}
          <h2 className="text-[#111] text-[40px] sm:text-[50px] lg:text-[64px] leading-[1.05] font-normal mb-6 tracking-wide drop-shadow-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Timeless Beauty.<br />
            Made to Shine.
          </h2>
          
          {/* Supporting Text */}
          <motion.p variants={descVariants} className="text-[#333] text-[14px] lg:text-[16px] max-w-md font-medium mb-10 leading-relaxed">
            Fine jewellery crafted with precision, passion, and the finest materials.
          </motion.p>
 
          {/* CTAs */}
          <motion.div variants={btnVariants} className="flex flex-wrap items-center gap-5">
            <Link to="/products" className="group relative inline-flex items-center justify-center bg-[#111] text-white px-8 py-3.5 text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-medium overflow-hidden rounded-[2px] hover:bg-[#333] transition-colors duration-300">
              <span className="relative z-10 flex items-center gap-2">
                SHOP NEW IN
              </span>
            </Link>
            
            <Link to="/collections" className="group inline-flex items-center gap-2 text-[#111] text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-bold hover:text-[#555] transition-colors duration-300">
              <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#111] after:scale-x-100 group-hover:after:scale-x-0 after:transition-transform after:duration-300 after:origin-right">EXPLORE COLLECTION</span>
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
