import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function BottomBanners() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container-luxury max-w-[1400px]">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Summer Sale Banner */}
          <motion.div variants={itemVariants} className="relative h-[300px] lg:h-[400px] w-full group overflow-hidden bg-[#EAE6DF]">
            <img 
              src="/images/home/banner-sale.jpg" 
              alt="Summer Sale" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-white text-[24px] lg:text-[32px] font-bold tracking-[0.05em] uppercase mb-3">
                Summer Sale
              </h3>
              <p className="text-white/90 text-[14px] lg:text-[15px] font-normal mb-8 max-w-[280px]">
                Up to 50% off on selected items.
              </p>
              <Link 
                to="/sale" 
                className="bg-white text-[#111] px-8 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#111] hover:text-white"
              >
                Shop Sale
              </Link>
            </div>
          </motion.div>

          {/* Join the Club Banner */}
          <motion.div variants={itemVariants} className="relative h-[300px] lg:h-[400px] w-full group overflow-hidden bg-[#111]">
            <img 
              src="/images/home/banner-club.jpg" 
              alt="Join the Club" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-white text-[24px] lg:text-[32px] font-bold tracking-[0.05em] uppercase mb-3">
                Join The Club
              </h3>
              <p className="text-white/90 text-[14px] lg:text-[15px] font-normal mb-8 max-w-[320px]">
                Get exclusive access to new drops and private sales.
              </p>
              <Link 
                to="/register" 
                className="bg-transparent border border-white text-white px-8 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-white hover:text-[#111]"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
