import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function BottomBanners() {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="py-10 bg-[#F7F5F1]">
      <div className="container-luxury max-w-[1400px]">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.15 }}
        >
          {/* Summer Sale — dark velvet jewelry campaign */}
          <motion.div
            variants={cardVariants}
            className="relative h-[340px] lg:h-[420px] w-full group overflow-hidden"
          >
            <img
              src="/images/home/summer-sale-new.png"
              alt="Summer Sale"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/85 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              {/* Label — Manrope */}
              <span
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="text-[#C7A56A] text-[10px] tracking-[0.20em] font-[600] uppercase mb-3 block"
              >
                LIMITED TIME
              </span>
              {/* Heading — Cormorant Garamond */}
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-white text-[32px] lg:text-[42px] font-[500] tracking-[-0.01em] mb-3 leading-[1.05]"
              >
                Summer Sale
              </h3>
              {/* Body — Manrope */}
              <p
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="text-white/80 text-[13px] font-[400] mb-8 max-w-[260px] leading-[1.7]"
              >
                Up to 50% off on selected items.
              </p>
              {/* Button — Manrope */}
              <Link
                to="/products"
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="bg-white text-[#111] px-8 py-3 text-[11px] font-[600] tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[#C7A56A] hover:text-white rounded-sm"
              >
                SHOP SALE
              </Link>
            </div>
          </motion.div>

          {/* Join the Club — matte black membership aesthetic */}
          <motion.div
            variants={cardVariants}
            className="relative h-[340px] lg:h-[420px] w-full group overflow-hidden bg-[#0D0D0D]"
          >
            <img
              src="/images/home/join-club-new.png"
              alt="Join the Club"
              className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            {/* Geometric gold accent */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[180px] h-[180px] border border-[#C7A56A]/20 rotate-45 absolute" />
              <div className="w-[240px] h-[240px] border border-[#C7A56A]/10 rotate-45 absolute" />
            </div>
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              {/* Label — Manrope */}
              <span
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="text-[#C7A56A] text-[10px] tracking-[0.20em] font-[600] uppercase mb-3 block"
              >
                MEMBERS ONLY
              </span>
              {/* Heading — Cormorant Garamond */}
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-white text-[32px] lg:text-[42px] font-[500] tracking-[-0.01em] mb-3 leading-[1.05]"
              >
                Join The Club
              </h3>
              {/* Body — Manrope */}
              <p
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="text-white/70 text-[13px] font-[400] mb-8 max-w-[280px] leading-[1.7]"
              >
                Get exclusive access to new drops and private sales.
              </p>
              {/* Button — Manrope */}
              <Link
                to="/register"
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="bg-transparent border border-[#C7A56A] text-[#C7A56A] px-8 py-3 text-[11px] font-[600] tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[#C7A56A] hover:text-black rounded-sm"
              >
                JOIN NOW
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
