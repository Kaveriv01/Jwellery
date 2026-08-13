import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function OrderFailurePage() {
  return (
    <>
      <Helmet><title>Payment Failed — Jwellery</title></Helmet>
      <div className="container-luxury py-20 text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-400" />
        </motion.div>
        <h1 className="font-serif text-3xl text-gray-900 mb-3">Payment Failed</h1>
        <p className="text-gray-500 mb-8">Something went wrong with your payment. Your cart has been saved — please try again.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/checkout" className="btn-gold rounded-xl py-3 px-6">Retry Payment</Link>
          <Link to="/cart" className="btn-outline-gold rounded-xl py-3 px-6">Back to Cart</Link>
        </div>
      </div>
    </>
  );
}
