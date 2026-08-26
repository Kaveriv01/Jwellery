import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

/** Full-page loading spinner shown during lazy-loaded route transitions */
export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-t-[#C5A059] border-r-[#C5A059] border-b-transparent border-l-transparent mb-4"
      />
      <div className="flex items-center gap-2">
        <Gem size={18} className="text-[#C5A059]" />
        <span className="font-serif text-lg text-gray-700 tracking-widest">JWELLERY</span>
      </div>
    </div>
  );
}
