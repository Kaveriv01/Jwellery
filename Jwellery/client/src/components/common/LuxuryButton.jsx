import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Luxury button with ripple + magnetic hover effect
 * @param {string} variant - 'gold' | 'outline' | 'dark' | 'ghost'
 */
export default function LuxuryButton({
  children,
  variant = 'gold',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const btnRef = useRef(null);

  const handleRipple = (e) => {
    if (disabled || loading) return;
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onClick?.(e);
  };

  const variantStyles = {
    gold:    'btn-gold rounded-sm text-white',
    outline: 'btn-outline-gold rounded-sm',
    dark:    'bg-[#1a1a1a] text-white text-[0.7rem] tracking-[0.1em] uppercase font-medium px-8 py-3 hover:bg-[#C5A059] transition-all duration-300 rounded-sm',
    ghost:   'text-[#C5A059] text-[0.7rem] tracking-[0.1em] uppercase font-medium border-b border-[#C5A059]/40 hover:border-[#C5A059] transition-all pb-0.5',
  };

  return (
    <motion.button
      ref={btnRef}
      type={type}
      disabled={disabled || loading}
      onClick={handleRipple}
      whileHover={{ scale: variant === 'ghost' ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center gap-2 ripple-container cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
          </svg>
          Loading…
        </span>
      ) : children}
    </motion.button>
  );
}
