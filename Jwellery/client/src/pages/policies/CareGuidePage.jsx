import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function CareGuidePage() {
  return (
    <div className="bg-[#1A1512] min-h-screen font-sans selection:bg-[#C6A15B]/30 selection:text-[#E8E1D6]">
      <Helmet>
        <title>Care Guide — Tarini Jewellers</title>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-[900px] mx-auto">
        <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
          Customer Care
        </div>
        <h1 className="text-[40px] md:text-[56px] text-[#E8E1D6] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Jewellery Care Guide
        </h1>
        <p className="text-[#8A8177] text-[15px] md:text-[17px] max-w-xl mx-auto italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "At Tarini Jewellers, every piece is crafted to last. To ensure your jewellery retains its brilliance for generations, follow these simple care instructions."
        </p>
        
        {/* Gradient Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent mt-12"></div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 pb-24">
        <div className="max-w-[700px] mx-auto space-y-16">
            
          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">1. Daily Wear</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Always remove your jewellery before engaging in activities like swimming, exercising, or doing household chores. Avoid exposing your jewellery to harsh chemicals, perfumes, lotions, or hairspray, as these can dull the metal and damage gemstones.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">2. Proper Storage</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Store your jewellery in a cool, dry place, away from direct sunlight. Keep individual pieces in separate pouches or compartments of a jewellery box to prevent scratches and tangling. Fasten chains to prevent knots.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">3. Cleaning Your Jewellery</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Clean your jewellery regularly using a soft, lint-free cloth to remove oils and dirt. For a deeper clean, soak the piece in warm water with a few drops of mild dish soap, then gently brush with a soft toothbrush. Rinse thoroughly and pat dry. Never use harsh abrasive cleaners.</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-[700px] mx-auto text-center border-t border-[#C6A15B]/20 pt-16">
          <h2 className="text-[#C6A15B] text-[18px] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Need further assistance?
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
