import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';

function SectionHeading({ title, dark = false }) {
  const shouldReduceMotion = useReducedMotion();

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const dividerReveal = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="flex flex-col items-center justify-center text-center mb-12"
    >
      <motion.h2 
        variants={headingReveal}
        className={`text-[23px] sm:text-[27px] lg:text-[32px] font-normal tracking-wide mb-[16px] ${dark ? 'text-[#FAF8F3]' : 'text-[#560817]'}`} 
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </motion.h2>
      <motion.div 
        variants={dividerReveal}
        style={{ originX: 0.5 }}
        className={`w-12 h-[1px] mb-4 ${dark ? 'bg-[#FAF8F3]/30' : 'bg-[#B08A45]'}`} 
      />
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
        className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 md:-translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_5px_15px_rgba(86,8,23,0.04)] flex items-center justify-center text-[#560817] transition-all duration-300 z-10 ${canScrollLeft ? 'opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-[#B08A45]' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={24} strokeWidth={1} />
      </button>

      <button 
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 md:translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_5px_15px_rgba(86,8,23,0.04)] flex items-center justify-center text-[#560817] transition-all duration-300 z-10 ${canScrollRight ? 'opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-[#B08A45]' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronRight size={24} strokeWidth={1} />
      </button>
    </div>
  );
}

function ProductSection({ title, products = [], viewAllLink, dark = false, bg = '', useCarousel = false }) {
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
        <SectionHeading title={title} dark={dark} />

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
              className="inline-block border-b border-[#560817] pb-1 text-[#560817] hover:text-[#B08A45] hover:border-[#B08A45] text-[11px] lg:text-[12px] font-medium tracking-[0.12em] uppercase transition-all duration-300"
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
    <ProductSection
      title="Our Bestsellers"
      products={products}
      viewAllLink="/products?isBestSeller=true"
      bg="bg-white border-t border-[#FAF6EE]"
      useCarousel={true}
    />
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

  const dividerReveal = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
      className="relative py-20 lg:py-28 overflow-hidden" 
      style={{ background: 'linear-gradient(180deg, #F8F4EC 0%, #FAF6EE 100%)' }}
    >
      {/* Subtle Background Micro-Animation */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at 50% 20%, rgba(200, 168, 102, 0.06), transparent 45%)' }}
      />
      
      <div className="container-luxury relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.h2 
            variants={headingReveal}
            className="text-[23px] sm:text-[27px] lg:text-[32px] font-normal tracking-wide mb-[16px] text-[#560817]" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            New Arrivals
          </motion.h2>
          <motion.div 
            variants={dividerReveal}
            style={{ originX: 0.5 }}
            className="w-12 h-[1px] mb-8 bg-[#B08A45]" 
          />
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true, amount: 0.15 }} 
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.35 }}
          >
            <Link
              to="/products?isNewArrival=true"
              className="text-[11px] font-medium tracking-[0.12em] uppercase pb-1 border-b transition-colors duration-300 text-[#181516] border-[#181516] hover:text-[#560817] hover:border-[#560817]"
            >
              EXPLORE COLLECTION
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {products.slice(0, 4).map((product) => (
            <motion.div key={product._id} variants={cardItem} className="h-full">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FeaturedCollection;
