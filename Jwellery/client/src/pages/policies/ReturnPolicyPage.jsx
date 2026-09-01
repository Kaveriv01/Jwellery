import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiRefreshCcw, FiBox, FiCreditCard, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#1A1512] min-h-screen font-sans selection:bg-[#C6A15B]/30 selection:text-[#E8E1D6]">
      <Helmet>
        <title>Returns & Exchanges | TARINI Fine Jewellery</title>
        <meta name="description" content="Read TARINI's Returns and Exchange policy. We want you to love your TARINI piece." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-[900px] mx-auto">
        <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
          Customer Care
        </div>
        <h1 className="text-[40px] md:text-[56px] text-[#E8E1D6] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Returns & Exchanges
        </h1>
        <p className="text-[#8A8177] text-[15px] md:text-[17px] max-w-xl mx-auto italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "We want you to love your TARINI piece — here's how we make it right if you don't."
        </p>
        
        {/* Gradient Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent mt-12"></div>
      </section>

      {/* At-a-glance Summary Bar */}
      <section className="px-6 pb-20">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] mb-4">
              <FiRefreshCcw strokeWidth={1.5} size={20} />
            </div>
            <h3 className="text-[#E8E1D6] text-[13px] font-medium tracking-wide">7-Day Returns</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] mb-4">
              <FiCheckCircle strokeWidth={1.5} size={20} />
            </div>
            <h3 className="text-[#E8E1D6] text-[13px] font-medium tracking-wide">Free Exchanges</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] mb-4">
              <FiBox strokeWidth={1.5} size={20} />
            </div>
            <h3 className="text-[#E8E1D6] text-[13px] font-medium tracking-wide">Original Packaging</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] mb-4">
              <FiCreditCard strokeWidth={1.5} size={20} />
            </div>
            <h3 className="text-[#E8E1D6] text-[13px] font-medium tracking-wide">Full Refund</h3>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 pb-24">
        <div className="max-w-[700px] mx-auto space-y-16">
          
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Eligibility for Returns</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Items may be returned within 7 days from the date of delivery. To be eligible for a return, your jewellery must remain unworn, in its original pristine condition, and with all security tags intact.</p>
              <p>The original branded packaging, including boxes, pouches, and certificates of authenticity, must be included to complete the return.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Non-Returnable Items</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>To uphold our commitment to quality and hygiene, the following items are final sale and cannot be returned or exchanged:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#E8E1D6]/80">
                <li>Earrings (due to hygiene standards).</li>
                <li>Customized, engraved, or bespoke pieces tailored to specific requests.</li>
                <li>Items purchased during promotional sales or marked as "Final Sale".</li>
              </ul>
            </div>
          </div>

          {/* Timeline for Returns */}
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-8">How to Initiate a Return</h2>
            <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-0 before:left-[11px] md:before:left-[15px] before:w-[1px] before:bg-[#C6A15B]/20">
              
              <div className="relative">
                <div className="absolute -left-[26px] md:-left-[30px] top-1.5 w-[11px] h-[11px] rounded-full bg-[#1A1512] border-2 border-[#C6A15B]"></div>
                <h3 className="text-[#E8E1D6] font-medium text-[14px] mb-2">1. Contact Us</h3>
                <p className="text-[#E8E1D6]/70 text-[13px] font-light leading-relaxed">Reach out to our Customer Care team at care@tarinijewellers.com within 7 days of delivery with your order number and reason for return.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[26px] md:-left-[30px] top-1.5 w-[11px] h-[11px] rounded-full bg-[#1A1512] border-2 border-[#C6A15B]"></div>
                <h3 className="text-[#E8E1D6] font-medium text-[14px] mb-2">2. Receive Authorization</h3>
                <p className="text-[#E8E1D6]/70 text-[13px] font-light leading-relaxed">We will review your request and provide a Return Merchandise Authorization (RMA) number along with a prepaid shipping label.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[26px] md:-left-[30px] top-1.5 w-[11px] h-[11px] rounded-full bg-[#1A1512] border-2 border-[#C6A15B]"></div>
                <h3 className="text-[#E8E1D6] font-medium text-[14px] mb-2">3. Pack Securely</h3>
                <p className="text-[#E8E1D6]/70 text-[13px] font-light leading-relaxed">Place the unworn jewellery back into its original TARINI box with all certificates and tags. Ensure the outer packaging is secure.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[26px] md:-left-[30px] top-1.5 w-[11px] h-[11px] rounded-full bg-[#1A1512] border-2 border-[#C6A15B]"></div>
                <h3 className="text-[#E8E1D6] font-medium text-[14px] mb-2">4. Ship it Back</h3>
                <p className="text-[#E8E1D6]/70 text-[13px] font-light leading-relaxed">Hand over the package to our designated courier partner during the scheduled pickup window.</p>
              </div>

            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Exchanges</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>If you require a different size or prefer an alternate style, we offer complimentary exchanges within the 7-day window. Exchanges are subject to inventory availability. Once your original piece is received and inspected, your replacement will be dispatched.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Refunds</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Refunds are processed within 5-7 business days after the returned item passes our quality inspection. The refunded amount will be credited back to the original payment method.</p>
              <p>Please note that any shipping charges incurred on the original order are non-refundable.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Damaged or Defective Items</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Every piece of TARINI jewellery undergoes rigorous quality checks. However, if you receive a damaged or defective item, please contact us immediately upon delivery. We will arrange a priority replacement or a full refund, ensuring your experience remains seamless and satisfying.</p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-[700px] mx-auto text-center border-t border-[#C6A15B]/20 pt-16">
          <h2 className="text-[#C6A15B] text-[18px] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Still have questions?
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
