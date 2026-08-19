import { motion } from 'framer-motion';

export default function Newsletter() {
  return (
    <section className="py-20 lg:py-24 bg-[#35050D] text-[#F8F4EE]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 text-center max-w-2xl"
      >
        <h2 className="text-3xl lg:text-4xl mb-4 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Subscribe to our Newsletter
        </h2>
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#F8F4EE]/70 mb-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Join our mailing list to receive updates on new arrivals, special offers, and our latest editorial stories.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            className="bg-transparent border border-[#F8F4EE]/30 text-[#F8F4EE] px-6 py-3 w-full sm:w-72 focus:outline-none focus:border-[#C9A96E] placeholder:text-[#F8F4EE]/50 text-xs tracking-wide transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
          <button
            type="submit"
            className="bg-[#4A0712] text-[#F8F4EE] px-8 py-3 text-[10px] tracking-[0.15em] uppercase hover:bg-[#C9A96E] hover:text-[#35050D] transition-colors font-medium border border-[#4A0712] hover:border-[#C9A96E]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            SUBSCRIBE
          </button>
        </form>
      </motion.div>
    </section>
  );
}
