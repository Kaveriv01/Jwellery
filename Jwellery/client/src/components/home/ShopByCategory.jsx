import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=90&w=1200', desc: 'Discover Tarini\'s finest diamond rings.' },
  { id: 'necklaces', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=90&w=1200', desc: 'Explore the newest necklace collection.' },
  { id: 'earrings', name: 'Earrings', image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=90&w=1200', desc: 'Handcrafted earrings for every occasion.' },
  { id: 'bracelets', name: 'Bracelets', image: '/images/categories/bracelets-banner.jpg', desc: 'Elegant bracelets, perfect for gifting.' },
];

export default function ShopByCategory() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} to={`/category/${cat.id}`} className="group block">
            <div className="overflow-hidden bg-[#F8F4EE] relative border border-[#EAE6DF]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full aspect-[4/5] object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[#35050D]/0 group-hover:bg-[#35050D]/5 transition-colors duration-[400ms]" />
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#EAE6DF] -mt-8 relative z-10 mx-4 text-center transition-all duration-[400ms] ease-out">
              <h3 className="text-[#35050D] font-normal text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{cat.name}</h3>
              <p className="text-[10px] text-[#756869] uppercase tracking-[0.15em] font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Shop Collection</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
