import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { jewelleryMedia } from '../../config/mediaConfig';

export default function ReelsSection() {
  return (
    <section className="py-20 bg-[#F8F4EC]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-[#5C1D24] mb-3 font-normal uppercase tracking-[0.15em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Follow Our Style
          </h2>
          <p className="text-[#746760] text-sm tracking-wide font-light">
            See how Tarini jewellery shines in real life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {jewelleryMedia.reels.slice(0, 4).map((reel, idx) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative w-full aspect-[9/16] bg-black rounded-[4px] overflow-hidden group cursor-pointer"
            >
              <video
                src={reel.videoUrl}
                poster={reel.poster}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                  <Play size={20} className="text-white ml-1" fill="white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
