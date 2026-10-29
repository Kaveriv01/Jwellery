import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);
  const location = useLocation();

  // WhatsApp Configuration
  const WHATSAPP_NUMBER = '918619859463';
  const DISPLAY_NUMBER = '+91 86198 59463';

  // Automatically show greeting pill after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTooltipDismissed) {
        setShowTooltip(true);
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [isTooltipDismissed]);

  // Craft dynamic greeting based on current page
  const getWhatsAppUrl = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    let message = `Hello Tarini Jewellery! I am browsing your website (${currentUrl}) and would like assistance.`;

    if (location.pathname.startsWith('/products/')) {
      message = `Hello Tarini Jewellery! I am interested in this jewellery piece from your website (${currentUrl}). Could you please share more details or schedule a live preview?`;
    } else if (location.pathname.includes('/category/')) {
      message = `Hello Tarini Jewellery! I am browsing your collection on (${currentUrl}) and need help picking a design.`;
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <aside aria-label="WhatsApp Support" className="fixed z-50 bottom-24 sm:bottom-6 right-4 sm:right-6 flex items-center gap-2.5 pointer-events-auto">
      {/* ── Desktop Floating Message Bubble ── */}
      <AnimatePresence>
        {showTooltip && !isTooltipDismissed && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="hidden sm:flex items-center gap-3 bg-white text-[#1F1517] py-2.5 px-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#EAE6DF] max-w-xs group cursor-pointer"
            onClick={() => window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer')}
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider font-montserrat text-[#1F1517] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Chat with Us
              </span>
              <span className="text-[10px] text-[#756A63] font-montserrat">
                Instant reply on WhatsApp
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsTooltipDismissed(true);
                setShowTooltip(false);
              }}
              className="text-[#756A63] hover:text-[#1F1517] p-0.5 rounded-full hover:bg-gray-100 transition-colors ml-1"
              aria-label="Close notification"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main WhatsApp Floating Button ── */}
      <motion.a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Tarini Jewellery on WhatsApp (${DISPLAY_NUMBER})`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_14px_30px_rgba(37,211,102,0.55)] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
        onMouseEnter={() => setShowTooltip(true)}
      >
        {/* Subtle Luxury Outer Ring Pulse */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

        {/* Online Status Pill Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#25D366] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#128C7E]" />
        </span>

        {/* WhatsApp Official Vector Logo */}
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
          className="relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.777.979-.953 1.179-.175.2-.351.225-.652.075-.3-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.084-.175-.301-.019-.463.132-.613.135-.134.301-.351.451-.527.151-.175.201-.3.301-.5.1-.2.05-.375-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.492-.507-.676-.516-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.375-.276.3-1.053 1.029-1.053 2.51s1.078 2.913 1.229 3.114c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.03-1.43.251-.702.251-1.303.176-1.429-.076-.126-.276-.201-.577-.351zM12.04 2C6.544 2 2.08 6.463 2.08 11.96c0 1.98.583 3.826 1.59 5.385L2 22l4.82-1.611a9.907 9.907 0 005.22 1.531h.004c5.494 0 9.957-4.464 9.957-9.96 0-2.66-1.036-5.161-2.919-7.043A9.894 9.894 0 0012.04 2zm0 18.234h-.003a8.23 8.23 0 01-4.2-1.155l-.301-.179-3.125 1.045 1.05-3.045-.196-.312A8.204 8.204 0 013.78 11.96c0-4.555 3.707-8.261 8.263-8.261 2.207 0 4.282.86 5.843 2.421a8.214 8.214 0 012.418 5.84c0 4.557-3.707 8.274-8.264 8.274z" />
        </svg>
      </motion.a>
    </aside>
  );
}
