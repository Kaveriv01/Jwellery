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
    <section className="py-16 lg:py-24 bg-[#F7F5F1]">
      <div className="container-luxury max-w-[1320px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left: craftsmanship image */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[4/5] overflow-hidden order-1"
          >
            <img
              src="/images/home/our-story-new.png"
              alt="Tarini Jewellers craftsmanship"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </motion.div>

          {/* Right: text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col justify-center order-2 px-0 lg:px-4"
          >
            {/* Label — Manrope */}
            <motion.span
              variants={fadeUp}
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[#C7A56A] text-[10px] lg:text-[11px] tracking-[0.18em] font-[600] uppercase mb-5 block"
            >
              DISCOVER TARINI
            </motion.span>

            {/* Heading — Cormorant Garamond */}
            <motion.h2
              variants={fadeUp}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[#111] text-[40px] lg:text-[52px] leading-[1.05] font-[500] mb-6 tracking-[-0.01em]"
            >
              Our Story
            </motion.h2>

            <motion.div variants={fadeUp} className="w-10 h-[1px] bg-[#C7A56A] mb-7" />

            {/* Body — Manrope */}
            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[#555] text-[14px] leading-[1.82] mb-3 font-[400]"
            >
              Founded with a passion for timeless elegance, Tarini Jewellers is dedicated to bringing you pieces that celebrate life's most precious moments.
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[#555] text-[14px] leading-[1.82] mb-10 font-[400]"
            >
              Every creation is a testament to our commitment to craftsmanship, heritage, and beauty — inspired by the rich traditions of Indian jewellery making.
            </motion.p>

            {/* Button — Manrope */}
            <motion.div variants={fadeUp}>
              <Link
                to="/about"
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="group inline-flex items-center gap-3 border border-[#111] text-[#111] px-8 py-3.5 text-[11px] uppercase tracking-[0.08em] font-[600] hover:bg-[#111] hover:text-white transition-all duration-300 rounded-sm"
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
