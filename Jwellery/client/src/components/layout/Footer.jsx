import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiArrowRight } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { productService } from '../../services/productService';

// Premium animated underline footer link
function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{ fontFamily: "'Manrope', sans-serif" }}
      className="footer-link-animated relative inline-block text-[13px] text-gray-400 font-[400] hover:text-white transition-colors duration-[250ms]"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  
  const colReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const colContainer = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1, delayChildren: shouldReduceMotion ? 0 : 0.1 } }
  };

  return (
    <footer className="relative pt-[80px] lg:pt-[100px] pb-[60px] lg:pb-[80px] overflow-hidden bg-[#111111] text-white">
      <div className="container-luxury max-w-[1400px] relative z-10">
        
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
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-[28px] lg:text-[32px] tracking-[0.18em] font-[500] text-white leading-none block"
              >
                TARINI
              </span>
              <p
                style={{ fontFamily: "'Manrope', sans-serif" }}
                className="text-[8px] text-gray-400 tracking-[0.28em] uppercase mt-2 font-[600]"
              >
                JEWELLERS
              </p>
            </Link>
            <p
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[13px] text-gray-400 font-[400] max-w-sm mb-8 leading-[1.75]"
            >
              Jewellery for every chapter of your story. Designed with elegance and crafted for everyday luxury.
            </p>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={colReveal}>
            <h4
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[10px] lg:text-[11px] font-[600] uppercase tracking-[0.14em] text-white mb-6"
            >
              Shop
            </h4>
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
            <h4
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[10px] lg:text-[11px] font-[600] uppercase tracking-[0.14em] text-white mb-6"
            >
              Help
            </h4>
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
            <h4
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="text-[10px] lg:text-[11px] font-[600] uppercase tracking-[0.14em] text-white mb-6"
            >
              About
            </h4>
            <ul className="space-y-4">
              <li className="group"><FooterLink to="/about">Our Story</FooterLink></li>
              <li className="group"><FooterLink to="/about">Our Materials</FooterLink></li>
              <li className="group"><FooterLink to="/about">Journal</FooterLink></li>
            </ul>
            
            <h4 className="text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.1em] text-white mb-4 mt-10">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaPinterestP size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="font-bold text-[16px] leading-none">X</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* ── Copyright & Legal ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
        >
          <p className="text-[10px] lg:text-[11px] tracking-[0.1em] uppercase text-gray-500 font-medium">
            © {new Date().getFullYear()} TARINI JEWELLERS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] lg:text-[11px] tracking-[0.1em] uppercase text-gray-500 font-medium">
            <Link to="/privacy" className="hover:text-white transition-colors duration-[250ms]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-[250ms]">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
