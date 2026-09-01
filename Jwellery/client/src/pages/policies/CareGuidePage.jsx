import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function CareGuidePage() {
  return (
    <>
      <Helmet>
        <title>Care Guide — Tarini Jewellers</title>
      </Helmet>
      <div className="bg-[#FAF7F2] min-h-screen py-24 px-5">
        <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 lg:p-16 border border-[#E8DED1] shadow-sm">
          
          <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#A99D95] text-center">
            <Link to="/" className="hover:text-[#B08D57] transition-colors">Home</Link>
            <span className="mx-3">/</span>
            <span className="text-[#25221F]">Care Guide</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] text-[#1F1517] mb-8 text-center font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Jewellery Care Guide
          </h1>
          
          <div className="space-y-8 text-[#756A63] text-[15px] leading-relaxed font-sans">
            <p className="mb-6 italic text-[#25221F] text-center max-w-lg mx-auto">
              "At Tarini Jewellers, every piece is crafted to last. To ensure your jewellery retains its brilliance and beauty for generations, we recommend following these simple care instructions."
            </p>
            
            <section className="bg-[#FAF7F2] p-8 border border-[#E8DED1]">
              <h3 className="font-medium text-[#25221F] text-[16px] mb-3 uppercase tracking-[0.1em]">1. Daily Wear</h3>
              <p>Always remove your jewellery before engaging in activities like swimming, exercising, or doing household chores. Avoid exposing your jewellery to harsh chemicals, perfumes, lotions, or hairspray, as these can dull the metal and damage gemstones.</p>
            </section>

            <section className="bg-[#FAF7F2] p-8 border border-[#E8DED1]">
              <h3 className="font-medium text-[#25221F] text-[16px] mb-3 uppercase tracking-[0.1em]">2. Proper Storage</h3>
              <p>Store your jewellery in a cool, dry place, away from direct sunlight. Keep individual pieces in separate pouches or compartments of a jewellery box to prevent scratches and tangling. Fasten chains to prevent knots.</p>
            </section>

            <section className="bg-[#FAF7F2] p-8 border border-[#E8DED1]">
              <h3 className="font-medium text-[#25221F] text-[16px] mb-3 uppercase tracking-[0.1em]">3. Cleaning Your Jewellery</h3>
              <p>Clean your jewellery regularly using a soft, lint-free cloth to remove oils and dirt. For a deeper clean, soak the piece in warm water with a few drops of mild dish soap, then gently brush with a soft toothbrush. Rinse thoroughly and pat dry. Never use harsh abrasive cleaners.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
