import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';
import { FaPinterestP, FaCcVisa, FaCcMastercard } from 'react-icons/fa';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', to: '/products' },
    { label: 'Rings', to: '/category/rings' },
    { label: 'Earrings', to: '/category/earrings' },
    { label: 'Necklaces', to: '/category/necklaces' },
    { label: 'Bracelets', to: '/category/bracelets' },
    { label: 'Collections', to: '/collections' }
  ],
  customerCare: [
    { label: 'Shipping', to: '/shipping-policy' },
    { label: 'Returns', to: '/return-policy' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Size Guide', to: '/size-guide' },
    { label: 'Care Guide', to: '/care-guide' }
  ],
  about: [
    { label: 'Our Story', to: '/about' },
    { label: 'About Tarini', to: '/about' },
    { label: 'Craftsmanship', to: '/about' },
    { label: 'Contact Us', to: '/contact' }
  ],
  social: [
    { label: 'Instagram', icon: <FiInstagram size={14} />, to: '#' },
    { label: 'Facebook', icon: <FiFacebook size={14} />, to: '#' },
    { label: 'Pinterest', icon: <FaPinterestP size={14} />, to: '#' }
  ]
};

function FooterAccordion({ title, links, isSocial = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#C6A15B]/10 md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <span className="text-[11px] font-medium text-[#C6A15B] uppercase tracking-[0.2em] font-sans">
          {title}
        </span>
        <span className="text-[#C6A15B]">
          {isOpen ? <FiMinus size={16} /> : <FiPlus size={16} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        {isSocial ? (
           <div className="flex items-center gap-4 pt-2">
              {links.map((link, idx) => (
                <a key={idx} href={link.to} className="w-10 h-10 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B]/40 hover:bg-[#C6A15B] hover:border-[#C6A15B] hover:text-[#1A1512] transition-all duration-300">
                  {link.icon}
                </a>
              ))}
           </div>
        ) : (
          <ul className="flex flex-col space-y-4">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link to={link.to} className="text-[13px] text-[#E8E1D6] hover:text-[#E4C989] hover:translate-x-1.5 transition-transform duration-200 inline-block font-sans">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#1A1512] overflow-hidden">
      {/* Subtle radial glow background behind the logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C6A15B] opacity-[0.04] blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Noise Texture Overlay for depth */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen"></div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pt-28 pb-10">
        
        {/* TOP: Brand Statement & Newsletter */}
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-[44px] md:text-[54px] text-[#E8E1D6] mb-4 tracking-[0.2em] md:tracking-[0.25em] hover:drop-shadow-[0_0_15px_rgba(198,161,91,0.3)] transition-all duration-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            TARINI
          </h2>
          <p className="text-[15px] md:text-[17px] text-[#8A8177] italic max-w-lg tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Timeless fine jewellery designed to celebrate every moment.
          </p>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/20 to-transparent my-16"></div>

          <div className="flex flex-col items-center w-full max-w-md">
            <h3 className="text-[13px] text-[#C6A15B] uppercase tracking-[0.15em] mb-6 font-sans">Join the TARINI Circle</h3>
            <form className="w-full flex items-center border-b border-[#C6A15B]/20 pb-3 group focus-within:border-[#C6A15B] transition-colors duration-300" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#E8E1D6] placeholder-[#8A8177] font-light tracking-wide px-2"
              />
              <button type="submit" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#C6A15B] hover:text-[#E4C989] transition-colors px-2 flex items-center gap-1.5">
                Subscribe <FiArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* MIDDLE: Desktop Navigation */}
        <div className="hidden md:grid grid-cols-4 gap-12 lg:gap-16 mb-24">
          <div>
            <h4 className="text-[11px] font-medium text-[#C6A15B] uppercase tracking-[0.2em] mb-8 font-sans">Shop</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[13px] text-[#E8E1D6] hover:text-[#E4C989] hover:translate-x-1.5 transition-transform duration-200 inline-block font-sans">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium text-[#C6A15B] uppercase tracking-[0.2em] mb-8 font-sans">About</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[13px] text-[#E8E1D6] hover:text-[#E4C989] hover:translate-x-1.5 transition-transform duration-200 inline-block font-sans">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium text-[#C6A15B] uppercase tracking-[0.2em] mb-8 font-sans">Customer Care</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.customerCare.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[13px] text-[#E8E1D6] hover:text-[#E4C989] hover:translate-x-1.5 transition-transform duration-200 inline-block font-sans">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium text-[#C6A15B] uppercase tracking-[0.2em] mb-8 font-sans">Connect</h4>
            <div className="flex items-center gap-4">
              {footerLinks.social.map((link, idx) => (
                <a key={idx} href={link.to} className="w-10 h-10 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B]/40 hover:bg-[#C6A15B] hover:border-[#C6A15B] hover:text-[#1A1512] transition-all duration-300">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: Mobile Accordion */}
        <div className="block md:hidden mb-20 border-t border-[#C6A15B]/10">
          <FooterAccordion title="Shop" links={footerLinks.shop} />
          <FooterAccordion title="About" links={footerLinks.about} />
          <FooterAccordion title="Customer Care" links={footerLinks.customerCare} />
          <FooterAccordion title="Connect" links={footerLinks.social} isSocial={true} />
        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t border-[#C6A15B]/10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
          <div className="flex items-center gap-6 text-[#8A8177]">
            <div className="text-[11px] font-sans tracking-wide">
              <span>© {new Date().getFullYear()} TARINI. All Rights Reserved.</span>
            </div>
            {/* Subtle Payment Icons */}
            <div className="hidden md:flex items-center gap-3">
              <FaCcVisa size={20} />
              <FaCcMastercard size={20} />
              <span className="text-[10px] border border-current rounded-[2px] px-1.5 py-[1px] font-bold tracking-wider">UPI</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center text-[11px] text-[#E8E1D6] font-sans tracking-wide">
            <Link to="/privacy-policy" className="hover:text-[#E4C989] transition-colors duration-200">Privacy Policy</Link>
            <span className="mx-3 text-[#C6A15B]">•</span>
            <Link to="/terms" className="hover:text-[#E4C989] transition-colors duration-200">Terms & Conditions</Link>
            <span className="mx-3 text-[#C6A15B]">•</span>
            <Link to="/shipping-policy" className="hover:text-[#E4C989] transition-colors duration-200">Shipping</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
