import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { jewelleryMedia } from '../../config/mediaConfig';

export default function LifestyleVideoSection() {
  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-[#C7A56A] text-[10px] sm:text-xs tracking-widest uppercase mb-3 font-medium">
            The Art of Everyday Luxury
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[40px] text-[#5C1D24] mb-4 font-normal leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Designed to shine with you, every day.
          </h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-[2px] overflow-hidden mb-10 border border-[#FAF6EE]"
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

        <div className="text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase border border-[#5C1D24] text-[#5C1D24] hover:bg-[#5C1D24] hover:text-white rounded-[2px] px-8 py-3.5 transition-all duration-[400ms] shadow-sm cursor-pointer"
          >
            Explore Collection <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
