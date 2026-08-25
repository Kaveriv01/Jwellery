import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { debounce } from '../../lib/utils';
import { productService } from '../../services/productService';
import { openCartDrawer } from '../cart/CartDrawer';
import { toast } from 'sonner';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const performSearch = debounce(async (query) => {
    if (query.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const { data } = await productService.search({ q: query, limit: 6 });
      setSearchResults(data.products);
    } catch { setSearchResults([]); }
    finally { setSearchLoading(false); }
  }, 350);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    performSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  // Desktop Navigation Link with Active State
  const DesktopNavLink = ({ to, children }) => {
    const isActive = location.pathname + location.search === to || location.pathname === to;
    return (
      <Link to={to} className="relative group py-2">
        <span
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          className={`relative z-10 text-[12px] lg:text-[13px] tracking-[0.08em] uppercase font-[600] transition-colors duration-[280ms] ease-out ${
            isActive ? 'text-[#756B62]' : 'text-[#35050D] group-hover:text-[#C7A56A]'
          }`}
        >
          {children}
        </span>
        <span className={`absolute left-0 right-0 bottom-0 h-[1.5px] transform ${isActive ? 'bg-[#756B62] scale-x-100' : 'bg-[#C7A56A] scale-x-0 group-hover:scale-x-100'} transition-transform duration-[280ms] origin-center ease-out`} />
      </Link>
    );
  };

  // Mobile Navigation Link with Active State
  const MobileNavLink = ({ to, children }) => {
    const isActive = location.pathname + location.search === to || location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setMenuOpen(false)} 
        className={`py-4 text-[12px] tracking-[0.08em] uppercase font-[600] border-b border-gray-100 transition-all duration-300 ${
          isActive ? 'text-[#756B62] pl-2' : 'text-[#35050D] hover:text-[#C7A56A] hover:pl-2'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* ── Main Navbar ─────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-[300ms] ease-out border-b ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm' 
            : 'bg-white'
        } border-gray-100`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20 lg:h-24">
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-[#111] hover:text-[#666] transition-all duration-300" onClick={() => setMenuOpen(true)}>
              <Menu size={21} strokeWidth={1.8} />
            </button>

            {/* LEFT: Logo */}
            <Link to="/" className="flex flex-col items-center justify-center flex-shrink-0 group lg:pr-10 lg:mr-4">
              {/* Ornate Luxury Lotus Motif */}
              <svg viewBox="0 0 100 100" className="w-11 h-11 lg:w-14 lg:h-14 mb-1 drop-shadow-sm transition-all duration-700 group-hover:scale-110" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FFF2CD" />
                    <stop offset="100%" stopColor="#AA771C" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" stroke="url(#goldGradient)" strokeWidth="2" strokeDasharray="6 6" className="group-hover:rotate-180 transition-transform duration-[3000ms] ease-in-out" style={{ transformOrigin: 'center' }} />
                <circle cx="50" cy="50" r="38" stroke="#8B2332" strokeWidth="1" />
                <path d="M 50 18 C 65 38, 70 58, 50 82 C 30 58, 35 38, 50 18 Z" fill="url(#goldGradient)" stroke="#8B2332" strokeWidth="1.5" />
                <path d="M 50 82 C 25 77, 15 52, 20 37 C 30 47, 40 57, 50 82 Z" fill="#8B2332" />
                <path d="M 50 82 C 75 77, 85 52, 80 37 C 70 47, 60 57, 50 82 Z" fill="#8B2332" />
                <path d="M 50 42 L 56 52 L 50 62 L 44 52 Z" fill="#FFF2CD" stroke="#AA771C" strokeWidth="1" />
              </svg>
              <div className="flex flex-col items-center mt-1">
                <span className="text-[24px] lg:text-[28px] font-normal tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#6a1b24] to-[#8B2332] group-hover:from-[#D4AF37] group-hover:to-[#AA771C] transition-all duration-700 leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  तारिणी
                </span>
                <span className="text-[6px] lg:text-[7px] tracking-[0.45em] text-[#756B62] uppercase mt-1.5 font-bold leading-none pl-[0.45em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  TARINI
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              <DesktopNavLink to="/products?isNewArrival=true">New In</DesktopNavLink>
              <DesktopNavLink to="/category/necklaces">Necklaces</DesktopNavLink>
              <DesktopNavLink to="/category/earrings">Earrings</DesktopNavLink>
              <DesktopNavLink to="/category/rings">Rings</DesktopNavLink>
              <DesktopNavLink to="/category/bracelets">Bracelets</DesktopNavLink>
              <DesktopNavLink to="/collections">Collections</DesktopNavLink>
              <DesktopNavLink to="/sale">Sale</DesktopNavLink>
            </nav>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-5 sm:gap-6">
              <button onClick={() => setSearchOpen(true)} className="group text-[#5C1D24] hover:text-[#C7A56A] transition-all duration-300" aria-label="Search">
                <Search size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
              </button>

              <div className="relative hidden lg:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="group text-[#5C1D24] hover:text-[#C7A56A] transition-all duration-300" aria-label="Account">
                  <User size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 top-full mt-4 w-56 bg-white border border-gray-100 shadow-xl z-50 rounded-none">
                      {isAuthenticated ? (
                        <>
                          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                            <p className="font-semibold text-sm text-[#111]">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                          </div>
                          <div className="py-2">
                            {isAdmin && <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-gray-600 hover:text-[#111] hover:bg-gray-50 transition-colors"><Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Admin</Link>}
                            <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-gray-600 hover:text-[#111] hover:bg-gray-50 transition-colors"><User size={14} className="group-hover:scale-110 transition-transform" /> Profile</Link>
                            <Link to="/profile/orders" onClick={() => setUserMenuOpen(false)} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-gray-600 hover:text-[#111] hover:bg-gray-50 transition-colors"><Package size={14} className="group-hover:scale-110 transition-transform" /> Orders</Link>
                            <button onClick={handleLogout} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-red-500 hover:bg-gray-50 w-full text-left transition-colors"><LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Logout</button>
                          </div>
                        </>
                      ) : (
                        <div className="p-5">
                          <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block w-full text-center mb-2 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] bg-[#111] text-white hover:bg-[#333] transition-colors duration-300">Sign In</Link>
                          <Link to="/register" onClick={() => setUserMenuOpen(false)} className="block w-full text-center py-3 text-[10px] font-semibold uppercase tracking-[0.1em] border border-[#111] text-[#111] hover:bg-gray-50 transition-colors duration-300">Create Account</Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/wishlist" className="relative group text-[#5C1D24] hover:text-[#C7A56A] transition-all duration-300 hidden sm:block" aria-label="Wishlist">
                <Heart size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#5C1D24] text-white text-[9px] rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>}
              </Link>

              <button onClick={() => openCartDrawer()} className="relative group text-[#5C1D24] hover:text-[#C7A56A] transition-all duration-300" aria-label="Cart">
                <ShoppingBag size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#5C1D24] text-white text-[9px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar ────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMenuOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }} className="fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col items-center justify-center cursor-pointer group mt-2">
                  <svg viewBox="0 0 100 100" className="w-10 h-10 mb-1 drop-shadow-sm transition-all duration-700 group-hover:scale-110" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="goldGradientMb" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#FFF2CD" />
                        <stop offset="100%" stopColor="#AA771C" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" stroke="url(#goldGradientMb)" strokeWidth="2" strokeDasharray="6 6" className="group-hover:rotate-180 transition-transform duration-[3000ms] ease-in-out" style={{ transformOrigin: 'center' }} />
                    <circle cx="50" cy="50" r="38" stroke="#8B2332" strokeWidth="1" />
                    <path d="M 50 18 C 65 38, 70 58, 50 82 C 30 58, 35 38, 50 18 Z" fill="url(#goldGradientMb)" stroke="#8B2332" strokeWidth="1.5" />
                    <path d="M 50 82 C 25 77, 15 52, 20 37 C 30 47, 40 57, 50 82 Z" fill="#8B2332" />
                    <path d="M 50 82 C 75 77, 85 52, 80 37 C 70 47, 60 57, 50 82 Z" fill="#8B2332" />
                    <path d="M 50 42 L 56 52 L 50 62 L 44 52 Z" fill="#FFF2CD" stroke="#AA771C" strokeWidth="1" />
                  </svg>
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-[22px] font-normal tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#6a1b24] to-[#8B2332] group-hover:from-[#D4AF37] group-hover:to-[#AA771C] transition-all duration-700 leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      तारिणी
                    </span>
                    <span className="text-[6px] tracking-[0.45em] text-[#756B62] uppercase mt-1.5 font-bold leading-none pl-[0.45em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      TARINI
                    </span>
                  </div>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-[#111] hover:text-[#666] transition-all duration-300"><X size={20} strokeWidth={1.5} /></button>
              </div>
              <nav className="flex-1 px-5 py-5 flex flex-col gap-1 bg-white">
                <MobileNavLink to="/products?isNewArrival=true">New In</MobileNavLink>
                <MobileNavLink to="/category/necklaces">Necklaces</MobileNavLink>
                <MobileNavLink to="/category/earrings">Earrings</MobileNavLink>
                <MobileNavLink to="/category/rings">Rings</MobileNavLink>
                <MobileNavLink to="/category/bracelets">Bracelets</MobileNavLink>
                <MobileNavLink to="/collections">Collections</MobileNavLink>
                <MobileNavLink to="/sale">Sale</MobileNavLink>
                
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="py-4 text-[12px] text-[#756B62] hover:text-[#35050D] tracking-[0.08em] uppercase font-[600] flex items-center gap-3 mt-4 transition-colors"><Heart size={16} /> Wishlist</Link>
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="py-4 text-[12px] text-[#756B62] hover:text-[#35050D] tracking-[0.08em] uppercase font-[600] flex items-center gap-3 transition-colors"><User size={16} /> Account / Login</Link>
                ) : (
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-4 text-[12px] text-[#756B62] hover:text-[#35050D] tracking-[0.08em] uppercase font-[600] flex items-center gap-3 transition-colors"><User size={16} /> My Profile</Link>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-[#FFFFFF]/95 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4" onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); } }}>
            <motion.div initial={{ y: -40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-3xl bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-2 relative rounded-sm">
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="absolute top-6 right-6 text-gray-400 hover:text-black hover:rotate-90 transition-all duration-300">
                <X size={24} strokeWidth={1} />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 p-5 border-b border-gray-100">
                <Search size={22} className="text-[#111] flex-shrink-0" strokeWidth={1.5} />
                <input ref={searchRef} type="text" placeholder="Search our collections..." value={searchQuery} onChange={handleSearchChange} autoFocus className="flex-1 text-xl lg:text-2xl text-[#111] outline-none placeholder-gray-300 font-light bg-transparent" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
              </form>
              <div className="max-h-[60vh] overflow-y-auto p-5">
                {searchLoading ? <div className="text-center text-sm text-[#666] font-medium py-12 animate-pulse">Searching the archives...</div> : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <Link key={product._id} to={`/products/${product.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="group flex items-center gap-5 p-3 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 rounded-sm">
                        <div className="w-16 h-16 overflow-hidden rounded-sm">
                          <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                          <p className="text-sm text-[#111] font-medium transition-colors">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-1 font-semibold">${(product.discountPrice || product.price)?.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="text-center text-sm text-gray-500 py-12 font-medium">No results found for "{searchQuery}"</div>
                ) : (
                  <div className="py-6">
                    <p className="text-[10px] text-[#111] uppercase tracking-[0.2em] font-bold mb-5">Trending Searches</p>
                    <div className="flex flex-wrap gap-3">
                      {['Diamond Ring', 'Gold Necklace', 'Earrings', 'Bracelet'].map(term => (
                        <button key={term} onClick={() => { setSearchQuery(term); performSearch(term); }} className="text-xs font-medium tracking-wide bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#111] px-5 py-2.5 transition-colors border border-gray-100 rounded-sm">{term}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
