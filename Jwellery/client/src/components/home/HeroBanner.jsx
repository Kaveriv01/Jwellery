import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBanner() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.15 } }
  };

  const eyebrowVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };
  const headingVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const descVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const btnVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="relative w-full h-[85vh] lg:h-[82vh] min-h-[520px] flex items-center bg-[#EEE9E0] overflow-hidden">
      {/* Background Image — 55% right side */}
      <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 overflow-hidden">
        <motion.img
          initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          src="/images/home/hero-new.png"
          alt="Tarini Jewellers — Fine Jewellery Collection"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient fade from left so text area stays clean */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EEE9E0] via-[#EEE9E0]/30 to-transparent" />
      </div>

      {/* Mobile overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EEE9E0]/80 to-[#EEE9E0]/60 lg:hidden z-0" />

      {/* Content — left 45% */}
      <div className="container-luxury relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start max-w-[480px]"
        >
          {/* Eyebrow */}
          <motion.span
            variants={eyebrowVariants}
            className="text-[#111] text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase mb-5 block"
          >
            NEW COLLECTION
          </motion.span>

          {/* Main Heading */}
          <motion.h1
            variants={headingVariants}
            className="text-[#111] text-[42px] sm:text-[52px] lg:text-[66px] leading-[1.05] font-normal mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Timeless<br />
            Beauty.<br />
            <span className="italic">Made to Shine.</span>
          </motion.h1>

          {/* Divider */}
          <motion.div variants={descVariants} className="w-10 h-[1px] bg-[#C7A56A] mb-6" />

          {/* Supporting Text */}
          <motion.p
            variants={descVariants}
            className="text-[#444] text-[14px] lg:text-[15px] max-w-sm font-normal mb-10 leading-relaxed"
          >
            Fine jewellery crafted with precision, passion, and the finest materials.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={btnVariants} className="flex flex-wrap items-center gap-5">
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-[#111] text-white px-8 py-3.5 text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#333] transition-colors duration-300 rounded-sm"
            >
              SHOP NEW IN
            </Link>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-[#111] text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-medium hover:opacity-60 transition-opacity duration-300"
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
