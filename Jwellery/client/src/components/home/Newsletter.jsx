import { motion } from 'framer-motion';

export default function Newsletter() {
  return (
    <section className="py-20 lg:py-24 bg-[#211719] text-[#FFFFFF]">
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
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#D8CFC7] mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
          Join our mailing list to receive updates on new arrivals, special offers, and our latest editorial stories.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            className="bg-[#1A1512] border-none text-[#2A2020] px-6 py-3 w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#B79A6B] placeholder:text-[#8A8177] text-[13px] tracking-wide transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="submit"
            className="bg-[#B79A6B] text-[#211719] px-8 py-3 text-[11px] tracking-[0.15em] uppercase hover:bg-[#C9B28A] transition-colors font-medium border-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            SUBSCRIBE
          </button>
        </form>
      </motion.div>
    </section>
  );
}
