import { Link } from 'react-router-dom';

const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1573408301145-b98c41e8c1b2?auto=format&fit=crop&q=80&w=800',
];

export default function InstagramGallery() {
  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-[#C7A56A] text-[10px] tracking-widest uppercase mb-2">Follow Our Journey</p>
        <h2 className="text-3xl text-[#5C1D24] mb-8 font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          @tarinijewellers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {INSTAGRAM_IMAGES.map((img, idx) => (
            <div key={idx} className={`bg-[#FAF8F5] overflow-hidden ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <img
                src={img}
                alt="Instagram post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
