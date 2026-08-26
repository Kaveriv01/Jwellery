import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const craftRef = useRef(null);
  const { scrollYProgress: craftProgress } = useScroll({
    target: craftRef,
    offset: ["start end", "end start"]
  });
  const craftScale = useTransform(craftProgress, [0, 1], [1, 1.1]);

  return (
    <div className="bg-[#FDFBF7] text-[#22181C] overflow-hidden">
      <Helmet>
        <title>Our Story — Tarini Jewellers</title>
        <meta name="description" content="Discover the story behind Tarini Jewellers — where tradition meets contemporary elegance." />
      </Helmet>
      
      {/* SECTION 1 — FULL-SCREEN HERO */}
      <section ref={heroRef} className="relative w-full h-[85vh] lg:h-[100vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=2000" 
            alt="Tarini Jewellers Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-20">
          <FadeUp>
            <h1 className="text-[#FDFBF7] text-[42px] sm:text-[52px] md:text-[64px] lg:text-[80px] xl:text-[90px] font-normal leading-none uppercase tracking-wide mb-6 drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Art of<br/>Timeless Beauty
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[#FDFBF7] text-[15px] sm:text-[16px] md:text-[18px] max-w-2xl mx-auto font-medium tracking-wide drop-shadow-md" style={{ fontFamily: "var(--font-sans)" }}>
              Discover the story behind Tarini Jewellers — where tradition meets contemporary elegance.
            </p>
          </FadeUp>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-16 bg-[#FDFBF7]/50 overflow-hidden relative">
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-1/2 bg-[#FDFBF7]"
            />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2 — BRAND INTRODUCTION */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <FadeUp>
            <h2 className="text-[38px] lg:text-[52px] xl:text-[60px] font-normal leading-[1.1] uppercase max-w-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Jewellery That<br/>Tells Your Story
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="space-y-6 text-[16px] lg:text-[18px] font-normal leading-relaxed text-[#22181C]/80" style={{ fontFamily: "var(--font-sans)" }}>
              <p>At Tarini Jewellers, we believe jewellery is more than an adornment. It is a reflection of individuality, a keeper of memories and a celebration of life's most meaningful moments.</p>
              <p>Born from a love for timeless craftsmanship and contemporary design, Tarini brings together the beauty of Indian jewellery traditions with a modern, effortless aesthetic.</p>
              <p>Every piece is thoughtfully created to become part of your story — today, tomorrow and for generations to come.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 3 — OUR PHILOSOPHY */}
      <section className="py-24 lg:py-32 px-6 bg-[#FAF8F5]">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[32px] lg:text-[42px] font-normal uppercase tracking-wide mb-16 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our Philosophy
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              {
                title: "TIMELESS",
                desc: "Designs created to transcend seasons and trends."
              },
              {
                title: "CRAFTED",
                desc: "Attention to detail, refined craftsmanship and a deep respect for the art of jewellery making."
              },
              {
                title: "PERSONAL",
                desc: "Jewellery designed to celebrate your individuality and meaningful moments."
              }
            ].map((item, idx) => (
              <FadeUp key={idx} delay={idx * 0.15} className="relative">
                <div className="hidden md:block absolute -left-10 lg:-left-12 top-0 bottom-0 w-[1px] bg-[#C5A059]/20" />
                <h3 className="text-[22px] lg:text-[28px] font-normal mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</h3>
                <p className="text-[15px] lg:text-[16px] text-[#22181C]/70 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{item.desc}</p>
                <div className="block md:hidden w-full h-[1px] bg-[#C5A059]/20 mt-8" />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CRAFTSMANSHIP */}
      <section ref={craftRef} className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
        <motion.div style={{ scale: craftScale }} className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=85&w=1600" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="relative z-10 text-center px-4">
          <FadeUp>
            <h2 className="text-[#FDFBF7] text-[38px] sm:text-[42px] lg:text-[60px] font-normal uppercase tracking-widest mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Hands Behind The Beauty
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[#FDFBF7]/90 text-[15px] lg:text-[18px] max-w-xl mx-auto font-light leading-relaxed mb-10" style={{ fontFamily: "var(--font-sans)" }}>
              Every Tarini piece begins with an idea and comes to life through patience, precision and craftsmanship.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <Link to="/collections" className="inline-block border border-[#FDFBF7] text-[#FDFBF7] px-8 py-3 text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-[#FDFBF7] hover:text-[#22181C] transition-colors duration-300" style={{ fontFamily: "var(--font-sans)" }}>
              Explore Our Craft
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 5 — TRADITION × MODERNITY */}
      <section className="py-24 lg:py-32 px-6 max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-0 relative">
          <FadeUp className="w-full md:w-1/2 md:pr-12 lg:pr-20 z-0">
            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=85&w=1000" alt="Traditional Indian Jewellery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]" />
            </div>
          </FadeUp>
          
          <div className="w-full md:absolute md:left-1/2 md:-translate-x-1/2 flex flex-col justify-center items-center text-center bg-[#FDFBF7]/95 backdrop-blur-sm p-8 md:p-12 z-10 md:w-[60%] lg:w-[45%] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#C5A059]/20">
            <FadeUp>
              <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-normal uppercase leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Where Tradition<br/>Meets Tomorrow
              </h2>
              <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mb-6" />
              <p className="text-[14px] lg:text-[16px] text-[#22181C]/80 leading-relaxed mb-4" style={{ fontFamily: "var(--font-sans)" }}>
                India's jewellery heritage is rich with stories, symbolism and craftsmanship. At Tarini, we respect that heritage while interpreting it through a contemporary lens.
              </p>
              <p className="text-[14px] lg:text-[16px] text-[#22181C]/80 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                The result is jewellery that feels rooted yet modern, classic yet effortless.
              </p>
            </FadeUp>
          </div>
          
          <FadeUp className="w-full md:w-1/2 md:pl-12 lg:pl-20 z-0 hidden md:block">
            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden md:mt-24">
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1000" alt="Modern Jewellery Fashion" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 6 — THE TARINI WOMAN */}
      <section className="relative w-full py-24 lg:py-40 px-6">
        <div className="absolute inset-0 w-full h-full">
          <img src="https://images.unsplash.com/photo-1588665977931-155e9eb5c425?auto=format&fit=crop&q=85&w=2000" alt="The Tarini Woman" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#FDFBF7]/90" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[32px] sm:text-[38px] lg:text-[60px] font-normal uppercase leading-tight mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              For the Woman<br/>Who Wears Her Story
            </h2>
          </FadeUp>
          <FadeUp delay={0.2} className="space-y-6 text-[15px] lg:text-[17px] font-normal leading-relaxed text-[#22181C]/80" style={{ fontFamily: "var(--font-sans)" }}>
            <p>Tarini is created for women who celebrate their individuality.</p>
            <p>She is confident without being loud, elegant without trying too hard, and timeless in her own way.</p>
            <p>Our jewellery is designed to move with her — from everyday moments to the occasions she will remember forever.</p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 7 — OUR VALUES */}
      <section className="py-24 lg:py-32 px-6 bg-white border-y border-[#22181C]/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {[
            { title: "CRAFT", desc: "Respect for exceptional craftsmanship." },
            { title: "QUALITY", desc: "Thoughtful materials and attention to detail." },
            { title: "DESIGN", desc: "Timeless silhouettes with a contemporary perspective." },
            { title: "TRUST", desc: "A jewellery experience built around transparency and care." }
          ].map((val, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="group cursor-default text-center lg:text-left">
                <h3 className="text-[24px] lg:text-[28px] font-normal uppercase mb-4 group-hover:text-[#C5A059] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {val.title}
                </h3>
                <p className="text-[15px] text-[#22181C]/70 font-normal leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                  {val.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* SECTION 8 — JEWELLERY CATEGORIES */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[32px] lg:text-[42px] font-normal uppercase text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Discover Tarini
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { name: "RINGS", img: "https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=800", link: "/category/rings" },
              { name: "NECKLACES", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800", link: "/category/necklaces" },
              { name: "EARRINGS", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800", link: "/category/earrings" },
              { name: "BRACELETS", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", link: "/category/bracelets" }
            ].map((cat, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <Link to={cat.link} className="group block relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-[24px] text-white font-normal uppercase tracking-widest mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{cat.name}</h3>
                    <span className="text-[11px] text-white/90 uppercase tracking-[0.2em] font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" style={{ fontFamily: "var(--font-sans)" }}>
                      Explore
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — BRAND STATEMENT */}
      <section className="py-24 lg:py-40 px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[30px] sm:text-[38px] md:text-[48px] lg:text-[60px] font-normal leading-[1.3] uppercase text-[#22181C] mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "Beauty may fade from view,<br/>
              but a meaningful piece<br/>
              remains part of your story."
            </h2>
            <p className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-bold text-[#C5A059]" style={{ fontFamily: "var(--font-sans)" }}>
              Tarini Jewellers
            </p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 10 — CTA */}
      <section className="py-24 lg:py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-[32px] sm:text-[36px] lg:text-[50px] font-normal uppercase leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Find Something That<br/>Feels Like You
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#22181C]/70 font-normal mb-10" style={{ fontFamily: "var(--font-sans)" }}>
              Explore jewellery designed for the moments that become memories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/collections" className="w-full sm:w-auto px-10 py-4 bg-[#22181C] text-[#FDFBF7] text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] hover:text-[#22181C] transition-colors duration-300" style={{ fontFamily: "var(--font-sans)" }}>
                Shop The Collection
              </Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full sm:w-auto px-10 py-4 border border-[#22181C] text-[#22181C] text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-[#FDFBF7] transition-colors duration-300" style={{ fontFamily: "var(--font-sans)" }}>
                Our Story
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}

