import { motion, useReducedMotion } from 'framer-motion';

const WHY_TARINI = [
  {
    title: 'Designed to Last',
    description: 'Thoughtfully designed pieces for everyday wear.',
  },
  {
    title: 'Effortless Elegance',
    description: 'Jewellery that transitions from everyday moments to celebrations.',
  },
  {
    title: 'Thoughtful Packaging',
    description: 'Beautiful packaging designed to make every order feel special.',
  },
  {
    title: 'Easy Shopping',
    description: 'Simple checkout, secure payments and convenient returns.',
  }
];

export default function OccasionSection() {
  const shouldReduceMotion = useReducedMotion();

  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const dividerReveal = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
      className="py-24 lg:py-32 bg-[#FAF6EE] border-t border-[#FAF6EE] overflow-hidden"
    >
      <div className="container-luxury">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="text-[#B59A68] text-[10px] lg:text-[11px] tracking-[0.20em] font-medium uppercase mb-4 block"
          >
            OUR PROMISE
          </motion.span>
          <motion.h2 
            variants={headingReveal}
            className="text-[23px] sm:text-[27px] lg:text-[32px] text-[#3A0508] font-normal tracking-wide mb-[16px]" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Why Tarini
          </motion.h2>
          <motion.div 
            variants={dividerReveal}
            style={{ originX: 0.5 }}
            className="w-12 h-[1px] bg-[#B59A68]" 
          />
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {WHY_TARINI.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: shouldReduceMotion ? 0 : i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-white p-10 border border-[#FAF6EE] rounded-[2px] text-center flex flex-col items-center justify-center transition-all duration-[350ms] ease-out hover:border-[#B59A68]/30 hover:shadow-[0_12px_28px_rgba(58,5,8,0.02)] ${shouldReduceMotion ? '' : 'lg:hover:-translate-y-[2px]'}`}
            >
              <h3 className="text-[#3A0508] text-[16px] lg:text-[18px] font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {item.title}
              </h3>
              <div className="w-6 h-[1px] bg-[#B59A68] my-3" />
              <p className="text-[#756B62] text-[11px] lg:text-[12px] leading-relaxed font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
