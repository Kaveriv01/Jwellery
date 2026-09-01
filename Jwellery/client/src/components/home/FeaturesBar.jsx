import { FiTruck, FiShield, FiAward, FiLock } from 'react-icons/fi';

export default function FeaturesBar() {
  const features = [
    { icon: FiTruck, text: 'Free Shipping' },
    { icon: FiShield, text: 'Lifetime Warranty' },
    { icon: FiAward, text: '100% Certified' },
    { icon: FiLock, text: 'Secure Checkout' },
  ];

  return (
    <div className="bg-[#FAF8F5] py-8 border-b border-[#EAE6DF]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-3 p-4 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <feature.icon size={28} className="text-[#1F1517] group-hover:text-[#C5A059] transition-colors duration-300 mb-1" />
              <span className="text-[14px] md:text-[18px] font-bold tracking-wide text-[#333] group-hover:text-[#1F1517] transition-colors duration-300" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
