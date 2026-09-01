import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import ScatteredReveal from '../animations/ScatteredReveal';

function SectionHeading({ title, subtitle, dark = false }) {
  const shouldReduceMotion = useReducedMotion();

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="flex flex-col items-center justify-center text-center mb-16"
    >
      {subtitle && (
        <motion.span className={`text-[10px] tracking-[0.15em] uppercase mb-3 block font-medium ${dark ? 'text-[#FDFBF7]/80' : 'text-[#E8E1D6]'}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {subtitle}
        </motion.span>
      )}
      
      {/* Decorative element */}
      <div className={`w-4 h-4 mx-auto mb-3 opacity-40 ${dark ? 'text-white' : 'text-[#C5A059]'}`}>
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>

      <motion.h2 
        variants={headingReveal}
        className={`text-[30px] md:text-[38px] lg:text-[48px] font-[500] leading-[1.15] tracking-wide mb-[16px] ${dark ? 'text-[#FDFBF7]' : 'text-[#E8E1D6]'}`} 
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}

function ProductCarousel({ products }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 lg:gap-8 pb-8 -mx-4 px-4 md:-mx-8 md:px-8 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {products.map((product, index) => (
          <div key={product._id} className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[35vw] lg:w-[23vw]">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 md:-translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-[#1A1512] rounded-full shadow-[0_5px_15px_rgba(53,5,13,0.06)] flex items-center justify-center text-[#E8E1D6] transition-all duration-300 z-10 ${canScrollLeft ? 'opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-[#4A0712]' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={24} strokeWidth={1} />
      </button>

      <button 
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 md:translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-[#1A1512] rounded-full shadow-[0_5px_15px_rgba(53,5,13,0.06)] flex items-center justify-center text-[#E8E1D6] transition-all duration-300 z-10 ${canScrollRight ? 'opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-[#4A0712]' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronRight size={24} strokeWidth={1} />
      </button>
    </div>
  );
}

function ProductSection({ title, subtitle, products = [], viewAllLink, dark = false, bg = '', useCarousel = false }) {
  const shouldReduceMotion = useReducedMotion();

  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
      className={`py-20 lg:py-28 overflow-hidden ${bg}`}
    >
      <div className="container-luxury relative">
        <SectionHeading title={title} subtitle={subtitle} dark={dark} />

        {useCarousel ? (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCarousel products={products} />
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
          >
            {products.slice(0, Math.max(4, products.length - (products.length % 4))).slice(0, 8).map((product, index) => (
              <motion.div key={product._id} variants={cardVariants} className="h-full">
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewAllLink && (
          <div className="text-center mt-12">
            <Link
              to={viewAllLink}
              className="inline-block border-b border-[#1F1517] pb-1 text-[#E8E1D6] hover:text-[#4A0712] hover:border-[#4A0712] text-[12px] lg:text-[13px] font-[600] tracking-[0.08em] uppercase transition-all duration-[300ms] ease-out hover:-translate-y-px"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export function FeaturedCollection({ products }) {
  return (
    <ProductSection
      title="Featured Collection"
      products={products}
      viewAllLink="/products?isFeatured=true"
      bg="bg-[#1A1512]"
    />
  );
}

export function TrendingCollection({ products }) {
  return (
    <ProductSection
      title="Trending Now"
      products={products}
      viewAllLink="/products?isTrending=true"
      bg="bg-[#F8F4EC]"
    />
  );
}

export function BestSellers({ products }) {
  return (
    <div className="relative">
      {/* Decorative large diamond background element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-0">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="0.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>
      
      <ProductSection
        title="Best Seller"
        subtitle="BEST SELLER PRODUCT THIS WEEK!"
        products={products}
        viewAllLink="/products?isBestSeller=true"
        bg="bg-[#FAFAF8] relative z-10"
        useCarousel={true}
      />
    </div>
  );
}

export function NewArrivals() {
  const shouldReduceMotion = useReducedMotion();

  const sectionReveal = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="bg-[#1A1512] py-20 lg:py-32 overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 flex flex-col items-center">
        
        {/* Main Hero Image */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionReveal}
          className="w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden group mb-12 lg:mb-16"
        >
          <img src="/images/editorial/main.png" alt="New In Tarini" className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" />
        </motion.div>

        {/* Title Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center mb-20 md:mb-32 max-w-2xl px-4"
        >
          <span className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#C5A059] font-bold mb-4 block" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            New Arrivals
          </span>
          <h2 className="text-[36px] md:text-[52px] lg:text-[64px] text-[#E8E1D6] font-[500] leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The Latest From Tarini
          </h2>
          <p className="text-[#E8E1D6]/80 text-[14px] md:text-[16px] font-light leading-relaxed mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Discover our newest jewellery pieces, thoughtfully designed to bring a refined touch to every occasion.
          </p>
          <Link
            to="/products?isNewArrival=true"
            className="inline-block bg-[#1F1517] text-white px-10 py-3.5 text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-[#C5A059] transition-colors duration-300"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Explore New In
          </Link>
        </motion.div>

        {/* Editorial Stack */}
        <div className="w-full flex flex-col gap-16 md:gap-24 lg:gap-32 pb-10">
          
          <ScatteredReveal className="w-full group">
            <div className="premium-image-container w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.35/1]">
               <div className="premium-image-inner w-full h-full relative">
                 <img src="/images/editorial/rings.png" alt="Luxury Rings" className="w-full h-full object-cover" />
               </div>
            </div>
            <div className="mt-6 md:mt-8 text-center">
               <h3 className="text-[24px] md:text-[32px] text-[#E8E1D6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Signature Rings</h3>
               <Link to="/collections" className="inline-block mt-3 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-[#1F1517] pb-1 text-[#E8E1D6] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">Discover</Link>
            </div>
          </ScatteredReveal>

          <ScatteredReveal className="w-full group">
            <div className="premium-image-container w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.35/1]">
               <div className="premium-image-inner w-full h-full relative">
                 <img src="/images/editorial/necklace.png" alt="Luxury Necklaces" className="w-full h-full object-cover" />
               </div>
            </div>
            <div className="mt-6 md:mt-8 text-center">
               <h3 className="text-[24px] md:text-[32px] text-[#E8E1D6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Statement Necklaces</h3>
               <Link to="/collections" className="inline-block mt-3 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-[#1F1517] pb-1 text-[#E8E1D6] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">Discover</Link>
            </div>
          </ScatteredReveal>

          <ScatteredReveal className="w-full group">
            <div className="premium-image-container w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.35/1]">
               <div className="premium-image-inner w-full h-full relative">
                 <img src="/images/editorial/earrings.png" alt="Luxury Earrings" className="w-full h-full object-cover" />
               </div>
            </div>
            <div className="mt-6 md:mt-8 text-center">
               <h3 className="text-[24px] md:text-[32px] text-[#E8E1D6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Elegant Earrings</h3>
               <Link to="/collections" className="inline-block mt-3 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-[#1F1517] pb-1 text-[#E8E1D6] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">Discover</Link>
            </div>
          </ScatteredReveal>

          <ScatteredReveal className="w-full group">
            <div className="premium-image-container w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.35/1]">
               <div className="premium-image-inner w-full h-full relative">
                 <img src="/images/editorial/bracelet.png" alt="Luxury Bracelets" className="w-full h-full object-cover" />
               </div>
            </div>
            <div className="mt-6 md:mt-8 text-center">
               <h3 className="text-[24px] md:text-[32px] text-[#E8E1D6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Fine Bracelets</h3>
               <Link to="/collections" className="inline-block mt-3 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-[#1F1517] pb-1 text-[#E8E1D6] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">Discover</Link>
            </div>
          </ScatteredReveal>

        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
