import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const INSTAGRAM_POSTS = [
  { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
  { url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800' },
  { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
  { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' },
];

export default function InstagramGallery() {
  return (
    <section className="py-20 bg-[#F8F4EE] overflow-hidden border-t border-[#EAE6DF]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <p className="text-[#C9A96E] text-[10px] tracking-widest uppercase mb-3 font-medium">Follow Our Journey</p>
        <h2 className="text-3xl lg:text-4xl text-[#35050D] font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          @tarinijewellers
        </h2>
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <motion.a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              className="relative aspect-square overflow-hidden group block bg-white"
            >
              <img
                src={post.url}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[#35050D]/0 group-hover:bg-[#35050D]/20 transition-colors duration-[400ms] flex items-center justify-center">
                <Instagram size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out translate-y-2 group-hover:translate-y-0" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
