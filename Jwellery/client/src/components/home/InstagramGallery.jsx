import { Link } from 'react-router-dom';
const InstagramIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { motion } from 'framer-motion';

const INSTAGRAM_POSTS = [
  { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
  { url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800' },
  { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
  { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' },
];

export default function InstagramGallery() {
  return (
    <section className="py-20 bg-[#FDFBF7] overflow-hidden border-t border-[#EAE6DF]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <p className="text-[#C5A059] text-[10px] tracking-widest uppercase mb-3 font-medium">Follow Our Journey</p>
        <h2 className="text-3xl lg:text-4xl text-[#22181C] font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          @tarinijewellers
        </h2>
      </motion.div>

      <div className="w-full overflow-hidden">
        <motion.div 
          className="flex flex-nowrap gap-1 sm:gap-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {[...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS].map((post, idx) => (
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              key={idx}
              className="relative aspect-square w-[200px] sm:w-[280px] md:w-[320px] flex-shrink-0 overflow-hidden group block bg-[#FDFBF7]"
            >
              <img
                src={post.url}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[#22181C]/0 group-hover:bg-[#22181C]/30 transition-colors duration-[400ms] flex items-center justify-center">
                <InstagramIcon size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-out translate-y-2 group-hover:translate-y-0" />
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
