import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';
import { motion } from 'framer-motion';

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-[11px] lg:text-[12px] text-[#756869] uppercase tracking-[0.1em] hover:text-[#C9A96E] transition-colors"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 bg-[#F8F4EE] text-[#35050D] border-t border-[#EAE6DF]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        
        {/* Top Section */}
        <div className="text-center mb-20 flex flex-col items-center">
          <Link to="/" className="inline-block mb-8">
            <span
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl lg:text-5xl tracking-[0.15em] font-normal text-[#35050D] block mb-2"
            >
              TARINI
            </span>
            <span className="text-[10px] text-[#C9A96E] tracking-[0.4em] uppercase block font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              JEWELLERS
            </span>
          </Link>
          <div className="flex justify-center gap-8">
            <motion.a whileHover={{ scale: 1.1, color: '#C9A96E' }} href="#" className="text-[#35050D] transition-colors"><FiInstagram size={20} strokeWidth={1.5} /></motion.a>
            <motion.a whileHover={{ scale: 1.1, color: '#C9A96E' }} href="#" className="text-[#35050D] transition-colors"><FiFacebook size={20} strokeWidth={1.5} /></motion.a>
            <motion.a whileHover={{ scale: 1.1, color: '#C9A96E' }} href="#" className="text-[#35050D] transition-colors"><FaPinterestP size={20} /></motion.a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left mb-20">
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#35050D] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>Shop</h4>
            <ul className="space-y-5">
              <li><FooterLink to="/category/rings">Rings</FooterLink></li>
              <li><FooterLink to="/category/necklaces">Necklaces</FooterLink></li>
              <li><FooterLink to="/category/earrings">Earrings</FooterLink></li>
              <li><FooterLink to="/category/bracelets">Bracelets</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#35050D] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>About</h4>
            <ul className="space-y-5">
              <li><FooterLink to="/about">Our Story</FooterLink></li>
              <li><FooterLink to="/about">Our Materials</FooterLink></li>
              <li><FooterLink to="/about">Journal</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#35050D] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>Help</h4>
            <ul className="space-y-5">
              <li><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li><FooterLink to="/shipping">Shipping</FooterLink></li>
              <li><FooterLink to="/returns">Returns</FooterLink></li>
              <li><FooterLink to="/faqs">FAQs</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#35050D] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>Legal</h4>
            <ul className="space-y-5">
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center border-t border-[#EAE6DF] pt-10">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#756869]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            © {new Date().getFullYear()} TARINI JEWELLERS. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
