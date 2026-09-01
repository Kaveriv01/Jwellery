import { motion } from 'framer-motion';

export default function WhyChooseUsBoxes() {
  const reasons = [
    { title: 'Quality Materials', desc: 'Sourced from the finest materials around the world.' },
    { title: 'Ethical Origins', desc: 'Committed to sustainable and ethical practices.' },
    { title: 'Handcrafted Process', desc: 'Each piece crafted with precision by master artisans.' },
    { title: 'Secure Shipping', desc: 'Insured and trackable delivery to your doorstep.' }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#1A1512]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[#C5A059] text-[10px] tracking-widest uppercase mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>OUR PROMISE</motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl lg:text-4xl text-[#E8E1D6] mb-16 font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Why Choose Tarini</motion.h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
              className="bg-[#1A1512] p-10 shadow-sm border border-[#EAE6DF] hover:shadow-md transition-shadow duration-[400ms] rounded-[2px]"
            >
              <h3 className="text-[#E8E1D6] text-xl font-normal mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{reason.title}</h3>
              <p className="text-[11px] text-[#E8E1D6] leading-relaxed uppercase tracking-[0.1em]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
