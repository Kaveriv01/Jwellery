import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';

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
        <motion.span className={`text-[10px] tracking-[0.15em] uppercase mb-3 block font-medium ${dark ? 'text-[#F8F4EE]/80' : 'text-[#756869]'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {subtitle}
        </motion.span>
      )}
      
      {/* Decorative element */}
      <div className={`w-4 h-4 mx-auto mb-3 opacity-40 ${dark ? 'text-white' : 'text-[#C9A96E]'}`}>
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>

      <motion.h2 
        variants={headingReveal}
        className={`text-[30px] md:text-[38px] lg:text-[48px] font-[500] leading-[1.15] tracking-wide mb-[16px] ${dark ? 'text-[#F8F4EE]' : 'text-[#35050D]'}`} 
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
        {products.map((product) => (
          <div key={product._id} className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[35vw] lg:w-[23vw]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 md:-translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_5px_15px_rgba(53,5,13,0.06)] flex items-center justify-center text-[#35050D] transition-all duration-300 z-10 ${canScrollLeft ? 'opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-[#4A0712]' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={24} strokeWidth={1} />
      </button>

      <button 
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 md:translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_5px_15px_rgba(53,5,13,0.06)] flex items-center justify-center text-[#35050D] transition-all duration-300 z-10 ${canScrollRight ? 'opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-[#4A0712]' : 'opacity-0 pointer-events-none'}`}
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
            {products.slice(0, Math.max(4, products.length - (products.length % 4))).slice(0, 8).map((product) => (
              <motion.div key={product._id} variants={cardVariants} className="h-full">
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewAllLink && (
          <div className="text-center mt-12">
            <Link
              to={viewAllLink}
              className="inline-block border-b border-[#35050D] pb-1 text-[#35050D] hover:text-[#4A0712] hover:border-[#4A0712] text-[12px] lg:text-[13px] font-[600] tracking-[0.08em] uppercase transition-all duration-[300ms] ease-out hover:-translate-y-px"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
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
      bg="bg-white"
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

export function NewArrivals({ products }) {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: 0.2 } },
  };

  const cardItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
      className="relative py-16 lg:py-20 overflow-hidden bg-white" 
    >
      <div className="container-luxury max-w-[1400px] relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <motion.h2 
            variants={headingReveal}
            className="text-[30px] md:text-[38px] lg:text-[48px] font-[500] leading-[1.15] tracking-wide mb-[16px] text-[#35050D]" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            New Arrivals
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {products.slice(0, 4).map((product) => (
            <motion.div key={product._id} variants={cardItem} className="h-full">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/products?isNewArrival=true"
            className="inline-block bg-[#35050D] text-[#F8F4EE] px-10 py-3.5 text-[12px] lg:text-[13px] font-[600] tracking-[0.08em] uppercase transition-all duration-[300ms] ease-out hover:bg-[#4A0712] hover:scale-[1.02] shadow-sm rounded-[2px]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Shop New In
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

export default FeaturedCollection;
