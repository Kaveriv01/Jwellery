import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function OrderFailurePage() {
  return (
    <>
      <Helmet><title>Payment Failed — Tarini Jewellers</title></Helmet>
      <div className="container-luxury py-20 text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-16 h-16 rounded-full bg-[#FDFBF7] border border-[#FDFBF7] flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-[#1F1517]" />
        </motion.div>
        <h1 className="text-[32px] text-[#1F1517] mb-3 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Payment Failed</h1>
        <p className="text-[#1F1517] text-[15px] font-light mb-8">Something went wrong with your payment. Your cart has been saved — please try again.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/checkout" className="bg-[#1F1517] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 px-6 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#C5A059] flex items-center justify-center gap-2">Retry Payment</Link>
          <Link to="/cart" className="border border-[#FDFBF7] bg-white text-[#1F1517] hover:bg-[#FDFBF7] py-3.5 px-6 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[2px] transition-all flex items-center justify-center gap-2">Back to Cart</Link>
        </div>
      </div>
    </>
  );
}

