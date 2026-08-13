import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import TariniLoader from '../components/home/TariniLoader';


export default function RootLayout() {
  const { pathname } = useLocation();
  const [loaderDone, setLoaderDone] = useState(false);

  // Check if loader was already shown this session
  useEffect(() => {
    if (sessionStorage.getItem('tarini-loader-seen')) {
      setLoaderDone(true);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <>

      {/* Cinematic loader (first visit only) */}
      {!loaderDone && (
        <TariniLoader onComplete={() => setLoaderDone(true)} />
      )}

      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </>
  );
}
