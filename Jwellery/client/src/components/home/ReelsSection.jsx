import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { jewelleryMedia } from '../../config/mediaConfig';

export default function ReelsSection() {
  const [previewVideo, setPreviewVideo] = useState(null);

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
              onClick={() => setPreviewVideo(reel.videoUrl)}
              className="relative w-full aspect-[9/16] bg-[#FAF6EE] rounded-[12px] shadow-sm overflow-hidden group cursor-pointer transition-transform duration-300 ease-out"
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
              
              {/* Subtle play icon on hover, NO background blur/dimming of the video itself */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <Play size={20} className="text-white ml-1" fill="white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Video Preview Modal */}
      <AnimatePresence>
        {previewVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setPreviewVideo(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white p-2 z-50 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
              onClick={() => setPreviewVideo(null)}
            >
              <X size={28} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={previewVideo}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
