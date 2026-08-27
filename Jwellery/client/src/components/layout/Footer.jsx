import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiPlus, FiMinus } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', to: '/products' },
    { label: 'Rings', to: '/category/rings' },
    { label: 'Earrings', to: '/category/earrings' },
    { label: 'Necklaces', to: '/category/necklaces' },
    { label: 'Bracelets', to: '/category/bracelets' },
    { label: 'Pendants', to: '/category/pendants' },
    { label: 'Jewellery Sets', to: '/category/jewellery-sets' },
    { label: 'Best Sellers', to: '/products' },
  ],
  customerCare: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Shipping & Delivery', to: '/shipping-policy' },
    { label: 'Returns & Exchanges', to: '/return-policy' },
    { label: 'Track Order', to: '/profile' },
    { label: 'Size Guide', to: '/faqs' },
    { label: 'Jewellery Care', to: '/faqs' },
    { label: 'FAQs', to: '/faqs' },
  ],
  about: [
    { label: 'Our Story', to: '/about' },
    { label: 'About Us', to: '/about' },
    { label: 'Craftsmanship', to: '/about' },
    { label: 'Sustainability', to: '/about' },
    { label: 'Careers', to: '/about' },
  ],
  social: [
    { label: 'Instagram', icon: <FiInstagram className="w-4 h-4" />, to: '#' },
    { label: 'Facebook', icon: <FiFacebook className="w-4 h-4" />, to: '#' },
    { label: 'Pinterest', icon: <FaPinterestP className="w-4 h-4" />, to: '#' },
    { label: 'YouTube', icon: <FiYoutube className="w-4 h-4" />, to: '#' },
  ]
};

function FooterAccordion({ title, links, isSocial = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E8E1D7] md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="text-[12px] font-semibold text-[#292725] uppercase tracking-[0.1em] font-sans">
          {title}
        </span>
        <span className="text-[#77716A]">
          {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <ul className="flex flex-col space-y-3">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link to={link.to} className="text-[14px] text-[#77716A] hover:text-[#B39A6B] transition-colors flex items-center gap-2 font-sans">
                {isSocial && link.icon}
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
    <footer className="bg-[#F7F4EF] pt-16 md:pt-24 pb-8 border-t border-[#E8E1D7]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        
        {/* SECTION 1 - BRAND & NEWSLETTER */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-20 gap-10 md:gap-16">
          <div className="w-full md:w-1/2 max-w-md">
            <h2 className="text-[32px] md:text-[40px] text-[#292725] mb-2 font-medium tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              TARINI
            </h2>
            <p className="text-[16px] text-[#292725] mb-3 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Timeless jewellery, thoughtfully crafted.
            </p>
            <p className="text-[14px] text-[#77716A] leading-relaxed font-sans">
              Discover jewellery designed to celebrate every moment, from everyday elegance to unforgettable occasions.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 max-w-md">
            <h3 className="text-[14px] font-semibold text-[#292725] uppercase tracking-[0.1em] mb-2 font-sans">
              Stay in the know
            </h3>
            <p className="text-[14px] text-[#77716A] mb-6 font-sans">
              Sign up for exclusive collections, new arrivals and private offers.
            </p>
            <form className="flex border-b border-[#292725] pb-2 group">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none outline-none w-full text-[14px] text-[#292725] placeholder-[#77716A] font-sans"
              />
              <button 
                type="button" 
                className="text-[12px] font-semibold text-[#292725] uppercase tracking-[0.15em] hover:text-[#B39A6B] transition-colors whitespace-nowrap ml-4 font-sans"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="w-full h-px bg-[#E8E1D7] mb-12 md:mb-16"></div>

        {/* SECTION 2 - NAVIGATION (DESKTOP) */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-20">
          <div>
            <h4 className="text-[12px] font-semibold text-[#292725] uppercase tracking-[0.1em] mb-6 font-sans">SHOP</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#77716A] hover:text-[#B39A6B] transition-colors relative group font-sans">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B39A6B] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-[#292725] uppercase tracking-[0.1em] mb-6 font-sans">CUSTOMER CARE</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.customerCare.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#77716A] hover:text-[#B39A6B] transition-colors relative group font-sans">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B39A6B] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-[#292725] uppercase tracking-[0.1em] mb-6 font-sans">ABOUT TARINI</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#77716A] hover:text-[#B39A6B] transition-colors relative group font-sans">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B39A6B] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-[#292725] uppercase tracking-[0.1em] mb-6 font-sans">FOLLOW US</h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.social.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[14px] text-[#77716A] hover:text-[#B39A6B] transition-all duration-300 flex items-center gap-3 relative group font-sans hover:-translate-y-[1px]">
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 2 - NAVIGATION (MOBILE ACCORDION) */}
        <div className="block md:hidden mb-16 border-t border-[#E8E1D7]">
          <FooterAccordion title="SHOP" links={footerLinks.shop} />
          <FooterAccordion title="CUSTOMER CARE" links={footerLinks.customerCare} />
          <FooterAccordion title="ABOUT TARINI" links={footerLinks.about} />
          <FooterAccordion title="FOLLOW US" links={footerLinks.social} isSocial={true} />
        </div>

        {/* SECTION 3 - BRAND STATEMENT */}
        <div className="text-center mb-16 md:mb-24 px-4">
          <h2 className="text-[22px] md:text-[32px] text-[#292725] uppercase tracking-[0.05em] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Jewellery that becomes part of your story.
          </h2>
          <p className="text-[15px] md:text-[18px] text-[#77716A] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Designed to be worn, loved and remembered.
          </p>
        </div>

        <div className="w-full h-px bg-[#E8E1D7] mb-8"></div>

        {/* SECTION 4 - BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-[#77716A] font-sans">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="text-[#292725]">© 2026 TARINI. All Rights Reserved.</span>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Secure Checkout</span>
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Easy Returns</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <Link to="/privacy-policy" className="hover:text-[#B39A6B] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#B39A6B] transition-colors">Terms & Conditions</Link>
            <Link to="/shipping-policy" className="hover:text-[#B39A6B] transition-colors">Shipping Policy</Link>
            <Link to="/return-policy" className="hover:text-[#B39A6B] transition-colors">Refund Policy</Link>
          </div>
          
          <div className="hidden lg:block text-[#292725] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Made with care for every story.
          </div>
        </div>

      </div>
    </footer>
  );
}
