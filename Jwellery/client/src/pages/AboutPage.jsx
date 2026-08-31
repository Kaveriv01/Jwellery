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
    <div className="bg-[#FAF7F2] text-[#1F1517] overflow-hidden selection:bg-[#C5A059] selection:text-white">
      <Helmet>
        <title>Our Story — Tarini Jewellers</title>
        <meta name="description" content="Discover the story behind Tarini Jewellers — where tradition meets contemporary elegance." />
      </Helmet>
      
      {/* 1. HERO — CINEMATIC JEWELLERY CAMPAIGN */}
      <section ref={heroRef} className="relative w-full h-[85vh] lg:h-[95vh] overflow-hidden bg-[#1F1517]">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
            poster="/images/home-banner.png"
          >
            <source src="/pinterest_video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        </motion.div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <h1 className="text-[#F8F5EF] text-[42px] md:text-[64px] lg:text-[84px] xl:text-[96px] font-medium leading-[1.05] tracking-wide drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Art of<br/>Timeless Beauty
            </h1>
          </FadeUp>
          <FadeUp delay={0.2} className="mt-6 md:mt-8 mb-10">
            <p className="text-[#F8F5EF]/90 text-[15px] md:text-[18px] max-w-xl mx-auto font-medium tracking-wide drop-shadow-sm uppercase" style={{ fontFamily: "var(--font-sans)" }}>
              Where heritage, craftsmanship and contemporary design come together.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })} 
              className="inline-block border border-[#F8F5EF]/50 text-[#F8F5EF] px-8 py-3 text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-[#FAF7F2] hover:text-[#1F1517] transition-all duration-500 backdrop-blur-sm"
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
          <div className="w-[1px] h-20 bg-[#FAF7F2]/30 overflow-hidden relative">
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 w-full h-1/2 bg-[#FAF7F2]"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. BRAND INTRODUCTION */}
      <section className="py-24 lg:py-40 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
                <div className="premium-image-inner">
                  <img src="/images/cat-ring-hands.png" alt="Jewellery That Tells Your Story" className="w-full h-full object-cover" />
                </div>
              </div>
            </ScatteredReveal>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <FadeUp>
              <span className="text-[#C5A059] text-[11px] md:text-[13px] font-bold tracking-[0.25em] uppercase mb-6 block" style={{ fontFamily: "var(--font-sans)" }}>Our Story</span>
              <h2 className="text-[48px] lg:text-[64px] xl:text-[72px] font-medium leading-[1.1] mb-10 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Jewellery That<br/>Tells Your Story
              </h2>
            </FadeUp>
            <FadeUp delay={0.2} className="space-y-6 text-[16px] md:text-[18px] font-normal leading-relaxed text-[#1F1517]/80 max-w-2xl" style={{ fontFamily: "var(--font-sans)" }}>
              <p>At Tarini Jewellers, we believe jewellery is more than an adornment. It carries memories, celebrates milestones and becomes part of the stories we treasure.</p>
              <p>Rooted in the timeless beauty of Indian craftsmanship and inspired by contemporary design, Tarini creates jewellery that feels elegant today and meaningful for years to come.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 3. OUR JOURNEY */}
      <section className="py-24 lg:py-32 px-6 bg-white border-y border-[#1F1517]/5">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-medium text-center mb-24 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Tarini Journey
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-12 gap-y-12 lg:gap-y-16">
            {[
              { num: "01", title: "The Beginning", desc: "A vision inspired by the timeless beauty of jewellery." },
              { num: "02", title: "The Craft", desc: "A commitment to thoughtful design and refined craftsmanship." },
              { num: "03", title: "The Collection", desc: "Jewellery created for modern women and meaningful occasions." },
              { num: "04", title: "The Future", desc: "Building a jewellery experience where tradition meets contemporary luxury." }
            ].map((step, idx) => (
              <FadeUp key={idx} delay={idx * 0.15} className="relative group">
                <div className="text-[50px] md:text-[70px] lg:text-[90px] text-[#C5A059] font-bold leading-none mb-4 lg:mb-6 group-hover:text-[#1F1517] transition-colors duration-500 drop-shadow-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {step.num}
                </div>
                <div className="w-12 h-[2px] bg-[#C5A059] mb-4 lg:mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
                <h3 className="text-[18px] md:text-[22px] lg:text-[26px] font-bold mb-3 lg:mb-4 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{step.title}</h3>
                <p className="text-[13px] md:text-[15px] lg:text-[16px] text-[#1F1517]/90 font-medium leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{step.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CRAFTSMANSHIP */}
      <section ref={craftRef} className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden flex items-center justify-center">
        <motion.div style={{ scale: craftScale }} className="absolute inset-0 w-full h-full">
          <img 
            src="/images/banner-new-v2.png" 
            alt="Jewellery Craftsmanship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3E2024]/50" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto">
          <FadeUp>
            <h2 className="text-[#F8F5EF] text-[42px] md:text-[56px] lg:text-[72px] font-medium leading-[1.1] tracking-wide mb-8 drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Hands Behind<br/>The Beauty
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[#F8F5EF]/90 text-[16px] lg:text-[18px] mx-auto font-light leading-relaxed max-w-2xl drop-shadow-md" style={{ fontFamily: "var(--font-sans)" }}>
              Every Tarini piece begins with an idea and comes to life through patience, precision and an appreciation for the art of jewellery making.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 5. TRADITION × MODERNITY */}
      <section className="py-24 lg:py-40 px-6 max-w-[1400px] mx-auto overflow-hidden">
        <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-[800px]">
          
          <FadeUp className="w-full lg:w-[45%] lg:absolute lg:left-0 lg:top-0 z-0">
            <div className="premium-image-container aspect-[4/5] w-full">
              <div className="premium-image-inner">
                <img src="/images/necklace-banner.jpg" alt="Traditional Indian Jewellery" className="w-full h-full object-cover" />
              </div>
            </div>
          </FadeUp>
          
          <FadeUp delay={0.2} className="w-full lg:w-[45%] lg:absolute lg:right-0 lg:bottom-0 z-0 mt-8 lg:mt-0 hidden lg:block">
            <div className="premium-image-container aspect-[4/5] w-full">
              <div className="premium-image-inner">
                <img src="/images/earrings-banner.jpg" alt="Modern Luxury Jewellery" className="w-full h-full object-cover" />
              </div>
            </div>
          </FadeUp>
          
          <div className="w-full lg:w-[45%] lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 mt-8 lg:mt-0">
            <FadeUp delay={0.1}>
              <div className="bg-[#FAF7F2] p-10 md:p-16 lg:p-20 text-center border border-[#C5A059]/30 shadow-2xl">
                <h2 className="text-[32px] md:text-[42px] lg:text-[48px] font-medium leading-tight mb-8 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Where Tradition<br/>Meets Tomorrow
                </h2>
                <p className="text-[15px] lg:text-[17px] text-[#1F1517]/80 leading-relaxed font-normal" style={{ fontFamily: "var(--font-sans)" }}>
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
          <img src="/images/home-banner.png" alt="The Tarini Woman" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#FAF7F2]/85 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[42px] md:text-[56px] lg:text-[72px] font-medium leading-[1.1] mb-12 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              For The Woman<br/>Who Wears Her Story
            </h2>
          </FadeUp>
          <FadeUp delay={0.2} className="space-y-6 text-[16px] lg:text-[18px] font-normal leading-relaxed text-[#1F1517]/80 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
            <p className="font-semibold text-[#1F1517]">Confident. Individual. Effortlessly elegant.</p>
            <p>Tarini is created for the woman who celebrates her individuality and chooses jewellery that moves with her—from everyday moments to the occasions she remembers forever.</p>
          </FadeUp>
        </div>
      </section>

      {/* 7. OUR VALUES */}
      <section className="py-24 lg:py-32 px-6 bg-white border-y border-[#1F1517]/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-16">
          {[
            { title: "Craftsmanship", desc: "Respect for the artistry and precision behind every piece." },
            { title: "Quality", desc: "Thoughtful materials, careful finishing and attention to detail." },
            { title: "Design", desc: "Timeless silhouettes interpreted through a contemporary lens." },
            { title: "Trust", desc: "A jewellery experience built around transparency, care and confidence." }
          ].map((val, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="group flex flex-col border border-[#1F1517]/10 p-6 md:p-10 lg:p-14 hover:border-[#C5A059]/50 hover:bg-[#FAF7F2]/50 transition-all duration-500 min-h-[220px] md:min-h-[300px] justify-between shadow-sm hover:shadow-md">
                <div>
                  <h3 className="text-[20px] md:text-[28px] lg:text-[32px] font-medium mb-4 lg:mb-6 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {val.title}
                  </h3>
                  <p className="text-[13px] md:text-[16px] lg:text-[17px] text-[#1F1517]/70 font-normal leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    {val.desc}
                  </p>
                </div>
                <div className="w-8 h-[2px] bg-[#C5A059] mt-6 lg:mt-8 group-hover:w-16 transition-all duration-500" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 8. MATERIALS & QUALITY */}
      <section className="py-24 lg:py-32 px-6 bg-[#FDFBF7]">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-medium mb-16 max-w-2xl leading-tight text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              What Goes Into<br/>A Tarini Piece
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[
              { title: "Materials", img: "/images/rings-banner.png" },
              { title: "Craft", img: "/images/banner-collections.png" },
              { title: "Detail", img: "/images/banner-bracelets.png" },
              { title: "Design", img: "/images/banner-earrings.png" }
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="premium-image-container aspect-square group">
                  <div className="premium-image-inner relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#3E2024]/20 group-hover:bg-[#3E2024]/40 transition-colors duration-500 rounded-[20px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-[20px] md:text-[28px] lg:text-[36px] font-medium tracking-wide drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 9. THE JEWELLERY EDITORIAL */}
      <section className="py-16 lg:py-24 px-6 bg-white overflow-hidden border-y border-[#1F1517]/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            
            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="/images/banner-earrings.png" className="w-full h-full object-cover" alt="Editorial 1" />
                </div>
              </div>
            </ScatteredReveal>
            
            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="/images/cat-necklace.png" className="w-full h-full object-cover" alt="Editorial 2" />
                </div>
              </div>
            </ScatteredReveal>
            
            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="/images/cat-ring.png" className="w-full h-full object-cover" alt="Editorial 3" />
                </div>
              </div>
            </ScatteredReveal>

            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="/images/banner-new-v2.png" className="w-full h-full object-cover" alt="Editorial 4" />
                </div>
              </div>
            </ScatteredReveal>

            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="/images/necklace-banner-floral.png" className="w-full h-full object-cover" alt="Editorial 6" />
                </div>
              </div>
            </ScatteredReveal>

            <ScatteredReveal index={Math.floor(Math.random() * 8)}>
              <div className="premium-image-container aspect-[4/5]">
                <div className="premium-image-inner">
                  <img src="/images/home-banner.png" className="w-full h-full object-cover" alt="Editorial 5" />
                </div>
              </div>
            </ScatteredReveal>

          </div>
        </div>
      </section>

      {/* 10. DISCOVER TARINI */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <FadeUp>
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-medium text-[#1F1517] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Shop by Category
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif" }} className="text-[11px] md:text-sm tracking-widest uppercase text-[#1F1517]/70">
                Discover our luxury collections
              </p>
            </FadeUp>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { name: "Necklaces", img: "/images/cat-necklace-floral.png", link: "/category/necklaces" },
              { name: "Earrings", img: "/images/cat-earrings.png", link: "/category/earrings" },
              { name: "Rings", img: "/images/cat-rings-floral.png", link: "/category/rings" },
              { name: "Bracelets", img: "/images/cat-bracelet.png", link: "/category/bracelets" }
            ].map((cat, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <Link to={cat.link} className="premium-image-container block aspect-[4/5] group">
                  <div className="premium-image-inner relative w-full h-full">
                    <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />

                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-center pointer-events-none">
                    <span 
                      style={{ 
                        fontFamily: "'Cormorant Garamond', serif",
                        textShadow: "0px 2px 5px rgba(0,0,0,0.6)" 
                      }} 
                      className="text-white text-3xl sm:text-4xl font-bold tracking-wide mb-2 transition-transform duration-500 group-hover:-translate-y-2 drop-shadow-xl"
                    >
                      {cat.name}
                    </span>
                    <div className="overflow-hidden hidden md:block">
                      <span 
                        style={{ 
                          fontFamily: "'Nunito Sans', sans-serif",
                          textShadow: "0px 1px 2px rgba(0,0,0,0.6)"
                        }}
                        className="text-white text-[11px] font-semibold uppercase tracking-[0.15em] border-b border-white pb-1 inline-block transform translate-y-[200%] group-hover:translate-y-0 transition-transform duration-500 ease-out drop-shadow-md"
                      >
                        Shop Now
                      </span>
                    </div>
                  </div>
                                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BRAND STATEMENT */}
      <section className="py-32 lg:py-48 px-6 bg-[#FAF7F2] border-t border-[#1F1517]/5">
        <div className="max-w-5xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[32px] sm:text-[42px] md:text-[50px] lg:text-[70px] font-medium leading-[1.25] text-[#1F1517] mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
          <img src="/images/banner-collections.png" alt="Tarini Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#FAF7F2]/95 backdrop-blur-[4px]" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] font-medium leading-[1.1] mb-8 text-[#1F1517]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Find Something That<br/>Feels Like You
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#1F1517]/80 font-normal mb-12" style={{ fontFamily: "var(--font-sans)" }}>
              Discover jewellery designed for the moments that become memories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/collections" className="w-full sm:w-auto px-12 py-4 bg-[#1F1517] text-[#F8F5EF] text-[12px] md:text-[13px] uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] transition-colors duration-300 shadow-lg" style={{ fontFamily: "var(--font-sans)" }}>
                Shop The Collection
              </Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full sm:w-auto px-12 py-4 border border-[#1F1517]/30 text-[#1F1517] text-[12px] md:text-[13px] uppercase tracking-[0.2em] font-bold hover:border-[#1F1517] hover:bg-white transition-all duration-300" style={{ fontFamily: "var(--font-sans)" }}>
                Explore Our Story
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}

