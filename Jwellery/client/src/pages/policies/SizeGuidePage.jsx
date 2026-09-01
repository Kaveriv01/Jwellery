import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function SizeGuidePage() {
  return (
    <div className="bg-[#1A1512] min-h-screen font-sans selection:bg-[#C6A15B]/30 selection:text-[#E8E1D6]">
      <Helmet>
        <title>Size Guide — Tarini Jewellers</title>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-[900px] mx-auto">
        <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
          Customer Care
        </div>
        <h1 className="text-[40px] md:text-[56px] text-[#E8E1D6] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Size Guide
        </h1>
        <p className="text-[#8A8177] text-[15px] md:text-[17px] max-w-xl mx-auto italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "Find your perfect fit with our detailed sizing information."
        </p>
        
        {/* Gradient Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent mt-12"></div>
      </section>
      
      {/* Main Content Area */}
      <section className="px-6 pb-24">
        <div className="max-w-[700px] mx-auto space-y-16">
            
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Ring Size Guide</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-6">
              <p>To find your perfect ring size, wrap a piece of string or paper around the base of your finger. Mark the point where the ends meet and measure the length in millimeters. Use our chart below to determine your size.</p>
              
              <div className="overflow-x-auto border border-[#C6A15B]/20 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#C6A15B]/5 border-b border-[#C6A15B]/20">
                      <th className="p-4 font-medium text-[#C6A15B] text-[12px] uppercase tracking-wide">Size (India)</th>
                      <th className="p-4 font-medium text-[#C6A15B] text-[12px] uppercase tracking-wide border-l border-[#C6A15B]/20">Diameter (mm)</th>
                      <th className="p-4 font-medium text-[#C6A15B] text-[12px] uppercase tracking-wide border-l border-[#C6A15B]/20">Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#E8E1D6]/80 text-[13px]">
                    <tr className="border-b border-[#C6A15B]/10 hover:bg-[#C6A15B]/[0.02] transition-colors"><td className="p-4">10</td><td className="p-4 border-l border-[#C6A15B]/10">16.0</td><td className="p-4 border-l border-[#C6A15B]/10">50.3</td></tr>
                    <tr className="border-b border-[#C6A15B]/10 hover:bg-[#C6A15B]/[0.02] transition-colors"><td className="p-4">12</td><td className="p-4 border-l border-[#C6A15B]/10">16.6</td><td className="p-4 border-l border-[#C6A15B]/10">52.1</td></tr>
                    <tr className="border-b border-[#C6A15B]/10 hover:bg-[#C6A15B]/[0.02] transition-colors"><td className="p-4">14</td><td className="p-4 border-l border-[#C6A15B]/10">17.2</td><td className="p-4 border-l border-[#C6A15B]/10">54.0</td></tr>
                    <tr className="hover:bg-[#C6A15B]/[0.02] transition-colors"><td className="p-4">16</td><td className="p-4 border-l border-[#C6A15B]/10">17.8</td><td className="p-4 border-l border-[#C6A15B]/10">56.0</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">Necklace Length Guide</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Our necklaces typically come in standard lengths:</p>
              <ul className="list-disc pl-5 space-y-3 text-[#E8E1D6]/80 mt-4">
                <li><strong className="text-[#E8E1D6] font-medium">16 inches (40 cm):</strong> Choker length, sits tightly against the base of the throat.</li>
                <li><strong className="text-[#E8E1D6] font-medium">18 inches (45 cm):</strong> Princess length, rests on the collarbone.</li>
                <li><strong className="text-[#E8E1D6] font-medium">20 inches (50 cm):</strong> Matinee length, falls slightly below the collarbone.</li>
                <li><strong className="text-[#E8E1D6] font-medium">24 inches (60 cm):</strong> Falls at or just above the top of the bust.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-[700px] mx-auto text-center border-t border-[#C6A15B]/20 pt-16">
          <h2 className="text-[#C6A15B] text-[18px] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Still unsure about your size?
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
