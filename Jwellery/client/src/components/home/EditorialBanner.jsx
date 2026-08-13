import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function EditorialBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: shouldReduceMotion ? 1 : 1.015 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=1600&q=90"
          alt="Everyday Luxury"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#F8F4EC]/85 backdrop-blur-md p-10 md:p-14 max-w-xl mx-auto border border-[#FAF6EE] shadow-[0_15px_35px_rgba(86,8,23,0.02)] rounded-[4px]"
        >
          <span className="text-[#B08A45] text-[10px] lg:text-[11px] tracking-[0.20em] font-medium uppercase mb-4 block">
            EVERYDAY LUXURY
          </span>
          
          <h2 className="text-[#560817] text-[22px] md:text-[25px] lg:text-[28px] leading-tight font-normal mb-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Pieces designed to be <em className="italic text-[#B08A45]">worn</em>, layered, and <em className="italic text-[#B08A45]">loved</em>.
          </h2>

          <motion.div
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="inline-block"
          >
            <Link
              to="/products"
              className="inline-block bg-[#560817] text-white px-8 py-3.5 text-[11px] lg:text-[12px] font-medium tracking-[0.12em] uppercase transition-all duration-[250ms] ease-out hover:-translate-y-[2px] hover:bg-[#3D0610] text-center rounded-[2px] border-b-2 border-transparent hover:border-[#B08A45] shadow-md shadow-black/10"
            >
              Discover The Collection
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
