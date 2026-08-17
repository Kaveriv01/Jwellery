export default function WhyChooseUsBoxes() {
  const reasons = [
    { title: 'Quality Materials', desc: 'Sourced from the finest materials around the world.' },
    { title: 'Ethical Origins', desc: 'Committed to sustainable and ethical practices.' },
    { title: 'Handcrafted Process', desc: 'Each piece crafted with precision by master artisans.' },
    { title: 'Secure Shipping', desc: 'Insured and trackable delivery to your doorstep.' }
  ];

  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-[#C7A56A] text-[10px] tracking-widest uppercase mb-4">OUR PROMISE</p>
        <h2 className="text-3xl text-[#5C1D24] mb-12 font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Why Choose Tarini</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, idx) => (
            <div key={idx} className="bg-white p-8 shadow-sm border border-[#EAE6DF] hover:shadow-md transition-shadow">
              <h3 className="text-[#5C1D24] text-lg font-normal mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{reason.title}</h3>
              <p className="text-[11px] text-[#756B62] leading-relaxed uppercase tracking-wider">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
