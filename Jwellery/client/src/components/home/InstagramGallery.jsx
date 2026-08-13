import { motion, useReducedMotion } from 'framer-motion';
import { SOCIAL_GALLERY, APP_INSTAGRAM } from '../../constants';
import { FiInstagram, FiArrowRight } from 'react-icons/fi';

export default function InstagramGallery() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const getItemClasses = (index) => {
    // Asymmetric luxury editorial grid
    if (index === 0) return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2'; // Large featured
    if (index === 1) return 'col-span-1 row-span-1 md:col-span-1 md:row-span-2'; // Tall
    if (index === 4) return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'; // Wide
    return 'col-span-1 row-span-1'; // Standard square
  };

  return (
    <section className="relative py-28 lg:py-32 bg-[#F8F4EC]/50 overflow-hidden border-t border-[#FAF6EE]">
      {/* ── Optional Premium Effect: Subtle Warm Glow Background ── */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(176, 138, 69, 0.03), transparent 70%)'
      }} />

      <div className="container-luxury relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          {/* ── LIVE / Fresh Indicator ── */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative flex items-center justify-center w-2 h-2">
              {!shouldReduceMotion && (
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#B08A45] opacity-75 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
              )}
              <span className="relative inline-flex rounded-full w-2 h-2 bg-[#B08A45]"></span>
            </div>
            <span className="text-[#B08A45] text-[10px] lg:text-[11px] tracking-[0.20em] font-medium uppercase">
              LIVE <span className="text-gray-500 font-normal ml-2">Fresh from the Tarini Journal</span>
            </span>
          </div>

          <h2 className="text-[23px] sm:text-[27px] lg:text-[32px] text-[#560817] font-normal tracking-wide mb-[16px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Follow The Tarini Journey
          </h2>
          
          {/* ── INSTAGRAM CTA ── */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-[11px] lg:text-[12px] font-medium tracking-[0.12em] uppercase text-[#560817] hover:text-[#B08A45] transition-colors"
          >
            <FiInstagram size={16} /> 
            {APP_INSTAGRAM}
            <FiArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* ── GALLERY LAYOUT (CSS Grid) ── */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[300px] grid-flow-dense"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {SOCIAL_GALLERY.map((post, i) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className={`group relative overflow-hidden bg-[#FAF6EE] rounded-sm ${getItemClasses(i)}`}
            >
              <img
                src={post.image}
                alt={post.title}
                className={`w-full h-full object-cover transition-transform duration-[450ms] ease-out ${!shouldReduceMotion ? 'group-hover:scale-[1.025]' : ''}`}
                loading="lazy"
                decoding="async"
              />
              
              {/* ── Hover Overlay ── */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#560817]/95 via-[#3D0610]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-4 md:p-6">
                
                {/* Unsplash Attribution */}
                <div className="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <a 
                    href={post.photographerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[8px] md:text-[9px] text-white/70 hover:text-white uppercase tracking-wider backdrop-blur-md bg-black/20 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Photo by {post.photographer} (Unsplash)
                  </a>
                </div>

                {/* Content & CTAs */}
                <div className="flex flex-col transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {post.featured ? (
                    <div className="text-center mb-6 mt-auto">
                      <span className="text-[#C9A24A] text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-3 block">TARINI JOURNAL</span>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-white text-3xl md:text-4xl font-light">"{post.title}"</h3>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="text-white font-medium text-sm md:text-base block">{post.title}</span>
                      <span className="text-white/70 text-[10px] uppercase tracking-widest">{post.category}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-end w-full mt-auto">
                    <a 
                      href={post.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-white/90 text-[10px] uppercase tracking-[0.2em] font-medium group/btn hover:text-[#C9A24A] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.featured ? 'VIEW STORY' : 'EXPLORE'} <FiArrowRight className="transform transition-transform group-hover/btn:translate-x-1" />
                    </a>

                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#C9A24A] hover:border-[#C9A24A] transition-colors">
                      <FiInstagram size={16} />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Secondary Follow Action */}
        <div className="mt-20 text-center">
           <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#5B0715] hover:bg-[#C9A24A] text-white text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-[2px] shadow-md"
          >
            FOLLOW US ON INSTAGRAM
            <FiArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
