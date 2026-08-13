import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <>
      <Helmet><title>About Us — Jwellery</title><meta name="description" content="Learn about Jwellery's story, craftsmanship, and commitment to luxury jewelry." /></Helmet>
      <div className="bg-[#1a1a1a] text-white py-20">
        <div className="container-luxury text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">Our Story</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-5xl lg:text-6xl mb-6">Crafting Timeless<br />Elegance</motion.h1>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">From the finest ateliers of India, we bring you jewelry that transcends generations.</p>
        </div>
      </div>
      <div className="container-luxury py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">Who We Are</p>
            <h2 className="font-serif text-3xl text-gray-900 mb-4">A Legacy of Artisanship</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Jwellery was founded with a singular vision — to make luxury jewelry accessible while preserving the highest standards of craftsmanship.</p>
            <p className="text-gray-600 leading-relaxed">Every piece in our collection is handcrafted by master artisans, using ethically sourced materials and BIS-certified gold and silver.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600" alt="About Jwellery" className="rounded-2xl w-full aspect-square object-cover" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center py-12 border-t border-b border-gray-100">
          {[['10K+', 'Happy Customers'], ['500+', 'Unique Designs'], ['100%', 'BIS Hallmarked'], ['7-Day', 'Easy Returns']].map(([val, label]) => (
            <div key={label}><p className="font-serif text-4xl text-[#c9a84c] mb-1">{val}</p><p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p></div>
          ))}
        </div>
      </div>
    </>
  );
}
