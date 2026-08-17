import { Link } from 'react-router-dom';

export default function EditorialBanner() {
  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Image */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-[#FAF8F5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"
                alt="Tarini Jewellery"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
            <span className="text-[#C7A56A] text-[10px] tracking-[0.2em] font-semibold uppercase mb-4 block">
              OUR VISION
            </span>
            <h2 
              className="text-[#5C1D24] text-3xl md:text-4xl leading-tight mb-4 font-normal" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Jewellery made to look perfect on everyone.
            </h2>
            <h3 
              className="text-[#5C1D24] text-xl italic mb-6 font-normal"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Indian Heritage pieces reimagined for the modern era.
            </h3>
            <p className="text-[#756B62] text-sm leading-relaxed mb-8 font-light">
              We carefully craft our pieces using the finest materials, combining traditional Indian artistry with contemporary design aesthetics. Discover a collection that celebrates your unique style and elegance.
            </p>
            <Link
              to="/about"
              className="inline-block bg-[#5C1D24] text-white px-8 py-3 text-[10px] tracking-widest uppercase hover:bg-[#3A0D15] transition-colors"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
