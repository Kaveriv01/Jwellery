import { FiTruck, FiShield, FiAward, FiLock } from 'react-icons/fi';

export default function FeaturesBar() {
  const features = [
    { icon: FiTruck, title: 'Free Insured Transit', sub: 'Doorstep Delivery' },
    { icon: FiShield, title: 'Lifetime Exchange', sub: '100% Guaranteed' },
    { icon: FiAward, title: 'IGI & BIS Certified', sub: '100% Hallmarked' },
    { icon: FiLock, title: 'Cash on Delivery', sub: 'Safe & Verified' },
  ];

  return (
    <div className="bg-[#FAF8F5] py-7 border-b border-[#EAE6DF]">
      <div className="container-luxury px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#EAE6DF]">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center pt-3 md:pt-0 group">
              <feature.icon size={22} className="text-[#C5A059] transition-transform duration-300 group-hover:-translate-y-0.5 mb-2" />
              <span className="font-cinzel text-[12px] md:text-[13px] font-semibold tracking-wider uppercase text-[#1F1517]">
                {feature.title}
              </span>
              <span className="font-montserrat text-[10px] text-[#756A63] tracking-widest uppercase mt-0.5">
                {feature.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
