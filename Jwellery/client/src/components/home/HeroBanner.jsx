import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

import { jewelleryMedia } from '../../config/mediaConfig';

export default function HeroBanner() {
  return (
    <section className="relative w-full flex flex-col md:block bg-[#1a080a]">
      <motion.img
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src="/images/home-banner.png"
        alt="Tarini Jewellers Collection"
        className="w-full h-auto block"
      />
      
      {/* Dark overlay for desktop readability */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hidden md:block absolute inset-0 bg-black/30 z-0" 
      />

      {/* Overlay Content Wrapper: Static on Mobile, Absolute on Desktop */}
      <div className="md:absolute md:inset-0 z-10 flex flex-col items-center justify-center gap-12 md:gap-20 py-12 md:py-20 px-4 bg-[#1a080a] md:bg-transparent">
        
        {/* Top Content */}
        <div className="text-center max-w-3xl flex flex-col items-center mt-2 md:mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6 mb-6 md:mb-8"
          >
             <div className="w-12 md:w-16 h-[1px] bg-[#FAF6EE]/80"></div>
             <Sparkles size={14} strokeWidth={1.5} className="text-[#FAF6EE]" fill="#FAF6EE" />
             <div className="w-12 md:w-16 h-[1px] bg-[#FAF6EE]/80"></div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#FAF6EE] text-[24px] sm:text-[28px] md:text-[36px] lg:text-[52px] font-[300] leading-tight mb-4 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Timeless Elegance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="text-[#FAF6EE] text-[10px] sm:text-[12px] md:text-[14px] font-[300] tracking-[0.2em] uppercase mb-8 md:mb-10 max-w-lg mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Discover jewellery designed to celebrate your everyday moments.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <Link
              to="/collections"
              className="inline-block px-8 py-3 md:px-10 md:py-3.5 bg-[#FAF6EE] text-[#1a080a] text-[10px] md:text-[14px] font-[500] tracking-[0.2em] uppercase hover:bg-white transition-all duration-[300ms] ease-out hover:scale-[1.02]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Bottom Content */}
        <div className="text-center flex flex-col items-center mb-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#FAF6EE] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-6 md:mb-8 leading-relaxed font-[400]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            For the moments<br />that matter most.
          </motion.p>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.7 }}
             className="flex items-center gap-6 mb-6 md:mb-8"
          >
             <div className="w-8 md:w-10 h-[1px] bg-[#FAF6EE]/60"></div>
             <Sparkles size={12} strokeWidth={1.5} className="text-[#FAF6EE]/80" fill="#FAF6EE" />
             <div className="w-8 md:w-10 h-[1px] bg-[#FAF6EE]/60"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mb-4">
              <div className="absolute w-5 h-5 md:w-6 md:h-6 border-[1.5px] border-[#FAF6EE] rounded-full top-2"></div>
              <div className="absolute w-1.5 h-1.5 md:w-2 md:h-2 border-[1.5px] border-[#FAF6EE] rounded-full -top-1 bg-transparent"></div>
            </div>
            
            <p className="text-[#FAF6EE] text-xs md:text-sm tracking-[0.2em] uppercase font-[400]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Tarini Jewellers
            </p>
            <p className="text-[#FAF6EE]/80 text-[7px] md:text-[8px] tracking-[0.2em] uppercase mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Diamonds
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
