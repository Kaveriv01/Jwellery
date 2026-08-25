import { Truck, ShieldCheck, Award, Lock } from 'lucide-react';

export default function FeaturesBar() {
  const features = [
    { icon: Truck, text: 'Free Shipping' },
    { icon: ShieldCheck, text: 'Lifetime Warranty' },
    { icon: Award, text: '100% Certified' },
    { icon: Lock, text: 'Secure Checkout' },
  ];

  return (
    <div className="bg-[#FAF8F5] py-8 border-b border-[#EAE6DF]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-3 p-4 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <feature.icon size={32} className="text-[#6a1b24] group-hover:text-[#D4AF37] transition-colors duration-300" strokeWidth={1} />
              <span className="text-[14px] md:text-[18px] font-semibold tracking-wide text-[#333] group-hover:text-[#6a1b24] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
