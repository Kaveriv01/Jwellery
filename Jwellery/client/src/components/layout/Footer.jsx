import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaPinterestP, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from 'react-icons/fa';
import { CONTACT_DETAILS, APP_TAGLINE } from '../../constants';

export default function Footer() {
  return (
    <footer className="w-full font-sans">
      
      {/* Newsletter Section - Light Background */}
      <div className="bg-[#FAF6F2] py-10 border-y border-[#E8DED1]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side: Icon & Text */}
          <div className="flex items-center gap-5">
            <div className="w-[52px] h-[52px] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="1" className="w-full h-full">
                <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="2.5" fill="#C6A15B" stroke="none" />
              </svg>
            </div>
            <div>
              <h3 className="text-[18px] font-medium text-[#2A2020] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Join Our Exclusive Circle</h3>
              <p className="text-[13px] text-[#756A63] font-light">Be the first to know about new collections, special offers & more.</p>
            </div>
          </div>
          
          {/* Right Side: Input & Button */}
          <div className="w-full lg:w-auto">
            <form className="flex w-full lg:w-[420px] bg-white rounded-[2px] overflow-hidden shadow-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-5 py-3.5 text-[13px] text-[#2A2020] outline-none placeholder:text-[#A99D95]"
                required
              />
              <button 
                type="submit" 
                className="bg-[#2B0E14] hover:bg-[#1E090E] text-white px-8 py-3.5 text-[12px] font-medium transition-colors flex items-center gap-2"
              >
                Subscribe <FiArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Dark Footer */}
      <div className="bg-[#1C1116] pt-20 pb-8 text-[#E8E1D6]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          {/* Top Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
            
            {/* Column 1: Brand (Takes 2 columns space on large screens) */}
            <div className="lg:col-span-2 pr-4 md:pr-12">
              <h2 className="text-[28px] md:text-[32px] text-white mb-1 tracking-[0.15em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                TARINI
              </h2>
              <p className="text-[9px] text-[#C6A15B] tracking-[0.3em] uppercase mb-6 font-medium">
                Fine Jewellery
              </p>
              <p className="text-[13px] text-[#A69C9F] mb-8 font-light">
                {APP_TAGLINE}.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-9 h-9 rounded-full border border-[#A69C9F]/50 flex items-center justify-center text-[#A69C9F] hover:bg-[#C6A15B] hover:border-[#C6A15B] hover:text-[#1C1116] transition-colors">
                  <FiFacebook size={14} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-[#A69C9F]/50 flex items-center justify-center text-[#A69C9F] hover:bg-[#C6A15B] hover:border-[#C6A15B] hover:text-[#1C1116] transition-colors">
                  <FiInstagram size={14} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-[#A69C9F]/50 flex items-center justify-center text-[#A69C9F] hover:bg-[#C6A15B] hover:border-[#C6A15B] hover:text-[#1C1116] transition-colors">
                  <FaPinterestP size={14} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-[14px] font-medium text-white mb-6">Quick Links</h4>
              <ul className="flex flex-col space-y-3.5 text-[13px] font-light text-[#E8E1D6]">
                <li><Link to="/" className="hover:text-[#C6A15B] transition-colors">Home</Link></li>
                <li><Link to="/products" className="hover:text-[#C6A15B] transition-colors">Shop</Link></li>
                <li><Link to="/collections" className="hover:text-[#C6A15B] transition-colors">Collections</Link></li>
                <li><Link to="/about" className="hover:text-[#C6A15B] transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#C6A15B] transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div>
              <h4 className="text-[14px] font-medium text-white mb-6">Customer Service</h4>
              <ul className="flex flex-col space-y-3.5 text-[13px] font-light text-[#E8E1D6]">
                <li><Link to="/shipping-policy" className="hover:text-[#C6A15B] transition-colors">Shipping Policy</Link></li>
                <li><Link to="/return-policy" className="hover:text-[#C6A15B] transition-colors">Returns & Exchange</Link></li>
                <li><Link to="/faqs" className="hover:text-[#C6A15B] transition-colors">FAQs</Link></li>
                <li><Link to="/terms" className="hover:text-[#C6A15B] transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/size-guide" className="hover:text-[#C6A15B] transition-colors">Size Guide</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div>
              <h4 className="text-[14px] font-medium text-white mb-6">Contact Us</h4>
              <ul className="flex flex-col space-y-4 text-[13px] font-light text-[#A69C9F]">
                <li className="flex items-start gap-3">
                  <FiPhone className="mt-1 flex-shrink-0 text-[#C6A15B]" size={14} />
                  <span>{CONTACT_DETAILS.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiMail className="mt-1 flex-shrink-0 text-[#C6A15B]" size={14} />
                  <span>{CONTACT_DETAILS.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiMapPin className="mt-1 flex-shrink-0 text-[#C6A15B]" size={14} />
                  <span className="leading-relaxed">350 Fifth Avenue, New York,<br/>NY 10118, USA</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#A69C9F]/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[11.5px] text-[#A69C9F] font-light tracking-wide">
              © {new Date().getFullYear()} Tarini Fine Jewellery. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-white px-2 py-1 flex items-center justify-center rounded-sm"><FaCcVisa size={18} className="text-[#1A1F71]" /></div>
              <div className="bg-white px-2 py-1 flex items-center justify-center rounded-sm"><FaCcMastercard size={18} className="text-[#EB001B]" /></div>
              <div className="bg-[#0079C1] px-2 py-1 flex items-center justify-center rounded-sm"><FaCcAmex size={18} className="text-white" /></div>
              <div className="bg-white px-2 py-1 flex items-center justify-center rounded-sm"><FaCcPaypal size={18} className="text-[#00457C]" /></div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
