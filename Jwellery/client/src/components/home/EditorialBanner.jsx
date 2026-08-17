import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function EditorialBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[60vh] lg:h-[520px] min-h-[420px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: shouldReduceMotion ? 1 : 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          src="/images/home/experience-banner-new.png"
          alt="The Tarini Experience"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-[#C7A56A] text-[11px] tracking-[0.3em] font-medium uppercase mb-5 block">
            TARINI EXPERIENCE
          </span>

          <h2
            className="text-white text-[34px] sm:text-[44px] lg:text-[58px] leading-tight font-normal mb-10 drop-shadow-md"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Experience The Magic
          </h2>

          {/* Play button */}
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            aria-label="Play Video"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
