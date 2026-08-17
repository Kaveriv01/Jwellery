import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function StorySection() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 } }
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F7F5F1]">
      <div className="container-luxury max-w-[1320px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left: craftsmanship image — unique, not hero */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
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
            {/* Subtle warm overlay */}
            <div className="absolute inset-0 bg-[#C7A56A]/5 pointer-events-none" />
          </motion.div>

          {/* Right: text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col justify-center order-2 px-0 lg:px-4"
          >
            <motion.span
              variants={fadeUp}
              className="text-[#C7A56A] text-[11px] tracking-[0.3em] font-medium uppercase mb-5 block"
            >
              DISCOVER TARINI
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-[#111] text-[36px] lg:text-[50px] leading-[1.1] font-normal mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Story
            </motion.h2>

            <motion.div variants={fadeUp} className="w-10 h-[1px] bg-[#C7A56A] mb-7" />

            <motion.p variants={fadeUp} className="text-[#555] text-[15px] leading-relaxed mb-4 font-normal">
              Founded with a passion for timeless elegance, Tarini Jewellers is dedicated to bringing you pieces that celebrate life's most precious moments.
            </motion.p>

            <motion.p variants={fadeUp} className="text-[#555] text-[15px] leading-relaxed mb-10 font-normal">
              Every creation is a testament to our commitment to craftsmanship, heritage, and beauty — inspired by the rich traditions of Indian jewellery making.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 border border-[#111] text-[#111] px-8 py-3.5 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-[#111] hover:text-white transition-all duration-300 rounded-sm"
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
