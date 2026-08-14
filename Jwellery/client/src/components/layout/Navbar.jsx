import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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



  const NavLink = ({ to, children }) => (
    <Link to={to} className="relative group text-[11px] text-[#181516] tracking-[0.10em] uppercase font-medium py-2">
      <span className="relative z-10 transition-colors duration-300 group-hover:text-[#560817]">{children}</span>
      <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-[#560817] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-[250ms] origin-center ease-out"></span>
    </Link>
  );

  return (
    <>


      {/* ── Main Navbar ─────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-[300ms] ease-out border-b ${
          scrolled 
            ? 'bg-[#F8F4EC]/95 backdrop-blur-md border-[#FAF6EE]/80 shadow-[0_4px_25px_rgba(86,8,23,0.02)]' 
            : 'bg-[#FFFFFF] border-[#FAF6EE]'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-[#560817] hover:text-[#B08A45] hover:scale-110 transition-all duration-300" onClick={() => setMenuOpen(true)}>
              <Menu size={21} strokeWidth={1.8} />
            </button>

            {/* LEFT: Logo */}
            <Link to="/" className="flex flex-col items-center justify-center lg:items-start flex-shrink-0 group lg:pr-10 lg:mr-4">
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl lg:text-2xl text-[#560817] tracking-[0.25em] leading-none font-semibold group-hover:opacity-85 transition-opacity duration-500">
                TARINI
              </span>
              <span className="text-[8px] lg:text-[9px] text-[#B08A45] tracking-[0.35em] uppercase leading-none mt-1.5 font-bold group-hover:opacity-80 transition-opacity">
                JEWELLERS
              </span>
            </Link>

            {/* CENTER: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-10">
              <NavLink to="/products?sort=-createdAt">New Arrivals</NavLink>
              <NavLink to="/category/rings">Rings</NavLink>
              <NavLink to="/category/necklaces">Necklaces</NavLink>
              <NavLink to="/category/earrings">Earrings</NavLink>
              <NavLink to="/category/bracelets">Bracelets</NavLink>
              <NavLink to="/products?sort=-rating">Bestsellers</NavLink>
            </nav>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => setSearchOpen(true)} className="group text-[#181516] hover:text-[#560817] transition-all duration-300 hover:scale-110 hover:-translate-y-0.5" aria-label="Search">
                <Search size={21} strokeWidth={1.8} className="transition-transform duration-300" />
              </button>

              <div className="relative hidden lg:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="group text-[#181516] hover:text-[#560817] transition-all duration-300 hover:scale-110 hover:-translate-y-0.5" aria-label="Account">
                  <User size={21} strokeWidth={1.8} className="transition-transform duration-300" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 top-full mt-4 w-56 bg-white border border-[#FAF6EE] shadow-[0_20px_40px_rgba(86,8,23,0.04)] z-50 rounded-sm">
                      {isAuthenticated ? (
                        <>
                          <div className="px-5 py-4 bg-[#F8F4EC] border-b border-[#FAF6EE]">
                            <p className="font-semibold text-sm text-[#560817]">{user?.name}</p>
                            <p className="text-xs text-[#746760] truncate mt-0.5">{user?.email}</p>
                          </div>
                          <div className="py-2">
                            {isAdmin && <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-[#746760] hover:text-[#560817] hover:bg-[#F8F4EC] transition-colors"><Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Admin</Link>}
                            <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-[#746760] hover:text-[#560817] hover:bg-[#F8F4EC] transition-colors"><User size={14} className="group-hover:scale-110 transition-transform" /> Profile</Link>
                            <Link to="/profile/orders" onClick={() => setUserMenuOpen(false)} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-[#746760] hover:text-[#560817] hover:bg-[#F8F4EC] transition-colors"><Package size={14} className="group-hover:scale-110 transition-transform" /> Orders</Link>
                            <button onClick={handleLogout} className="group flex items-center gap-3 px-5 py-2.5 text-xs text-red-500 hover:bg-[#F8F4EC] w-full text-left transition-colors"><LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Logout</button>
                          </div>
                        </>
                      ) : (
                        <div className="p-5">
                          <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block w-full text-center mb-2 py-3 text-[10px] font-bold uppercase tracking-widest bg-[#560817] text-white hover:bg-[#3D0610] transition-colors duration-300 rounded-[2px]">Sign In</Link>
                          <Link to="/register" onClick={() => setUserMenuOpen(false)} className="block w-full text-center py-3 text-[10px] font-bold uppercase tracking-widest border border-[#560817] text-[#560817] hover:bg-[#F8F4EC] transition-colors duration-300 rounded-[2px]">Create Account</Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/wishlist" className="relative group text-[#181516] hover:text-[#560817] transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hidden sm:block" aria-label="Wishlist">
                <Heart size={21} strokeWidth={1.8} className="transition-transform duration-300" />
                {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#560817] text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(86,8,23,0.2)] transition-transform duration-300 group-hover:scale-110">{wishlistCount}</span>}
              </Link>

              <button onClick={() => openCartDrawer()} className="relative group text-[#181516] hover:text-[#560817] transition-all duration-300 hover:scale-110 hover:-translate-y-0.5" aria-label="Cart">
                <ShoppingBag size={21} strokeWidth={1.8} className="transition-transform duration-300" />
                {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#560817] text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(86,8,23,0.2)] transition-transform duration-300 group-hover:scale-110">{totalItems}</span>}
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
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }} className="fixed left-0 top-0 h-full w-80 bg-[#F8F4EC] z-50 overflow-y-auto flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#FAF6EE] bg-white">
                <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#181516] tracking-widest font-medium">TARINI</span>
                <button onClick={() => setMenuOpen(false)} className="text-[#181516] hover:text-[#560817] hover:rotate-90 transition-all duration-300"><X size={20} strokeWidth={1.5} /></button>
              </div>
              <nav className="flex-1 px-5 py-5 flex flex-col gap-1 bg-[#F8F4EC]">
                <Link to="/products?sort=-createdAt" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#181516] tracking-widest uppercase font-medium border-b border-[#FAF6EE] hover:text-[#560817] hover:pl-2 transition-all duration-300">New Arrivals</Link>
                <Link to="/category/rings" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#181516] tracking-widest uppercase font-medium border-b border-[#FAF6EE] hover:text-[#560817] hover:pl-2 transition-all duration-300">Rings</Link>
                <Link to="/category/necklaces" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#181516] tracking-widest uppercase font-medium border-b border-[#FAF6EE] hover:text-[#560817] hover:pl-2 transition-all duration-300">Necklaces</Link>
                <Link to="/category/earrings" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#181516] tracking-widest uppercase font-medium border-b border-[#FAF6EE] hover:text-[#560817] hover:pl-2 transition-all duration-300">Earrings</Link>
                <Link to="/category/bracelets" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#181516] tracking-widest uppercase font-medium border-b border-[#FAF6EE] hover:text-[#560817] hover:pl-2 transition-all duration-300">Bracelets</Link>
                <Link to="/products?sort=-rating" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#181516] tracking-widest uppercase font-medium border-b border-[#FAF6EE] hover:text-[#560817] hover:pl-2 transition-all duration-300">Bestsellers</Link>
                
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#746760] hover:text-[#560817] tracking-widest uppercase font-medium flex items-center gap-3 mt-4 transition-colors"><Heart size={16} /> Wishlist</Link>
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#746760] hover:text-[#560817] tracking-widest uppercase font-medium flex items-center gap-3 transition-colors"><User size={16} /> Account / Login</Link>
                ) : (
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-4 text-sm text-[#746760] hover:text-[#560817] tracking-widest uppercase font-medium flex items-center gap-3 transition-colors"><User size={16} /> My Profile</Link>
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
            <motion.div initial={{ y: -40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-3xl bg-white border border-[#FAF6EE] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-2 relative rounded-sm">
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="absolute top-6 right-6 text-gray-400 hover:text-black hover:rotate-90 transition-all duration-300">
                <X size={24} strokeWidth={1} />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 p-5 border-b border-[#FAF6EE]">
                <Search size={22} className="text-[#B08A45] flex-shrink-0" strokeWidth={1.5} />
                <input ref={searchRef} type="text" placeholder="Search our collections..." value={searchQuery} onChange={handleSearchChange} autoFocus className="flex-1 text-xl lg:text-2xl text-[#181516] outline-none placeholder-gray-300 font-light bg-transparent" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
              </form>
              <div className="max-h-[60vh] overflow-y-auto p-5">
                {searchLoading ? <div className="text-center text-sm text-[#B08A45] font-medium py-12 animate-pulse">Searching the archives...</div> : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <Link key={product._id} to={`/products/${product.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="group flex items-center gap-5 p-3 hover:bg-[#F8F4EC] transition-colors border border-transparent hover:border-[#FAF6EE] rounded-sm">
                        <div className="w-16 h-16 overflow-hidden rounded-sm">
                          <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                          <p className="text-sm text-[#181516] font-medium group-hover:text-[#560817] transition-colors">{product.name}</p>
                          <p className="text-xs text-[#746760] mt-1 font-semibold">₹{(product.discountPrice || product.price)?.toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="text-center text-sm text-[#746760] py-12 font-medium">No results found for "{searchQuery}"</div>
                ) : (
                  <div className="py-6">
                    <p className="text-[10px] text-[#B08A45] uppercase tracking-[0.2em] font-bold mb-5">Trending Searches</p>
                    <div className="flex flex-wrap gap-3">
                      {['Diamond Ring', 'Gold Necklace', 'Earrings', 'Bracelet'].map(term => (
                        <button key={term} onClick={() => { setSearchQuery(term); performSearch(term); }} className="text-xs font-medium tracking-wide bg-[#F8F4EC] hover:bg-[#FAF6EE] text-[#746760] hover:text-[#181516] px-5 py-2.5 transition-colors border border-[#FAF6EE]/50 rounded-sm">{term}</button>
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
