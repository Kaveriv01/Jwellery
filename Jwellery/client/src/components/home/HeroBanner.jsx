import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex flex-col items-center justify-between py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/home/our-story-new.png"
          alt="Timeless, Beautifully You"
          className="w-full h-full object-cover object-center"
        />
        {/* We removed the black overlay so the image's original colors shine through */}
      </div>

      {/* Hidden SEO Text (for accessibility/search engines without cluttering the image) */}
      <div className="sr-only">
        <h1>Timeless, Beautifully You.</h1>
        <p>Simple. Elegant. Unforgettable. For the moments that matter most. Wedding Day Diamonds.</p>
      </div>
    </section>
  );
}
