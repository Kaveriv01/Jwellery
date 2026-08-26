import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function EditorialBanner() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FDFBF7] border-t border-[#EAE6DF] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Left Image */}
          <motion.div 
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2"
          >
            <div className="aspect-[4/5] bg-white overflow-hidden rounded-[2px] relative group">
              <img
                src="https://plus.unsplash.com/premium_photo-1681276169450-4504a2442173?q=80&w=800&auto=format&fit=crop"
                alt="Luxury Pearl Necklace"
                className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-[1.03] ease-out"
              />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full md:w-1/2 flex flex-col justify-center items-start lg:pr-12"
          >
            <motion.span variants={fadeUp} className="text-[#C5A059] text-[10px] lg:text-[11px] tracking-[0.2em] font-medium uppercase mb-5 block" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              OUR VISION
            </motion.span>
            <motion.h2 
              variants={fadeUp}
              className="text-[#22181C] text-[36px] md:text-[44px] leading-[1.1] mb-5 font-normal tracking-wide" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Jewellery made to look perfect on everyone.
            </motion.h2>
            <motion.div variants={fadeUp} className="w-12 h-[1px] bg-[#C5A059] mb-6" />
            <motion.h3 
              variants={fadeUp}
              className="text-[#22181C] text-xl lg:text-2xl italic mb-6 font-normal tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Indian Heritage pieces reimagined for the modern era.
            </motion.h3>
            <motion.p variants={fadeUp} className="text-[#22181C] text-[13px] leading-[1.8] mb-10 font-light" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              We carefully craft our pieces using the finest materials, combining traditional Indian artistry with contemporary design aesthetics. Discover a collection that celebrates your unique style and elegance.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/about"
                className="inline-block bg-[#22181C] text-[#FDFBF7] px-10 py-3.5 text-[11px] tracking-[0.15em] uppercase hover:bg-[#4A0712] transition-colors shadow-sm font-medium hover:scale-[1.02] ease-out"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                LEARN MORE
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
