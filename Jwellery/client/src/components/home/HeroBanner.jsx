import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

import { jewelleryMedia } from '../../config/mediaConfig';

export default function HeroBanner() {
  return (
    <section className="w-full flex flex-col md:block md:relative md:h-[90vh] lg:h-screen overflow-hidden bg-[#111]">
      {/* Edge-to-Edge Image on Desktop / Clean Top Image on Mobile */}
      <motion.img
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src="/images/home-banner.png"
        alt="Tarini Jewellers Collection"
        className="w-full h-[55vh] md:h-full md:absolute md:inset-0 object-cover object-[center_top]"
      />
      
      {/* Desktop-only dark overlay for text readability */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hidden md:block absolute inset-0 bg-black/30 z-0" 
      />

      {/* Content Wrapper: Stacked below image on mobile, Overlay on desktop */}
      <div className="w-full relative md:absolute md:inset-0 z-10 flex flex-col items-center justify-center gap-10 md:gap-20 py-12 md:py-20 px-4 bg-[#111] md:bg-transparent">
        
        {/* Top Content */}
        <div className="text-center max-w-3xl flex flex-col items-center mt-0 md:mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8"
          >
             <div className="w-10 md:w-16 h-[1px] bg-[#FAF6EE]/80"></div>
             <Sparkles size={14} strokeWidth={1.5} className="text-[#FAF6EE]" fill="#FAF6EE" />
             <div className="w-10 md:w-16 h-[1px] bg-[#FAF6EE]/80"></div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#FAF6EE] text-[24px] sm:text-[28px] md:text-[40px] lg:text-[52px] font-[300] leading-tight mb-4 md:mb-4 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Timeless Elegance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="text-[#FAF6EE] text-[10px] sm:text-[12px] md:text-[14px] font-[300] tracking-[0.2em] uppercase mb-8 md:mb-10 max-w-lg mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif", textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}
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
              className="inline-block px-8 py-3 md:px-10 md:py-3.5 bg-[#FAF6EE] text-[#111] text-[10px] md:text-[12px] font-[500] tracking-[0.2em] uppercase hover:bg-white transition-all duration-[300ms] ease-out hover:scale-[1.02] shadow-xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Bottom Content */}
        <div className="text-center flex flex-col items-center mb-0 md:mb-2 mt-2 md:mt-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#FAF6EE] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-6 md:mb-8 leading-relaxed font-[400]"
            style={{ fontFamily: "'Montserrat', sans-serif", textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}
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
            
            <p className="text-[#FAF6EE] text-xs md:text-sm tracking-[0.2em] uppercase font-[400]" style={{ fontFamily: "'Montserrat', sans-serif", textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
              Tarini Jewellers
            </p>
            <p className="text-[#FAF6EE]/80 text-[7px] md:text-[8px] tracking-[0.2em] uppercase mt-2" style={{ fontFamily: "'Montserrat', sans-serif", textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
              Diamonds
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
