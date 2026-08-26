import { Link, useLocation } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Shield, Lock, RefreshCw, HeartHandshake } from 'lucide-react';

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-[14px] text-[#1F1517] font-[500] uppercase tracking-[0.10em] hover:text-[#1F1517] transition-colors"
      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="bg-[#FDFBF7]">
      {/* ── TRUST & BENEFITS STRIP ────────────────────────────────────────── */}
      {isHomePage && (
        <div className="border-t border-[#EAE6DF]">
          <div className="container-luxury pt-16 pb-24 lg:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-6 text-center">
              
              <div className="flex flex-col items-center">
                <Shield size={24} strokeWidth={1.5} className="text-[#C5A059] mb-4" />
                <h4 className="text-[13px] font-[600] text-[#1F1517] uppercase tracking-[0.05em] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  AUTHENTIC CRAFTSMANSHIP
                </h4>
                <p className="text-[13px] text-[#1F1517] font-[400] max-w-[200px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Thoughtfully designed jewellery made with attention to detail.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <Lock size={24} strokeWidth={1.5} className="text-[#C5A059] mb-4" />
                <h4 className="text-[13px] font-[600] text-[#1F1517] uppercase tracking-[0.05em] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  SECURE PAYMENTS
                </h4>
                <p className="text-[13px] text-[#1F1517] font-[400] max-w-[200px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Safe and secure checkout experience.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <RefreshCw size={24} strokeWidth={1.5} className="text-[#C5A059] mb-4" />
                <h4 className="text-[13px] font-[600] text-[#1F1517] uppercase tracking-[0.05em] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  EASY RETURNS
                </h4>
                <p className="text-[13px] text-[#1F1517] font-[400] max-w-[200px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Simple and transparent return experience.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <HeartHandshake size={24} strokeWidth={1.5} className="text-[#C5A059] mb-4" />
                <h4 className="text-[13px] font-[600] text-[#1F1517] uppercase tracking-[0.05em] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  CARE & SUPPORT
                </h4>
                <p className="text-[13px] text-[#1F1517] font-[400] max-w-[200px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Dedicated customer support whenever you need us.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── NEWSLETTER SECTION ────────────────────────────────────────────── */}
      <div className="border-t border-[#EAE6DF] mt-8 lg:mt-0">
        <div className="container-luxury pt-20 pb-20 lg:py-24 flex flex-col items-center text-center">
          <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-[#1F1517] font-[500] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Stay Close to TARINI
          </h2>
          <p className="text-[14px] text-[#1F1517] font-[400] max-w-md mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Discover new collections, thoughtful designs and stories from TARINI JEWELLERS.
          </p>
          <form className="flex w-full max-w-md border-b border-[#1F1517] pb-2 group relative overflow-visible" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#1F1517] placeholder:text-[#1F1517] font-[400]" 
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              required 
            />
            <button 
              type="submit" 
              className="text-[13px] text-[#1F1517] font-[600] uppercase tracking-[0.08em] hover:text-[#C5A059] transition-colors pl-4"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Subscribe
            </button>
            <div className="absolute bottom-[-1px] left-0 w-0 h-[1.5px] bg-[#C5A059] transition-all duration-500 ease-out group-hover:w-full" />
          </form>
        </div>
      </div>

      {/* ── MAIN FOOTER ───────────────────────────────────────────────────── */}
      <footer className="pt-20 pb-10 bg-[#FDFBF7] text-[#1F1517] border-t border-[#EAE6DF]">
        <div className="container-luxury max-w-[1400px]">
          
          {/* Top Brand Area */}
          <div className="text-center mb-20 flex flex-col items-center">
            <Link to="/" className="flex flex-col items-center justify-center group mb-10">
              <svg viewBox="0 0 24 24" className="w-8 h-8 lg:w-10 lg:h-10 text-[#111] group-hover:text-[#C5A059] transition-colors duration-500 mb-2" fill="currentColor">
                <path d="M12 0C12 5.5 16.5 10 22 10C16.5 10 12 14.5 12 24C12 14.5 7.5 10 2 10C7.5 10 12 5.5 12 0Z" />
              </svg>
              <span className="text-[46px] lg:text-[60px] font-light tracking-[0.15em] text-[#111] group-hover:text-[#C5A059] transition-colors duration-500 leading-none pl-[0.15em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                तारिणी
              </span>
            </Link>
            <div className="flex justify-center gap-6 text-[#1F1517]">
              <motion.a whileHover={{ scale: 1.15, color: '#1F1517' }} href="#" className="transition-colors duration-300 p-2"><FiInstagram size={20} strokeWidth={1.5} /></motion.a>
              <motion.a whileHover={{ scale: 1.15, color: '#1F1517' }} href="#" className="transition-colors duration-300 p-2"><FiFacebook size={20} strokeWidth={1.5} /></motion.a>
              <motion.a whileHover={{ scale: 1.15, color: '#1F1517' }} href="#" className="transition-colors duration-300 p-2"><FaPinterestP size={20} /></motion.a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 text-left mb-20 px-2 sm:px-0">
            <div>
              <h4 className="text-[13px] font-[700] uppercase tracking-[0.08em] text-[#1F1517] mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>SHOP</h4>
              <ul className="space-y-4">
                <li><FooterLink to="/category/rings">RINGS</FooterLink></li>
                <li><FooterLink to="/category/necklaces">NECKLACES</FooterLink></li>
                <li><FooterLink to="/category/earrings">EARRINGS</FooterLink></li>
                <li><FooterLink to="/category/bracelets">BRACELETS</FooterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-[700] uppercase tracking-[0.08em] text-[#1F1517] mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>ABOUT</h4>
              <ul className="space-y-4">
                <li><FooterLink to="/about">OUR STORY</FooterLink></li>
                <li><FooterLink to="/about">OUR MATERIALS</FooterLink></li>
                <li><FooterLink to="/about">JOURNAL</FooterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-[700] uppercase tracking-[0.08em] text-[#1F1517] mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>HELP</h4>
              <ul className="space-y-4">
                <li><FooterLink to="/contact">CONTACT US</FooterLink></li>
                <li><FooterLink to="/shipping">SHIPPING</FooterLink></li>
                <li><FooterLink to="/returns">RETURNS</FooterLink></li>
                <li><FooterLink to="/faqs">FAQS</FooterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-[700] uppercase tracking-[0.08em] text-[#1F1517] mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>LEGAL</h4>
              <ul className="space-y-4">
                <li><FooterLink to="/privacy">PRIVACY POLICY</FooterLink></li>
                <li><FooterLink to="/terms">TERMS OF SERVICE</FooterLink></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="text-center pt-8">
            <p className="text-[11px] lg:text-[12px] tracking-[0.10em] uppercase text-[#1F1517] font-[500]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              © 2026 TARINI JEWELLERS. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
