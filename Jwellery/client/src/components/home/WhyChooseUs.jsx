import { ShieldCheck, Leaf, Truck, RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();

  const values = [
    {
      icon: <ShieldCheck size={26} strokeWidth={1} />,
      title: 'Premium Quality',
      description: 'Crafted to last a lifetime'
    },
    {
      icon: <Leaf size={26} strokeWidth={1} />,
      title: 'Skin-Friendly',
      description: 'Hypoallergenic materials'
    },
    {
      icon: <Truck size={26} strokeWidth={1} />,
      title: 'Secure Shipping',
      description: 'Insured delivery'
    },
    {
      icon: <RotateCcw size={26} strokeWidth={1} />,
      title: 'Easy Returns',
      description: '7-day return policy'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="bg-[#FBF8F2] py-14 lg:py-18 border-b border-[#FAF6EE] overflow-hidden">
      <div className="container-luxury">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {values.map((val, idx) => (
            <motion.div key={idx} variants={itemVariants} className="group relative flex flex-col items-center justify-center text-center px-4 cursor-default">
              
              <div className="text-[#B59A68] mb-4 transition-colors duration-300 ease-out">
                {val.icon}
              </div>
              <h3 className="text-[10px] lg:text-[11px] font-medium tracking-[0.12em] uppercase text-[#332B27] mb-1.5 transition-colors duration-300 group-hover:text-[#3A0508]">
                {val.title}
              </h3>
              <p className="text-[9px] lg:text-[10px] text-[#756B62] font-light tracking-wide">
                {val.description}
              </p>
              
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </section>
  );
}
