import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-[#1A1512] min-h-screen font-sans selection:bg-[#C6A15B]/30 selection:text-[#E8E1D6]">
      <Helmet>
        <title>Terms & Conditions | TARINI Fine Jewellery</title>
        <meta name="description" content="Read TARINI's Terms of Service and Conditions." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-[900px] mx-auto">
        <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
          Legal
        </div>
        <h1 className="text-[40px] md:text-[56px] text-[#E8E1D6] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Terms & Conditions
        </h1>
        <p className="text-[#8A8177] text-[15px] md:text-[17px] max-w-xl mx-auto italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "By accessing our platform and purchasing our creations, you agree to these terms."
        </p>
        <p className="text-[#8A8177]/60 text-[12px] font-sans tracking-wide mt-6">Last updated: {currentDate}</p>
        
        {/* Gradient Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent mt-12"></div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 pb-24">
        <div className="max-w-[700px] mx-auto space-y-16">
            
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">1. General</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Welcome to TARINI. By using our website, you agree to comply with and be bound by the following terms of service. Please review them carefully.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">2. Products & Pricing</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>We strive to display our jewellery as accurately as possible. However, slight variations in color or appearance may occur depending on your device. All prices listed on the website are in Indian Rupees (INR) and are inclusive of GST. TARINI reserves the right to adjust pricing based on market fluctuations of precious metals and stones.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">3. Intellectual Property</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>All content on this website, including but not limited to designs, photography, text, and logos, is the exclusive property of TARINI. Unauthorized reproduction or use is strictly prohibited and subject to legal action.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">4. Order Processing</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>We reserve the right to refuse or cancel any order at our discretion, including orders suspected of fraud. In the event of an order cancellation by us, a full refund will be processed.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">5. Governing Law</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>These terms are governed by the laws of India. Any disputes arising from the use of our services will be subject to the exclusive jurisdiction of the courts located in our operating city.</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-[700px] mx-auto text-center border-t border-[#C6A15B]/20 pt-16">
          <h2 className="text-[#C6A15B] text-[18px] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Require further clarification?
          </h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-[#E8E1D6] hover:text-[#E4C989] transition-colors group"
          >
            Contact Customer Care <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
}
