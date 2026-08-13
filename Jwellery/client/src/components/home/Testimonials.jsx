import { motion, useReducedMotion } from 'framer-motion';
import { TESTIMONIALS } from '../../constants';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();

  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] } }
  };

  const dividerReveal = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
      className="py-20 bg-[#F8F4EC]/30 border-t border-[#FAF6EE] overflow-hidden"
    >
      <div className="container-luxury">
        {/* Section heading with premium reveal */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="w-[2px] h-8 bg-[#560817]" />
          <div>
            <motion.h2 variants={headingReveal} className="text-[22px] sm:text-[26px] lg:text-[30px] font-normal text-[#560817]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What Our Customers Say</motion.h2>
            <motion.div variants={dividerReveal} style={{ originX: 0 }} className="w-10 h-[1px] bg-[#B08A45] mt-2" />
          </div>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          grabCursor
          centeredSlides={false}
          slidesPerView={1}
          spaceBetween={16}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640:  { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="pb-10"
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-white rounded-[2px] p-6 sm:p-7 border border-[#FAF6EE] shadow-sm hover:shadow-md transition-all duration-[450ms] h-full min-h-[260px] flex flex-col justify-between">
                {/* Top: Stars + Quote */}
                <div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="#B08A45" className="text-[#B08A45]" />
                    ))}
                  </div>

                  {/* Quote icon */}
                  <Quote size={20} className="text-[#560817]/10 mb-2" />

                  {/* Text */}
                  <p className="text-[#746760] text-[13px] lg:text-[14px] leading-relaxed italic font-light">
                    "{t.text}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#FAF6EE]">
                  <div className="relative flex-shrink-0">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name}
                           className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F8F4EC]" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#560817] to-[#FAF6EE] flex items-center justify-center text-white text-sm font-medium">
                        {t.initials}
                      </div>
                    )}
                    {t.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#560817] rounded-full flex items-center justify-center">
                        <svg width="7" height="5" viewBox="0 0 10 8" fill="white">
                          <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[#181516] text-sm font-medium">{t.name}</p>
                    <p className="text-[#746760] text-[11px] font-light">{t.location} · {t.purchase}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
}
