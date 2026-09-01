import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();

  const values = [
    {
      icon: <Truck size={24} strokeWidth={1.5} />,
      title: 'FREE SHIPPING',
      description: 'On orders over $75'
    },
    {
      icon: <RotateCcw size={24} strokeWidth={1.5} />,
      title: 'EASY RETURNS',
      description: '30-day hassle free returns'
    },
    {
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
      title: 'SECURE PAYMENT',
      description: '100% secure checkout'
    },
    {
      icon: <Headphones size={24} strokeWidth={1.5} />,
      title: 'CUSTOMER SUPPORT',
      description: "We're here to help"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="bg-white py-12 border-b border-[#DED3C4] overflow-hidden">
      <div className="container-luxury max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {values.map((val, idx) => (
            <motion.div key={idx} variants={itemVariants} className="group relative flex items-center justify-center gap-4 py-6 lg:py-0 px-4">
              <div className="text-[#111]">
                {val.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[11px] font-bold tracking-[0.05em] text-[#111] uppercase mb-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {val.title}
                </h3>
                <p className="text-[12px] text-[#756A63] font-normal" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {val.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
