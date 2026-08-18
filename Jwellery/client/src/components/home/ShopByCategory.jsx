import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', desc: 'Discover Tarini\'s finest diamond rings.' },
  { id: 'necklaces', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', desc: 'Explore the newest necklace collection.' },
  { id: 'earrings', name: 'Earrings', image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800', desc: 'Handcrafted earrings for every occasion.' },
  { id: 'bracelets', name: 'Bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b6?auto=format&fit=crop&q=80&w=800', desc: 'Elegant bracelets, perfect for gifting.' },
];

export default function ShopByCategory() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} to={`/category/${cat.id}`} className="group block">
            <div className="overflow-hidden bg-[#FAF8F5]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#EAE6DF] -mt-10 relative z-10 mx-4 text-center group-hover:shadow-md transition-shadow">
              <h3 className="text-[#5C1D24] font-normal text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{cat.name}</h3>
              <p className="text-[11px] text-[#756B62] uppercase tracking-wider">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
