import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  
  const craftRef = useRef(null);
  const { scrollYProgress: craftProgress } = useScroll({
    target: craftRef,
    offset: ["start end", "end start"]
  });
  const craftScale = useTransform(craftProgress, [0, 1], [1, 1.15]);

  return (
    <div className="bg-[#F8F5EF] text-[#22181C] overflow-hidden selection:bg-[#C5A059] selection:text-white">
      <Helmet>
        <title>Our Story — Tarini Jewellers</title>
        <meta name="description" content="Discover the story behind Tarini Jewellers — where tradition meets contemporary elegance." />
      </Helmet>
      
      {/* 1. HERO — CINEMATIC JEWELLERY CAMPAIGN */}
      <section ref={heroRef} className="relative w-full h-[85vh] lg:h-[95vh] overflow-hidden bg-[#22181C]">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=85&w=2000"
          >
            <source src="https://videos.pexels.com/video-files/6969566/6969566-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        </motion.div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <h1 className="text-[#F8F5EF] text-[42px] md:text-[64px] lg:text-[84px] xl:text-[100px] font-normal leading-[1.05] uppercase tracking-wide drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Art of<br/>Timeless Beauty
            </h1>
          </FadeUp>
          <FadeUp delay={0.2} className="mt-6 md:mt-8 mb-10">
            <p className="text-[#F8F5EF]/90 text-[15px] md:text-[18px] max-w-xl mx-auto font-medium tracking-wide drop-shadow-sm" style={{ fontFamily: "var(--font-sans)" }}>
              Where heritage, craftsmanship and contemporary design come together.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })} 
              className="inline-block border border-[#F8F5EF]/50 text-[#F8F5EF] px-8 py-3 text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5EF] hover:text-[#22181C] transition-all duration-500 backdrop-blur-sm"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Discover Our Story
            </button>
          </FadeUp>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="w-[1px] h-20 bg-[#F8F5EF]/30 overflow-hidden relative">
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 w-full h-1/2 bg-[#F8F5EF]"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. BRAND INTRODUCTION */}
      <section className="py-24 lg:py-40 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <FadeUp>
              <div className="aspect-[3/4] overflow-hidden w-full max-w-md mx-auto lg:max-w-none">
                <img 
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1000" 
                  alt="Jewellery That Tells Your Story" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" 
                />
              </div>
            </FadeUp>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <FadeUp>
              <span className="text-[#C5A059] text-[11px] md:text-[13px] font-bold tracking-[0.25em] uppercase mb-6 block" style={{ fontFamily: "var(--font-sans)" }}>Our Story</span>
              <h2 className="text-[48px] lg:text-[64px] xl:text-[72px] font-normal leading-[1.1] uppercase mb-10 text-[#22181C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Jewellery<br/>That Tells<br/>Your Story
              </h2>
            </FadeUp>
            <FadeUp delay={0.2} className="space-y-6 text-[16px] md:text-[18px] font-normal leading-relaxed text-[#22181C]/80 max-w-2xl" style={{ fontFamily: "var(--font-sans)" }}>
              <p>At Tarini Jewellers, we believe jewellery is more than an adornment. It carries memories, celebrates milestones and becomes part of the stories we treasure.</p>
              <p>Rooted in the timeless beauty of Indian craftsmanship and inspired by contemporary design, Tarini creates jewellery that feels elegant today and meaningful for years to come.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 3. OUR JOURNEY (Horizontal Timeline) */}
      <section className="py-24 lg:py-32 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-normal uppercase text-center mb-24" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Tarini Journey
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            {[
              { num: "01", title: "THE BEGINNING", desc: "A vision inspired by the timeless beauty of jewellery." },
              { num: "02", title: "THE CRAFT", desc: "A commitment to thoughtful design and refined craftsmanship." },
              { num: "03", title: "THE COLLECTION", desc: "Jewellery created for modern women and meaningful occasions." },
              { num: "04", title: "THE FUTURE", desc: "Building a jewellery experience where tradition meets contemporary luxury." }
            ].map((step, idx) => (
              <FadeUp key={idx} delay={idx * 0.15} className="relative group">
                <div className="text-[60px] lg:text-[80px] text-[#F8F5EF] font-normal leading-none mb-6 group-hover:text-[#F0EBE1] transition-colors duration-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {step.num}
                </div>
                <div className="w-12 h-[1px] bg-[#C5A059] mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
                <h3 className="text-[18px] lg:text-[22px] font-normal uppercase mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{step.title}</h3>
                <p className="text-[15px] lg:text-[16px] text-[#22181C]/70 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{step.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CRAFTSMANSHIP — FULL-WIDTH IMAGE */}
      <section ref={craftRef} className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden flex items-center justify-center">
        <motion.div style={{ scale: craftScale }} className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=85&w=2000" 
            alt="Jewellery Craftsmanship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto">
          <FadeUp>
            <h2 className="text-[#F8F5EF] text-[42px] md:text-[56px] lg:text-[72px] font-normal uppercase leading-[1.1] tracking-wide mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Hands<br/>Behind The Beauty
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[#F8F5EF]/90 text-[16px] lg:text-[18px] mx-auto font-light leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-sans)" }}>
              Every Tarini piece begins with an idea and comes to life through patience, precision and an appreciation for the art of jewellery making.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 5. TRADITION × MODERNITY */}
      <section className="py-24 lg:py-40 px-6 max-w-[1400px] mx-auto overflow-hidden">
        <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-[800px]">
          
          <FadeUp className="w-full lg:w-[45%] lg:absolute lg:left-0 lg:top-0 z-0">
            <div className="aspect-[4/5] overflow-hidden w-full">
              <img src="https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=85&w=1000" alt="Traditional Indian Jewellery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" />
            </div>
          </FadeUp>
          
          <FadeUp delay={0.2} className="w-full lg:w-[45%] lg:absolute lg:right-0 lg:bottom-0 z-0 mt-8 lg:mt-0 hidden lg:block">
            <div className="aspect-[4/5] overflow-hidden w-full">
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=85&w=1000" alt="Modern Luxury Jewellery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" />
            </div>
          </FadeUp>
          
          {/* Floating Editorial Card */}
          <div className="w-full lg:w-[45%] lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 mt-8 lg:mt-0">
            <FadeUp delay={0.1}>
              <div className="bg-[#F8F5EF] p-10 md:p-16 lg:p-20 text-center border border-[#C5A059]/30 shadow-[0_20px_50px_rgba(34,24,28,0.05)]">
                <h2 className="text-[32px] md:text-[42px] lg:text-[48px] font-normal uppercase leading-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Where Tradition<br/>Meets Tomorrow
                </h2>
                <p className="text-[15px] lg:text-[17px] text-[#22181C]/80 leading-relaxed font-normal" style={{ fontFamily: "var(--font-sans)" }}>
                  India's jewellery heritage is rich with stories, symbolism and craftsmanship. Tarini honours that heritage while interpreting it through a contemporary perspective.
                </p>
              </div>
            </FadeUp>
          </div>
          
        </div>
      </section>

      {/* 6. THE TARINI WOMAN */}
      <section className="relative w-full py-32 lg:py-48 px-6 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src="https://images.unsplash.com/photo-1588665977931-155e9eb5c425?auto=format&fit=crop&q=85&w=2000" alt="The Tarini Woman" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-[#F8F5EF]/85 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[42px] md:text-[56px] lg:text-[72px] font-normal uppercase leading-[1.1] mb-12 text-[#22181C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              For The Woman<br/>Who Wears<br/>Her Story
            </h2>
          </FadeUp>
          <FadeUp delay={0.2} className="space-y-6 text-[16px] lg:text-[18px] font-normal leading-relaxed text-[#22181C]/80 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
            <p className="font-medium text-[#22181C]">Confident. Individual. Effortlessly elegant.</p>
            <p>Tarini is created for the woman who celebrates her individuality and chooses jewellery that moves with her—from everyday moments to the occasions she remembers forever.</p>
          </FadeUp>
        </div>
      </section>

      {/* 7. OUR VALUES */}
      <section className="py-24 lg:py-32 px-6 bg-white border-y border-[#22181C]/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {[
            { num: "01", title: "CRAFTSMANSHIP", desc: "Respect for the artistry and precision behind every piece." },
            { num: "02", title: "QUALITY", desc: "Thoughtful materials, careful finishing and attention to detail." },
            { num: "03", title: "DESIGN", desc: "Timeless silhouettes interpreted through a contemporary lens." },
            { num: "04", title: "TRUST", desc: "A jewellery experience built around transparency, care and confidence." }
          ].map((val, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="group flex flex-col border border-[#22181C]/10 p-10 md:p-14 hover:border-[#C5A059]/50 hover:bg-[#F8F5EF]/50 transition-all duration-500 min-h-[300px] justify-between">
                <div>
                  <span className="text-[12px] md:text-[13px] text-[#C5A059] font-bold tracking-[0.2em] mb-4 block" style={{ fontFamily: "var(--font-sans)" }}>{val.num}</span>
                  <h3 className="text-[28px] lg:text-[36px] font-normal uppercase mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {val.title}
                  </h3>
                  <p className="text-[16px] lg:text-[18px] text-[#22181C]/70 font-normal leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    {val.desc}
                  </p>
                </div>
                <div className="w-0 h-[1px] bg-[#C5A059] mt-8 group-hover:w-16 transition-all duration-500" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 8. MATERIALS & QUALITY */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[36px] md:text-[48px] lg:text-[60px] font-normal uppercase mb-16 max-w-2xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              What Goes<br/>Into A Tarini Piece
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { title: "MATERIALS", img: "https://images.unsplash.com/photo-1620653066928-11b0e3efebbb?auto=format&fit=crop&q=85&w=1000" },
              { title: "CRAFT", img: "https://images.unsplash.com/photo-1563236306-03f0b2fbe0be?auto=format&fit=crop&q=85&w=1000" },
              { title: "DETAIL", img: "https://images.unsplash.com/photo-1599643477818-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1000" }
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="relative aspect-square overflow-hidden group">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-[24px] lg:text-[32px] font-normal uppercase tracking-widest drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 9. THE JEWELLERY EDITORIAL (Magazine Gallery) */}
      <section className="py-16 lg:py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-min">
            
            <FadeUp className="md:col-span-8 md:row-span-2">
              <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=85&w=1600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" alt="Editorial 1" />
              </div>
            </FadeUp>
            
            <FadeUp delay={0.1} className="md:col-span-4">
              <div className="aspect-[3/4] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=85&w=800" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" alt="Editorial 2" />
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2} className="md:col-span-4 hidden md:block">
              <div className="aspect-[3/4] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=85&w=800" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" alt="Editorial 3" />
              </div>
            </FadeUp>

            <FadeUp delay={0.1} className="md:col-span-4 mt-0 md:mt-8">
              <div className="aspect-[3/4] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=85&w=800" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" alt="Editorial 4" />
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="md:col-span-8 md:row-span-2 mt-0 md:mt-8">
              <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" alt="Editorial 5" />
              </div>
            </FadeUp>
            
            <FadeUp delay={0.3} className="md:col-span-4 mt-0 md:mt-8 hidden md:block">
              <div className="aspect-[3/4] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1574542278457-41abdfa5b172?auto=format&fit=crop&q=85&w=800" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" alt="Editorial 6" />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* 10. DISCOVER TARINI */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[36px] md:text-[48px] lg:text-[60px] font-normal uppercase text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
                <Link to={cat.link} className="group block relative aspect-[4/5] overflow-hidden bg-[#F8F5EF]">
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-[28px] text-white font-normal uppercase tracking-widest mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{cat.name}</h3>
                    <span className="text-[12px] text-white/90 uppercase tracking-[0.2em] font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75" style={{ fontFamily: "var(--font-sans)" }}>
                      Explore
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BRAND STATEMENT */}
      <section className="py-32 lg:py-48 px-6 bg-[#F8F5EF]">
        <div className="max-w-5xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[32px] sm:text-[42px] md:text-[50px] lg:text-[70px] font-normal leading-[1.25] uppercase text-[#22181C] mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "Beauty may fade<br/>
              from view,<br/><br/>
              but a meaningful piece<br/>
              remains part<br/>
              of your story."
            </h2>
            <p className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-bold text-[#C5A059]" style={{ fontFamily: "var(--font-sans)" }}>
              Tarini Jewellers
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="relative py-32 lg:py-48 px-6 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=85&w=2000" alt="Tarini Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#F8F5EF]/95 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-normal uppercase leading-[1.1] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Find Something<br/>That Feels Like You
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#22181C]/80 font-normal mb-12" style={{ fontFamily: "var(--font-sans)" }}>
              Discover jewellery designed for the moments that become memories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/collections" className="w-full sm:w-auto px-12 py-4 bg-[#22181C] text-[#F8F5EF] text-[12px] md:text-[13px] uppercase tracking-[0.2em] font-medium hover:bg-[#C5A059] transition-colors duration-300" style={{ fontFamily: "var(--font-sans)" }}>
                Shop The Collection
              </Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full sm:w-auto px-12 py-4 border border-[#22181C]/30 text-[#22181C] text-[12px] md:text-[13px] uppercase tracking-[0.2em] font-medium hover:border-[#22181C] hover:bg-white transition-all duration-300" style={{ fontFamily: "var(--font-sans)" }}>
                Explore Our Story
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}

