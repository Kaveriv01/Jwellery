import { motion } from 'framer-motion';

/**
 * Reusable luxury section heading
 * @param {string} eyebrow - Small gold uppercase text above
 * @param {string} title   - Main serif title
 * @param {string} subtitle - Optional light subtitle
 * @param {boolean} centered
 * @param {boolean} dark   - White text for dark backgrounds
 */
export default function SectionHeading({ eyebrow, title, subtitle, centered = true, dark = false }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[#1E1E1E] text-[11px] tracking-[0.45em] uppercase font-bold mb-3 flex items-center gap-2"
          style={{ justifyContent: centered ? 'center' : 'flex-start' }}
        >
          <span className="inline-block w-6 h-px bg-[#1E1E1E]/30" />
          {eyebrow}
          <span className="inline-block w-6 h-px bg-[#1E1E1E]/30" />
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-semibold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}
        style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-3 text-xs sm:text-sm leading-relaxed max-w-xl ${centered ? 'mx-auto' : ''} ${dark ? 'text-white/60' : 'text-gray-500'}`}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`mt-4 h-0.5 w-12 bg-[#1E1E1E] ${centered ? 'mx-auto' : ''}`}
      />
    </div>
  );
}
