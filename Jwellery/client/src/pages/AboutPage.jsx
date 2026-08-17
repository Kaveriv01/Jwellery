import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us — Tarini Jewellers</title>
        <meta name="description" content="Learn about Tarini Jewellers' story, craftsmanship, and commitment to luxury jewelry." />
      </Helmet>
      
      <div className="bg-[#220306] text-[#F7F3EA] py-20">
        <div className="container-luxury text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#B59A68] text-[11px] font-medium tracking-[0.12em] uppercase mb-3">Our Story</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl mb-6 font-normal tracking-wide text-[#F7F3EA]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Crafting Timeless<br />Elegance</motion.h1>
          <p className="text-[#FAF6EE]/80 max-w-xl mx-auto leading-relaxed text-[15px] font-light">From the finest ateliers of India, we bring you jewelry that transcends generations.</p>
        </div>
      </div>

      <div className="container-luxury py-20 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-[#B59A68] text-[11px] font-medium uppercase tracking-[0.12em] mb-2">Who We Are</p>
            <h2 className="text-[28px] lg:text-[32px] text-[#3A0508] font-normal leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>A Legacy of Artisanship</h2>
            <p className="text-[#756B62] text-[15px] font-light leading-relaxed mb-4">Tarini Jewellers was founded with a singular vision — to make luxury jewelry accessible while preserving the highest standards of craftsmanship.</p>
            <p className="text-[#756B62] text-[15px] font-light leading-relaxed">Every piece in our collection is handcrafted by master artisans, using ethically sourced materials and BIS-certified gold and silver.</p>
          </div>
          <img src="/images/home/our-story-new.png" alt="About Tarini Jewellers" className="rounded-[2px] w-full aspect-square object-cover border border-[#FAF6EE]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center py-12 border-t border-b border-[#FAF6EE]">
          {[
            ['10K+', 'Happy Customers'],
            ['500+', 'Unique Designs'],
            ['100%', 'BIS Hallmarked'],
            ['7-Day', 'Easy Returns']
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl text-[#3A0508] font-normal mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
              <p className="text-[11px] text-[#756B62] uppercase tracking-[0.12em] font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

