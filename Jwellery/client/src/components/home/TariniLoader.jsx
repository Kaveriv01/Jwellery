import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TariniLoader({ onComplete }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    // Show splash for 3 seconds as requested, then trigger exit
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 3000);
    
    // Complete the loader after exit animation finishes (800ms)
    const t3 = setTimeout(() => {
      sessionStorage.setItem('tarini-loader-seen', '1');
      onComplete?.();
    }, 3800); 

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
              transition={{ duration: 3.5, ease: 'easeOut' }}
              src="/images/splash_background.png" 
              alt="Luxury Splash" 
              className="w-full h-full object-cover blur-[16px] brightness-75 scale-110" 
            />
            {/* Dark gradient overlay so the text stands out */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#100A0C]/90 to-[#350A11]/60" />
          </div>

          {/* Diamond SVG with slow elegant pulse */}
          <motion.svg
            width="72" height="72" viewBox="0 0 56 56" fill="none"
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mb-8 drop-shadow-2xl z-10"
          >
            <motion.path
              d="M28 4 L52 22 L28 52 L4 22 Z"
              stroke="#EAD7B0" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.path
              d="M4 22 L28 4 L52 22 M28 52 L4 22 M28 52 L52 22"
              stroke="#C5A059" strokeWidth="0.5" fill="none" opacity="0.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.6 }}
            />
            <motion.circle
              cx="28" cy="22" r="3"
              fill="#FFFFFF"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
              transition={{ delay: 1.4, duration: 0.8, ease: 'easeInOut' }}
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
            />
          </motion.svg>

          {/* TARINI Letters - Highlighted & Glowing Cinematic Reveal */}
          <div className="flex items-center gap-2 sm:gap-4 mb-6 z-10">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 15, filter: 'blur(10px)', color: '#C5A059' }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)',
                  color: '#FFFFFF',
                  textShadow: '0px 0px 20px rgba(197, 160, 89, 0.7), 0px 4px 10px rgba(0,0,0,0.8)'
                }}
                transition={{ delay: 0.3 + i * 0.1, duration: 1.0, ease: 'easeOut' }}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-widest"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* English Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.4em' }}
            transition={{ delay: 1.2, duration: 1.0, ease: 'easeOut' }}
            className="text-[11px] md:text-[14px] uppercase text-[#EAD7B0] font-bold z-10 drop-shadow-md text-center px-4"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Timeless Luxury Jewellery
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 h-[2px] bg-[#FDFBF7]/20 overflow-hidden z-10 rounded-full"
            style={{ width: 180 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#C5A059] via-[#FFFFFF] to-[#EAD7B0]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.0, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
