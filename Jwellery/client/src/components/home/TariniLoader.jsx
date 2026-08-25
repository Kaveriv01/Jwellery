import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TariniLoader({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    const seen = sessionStorage.getItem('tarini-loader-seen');
    if (seen) {
      onComplete?.();
      return;
    }

    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 1000);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('tarini-loader-seen', '1');
      onComplete?.();
    }, 1400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const letters = ['ता', 'रि', 'णी'];

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        key="loader"
        className="tarini-loader"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Diamond SVG */}
        <motion.svg
          width="56" height="56" viewBox="0 0 56 56" fill="none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="mb-8"
        >
          <motion.path
            d="M28 4 L52 22 L28 52 L4 22 Z"
            stroke="#B08A45" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
          />
          <motion.path
            d="M4 22 L28 4 L52 22 M28 52 L4 22 M28 52 L52 22"
            stroke="#C8A866" strokeWidth="0.8" fill="none" opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.circle
            cx="28" cy="22" r="3"
            fill="#B08A45"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4, ease: 'backOut' }}
          />
        </motion.svg>

        {/* TARINI Letters */}
        <div className="flex items-center gap-1 mb-3">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-5xl font-light tracking-wide text-shimmer-gold"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 0.5, letterSpacing: '0.4em' }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-[10px] uppercase text-[#B08A45]/60 tracking-[0.4em]"
        >
          Timeless Luxury Jewellery
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[1px] bg-[#B08A45]/20 overflow-hidden"
          style={{ width: 120 }}
        >
          <motion.div
            className="h-full bg-[#B08A45]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
