import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TariniLoader({ onComplete }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    // Show splash for 2 seconds as requested, then trigger exit
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 2000);
    
    // Complete the loader after exit animation finishes (800ms)
    const t3 = setTimeout(() => {
      sessionStorage.setItem('tarini-loader-seen', '1');
      onComplete?.();
    }, 2800); 

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const letters = ['T', 'A', 'R', 'I', 'N', 'I'];

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Blurred Background Image */}
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              src="/images/home-banner.png" 
              alt="Luxury Jewelry" 
              className="w-full h-full object-cover blur-[12px] brightness-75 scale-110" 
            />
            {/* Dark gradient overlay so the text stands out */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#211719]/80 to-[#4A0E17]/50" />
          </div>

          {/* Diamond SVG with slow elegant pulse */}
          <motion.svg
            width="64" height="64" viewBox="0 0 56 56" fill="none"
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="mb-8 drop-shadow-lg z-10"
          >
            <motion.path
              d="M28 4 L52 22 L28 52 L4 22 Z"
              stroke="#C5A059" strokeWidth="1" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.path
              d="M4 22 L28 4 L52 22 M28 52 L4 22 M28 52 L52 22"
              stroke="#C5A059" strokeWidth="0.5" fill="none" opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.5 }}
            />
            <motion.circle
              cx="28" cy="22" r="2.5"
              fill="#EAD7B0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.9] }}
              transition={{ delay: 1.2, duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.svg>

          {/* TARINI Letters - Cinematic Blur Reveal */}
          <div className="flex items-center gap-1 sm:gap-3 mb-6 z-10">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-[#FDFBF7] tracking-widest drop-shadow-xl"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* English Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10, letterSpacing: '0.1em' }}
            animate={{ opacity: 0.9, y: 0, letterSpacing: '0.4em' }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            className="text-[10px] md:text-[12px] uppercase text-[#C5A059] font-bold z-10 drop-shadow-md text-center px-4"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Timeless Luxury Jewellery
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 h-[2px] bg-[#FDFBF7]/20 overflow-hidden z-10 rounded-full"
            style={{ width: 160 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#EAD7B0]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.0, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
