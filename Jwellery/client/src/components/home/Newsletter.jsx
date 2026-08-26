import { motion } from 'framer-motion';

export default function Newsletter() {
  return (
    <section className="py-20 lg:py-24 bg-[#1F1517] text-[#FDFBF7]">
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
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#FDFBF7]/70 mb-10" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Join our mailing list to receive updates on new arrivals, special offers, and our latest editorial stories.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            className="bg-transparent border border-[#FDFBF7]/30 text-[#FDFBF7] px-6 py-3 w-full sm:w-72 focus:outline-none focus:border-[#C5A059] placeholder:text-[#FDFBF7]/50 text-xs tracking-wide transition-colors"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          />
          <button
            type="submit"
            className="bg-[#4A0712] text-[#FDFBF7] px-8 py-3 text-[10px] tracking-[0.15em] uppercase hover:bg-[#C5A059] hover:text-[#1F1517] transition-colors font-medium border border-[#4A0712] hover:border-[#C5A059]"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            SUBSCRIBE
          </button>
        </form>
      </motion.div>
    </section>
  );
}
