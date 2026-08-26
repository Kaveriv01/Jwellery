import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us — Tarini Jewellers</title>
      </Helmet>
      
      {/* Editorial Header */}
      <div className="bg-[#22181C] py-20 text-center text-[#FDFBF7]">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#C5A059] text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Get In Touch</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl mb-4 font-normal tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>We're Here to Help</motion.h1>
        <p className="max-w-xl mx-auto text-[14px] text-[#FDFBF7]/80 font-medium leading-relaxed px-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Whether you have a question about our collections, need styling advice, or require assistance with an order, our concierge is at your service.
        </p>
      </div>

      <div className="container-luxury py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Contact Information */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-[28px] text-[#22181C] mb-8 font-normal tracking-wide border-b border-[#22181C]/10 pb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Contact Information
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#22181C]">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#22181C] uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Email Us</h3>
                  <p className="text-[14px] text-[#22181C]/70 font-medium mb-1">Our team typically replies within 24 hours.</p>
                  <a href="mailto:support@tarinijewellers.com" className="text-[15px] font-bold text-[#C5A059] hover:text-[#22181C] transition-colors">support@tarinijewellers.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#22181C]">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#22181C] uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Call Us</h3>
                  <p className="text-[14px] text-[#22181C]/70 font-medium mb-1">Mon-Sat, 10am to 7pm (IST)</p>
                  <a href="tel:+919876543210" className="text-[15px] font-bold text-[#C5A059] hover:text-[#22181C] transition-colors">+91 98765 43210</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#22181C]">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#22181C] uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Visit Our Boutique</h3>
                  <p className="text-[14px] text-[#22181C]/70 font-medium leading-relaxed">
                    123 Luxury Avenue, Heritage Block,<br />
                    Mumbai, Maharashtra 400001, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(34,24,28,0.06)] border border-transparent rounded-[2px]">
              <h3 className="text-[22px] text-[#22181C] mb-6 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-bold text-[#22181C] mb-2 block uppercase tracking-[0.15em]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>First Name *</label>
                    <input className="w-full border-b border-[#22181C]/20 bg-transparent py-2.5 text-[14px] font-medium text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-300" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#22181C] mb-2 block uppercase tracking-[0.15em]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Last Name</label>
                    <input className="w-full border-b border-[#22181C]/20 bg-transparent py-2.5 text-[14px] font-medium text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-300" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-[#22181C] mb-2 block uppercase tracking-[0.15em]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Email Address *</label>
                  <input className="w-full border-b border-[#22181C]/20 bg-transparent py-2.5 text-[14px] font-medium text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-300" type="email" placeholder="jane@example.com" />
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-[#22181C] mb-2 block uppercase tracking-[0.15em]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Subject</label>
                  <select defaultValue="" className="w-full border-b border-[#22181C]/20 bg-transparent py-2.5 text-[14px] font-medium text-[#22181C] outline-none focus:border-[#C5A059] transition-colors appearance-none cursor-pointer">
                    <option value="" disabled>Select an option</option>
                    <option value="order">Order Inquiry</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="product">Product Information</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-[#22181C] mb-2 block uppercase tracking-[0.15em]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Message *</label>
                  <textarea className="w-full border-b border-[#22181C]/20 bg-transparent py-2.5 text-[14px] font-medium text-[#22181C] h-24 resize-none outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-300" placeholder="How can we help you?" />
                </div>
                
                <button className="w-full bg-[#22181C] hover:bg-[#C5A059] text-[#FDFBF7] hover:text-[#22181C] text-[13px] font-bold uppercase tracking-[0.2em] py-4 transition-all duration-[300ms] shadow-lg mt-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Submit Inquiry
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

