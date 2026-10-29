import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Truck } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:h-[88vh] md:min-h-[680px] lg:h-[92vh] lg:min-h-[720px] bg-[#0E0C0B] overflow-hidden flex flex-col md:flex-row items-stretch">
      
      {/* ======================================================== */}
      {/* DESKTOP BACKGROUND & IMAGE LAYOUT (md and above)         */}
      {/* Model sits cleanly on the right half - 100% unobstructed */}
      {/* ======================================================== */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[52%] lg:w-[55%] xl:w-[58%] h-full z-0 overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="/images/home-banner.png"
          alt="Tarini Fine Jewellery - Model wearing Diamond Necklace and Earrings"
          className="w-full h-full object-cover object-[center_top] lg:object-[center_10%]"
        />
        {/* Soft luxury feather gradients:
            - Left fade: smoothly blends the image edge into the left dark section 
            - Bottom subtle fade: blends into the next section */}
        <div className="absolute inset-y-0 left-0 w-36 lg:w-48 bg-gradient-to-r from-[#0E0C0B] via-[#0E0C0B]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0E0C0B] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0E0C0B]/40 to-transparent pointer-events-none" />
      </div>

      {/* ======================================================== */}
      {/* MOBILE BACKGROUND & IMAGE LAYOUT (< md)                  */}
      {/* Image in background with top focus so face/earrings are  */}
      {/* clearly framed in the upper safe-zone                    */}
      {/* ======================================================== */}
      <div className="md:hidden absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="/images/home-banner.png"
          alt="Tarini Fine Jewellery - Model wearing Diamond Necklace and Earrings"
          className="w-full h-full object-cover object-[center_2%]"
        />
        {/* Mobile Gradient: Top 50% is transparent so face and necklace are crystal clear.
            Bottom 50% has rich dark gradient for legible typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B] via-[#0E0C0B]/85 via-45% to-transparent pointer-events-none" />
      </div>

      {/* ======================================================== */}
      {/* CONTENT LAYER                                            */}
      {/* Desktop: Left-aligned editorial column                   */}
      {/* Mobile: Bottom-anchored luxury sheet                     */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-end md:justify-center">
        <div className="container-luxury w-full px-5 sm:px-8 lg:px-14 py-8 sm:py-12 md:py-16">
          <div className="max-w-xl lg:max-w-[540px] xl:max-w-[580px] text-center md:text-left flex flex-col items-center md:items-start">
            
            {/* Luxury Brand Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 mb-3 md:mb-4"
            >
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37] font-montserrat">
                Tarini Haute Joaillerie
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="font-cinzel text-[#FDFBF7] text-[30px] sm:text-[40px] md:text-[48px] lg:text-[58px] font-normal leading-[1.08] mb-3 md:mb-4 tracking-[0.04em] uppercase"
              style={{ textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}
            >
              Timeless <br className="hidden sm:inline" />
              Elegance
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="font-montserrat text-[#E5DFD7] text-[12px] sm:text-[13px] md:text-[14px] font-light leading-relaxed tracking-wider mb-6 sm:mb-8 max-w-md"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              Handcrafted lab-grown diamonds and fine gold jewellery designed to celebrate life's most precious everyday moments and grand milestones.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <Link
                to="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-9 sm:py-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C158] text-[#141210] text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl font-montserrat rounded-[2px] group"
              >
                <span>Explore Collection</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/category/rings"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 bg-white/5 hover:bg-white/15 text-[#FDFBF7] text-[11px] sm:text-[12px] font-medium tracking-[0.18em] uppercase border border-[#FDFBF7]/35 hover:border-[#FDFBF7] transition-all duration-300 font-montserrat rounded-[2px] backdrop-blur-xs"
              >
                Diamond Rings
              </Link>
            </motion.div>

            {/* Desktop Trust Pillars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="hidden sm:flex items-center gap-4 lg:gap-5 mt-7 pt-5 border-t border-white/10 text-[10px] text-[#C5BDB5] font-montserrat tracking-wider uppercase"
            >
              <span className="flex items-center gap-1.5">
                <Award size={13} className="text-[#C5A059]" /> IGI Certified Diamonds
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#C5A059]" /> 100% BIS Hallmarked
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-[#C5A059]" /> Insured Delivery
              </span>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
