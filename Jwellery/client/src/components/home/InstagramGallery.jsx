import { Link } from 'react-router-dom';

const INSTAGRAM_IMAGES = [
  '/images/home/cat-necklaces.jpg',
  '/images/home/cat-earrings.jpg',
  '/images/home/cat-bracelets.jpg',
  '/images/home/cat-rings.jpg',
  '/images/home/hero-new.png',
  '/images/home/experience-banner.jpg',
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
