import { Link } from 'react-router-dom';

export default function MidBanner() {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden my-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/home/experience-banner.jpg"
          alt="The Tarini Experience"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#3E2024]/20" />
      </div>

      {/* Content Box */}
      <div className="relative z-10 bg-[#FDFBF7] px-12 py-10 text-center max-w-xl mx-4 shadow-lg">
        <p className="text-[#C5A059] text-[10px] tracking-widest uppercase mb-4">The Tarini Experience</p>
        <h2 className="text-[#5C1D24] text-3xl mb-6 font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Jewellery made to look perfect on everyone.
        </h2>
        <Link
          to="/about"
          className="inline-block bg-[#5C1D24] text-white px-8 py-3 text-[10px] tracking-widest uppercase hover:bg-[#3A0D15] transition-colors"
        >
          EXPLORE THE BRAND
        </Link>
      </div>
    </section>
  );
}
