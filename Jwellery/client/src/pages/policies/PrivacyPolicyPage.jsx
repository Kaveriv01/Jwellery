import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-[#1A1512] min-h-screen font-sans selection:bg-[#C6A15B]/30 selection:text-[#E8E1D6]">
      <Helmet>
        <title>Privacy Policy | TARINI Fine Jewellery</title>
        <meta name="description" content="Read TARINI's Privacy Policy. We value and protect your privacy." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-[900px] mx-auto">
        <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
          Legal
        </div>
        <h1 className="text-[40px] md:text-[56px] text-[#E8E1D6] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Privacy Policy
        </h1>
        <p className="text-[#8A8177] text-[15px] md:text-[17px] max-w-xl mx-auto italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "We collect your information only to provide you with the most seamless and personalized TARINI experience. Your privacy is paramount."
        </p>
        <p className="text-[#8A8177]/60 text-[12px] font-sans tracking-wide mt-6">Last updated: {currentDate}</p>
        
        {/* Gradient Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent mt-12"></div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 pb-24">
        <div className="max-w-[700px] mx-auto space-y-16">
            
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">1. Information Collection</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>When you visit TARINI, we may collect personal information such as your name, email address, phone number, shipping and billing addresses, and payment details only to process your orders securely.</p>
              <p>We also automatically collect standard browsing data to improve our website experience and optimize our luxury offerings.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">2. Use of Information</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Your data is used strictly to fulfill orders, process payments securely, communicate regarding your purchases, and, with your consent, to notify you of exclusive collections and offers.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">3. Data Protection</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>We implement stringent security measures to protect your personal information. We do not sell or trade your data to third parties. We may share necessary details with trusted partners (such as courier services and payment gateways) solely to complete your transactions securely.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">4. Cookies</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>We use cookies to enhance your browsing experience, remember your preferences, and maintain the contents of your shopping cart. You may choose to disable cookies in your browser settings, though it may affect site functionality.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">5. Your Rights</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>You have the right to access, update, or request deletion of your personal information at any time. Simply contact our privacy team, and we will promptly address your request.</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-[700px] mx-auto text-center border-t border-[#C6A15B]/20 pt-16">
          <h2 className="text-[#C6A15B] text-[18px] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Questions regarding our policy?
          </h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-[#E8E1D6] hover:text-[#E4C989] transition-colors group"
          >
            Contact Privacy Team <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
}
