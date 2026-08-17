import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function StorySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28 bg-[#F9F9F9] overflow-hidden">
      <div className="container-luxury max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image */}
          <div className="relative order-1 h-[400px] lg:h-[600px] w-full">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full overflow-hidden"
            >
              <img
                src="/images/home/hero.jpg"
                alt="Discover Lumière"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center order-2 px-4 lg:px-0 lg:max-w-md"
          >
            <span className="text-[#111] text-[12px] tracking-[0.25em] font-medium uppercase mb-4 block">
              DISCOVER LUMIÈRE
            </span>
            
            <h2 className="text-[#111] text-[36px] lg:text-[48px] leading-[1.1] font-normal mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our Story
            </h2>
            
            <p className="text-gray-600 text-[15px] leading-relaxed mb-10 font-normal">
              Founded with a passion for timeless elegance, Lumière Jewelry is dedicated to bringing you pieces that celebrate life's most precious moments. Every creation is a testament to our commitment to craftsmanship and beauty.
            </p>
 
            <div>
              <Link
                to="/about"
                className="inline-block bg-[#111] text-white px-10 py-3.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#333]"
              >
                Explore our story
              </Link>
            </div>
          </motion.div>
 
        </div>
      </div>
    </section>
  );
}
