import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function StorySection() {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    { value: '15K', label: 'Worldwide Branches' },
    { value: '400+', label: 'Unique Designs' },
    { value: '4.5M', label: 'Happy Clients' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden relative">
      {/* Decorative background element left */}
      <div className="absolute left-0 top-1/4 opacity-10 pointer-events-none hidden lg:block">
        <svg width="200" height="300" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="0.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>

      {/* Decorative background element right */}
      <div className="absolute right-0 bottom-10 opacity-10 pointer-events-none hidden lg:block">
        <svg width="150" height="200" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="0.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>

      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <span className="text-[#B59A68] text-[11px] tracking-[0.25em] font-semibold uppercase mb-3 block">
              JEWELRY THAT REFLECTS YOU
            </span>
            {/* Decorative element */}
            <div className="w-4 h-4 mb-4 opacity-50 text-[#B59A68]">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            
            <h2 className="text-[#4A4A4A] text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] font-normal mb-[24px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Every Jewel Tells a Story of Forever
            </h2>
            
            <p className="text-[#4A4A4A] text-[14px] leading-relaxed mb-10 max-w-lg font-medium opacity-80">
              Integer fermentum sociosqu malesuada dictumst pretium gravida. Semper porta class tempor nec parturient sollicitudin id ridiculus habitant. Taciti sociosqu sodales tristique lobortis.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((stat, idx) => (
                <div key={idx} className="border border-[#E5E5E5] p-4 text-center flex flex-col justify-center min-h-[100px]">
                  <span className="text-[28px] text-[#4A4A4A] font-normal mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{stat.value}</span>
                  <span className="text-[#888888] text-[10px] tracking-wider uppercase font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
 
            <div>
              <Link
                to="/about"
                className="inline-block bg-[#4A4A4A] text-white px-10 py-3.5 text-[12px] font-medium tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#2A2A2A]"
              >
                Know More
              </Link>
            </div>
          </motion.div>
 
          {/* Images */}
          <div className="relative order-1 lg:order-2 h-[500px] lg:h-[700px] flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-4/5 h-full overflow-hidden rounded-t-full bg-[#FAF6EE]"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?auto=format&fit=crop&w=800&q=80"
                alt="Jewelry Model"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 bottom-10 w-2/5 aspect-square rounded-full overflow-hidden border-[8px] border-white shadow-xl z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1596944924616-7b38e7cf0d22?auto=format&fit=crop&w=400&q=80"
                alt="Jewelry Detail"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating decorative leaf/flower element */}
            <motion.div 
              initial={{ opacity: 0, rotate: -20 }}
              whileInView={{ opacity: 0.2, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute left-[-5%] top-[40%] text-[#B59A68] w-24 h-24 z-10"
            >
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C70 30, 90 50, 100 50 C90 70, 70 90, 50 100 C30 70, 10 50, 0 50 C10 30, 30 10, 50 0 Z" opacity="0.5"/>
              </svg>
            </motion.div>
          </div>
 
        </div>
      </div>
    </section>
  );
}
