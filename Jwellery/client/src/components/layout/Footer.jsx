import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaChevronRight, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] relative mt-32 pt-32 pb-6 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Overlapping Newsletter Box */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px] px-4">
          <div className="bg-white rounded-[4px] shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background pattern similar to screenshot */}
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 100 100" className="rotate-45 transform scale-150 -translate-y-12 translate-x-12">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="10"/>
              </svg>
            </div>
            
            <div className="w-full md:w-1/2 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Subscribe to Newsletter!</h2>
              <p className="text-[#64748B] text-sm md:text-base">Subscribe to get latest updates and information.</p>
            </div>
            <div className="w-full md:w-[45%] relative z-10">
              <form className="relative flex items-center bg-white rounded-full border border-gray-200 overflow-hidden p-1.5 focus-within:border-[#F97316] focus-within:ring-1 focus-within:ring-[#F97316] transition-all shadow-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email :" 
                  className="bg-transparent border-none outline-none w-full px-5 text-gray-700 placeholder-gray-400 text-sm"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 px-8 rounded-full transition-colors whitespace-nowrap text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="pr-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden">
                <img src="/tarini-logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                <span className="hidden text-[#0F172A] font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>T</span>
              </div>
              <h3 className="text-lg font-bold text-[#10B981]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>TARINI</h3>
            </div>
            <p className="text-[#94A3B8] text-[13px] leading-relaxed">
              A great platform to buy the most exquisite and timeless jewellery without any hassle.
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-[17px] font-bold text-white mb-6">Company</h4>
            <ul className="flex flex-col space-y-3.5">
              <li>
                <Link to="/about" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> About us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Blogs
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> FAQ
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Pricing
                </Link>
              </li>
              <li>
                <Link to="/listing" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Listing
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Usefull Links */}
          <div>
            <h4 className="text-[17px] font-bold text-white mb-6">Usefull Links</h4>
            <ul className="flex flex-col space-y-3.5">
              <li>
                <Link to="/terms" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 text-[14px] group">
                  <FaChevronRight className="text-white text-[10px] group-hover:translate-x-1 transition-transform" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h4 className="text-[17px] font-bold text-white mb-6">Contact Details</h4>
            <ul className="flex flex-col space-y-5 text-[14px] text-[#94A3B8]">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#10B981] mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-[#E2E8F0] mb-1">Mumbai, India</p>
                  <a href="#" className="text-[#10B981] hover:underline hover:text-emerald-400 transition-colors text-xs">View on Google map</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[#10B981] flex-shrink-0" size={16} />
                <a href="mailto:customercare@tarinijewellers.com" className="hover:text-white transition-colors break-all">customercare@tarinijewellers.com</a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-[#10B981] flex-shrink-0" size={16} />
                <a href="tel:+916376542007" className="hover:text-[#E2E8F0] transition-colors">+91 63765 42007</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 pb-2 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-[#64748B]">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <p>
              © 2026 Tarini Jewellers
            </p>
            <div className="flex justify-center md:justify-start gap-2 text-[11px]">
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <span>|</span>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded border border-[#334155] flex items-center justify-center hover:bg-[#334155] hover:text-white transition-colors">
              <FiFacebook size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded border border-[#334155] flex items-center justify-center hover:bg-[#334155] hover:text-white transition-colors">
              <FiInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded border border-[#334155] flex items-center justify-center hover:bg-[#334155] hover:text-white transition-colors">
              <FiMail size={14} />
            </a>
          </div>
        </div>

      </div>

      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className="absolute bottom-8 -right-4 md:right-8 w-10 h-10 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1 z-50"
      >
        <FaArrowUp size={14} />
      </button>

    </footer>
  );
}
