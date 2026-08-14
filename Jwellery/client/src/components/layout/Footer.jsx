import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { productService } from '../../services/productService';

// Premium animated underline footer link
function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="footer-link-animated relative inline-block text-[15px] lg:text-[16px] text-[#746760] hover:text-[#560817] font-light transition-colors duration-[250ms]"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeatured({ limit: 8 }).then((r) => r.data).catch(() => null),
    staleTime: 5 * 60_000,
  });

  const fallbackItems = [
    {
      _id: 'fb1',
      name: 'Classic Solitaire Diamond Ring',
      slug: 'classic-solitaire-diamond-ring',
      category: { name: 'Signature Rings' },
      images: [{ url: '/images/products/ring_solitaire.jpg' }]
    },
    {
      _id: 'fb2',
      name: 'Royal Sapphire Pendant Necklace',
      slug: 'royal-sapphire-pendant-necklace',
      category: { name: 'Gold Necklaces' },
      images: [{ url: '/images/products/necklace_sapphire.jpg' }]
    },
    {
      _id: 'fb3',
      name: '18K Yellow Gold Hoop Earrings',
      slug: '18k-yellow-gold-hoop-earrings',
      category: { name: 'Everyday Earrings' },
      images: [{ url: '/images/products/earrings_hoop.jpg' }]
    },
    {
      _id: 'fb4',
      name: 'Emerald Cut Tennis Bracelet',
      slug: 'emerald-cut-tennis-bracelet',
      category: { name: 'Tennis Bracelets' },
      images: [{ url: '/images/products/bracelet_tennis.jpg' }]
    }
  ];

  const trendingItems = featuredData?.bestSellers?.length > 0 ? featuredData.bestSellers : fallbackItems;

  // Animation variants
  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const eyebrowReveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const headingReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] } }
  };

  const dividerReveal = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.7, delay: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] } }
  };

  const subTextReveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: shouldReduceMotion ? 0 : 0.36, ease: 'easeOut' } }
  };

  const colReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const colContainer = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1, delayChildren: shouldReduceMotion ? 0 : 0.1 } }
  };

  return (
    <footer className="relative pt-[100px] lg:pt-[120px] pb-[80px] lg:pb-[100px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF6EE 0%, #F8F4EC 50%, #FAF6EE 100%)' }}>
      
      {/* ── Subtle Decorative Background Gradients ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] rounded-full blur-[100px] bg-[radial-gradient(circle_at_center,rgba(176,138,69,0.03),transparent_60%)] -top-[200px] -left-[200px]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] bg-[radial-gradient(circle_at_center,rgba(176,138,69,0.04),transparent_60%)] bottom-[10%] -right-[100px]"></div>
      </div>

      <div className="container-luxury max-w-[1280px] relative z-10">
        
        {/* ── Main Editorial Heading ── */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.span variants={eyebrowReveal} className="text-[#B08A45] text-[10px] lg:text-[11px] tracking-[0.20em] font-medium uppercase mb-5 block">
            TARINI EDIT
          </motion.span>
          <motion.h2 variants={headingReveal} style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[23px] sm:text-[27px] lg:text-[32px] text-[#560817] font-normal mb-3 tracking-wide">
            Jewellery that moves with you.
          </motion.h2>
          <motion.div variants={dividerReveal} style={{ originX: 0.5 }} className="w-12 h-[1px] bg-[#B08A45] mx-auto my-4" />
          <motion.p variants={subTextReveal} className="text-[#B08A45] text-[10px] lg:text-[11px] font-medium tracking-[0.20em] uppercase relative inline-block">
            DESIGNED FOR EVERY CHAPTER OF YOUR STORY.
          </motion.p>
        </motion.div>

        {/* ── Trending Section ── */}
        {trendingItems.length > 0 && (
          <div className="mb-8">
            
            {/* LIVE Indicator */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#B08A45] opacity-60 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                <span className="relative inline-flex rounded-full w-2 h-2 bg-[#B08A45]"></span>
              </div>
              <h3 className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#560817] font-medium">
                LIVE <span className="font-light ml-2 opacity-90 text-[#746760]">Trending pieces this week</span>
              </h3>
            </div>
            
            {/* ── Horizontal Infinite Marquee (Restored Animation) ── */}
            <div className="group flex overflow-hidden -mx-6 px-6 md:mx-0 md:px-0">
              <div className="flex shrink-0 items-center gap-4 md:gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max">
                {/* Duplicate the array multiple times to ensure smooth infinite scroll */}
                {[...trendingItems, ...trendingItems, ...trendingItems].map((item, index) => {
                  // Maintain the elegant rhythm even in the marquee
                  const isLarge = (index % 4 === 0) || (index % 4 === 3);
                  return (
                    <Link 
                      key={`${item._id}-${index}`}
                      to={`/products/${item.slug}`} 
                      className="flex-shrink-0 block w-[260px] md:w-[280px] group/card bg-white rounded-[2px] overflow-hidden border border-[#FAF6EE] shadow-[0_12px_35px_rgba(86,8,23,0.02)] hover:shadow-[0_20px_45px_rgba(86,8,23,0.04)] hover:border-[#B59A68]/30 hover:-translate-y-1 transition-all duration-[450ms] ease-out flex flex-col"
                    >
                      <div className={`relative overflow-hidden bg-[#F8F4EC] w-full ${isLarge ? 'aspect-[4/5] md:aspect-[3/4]' : 'aspect-square'}`}>
                        <img src={item.images?.[0]?.url || '/placeholder.jpg'} className="w-full h-full object-cover transition-transform duration-[450ms] ease-out group-hover/card:scale-[1.02]" alt={item.name} />
                      </div>
                      
                      <div className="p-5 md:p-6 flex flex-col justify-between flex-1 bg-white border-t border-[#FAF6EE]">
                        <div>
                          <p className="text-[9px] text-[#B59A68] tracking-[0.12em] uppercase mb-1.5 font-medium">
                            {item.category?.name || 'Signature'}
                          </p>
                          <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#332B27] font-medium text-[15px] md:text-[16px] line-clamp-1 mb-3">
                            {item.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#3A0508] uppercase tracking-[0.12em] font-medium group/cta">
                          <span>Shop Now</span>
                          <FiArrowRight size={14} className="text-[#B59A68] transform transition-transform duration-300 group-hover/card:translate-x-1.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* ── Section CTA ── */}
            <div className="text-center mt-8 md:mt-12 mb-20">
              <Link to="/products" className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[#560817] text-[#560817] text-[11px] lg:text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#560817] hover:text-white transition-colors duration-300 rounded-[2px] shadow-sm">
                EXPLORE THE COLLECTION <FiArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        )}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FAF6EE] to-transparent mb-16"></div>

        {/* ── Footer Navigation ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-16"
          variants={colContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Brand Column */}
          <motion.div variants={colReveal} className="lg:col-span-2 md:pr-10">
            <Link to="/" className="inline-block mb-6">
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl tracking-[0.2em] font-normal text-[#560817]">
                TARINI
              </span>
              <p className="text-[10px] text-[#B08A45] tracking-[0.20em] uppercase mt-1.5 font-medium">
                JEWELLERS
              </p>
            </Link>
            <p className="text-[16px] lg:text-[17px] text-[#746760] font-light max-w-sm mb-8 leading-relaxed">
              Jewellery for every chapter of your story. Designed with elegance and crafted for everyday luxury.
            </p>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={colReveal}>
            <h4 className="text-[12px] lg:text-[13px] font-medium uppercase tracking-[0.12em] text-[#560817] mb-6">Shop</h4>
            <ul className="space-y-4">
              <li className="group"><FooterLink to="/category/rings">Rings</FooterLink></li>
              <li className="group"><FooterLink to="/category/necklaces">Necklaces</FooterLink></li>
              <li className="group"><FooterLink to="/category/earrings">Earrings</FooterLink></li>
              <li className="group"><FooterLink to="/category/bracelets">Bracelets</FooterLink></li>
              <li className="group"><FooterLink to="/products?sort=-createdAt">New Arrivals</FooterLink></li>
              <li className="group"><FooterLink to="/products?sort=-rating">Bestsellers</FooterLink></li>
            </ul>
          </motion.div>

          {/* Help Links */}
          <motion.div variants={colReveal}>
            <h4 className="text-[12px] lg:text-[13px] font-medium uppercase tracking-[0.12em] text-[#560817] mb-6">Help</h4>
            <ul className="space-y-4">
              <li className="group"><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li className="group"><FooterLink to="/shipping">Shipping</FooterLink></li>
              <li className="group"><FooterLink to="/returns">Returns</FooterLink></li>
              <li className="group"><FooterLink to="/faqs">FAQs</FooterLink></li>
              <li className="group"><FooterLink to="/about">Size Guide</FooterLink></li>
            </ul>
          </motion.div>

          {/* About Links + Social */}
          <motion.div variants={colReveal}>
            <h4 className="text-[12px] lg:text-[13px] font-medium uppercase tracking-[0.12em] text-[#560817] mb-6">About</h4>
            <ul className="space-y-4">
              <li className="group"><FooterLink to="/about">Our Story</FooterLink></li>
              <li className="group"><FooterLink to="/about">Our Materials</FooterLink></li>
              <li className="group"><FooterLink to="/about">Journal</FooterLink></li>
            </ul>
            
            <h4 className="text-[12px] lg:text-[13px] font-medium uppercase tracking-[0.12em] text-[#560817] mb-4 mt-10">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full border border-[#FAF6EE] flex items-center justify-center text-[#560817] hover:text-white hover:border-[#560817] hover:bg-[#560817] bg-[#F8F4EC] transition-all duration-300">
                <FiInstagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-[#FAF6EE] flex items-center justify-center text-[#560817] hover:text-white hover:border-[#560817] hover:bg-[#560817] bg-[#F8F4EC] transition-all duration-300">
                <FiFacebook size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-[#FAF6EE] flex items-center justify-center text-[#560817] hover:text-white hover:border-[#560817] hover:bg-[#560817] bg-[#F8F4EC] transition-all duration-300">
                <FiTwitter size={14} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FAF6EE] to-transparent mb-8"></div>

        {/* ── Copyright & Legal ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
        >
          <p className="text-[12px] lg:text-[13px] tracking-[0.15em] uppercase text-[#746760] font-light">
            © {new Date().getFullYear()} TARINI JEWELLERS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[12px] lg:text-[13px] tracking-[0.15em] uppercase text-[#746760] font-light">
            <Link to="/privacy" className="hover:text-[#560817] transition-colors duration-[250ms]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#560817] transition-colors duration-[250ms]">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

