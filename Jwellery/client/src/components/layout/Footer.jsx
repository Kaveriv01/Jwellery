import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPlus, FiMinus } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';

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
    { label: 'Instagram', icon: <FiInstagram size={16} />, to: '#' },
    { label: 'Facebook', icon: <FiFacebook size={16} />, to: '#' },
    { label: 'Pinterest', icon: <FaPinterestP size={16} />, to: '#' }
  ]
};

function FooterAccordion({ title, links, isSocial = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <span className="text-[13px] font-medium text-white uppercase tracking-[0.1em] font-sans">
          {title}
        </span>
        <span className="text-[#D8CFC7]">
          {isOpen ? <FiMinus size={16} /> : <FiPlus size={16} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <ul className="flex flex-col space-y-4">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link to={link.to} className="text-[14px] text-[#D8CFC7] hover:text-[#C9B28A] transition-colors flex items-center gap-3 font-sans">
                {isSocial && <span className="text-[#D8CFC7] group-hover:text-[#B79A6B] transition-colors">{link.icon}</span>}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#211719] pt-20 pb-10 border-t border-[#DED3C4]/20">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 xl:px-12">
        
        {/* TOP: Brand Statement */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <h2 className="text-[32px] md:text-[44px] text-white mb-4 tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            TARINI
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#D8CFC7] italic max-w-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Timeless fine jewellery designed to celebrate every moment.
          </p>
        </div>

        <div className="w-full h-px bg-white/10 mb-12 md:mb-16"></div>

        {/* MIDDLE: Desktop Navigation */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-20">
          <div>
            <h4 className="text-[12px] font-medium text-white uppercase tracking-[0.15em] mb-8 font-sans">SHOP</h4>
            <ul className="flex flex-col space-y-5">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#D8CFC7] hover:text-[#C9B28A] transition-colors font-sans block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-medium text-white uppercase tracking-[0.15em] mb-8 font-sans">ABOUT</h4>
            <ul className="flex flex-col space-y-5">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#D8CFC7] hover:text-[#C9B28A] transition-colors font-sans block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-medium text-white uppercase tracking-[0.15em] mb-8 font-sans">CUSTOMER CARE</h4>
            <ul className="flex flex-col space-y-5">
              {footerLinks.customerCare.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#D8CFC7] hover:text-[#C9B28A] transition-colors font-sans block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-medium text-white uppercase tracking-[0.15em] mb-8 font-sans">CONNECT</h4>
            <ul className="flex flex-col space-y-5">
              {footerLinks.social.map((link, idx) => (
                <li key={idx}>
                  <a href={link.to} className="text-[14px] text-[#D8CFC7] hover:text-[#C9B28A] transition-all duration-400 flex items-center gap-3 font-sans group">
                    <span className="text-[#D8CFC7] group-hover:text-[#B79A6B] transition-colors">{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* MIDDLE: Mobile Accordion */}
        <div className="block md:hidden mb-16">
          <div className="border-t border-white/10">
            <FooterAccordion title="SHOP" links={footerLinks.shop} />
            <FooterAccordion title="ABOUT" links={footerLinks.about} />
            <FooterAccordion title="CUSTOMER CARE" links={footerLinks.customerCare} />
            <FooterAccordion title="CONNECT" links={footerLinks.social} isSocial={true} />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[12px] text-[#A99D95] font-sans text-center md:text-left">
            <span>© 2026 TARINI. All Rights Reserved.</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-5 md:gap-8 text-[12px] text-[#D8CFC7] font-sans">
            <Link to="/privacy-policy" className="hover:text-[#C9B28A] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#C9B28A] transition-colors">Terms & Conditions</Link>
            <Link to="/shipping-policy" className="hover:text-[#C9B28A] transition-colors">Shipping Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
