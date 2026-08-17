import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/home/our-story-new.png"
          alt="Tarini Jewellers Hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white/90 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4"
        >
          Tarini Jewellers
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white text-4xl sm:text-5xl md:text-6xl mb-6 font-normal"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Jewellery that becomes<br />part of your story
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            to="/products"
            className="inline-block bg-[#5C1D24] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#3A0D15] transition-colors"
          >
            DISCOVER NOW
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
