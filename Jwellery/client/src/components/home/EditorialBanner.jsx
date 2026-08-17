import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function EditorialBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          src="/images/home/experience-banner-new.png"
          alt="The Tarini Experience"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-white text-[12px] tracking-[0.25em] font-medium uppercase mb-6 block drop-shadow-md">
            THE TARINI EXPERIENCE
          </span>
          
          <h2 className="text-white text-[36px] sm:text-[42px] lg:text-[54px] leading-tight font-normal mb-10 drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Experience The Magic
          </h2>

          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Play Video"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
