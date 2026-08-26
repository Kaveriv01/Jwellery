import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TariniLoader({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    // Uncomment the following lines if you want it to show ONLY once per session
    /*
    const seen = sessionStorage.getItem('tarini-loader-seen');
    if (seen) {
      onComplete?.();
      return;
    }
    */

    // Extended to 5 seconds for a more immersive, premium aesthetic reveal
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 5000);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('tarini-loader-seen', '1');
      onComplete?.();
    }, 5600); // Gives time for the fade out

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const letters = ['ता', 'रि', 'णी'];

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Subtle Ambient Glow Background */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_60%)] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Diamond SVG with slow elegant pulse */}
          <motion.svg
            width="64" height="64" viewBox="0 0 56 56" fill="none"
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="mb-10 drop-shadow-lg z-10"
          >
            <motion.path
              d="M28 4 L52 22 L28 52 L4 22 Z"
              stroke="#C5A059" strokeWidth="1" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.path
              d="M4 22 L28 4 L52 22 M28 52 L4 22 M28 52 L52 22"
              stroke="#C5A059" strokeWidth="0.5" fill="none" opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 1.0 }}
            />
            <motion.circle
              cx="28" cy="22" r="3"
              fill="#C5A059"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
              transition={{ delay: 1.8, duration: 1, ease: 'easeInOut' }}
            />
          </motion.svg>

          {/* TARINI Letters in Marathi - Cinematic Blur Reveal */}
          <div className="flex items-center gap-4 mb-8 z-10">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.6 + i * 0.3, duration: 1.2, ease: 'easeOut' }}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-6xl md:text-8xl font-medium text-[#FDFBF7]"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* English Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10, letterSpacing: '0.2em' }}
            animate={{ opacity: 0.8, y: 0, letterSpacing: '0.4em' }}
            transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
            className="text-[11px] md:text-[13px] uppercase text-[#C5A059] font-medium z-10 drop-shadow-md"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Timeless Luxury Jewellery
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[1px] bg-[#FDFBF7]/10 overflow-hidden z-10"
            style={{ width: 180 }}
          >
            <motion.div
              className="h-full bg-[#C5A059]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4.8, ease: 'easeInOut', delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
