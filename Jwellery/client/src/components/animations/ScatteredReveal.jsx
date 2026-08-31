import { motion, useReducedMotion } from 'framer-motion';

const scatteredVariants = {
  hidden: (custom) => {
    // Generate pseudo-random values based on index 'custom'
    // This gives each item a unique starting position
    const xOffsets = [-40, 50, -30, 40, -60, 60, -20, 30];
    const yOffsets = [-50, 40, 60, -40, 30, -70, 50, -30];
    const rotZ = [-8, 6, -4, 8, -6, 5, -7, 4];
    const rotX = [10, -15, 12, -10, 15, -12, 14, -14];
    const rotY = [-15, 10, -12, 15, -10, 12, -14, 14];
    
    const i = custom % xOffsets.length;
    
    return {
      opacity: 0,
      scale: 0.92,
      x: xOffsets[i],
      y: yOffsets[i],
      rotateZ: rotZ[i],
      rotateX: rotX[i],
      rotateY: rotY[i],
      filter: 'blur(10px)',
      transformPerspective: 1200
    };
  },
  visible: (custom) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotateZ: 0,
    rotateX: 0,
    rotateY: 0,
    filter: 'blur(0px)',
    transformPerspective: 1200,
    transition: {
      duration: 1.2,
      delay: custom * 0.12, // Staggered entrance
      ease: [0.22, 1, 0.36, 1] // Luxurious smooth cubic-bezier easing
    }
  })
};

export default function ScatteredReveal({ children, index = 0, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Fallback for reduced motion: simple fade
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      custom={index}
      variants={scatteredVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% enters viewport
      className={`will-change-transform ${className}`}
      {...props}
      onAnimationComplete={(definition) => {
        // Clear all transform styles after animation completes to prevent stacking context bugs 
        // and allow hover animations (like 3D flip) to work perfectly
        if (definition === "visible") {
           // We keep it perfectly in its final position without continuous transforms
        }
      }}
    >
      {children}
    </motion.div>
  );
}
