import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function SizeGuidePage() {
  return (
    <>
      <Helmet>
        <title>Size Guide — Tarini Jewellers</title>
      </Helmet>
      <div className="bg-[#FAF7F2] min-h-screen py-24 px-5">
        <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 lg:p-16 border border-[#E8DED1] shadow-sm">
          
          <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#A99D95] text-center">
            <Link to="/" className="hover:text-[#B08D57] transition-colors">Home</Link>
            <span className="mx-3">/</span>
            <span className="text-[#25221F]">Size Guide</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] text-[#1F1517] mb-12 text-center font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Size Guide
          </h1>
          
          <div className="space-y-12 text-[#756A63] text-[15px] leading-relaxed font-sans">
            
            <section>
              <h2 className="text-[24px] text-[#25221F] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ring Size Guide</h2>
              <p className="mb-6">To find your perfect ring size, wrap a piece of string or paper around the base of your finger. Mark the point where the ends meet and measure the length in millimeters. Use our chart below to determine your size.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-[#E8DED1]">
                  <thead>
                    <tr className="bg-[#FAF7F2]">
                      <th className="p-4 border border-[#E8DED1] font-medium text-[#25221F]">Size (India)</th>
                      <th className="p-4 border border-[#E8DED1] font-medium text-[#25221F]">Diameter (mm)</th>
                      <th className="p-4 border border-[#E8DED1] font-medium text-[#25221F]">Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-4 border border-[#E8DED1]">10</td><td className="p-4 border border-[#E8DED1]">16.0</td><td className="p-4 border border-[#E8DED1]">50.3</td></tr>
                    <tr><td className="p-4 border border-[#E8DED1]">12</td><td className="p-4 border border-[#E8DED1]">16.6</td><td className="p-4 border border-[#E8DED1]">52.1</td></tr>
                    <tr><td className="p-4 border border-[#E8DED1]">14</td><td className="p-4 border border-[#E8DED1]">17.2</td><td className="p-4 border border-[#E8DED1]">54.0</td></tr>
                    <tr><td className="p-4 border border-[#E8DED1]">16</td><td className="p-4 border border-[#E8DED1]">17.8</td><td className="p-4 border border-[#E8DED1]">56.0</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section>
              <h2 className="text-[24px] text-[#25221F] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Necklace Length Guide</h2>
              <p className="mb-4">Our necklaces typically come in standard lengths:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-[#25221F] font-medium">16 inches (40 cm):</strong> Choker length, sits tightly against the base of the throat.</li>
                <li><strong className="text-[#25221F] font-medium">18 inches (45 cm):</strong> Princess length, rests on the collarbone.</li>
                <li><strong className="text-[#25221F] font-medium">20 inches (50 cm):</strong> Matinee length, falls slightly below the collarbone.</li>
                <li><strong className="text-[#25221F] font-medium">24 inches (60 cm):</strong> Falls at or just above the top of the bust.</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
