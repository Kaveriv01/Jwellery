export default function Newsletter() {
  return (
    <section className="py-16 bg-[#3A0910] text-white">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="text-3xl mb-4 font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Subscribe to our Newsletter
        </h2>
        <p className="text-[12px] uppercase tracking-widest text-white/80 mb-8">
          Join our mailing list to receive updates on new arrivals, special offers, and our latest editorial stories.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            className="bg-transparent border border-white/30 text-white px-6 py-3 w-full sm:w-80 focus:outline-none focus:border-white placeholder:text-white/50 text-sm"
          />
          <button
            type="submit"
            className="bg-[#5C1D24] text-white px-8 py-3 text-[10px] tracking-widest uppercase hover:bg-[#72252C] transition-colors"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}
