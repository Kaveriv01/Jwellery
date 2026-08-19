import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

import { jewelleryMedia } from '../../config/mediaConfig';

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[80vh] md:h-[85vh] lg:h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#2D0B12]">
      {/* Background Image determining height */}
      <img
        src="/7f6da4e9-866a-4b32-b1da-bdfd58aaac91.jfif"
        alt="Tarini Jewellers Collection"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />
      <div className="absolute inset-0 bg-black/30 z-0" /> {/* Darker overlay for text readability */}

      {/* Overlay Content Wrapper */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between py-12 md:py-20">
        
        {/* Top Content */}
        <div className="text-center px-4 max-w-3xl flex flex-col items-center mt-4 md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6 mb-8"
          >
             <div className="w-16 h-[1px] bg-[#FAF6EE]/80"></div>
             <Sparkles size={16} strokeWidth={1.5} className="text-[#FAF6EE]" fill="#FAF6EE" />
             <div className="w-16 h-[1px] bg-[#FAF6EE]/80"></div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#FAF6EE] text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-normal leading-tight mb-4 tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Timeless Elegance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#FAF6EE] text-xs md:text-sm font-light tracking-wide mb-8 max-w-md mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Discover jewellery designed to celebrate your everyday moments.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              to="/collections"
              className="inline-block px-8 py-2.5 bg-[#FAF6EE] text-[#2D0B12] text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-white hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Bottom Content */}
        <div className="text-center px-4 flex flex-col items-center mb-2 md:mb-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[#FAF6EE] text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-6 leading-relaxed font-medium"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          For the moments<br />that matter most.
        </motion.p>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.7 }}
           className="flex items-center gap-6 mb-8"
        >
           <div className="w-10 h-[1px] bg-[#FAF6EE]/60"></div>
           <Sparkles size={14} strokeWidth={1.5} className="text-[#FAF6EE]/80" fill="#FAF6EE" />
           <div className="w-10 h-[1px] bg-[#FAF6EE]/60"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-8 h-8 flex items-center justify-center mb-4">
            <div className="absolute w-6 h-6 border-[1.5px] border-[#FAF6EE] rounded-full top-2"></div>
            <div className="absolute w-2 h-2 border-[1.5px] border-[#FAF6EE] rounded-full -top-1 bg-transparent"></div>
          </div>
          
          <p className="text-[#FAF6EE] text-sm md:text-base tracking-[0.3em] uppercase font-medium">
            Tarini Jewellers
          </p>
          <p className="text-[#FAF6EE]/80 text-[8px] md:text-[9px] tracking-[0.5em] uppercase mt-2">
            Diamonds
          </p>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
