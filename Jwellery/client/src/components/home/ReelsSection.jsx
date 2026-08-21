import { motion } from 'framer-motion';
import { jewelleryMedia } from '../../config/mediaConfig';

export default function ReelsSection() {
  return (
    <section className="py-20 bg-[#F8F4EC]">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl lg:text-4xl text-[#5C1D24] mb-3 font-normal uppercase tracking-[0.15em]" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The TARINI Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#746760] text-sm tracking-wide font-light max-w-lg mx-auto"
          >
            A glimpse into the craftsmanship, details and elegance behind TARINI.
          </motion.p>
        </motion.div>

        {/* 
          Responsive Rules applied:
          - Mobile (default): 2 columns
          - Tablet (md): 2 columns
          - Desktop (lg - 1024px+): 4 columns
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
          {jewelleryMedia.reels.slice(0, 4).map((reel, idx) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="relative w-full aspect-[4/5] md:aspect-[9/16] bg-[#FAF6EE] rounded-[12px] shadow-sm overflow-hidden group cursor-pointer transition-transform duration-300 ease-out"
            >
              <video
                src={reel.videoUrl}
                poster={reel.poster}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
