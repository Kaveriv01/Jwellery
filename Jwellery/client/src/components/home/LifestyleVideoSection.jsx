import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { jewelleryMedia } from '../../config/mediaConfig';

export default function LifestyleVideoSection() {
  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl mx-auto text-center mb-10"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#C5A059] text-[10px] sm:text-xs tracking-widest uppercase mb-3 font-medium">
            The Art of Everyday Luxury
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-[40px] text-[#5C1D24] mb-4 font-normal leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Designed to shine with you, every day.
          </motion.h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-[2px] overflow-hidden mb-10 border border-[#FDFBF7] shadow-sm transition-transform duration-[400ms] ease-out"
        >
          <video
            src={jewelleryMedia.lifestyle.video}
            poster={jewelleryMedia.lifestyle.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-center"
        >
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase border border-[#5C1D24] text-[#5C1D24] hover:bg-[#5C1D24] hover:text-white rounded-[2px] px-8 py-3.5 transition-all duration-[300ms] shadow-sm cursor-pointer hover:scale-[1.02] ease-out"
          >
            Explore Collection <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
