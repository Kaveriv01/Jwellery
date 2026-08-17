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
    <section className="relative w-full h-[85vh] lg:h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#D3BFA9]">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full z-0 overflow-hidden hidden lg:block mask-image-linear-to-l">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?auto=format&fit=crop&q=80&w=2000"
          alt="Premium Luxury Jewellery"
          className="w-full h-full object-cover object-top origin-top"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 30%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)' }}
        />
      </div>

      <div className="absolute top-0 right-0 w-full h-full z-0 overflow-hidden lg:hidden block">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?auto=format&fit=crop&q=80&w=2000"
          alt="Premium Luxury Jewellery"
          className="w-full h-full object-cover object-top opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center px-6 lg:px-20 max-w-7xl mx-auto w-full h-full">
        <motion.div
          initial="hidden"
          animate="show"
          className="flex flex-col items-start max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.span variants={eyebrowVariants} className="text-[#5b4e3e] text-[11px] lg:text-[13px] tracking-[0.25em] uppercase font-semibold mb-6 block">
            UNFADING BEAUTY
          </motion.span>
          
          {/* Main Heading */}
          <motion.h1 variants={headingVariants} className="text-[#3A332B] text-[40px] sm:text-[48px] lg:text-[64px] leading-[1.1] font-normal mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Crafted To Shine, Designed<br />To Empower – One Chain<br />At A Time
          </motion.h1>
          
          {/* Supporting Text */}
          <motion.p variants={descVariants} className="text-[#5b4e3e] text-[14px] lg:text-[15px] max-w-lg font-medium mb-12 leading-relaxed tracking-[0.02em]">
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Aliquam erat volutpat. Fusce tincidunt lorem at nisl lacinia, at sollicitudin quam feugiat.
          </motion.p>
 
          {/* CTAs */}
          <motion.div variants={ctaVariants} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <motion.div
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/products"
                className="w-full sm:w-auto block bg-[#4A4A4A] text-white px-12 py-4 text-[12px] font-medium tracking-[0.1em] uppercase transition-all duration-[250ms] ease-out hover:bg-[#2A2A2A] text-center"
              >
                Know More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Slider Controls Placeholder */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#3A332B]" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
      </div>

      {/* Arrows Placeholder */}
      <button className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-sm flex items-center justify-center text-[#3A332B] hover:bg-white/50 transition-colors z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-sm flex items-center justify-center text-[#3A332B] hover:bg-white/50 transition-colors z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </section>
  );
}
