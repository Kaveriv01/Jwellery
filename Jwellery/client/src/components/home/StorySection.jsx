import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function StorySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 lg:py-32 bg-[#F8F4EC]/40 overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.02 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] lg:h-[600px] overflow-hidden bg-[#F8F4EC] rounded-[3px] border border-[#FAF6EE]"
          >
            <img
              src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=90"
              alt="The Tarini Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-[16px] border-white/20 mix-blend-overlay" />
          </motion.div>
 
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : 0.15 }}
            className="flex flex-col justify-center"
          >
            <span className="text-[#B08A45] text-[10px] lg:text-[11px] tracking-[0.20em] font-medium uppercase mb-4 block">
              THE TARINI STORY
            </span>
            
            <h2 className="text-[#560817] text-[22px] md:text-[26px] lg:text-[32px] leading-tight font-normal mb-[16px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Jewellery should not simply complete an outfit.<br />It should become part of the moments you remember.
            </h2>
            
            <p className="text-[#746760] text-[13px] lg:text-[14px] leading-relaxed mb-8 max-w-lg font-light">
              Tarini Jewellers focuses on elegant, wearable jewellery designed for modern women. 
              Our pieces are created to transition seamlessly from your everyday moments to your most cherished celebrations. 
              We believe in thoughtful design, minimal aesthetics, and quality that allows you to wear our pieces day in and day out.
            </p>
 
            <div>
              <motion.div
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="inline-block"
              >
                <Link
                  to="/about"
                  className="inline-block bg-[#560817] text-white px-8 py-3.5 text-[11px] lg:text-[12px] font-medium tracking-[0.12em] uppercase transition-all duration-[250ms] ease-out hover:-translate-y-[2px] hover:bg-[#3D0610] text-center rounded-[2px] border-b-2 border-transparent hover:border-[#B08A45] shadow-md shadow-black/10"
                >
                  Read Our Story
                </Link>
              </motion.div>
            </div>
          </motion.div>
 
        </div>
      </div>
    </section>
  );
}
