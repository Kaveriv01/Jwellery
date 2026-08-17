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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-2">
              <feature.icon size={20} className="text-[#5C1D24] mb-1" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-widest text-[#333]">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
