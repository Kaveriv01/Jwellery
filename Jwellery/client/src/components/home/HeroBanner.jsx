import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CAROUSEL_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800', title: 'Necklaces' },
  { id: 2, url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', title: 'Earrings' },
  { id: 3, url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', title: 'Rings' },
  { id: 4, url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', title: 'Bracelets' },
  { id: 5, url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800', title: 'Collections' },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1));
  };

  const getCardStyles = (index) => {
    const total = CAROUSEL_IMAGES.length;
    let offset = index - currentIndex;
    
    if (offset > 2) offset -= total;
    if (offset < -2) offset += total;

    // Define positions for layers
    const isCenter = offset === 0;
    const isLeft1 = offset === -1;
    const isRight1 = offset === 1;
    const isLeft2 = offset <= -2;
    const isRight2 = offset >= 2;

    let x = 0;
    let scale = 1;
    let zIndex = 30;
    let opacity = 1;
    let rotateY = 0;

    if (isCenter) {
      x = '0%';
      scale = 1;
      zIndex = 50;
      opacity = 1;
    } else if (isLeft1) {
      x = '-65%';
      scale = 0.85;
      zIndex = 40;
      opacity = 0.9;
      rotateY = 10;
    } else if (isRight1) {
      x = '65%';
      scale = 0.85;
      zIndex = 40;
      opacity = 0.9;
      rotateY = -10;
    } else if (isLeft2) {
      x = '-110%';
      scale = 0.7;
      zIndex = 30;
      opacity = 0.6;
      rotateY = 20;
    } else if (isRight2) {
      x = '110%';
      scale = 0.7;
      zIndex = 30;
      opacity = 0.6;
      rotateY = -20;
    }

    return { x, scale, zIndex, opacity, rotateY };
  };

  return (
    <section className="relative w-full h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] flex flex-col items-center justify-center bg-[#FAF6EE] overflow-hidden pt-8 pb-12">
      
      {/* Centered Title */}
      <div className="absolute top-10 md:top-16 text-center z-50 px-4 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#111] text-[32px] md:text-[48px] lg:text-[56px] font-[500] mb-2 tracking-wide"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          The Tarini Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-500 text-[11px] md:text-[13px] uppercase tracking-[0.25em]" 
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Discover Timeless Elegance
        </motion.p>
      </div>

      <div className="relative w-full max-w-6xl h-full flex items-center justify-center mt-12 perspective-[1200px]">
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 sm:left-12 md:left-24 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#111] hover:scale-110 transition-transform duration-300"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-4 sm:right-12 md:right-24 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#111] hover:scale-110 transition-transform duration-300"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} strokeWidth={1.5} />
        </button>

        {/* Layered Carousel Cards */}
        <div className="relative w-[280px] sm:w-[320px] md:w-[380px] h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center" style={{ perspective: '1200px' }}>
          <AnimatePresence initial={false}>
            {CAROUSEL_IMAGES.map((img, i) => {
              const styles = getCardStyles(i);
              const isActive = i === currentIndex;
              
              return (
                <motion.div
                  key={img.id}
                  className="absolute w-full h-full rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white cursor-pointer"
                  initial={false}
                  animate={{
                    x: styles.x,
                    scale: styles.scale,
                    zIndex: styles.zIndex,
                    opacity: styles.opacity,
                    rotateY: styles.rotateY
                  }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => setCurrentIndex(i)}
                >
                  <img 
                    src={img.url} 
                    alt={img.title}
                    className="w-full h-full object-cover object-center"
                    draggable="false"
                  />
                  
                  {/* Subtle Gradient Overlay for Text */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                  {/* Active Card Content */}
                  <div className={`absolute inset-0 flex flex-col justify-end items-center p-8 transition-opacity duration-500 ${isActive ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none'}`}>
                    <h3 className="text-white text-[28px] md:text-[34px] font-[400] tracking-wide mb-6 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {img.title}
                    </h3>
                    <Link 
                      to={`/category/${img.title.toLowerCase()}`}
                      className="inline-block px-10 py-3.5 bg-white text-[#111] text-[12px] md:text-[13px] font-[600] uppercase tracking-[0.15em] hover:bg-[#111] hover:text-white transition-colors rounded-[2px]"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Explore
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
