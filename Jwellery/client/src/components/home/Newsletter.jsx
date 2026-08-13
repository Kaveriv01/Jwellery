import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Gift } from 'lucide-react';
import { NEWSLETTER_PERKS } from '../../constants';
import { toast } from 'sonner';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
    toast.success('Welcome to TARINI! Your 10% discount is on its way.', {
      description: 'Check your inbox for the exclusive code.',
    });
    setEmail('');
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <section className="relative overflow-hidden bg-[#0C0203]">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E0509] via-[#0C0203] to-[#120003]" />

      {/* Subtle pink/red glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full opacity-[0.05]"
           style={{ background: 'radial-gradient(circle, #560817 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-[0.05]"
           style={{ background: 'radial-gradient(circle, #560817 0%, transparent 70%)' }} />

      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#B08A45]/15"
          style={{ left: `${12 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={shouldReduceMotion ? {} : { y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      <div className="relative container-luxury py-24 sm:py-28">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 border border-[#B08A45]/30 rounded-[2px] px-4 py-1.5 mb-7 bg-[#560817]/40"
          >
            <Gift size={12} className="text-[#B08A45]" />
            <span className="text-[#FAF8F3] text-[10px] lg:text-[11px] tracking-[0.20em] uppercase font-medium">Exclusive Members Only</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[#FAF8F3] font-normal leading-tight mb-4 text-[23px] sm:text-[27px] lg:text-[32px]"
          >
            Join the TARINI<br />
            <em className="italic text-[#B08A45]">Inner Circle</em>
          </motion.h2>

          {/* Subtle Divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0.5 }}
            className="w-12 h-[1px] bg-[#B08A45] mx-auto my-6" 
          />

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#FAF8F3]/70 text-[13px] lg:text-[14px] mb-8 font-light max-w-lg mx-auto"
          >
            Subscribe and receive 10% off your first order + exclusive early access to new collections.
          </motion.p>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
          >
            {NEWSLETTER_PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#560817]/40 flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-[#B08A45]" />
                </div>
                <span className="text-[#FAF8F3]/60 text-[11px] font-light tracking-wide">{perk}</span>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-white/5 border border-[#B08A45]/30 hover:border-[#B08A45]/50 text-white placeholder-[#FAF8F3]/40 rounded-[2px] px-5 py-3 text-sm outline-none focus:border-[#B08A45] transition-all duration-300"
            />
            <motion.button
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.12 }}
              type="submit"
              disabled={loading || done}
              className="bg-[#560817] hover:bg-[#3D0610] text-white rounded-[2px] flex items-center justify-center gap-2 px-8 py-3.5 font-medium text-[11px] lg:text-[12px] uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-[250ms] ease-out shadow-md border-b-2 border-transparent hover:border-[#B08A45] hover:-translate-y-[2px] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Joining…
                </span>
              ) : done ? (
                <span className="flex items-center gap-1.5"><Check size={13} /> Joined!</span>
              ) : (
                <span className="flex items-center gap-1.5">JOIN THE INNER CIRCLE <ArrowRight size={13} /></span>
              )}
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.64 }}
            className="text-[#FAF8F3]/30 text-[10px] mt-4"
          >
            No spam. Unsubscribe anytime. We respect your privacy.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
