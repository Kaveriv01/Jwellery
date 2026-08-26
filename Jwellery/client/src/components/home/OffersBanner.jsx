import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DEFAULT_OFFERS = [
  {
    id: 1,
    title: 'Bridal Splendour',
    subtitle: '✦ Up to 30% Off',
    description: 'Exclusive wedding & bridal collections',
    image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900&q=85',
    link: '/category/wedding',
    bg: 'from-[#1a0a0a]/80',
  },
  {
    id: 2,
    title: 'Silver Heritage',
    subtitle: '✦ Starting ₹499',
    description: '925 Sterling Silver — BIS Certified',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=85',
    link: '/products?material=Silver',
    bg: 'from-[#0a0a12]/80',
  },
];

export default function OffersBanner({ banners = [] }) {
  const offers = banners.length >= 2 ? banners.slice(0, 2) : DEFAULT_OFFERS;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="container-luxury py-12">
      {/* GIVA-style heading */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-[2px] h-8 bg-[#560817]" />
        <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-normal text-[#560817]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Special Offers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.id || offer._id}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: shouldReduceMotion ? 0 : i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2px] group border border-[#FDFBF7]"
            style={{ aspectRatio: '16/8' }}
          >
            <img
              src={offer.image?.url || offer.image}
              alt={offer.title}
              className={`w-full h-full object-cover transition-transform duration-[450ms] ease-out ${shouldReduceMotion ? '' : 'group-hover:scale-[1.02]'}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${offer.bg || 'from-black/70'} to-transparent`} />
            <div className="absolute inset-0 p-7 sm:p-8 flex flex-col justify-center">
              <p className="text-[#C8A866] text-[10px] lg:text-[11px] tracking-[0.20em] uppercase mb-1.5 font-medium">{offer.subtitle}</p>
              <h3 className="text-white text-[20px] sm:text-[24px] font-normal mb-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{offer.title}</h3>
              <p className="text-white/70 text-[13px] font-light mb-5">{offer.description}</p>
              <motion.div
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="w-fit"
              >
                <Link
                  to={offer.link || '/products'}
                  className="inline-flex items-center gap-2 text-[11px] lg:text-[12px] tracking-[0.12em] uppercase text-white bg-[#560817] hover:bg-[#3D0610] px-5 py-2.5 rounded-[2px] border-b-2 border-transparent hover:border-[#B08A45] transition-all duration-[250ms] ease-out w-fit font-medium shadow-md shadow-black/30 hover:-translate-y-[2px]"
                >
                  Shop Now <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
