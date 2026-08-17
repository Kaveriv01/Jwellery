import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function EditorialBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[60vh] lg:h-[520px] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          src="/images/home/experience-banner-new.png"
          alt="The Tarini Experience"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/52 to-black/65" />
      </div>

      <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* Label — Manrope */}
          <span
            style={{ fontFamily: "'Manrope', sans-serif" }}
            className="text-[#C7A56A] text-[10px] tracking-[0.20em] font-[600] uppercase mb-6 block"
          >
            TARINI EXPERIENCE
          </span>

          {/* Heading — Cormorant Garamond */}
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-white text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.05] font-[500] mb-10 tracking-[-0.01em]"
          >
            Experience The Magic
          </h2>

          {/* Play button */}
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-16 h-16 rounded-full border-2 border-white/70 flex items-center justify-center text-white hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
            aria-label="Play Video"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
