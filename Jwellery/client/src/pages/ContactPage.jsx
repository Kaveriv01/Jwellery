import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us — Tarini Jewellers</title>
      </Helmet>
      
      {/* Cinematic Hero Header (Parcos Inspired) */}
      <section className="relative w-full h-[50vh] md:h-[65vh] flex flex-col items-center justify-center overflow-hidden bg-[#111]">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/images/necklace-banner.jpg"
          alt="Tarini Contact"
          className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />
        
        <div className="relative z-10 text-center flex flex-col items-center px-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-[#FDFBF7] text-4xl md:text-6xl font-medium tracking-wide mb-4" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#FDFBF7]/90 text-[11px] md:text-[13px] font-semibold tracking-[0.2em] uppercase max-w-md mx-auto" 
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            We are here to assist you with any inquiries regarding our collections, orders, or bespoke services.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full bg-[#FDFBF7] py-20 lg:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: Reach Out & Info (5 Cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl text-[#22181C] mb-6 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Get In Touch
              </h2>
              <p className="text-[14px] text-[#22181C]/70 leading-relaxed mb-12 font-medium" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Our dedicated concierge team is available to assist you with styling advice, order tracking, and any other inquiries you may have. We aim to respond to all emails within 24 hours.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-10">
                {/* Phone */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#FDFBF7] transition-all duration-300">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-[#22181C] uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Call Us</h3>
                    <a href="tel:+919876543210" className="text-[16px] text-[#22181C] font-medium group-hover:text-[#C5A059] transition-colors">+91 98765 43210</a>
                    <p className="text-[12px] text-[#22181C]/50 mt-1">Mon - Sat | 10:00 AM - 7:00 PM (IST)</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#FDFBF7] transition-all duration-300">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-[#22181C] uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Email Us</h3>
                    <a href="mailto:support@tarinijewellers.com" className="text-[16px] text-[#22181C] font-medium group-hover:text-[#C5A059] transition-colors">support@tarinijewellers.com</a>
                    <p className="text-[12px] text-[#22181C]/50 mt-1">For general inquiries and support</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-5 group cursor-pointer col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#FDFBF7] transition-all duration-300">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-[#22181C] uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Visit Boutique</h3>
                    <p className="text-[15px] text-[#22181C] font-medium leading-relaxed">
                      123 Luxury Avenue,<br />
                      Heritage Block, Mumbai<br />
                      Maharashtra 400001, India
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Sleek Contact Form (7 Cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 bg-white p-10 lg:p-14 shadow-2xl rounded-sm"
            >
              <h3 className="text-2xl text-[#22181C] mb-8 font-medium border-b border-[#22181C]/10 pb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Send an Inquiry
              </h3>
              
              <form className="space-y-8">
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  <div className="relative">
                    <input id="first_name" type="text" required className="peer w-full border-b border-[#22181C]/20 bg-transparent py-2 text-[14px] text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder-transparent" placeholder="First Name" />
                    <label htmlFor="first_name" className="absolute left-0 top-2 text-[12px] text-[#22181C]/50 font-bold uppercase tracking-[0.1em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C5A059] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-[#22181C]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>First Name *</label>
                  </div>
                  <div className="relative">
                    <input id="last_name" type="text" required className="peer w-full border-b border-[#22181C]/20 bg-transparent py-2 text-[14px] text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder-transparent" placeholder="Last Name" />
                    <label htmlFor="last_name" className="absolute left-0 top-2 text-[12px] text-[#22181C]/50 font-bold uppercase tracking-[0.1em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C5A059] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-[#22181C]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Last Name *</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  <div className="relative">
                    <input id="email" type="email" required className="peer w-full border-b border-[#22181C]/20 bg-transparent py-2 text-[14px] text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder-transparent" placeholder="Email" />
                    <label htmlFor="email" className="absolute left-0 top-2 text-[12px] text-[#22181C]/50 font-bold uppercase tracking-[0.1em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C5A059] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-[#22181C]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Email Address *</label>
                  </div>
                  <div className="relative">
                    <input id="phone" type="tel" className="peer w-full border-b border-[#22181C]/20 bg-transparent py-2 text-[14px] text-[#22181C] outline-none focus:border-[#C5A059] transition-colors placeholder-transparent" placeholder="Phone" />
                    <label htmlFor="phone" className="absolute left-0 top-2 text-[12px] text-[#22181C]/50 font-bold uppercase tracking-[0.1em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C5A059] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-[#22181C]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Phone Number</label>
                  </div>
                </div>
                
                <div className="relative">
                  <select id="subject" required className="peer w-full border-b border-[#22181C]/20 bg-transparent py-2 text-[14px] text-[#22181C] outline-none focus:border-[#C5A059] transition-colors appearance-none cursor-pointer">
                    <option value="" disabled selected hidden></option>
                    <option value="order">Order Inquiry</option>
                    <option value="return">Returns &amp; Exchanges</option>
                    <option value="product">Product Information</option>
                    <option value="other">Other</option>
                  </select>
                  <label htmlFor="subject" className="absolute left-0 -top-4 text-[10px] text-[#22181C]/50 font-bold uppercase tracking-[0.1em] transition-all" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Subject *</label>
                  {/* Custom arrow for select */}
                  <div className="absolute right-0 top-3 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#22181C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                <div className="relative mt-12">
                  <textarea id="message" required className="peer w-full border-b border-[#22181C]/20 bg-transparent py-2 text-[14px] text-[#22181C] h-20 resize-none outline-none focus:border-[#C5A059] transition-colors placeholder-transparent" placeholder="Message"></textarea>
                  <label htmlFor="message" className="absolute left-0 top-2 text-[12px] text-[#22181C]/50 font-bold uppercase tracking-[0.1em] transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C5A059] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-[#22181C]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Your Message *</label>
                </div>
                
                <button type="submit" className="w-full bg-[#22181C] text-[#FDFBF7] hover:bg-[#C5A059] hover:text-[#22181C] text-[12px] font-bold uppercase tracking-[0.2em] py-4 mt-8 transition-all duration-300 ease-out border border-transparent hover:border-[#C5A059]">
                  Send Message
                </button>
              </form>
            </motion.div>
            
          </div>
        </div>
      </section>
    </>
  );
}

