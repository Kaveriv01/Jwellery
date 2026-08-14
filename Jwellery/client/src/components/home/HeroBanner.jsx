import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const imgScale = shouldReduceMotion ? 1 : 1.03;

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
    <section className="relative w-full h-[85vh] lg:h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#FAF8F3]">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: imgScale }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Luxury Jewellery"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#220306]/35 via-black/30 to-[#220306]/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full">
        <motion.div
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.span variants={eyebrowVariants} className="text-[#B59A68] text-[10px] lg:text-[11px] tracking-[0.20em] uppercase font-medium mb-6 block">
            TIMELESS JEWELLERY, MADE FOR YOU
          </motion.span>
          
          {/* Main Heading */}
          <motion.h1 variants={headingVariants} className="text-[#F7F3EA] text-[30px] sm:text-[38px] lg:text-[52px] leading-[1.12] font-normal mb-6 drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Jewellery That Becomes<br />Part of Your Story
          </motion.h1>
          
          {/* Supporting Text */}
          <motion.p variants={descVariants} className="text-[#FAF8F3]/90 text-[13px] lg:text-[14px] max-w-xl mx-auto font-light mb-12 drop-shadow-sm leading-relaxed tracking-[0.03em]">
            Discover elegant pieces designed to celebrate every version of you.
          </motion.p>
 
          {/* CTAs */}
          <motion.div variants={ctaVariants} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <motion.div
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/products?sort=-createdAt"
                className="w-full sm:w-auto block bg-[#3A0508] text-[#F7F3EA] px-10 py-4 text-[10px] lg:text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-[250ms] ease-out hover:-translate-y-[2px] hover:bg-[#220306] text-center rounded-[2px] border-b-2 border-transparent hover:border-[#B59A68] shadow-md shadow-black/10"
              >
                Shop New Arrivals
              </Link>
            </motion.div>
            
            <motion.div
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/products"
                className="w-full sm:w-auto block bg-transparent border border-white/80 text-white px-10 py-4 text-[10px] lg:text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-[250ms] ease-out hover:-translate-y-[2px] hover:bg-[#F7F3EA] hover:text-[#3A0508] text-center rounded-[2px] shadow-sm"
              >
                Explore All
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
