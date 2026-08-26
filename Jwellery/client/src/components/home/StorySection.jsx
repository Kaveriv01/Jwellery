import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function StorySection() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } }
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-[#EAE6DF]">
      <div className="container-luxury max-w-[1320px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: craftsmanship image */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[4/5] overflow-hidden order-1 rounded-[2px]"
          >
            <img
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1200"
              alt="Tarini Jewellers craftsmanship"
              className="w-full h-full object-cover object-center transition-transform duration-[700ms] hover:scale-[1.02] ease-out"
              loading="lazy"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200'; }}
            />
          </motion.div>

          {/* Right: text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col justify-center order-2 px-4 lg:px-12"
          >
            {/* Label — Nunito Sans */}
            <motion.span
              variants={fadeUp}
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              className="text-[#C5A059] text-[10px] lg:text-[11px] tracking-[0.2em] font-medium uppercase mb-6 block"
            >
              DISCOVER TARINI
            </motion.span>

            {/* Heading — Cormorant Garamond */}
            <motion.h2
              variants={fadeUp}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[#22181C] text-[40px] lg:text-[48px] leading-[1.1] font-normal mb-8 tracking-wide"
            >
              Our Story
            </motion.h2>

            <motion.div variants={fadeUp} className="w-12 h-[1px] bg-[#C5A059] mb-8" />

            {/* Body — Nunito Sans */}
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              className="text-[#22181C] text-[13px] leading-[1.8] mb-4 font-light tracking-wide"
            >
              Founded with a passion for timeless elegance, Tarini Jewellers is dedicated to bringing you pieces that celebrate life's most precious moments.
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              className="text-[#22181C] text-[13px] leading-[1.8] mb-12 font-light tracking-wide"
            >
              Every creation is a testament to our commitment to craftsmanship, heritage, and beauty — inspired by the rich traditions of Indian jewellery making.
            </motion.p>

            {/* Button — Nunito Sans */}
            <motion.div variants={fadeUp}>
              <Link
                to="/about"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                className="group inline-flex items-center justify-center border border-[#22181C] text-[#22181C] px-10 py-3.5 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-[#22181C] hover:text-[#FDFBF7] transition-all duration-[300ms] ease-out rounded-[2px]"
              >
                EXPLORE OUR STORY
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
