import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { jewelleryMedia } from '../../config/mediaConfig';

export default function ReelsSection() {
  return (
    <section className="py-20 bg-[#F8F4EC]">
      <div className="container mx-auto px-4">
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
            className="text-3xl text-[#5C1D24] mb-3 font-normal uppercase tracking-[0.15em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Follow Our Style
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#746760] text-sm tracking-wide font-light">
            See how Tarini jewellery shines in real life.
          </motion.p>
        </motion.div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${jewelleryMedia.reels.length === 3 ? 'lg:grid-cols-3 max-w-5xl mx-auto' : 'lg:grid-cols-4'} gap-6`}>
          {jewelleryMedia.reels.slice(0, 4).map((reel, idx) => (
            <div key={reel.id} style={{ perspective: '1200px' }} className="w-full">
              <motion.div
                initial={{ opacity: 0, scale: 1.03 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="relative w-full aspect-[9/16] bg-[#FAF6EE] rounded-[2px] shadow-sm overflow-hidden group cursor-pointer transition-transform duration-[400ms] ease-out"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <video
                  src={reel.videoUrl}
                  poster={reel.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-all duration-700"
                />
                

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-z-12">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/50 shadow-lg hover:scale-110 transition-transform">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
