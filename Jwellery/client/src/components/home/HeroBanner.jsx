import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 } }
  };
  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } }
  });

  return (
    <section className="relative w-full h-[88vh] lg:h-[84vh] min-h-[560px] flex items-center bg-[#EEE9E0] overflow-hidden">
      {/* Background Image — 55% right side */}
      <div className="absolute top-0 right-0 w-full lg:w-[58%] h-full z-0 overflow-hidden">
        <motion.img
          initial={{ scale: shouldReduceMotion ? 1 : 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
          src="/images/home/hero-new.png"
          alt="Tarini Jewellers — Fine Jewellery Collection"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient: left fade for clean text area */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EEE9E0] via-[#EEE9E0]/40 to-transparent" />
      </div>

      {/* Mobile overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EEE9E0]/85 to-[#EEE9E0]/55 lg:hidden z-0" />

      {/* Content */}
      <div className="container-luxury relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start max-w-[500px]"
        >
          {/* Eyebrow — Manrope */}
          <motion.span
            variants={fadeUp(0)}
            style={{ fontFamily: "'Manrope', sans-serif" }}
            className="text-[#111] text-[10px] lg:text-[11px] tracking-[0.18em] font-semibold uppercase mb-6 block"
          >
            NEW COLLECTION
          </motion.span>

          {/* Main Heading — Cormorant Garamond */}
          <motion.h1
            variants={fadeUp(0.1)}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[#111] text-[52px] sm:text-[62px] lg:text-[72px] leading-[0.98] font-[500] mb-2 tracking-[-0.02em]"
          >
            Timeless Beauty.<br />
            <em className="not-italic" style={{ fontStyle: 'italic', fontWeight: 500 }}>Made to Shine.</em>
          </motion.h1>

          {/* Divider */}
          <motion.div variants={fadeUp(0.2)} className="w-10 h-[1px] bg-[#C7A56A] my-7" />

          {/* Supporting Text — Manrope */}
          <motion.p
            variants={fadeUp(0.25)}
            style={{ fontFamily: "'Manrope', sans-serif" }}
            className="text-[#444] text-[14px] lg:text-[15px] max-w-[400px] font-[400] mb-10 leading-[1.75]"
          >
            Fine jewellery crafted with precision, passion, and the finest materials.
          </motion.p>

          {/* CTAs — Manrope */}
          <motion.div variants={fadeUp(0.3)} className="flex flex-wrap items-center gap-5">
            <Link
              to="/products"
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="inline-flex items-center justify-center bg-[#111] text-white px-8 py-3.5 text-[11px] uppercase tracking-[0.08em] font-[600] hover:bg-[#333] transition-colors duration-300 rounded-sm"
            >
              SHOP NEW IN
            </Link>
            <Link
              to="/products"
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="group inline-flex items-center text-[#111] text-[11px] uppercase tracking-[0.08em] font-[600] hover:opacity-60 transition-opacity duration-300"
            >
              <span className="relative pb-[2px] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#111] after:origin-right after:scale-x-100 group-hover:after:scale-x-0 after:transition-transform after:duration-300">
                EXPLORE COLLECTION
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
