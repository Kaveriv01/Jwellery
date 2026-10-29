import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart,
  Users, Tag, Image, Star, BarChart3, LogOut, Menu, X,
  ChevronRight, Gem, ExternalLink, PlusCircle, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Admin session ended.');
    navigate('/login');
  };

  const currentPage = navItems.find((item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label || 'Administration Suite';

  return (
    <div className="flex h-screen bg-[#FBF9F5] overflow-hidden font-sans">
      {/* ── Mobile overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#160B0E]/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#160B0E] border-r border-[#C5A059]/25 flex flex-col transition-transform duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo and Brand Header */}
        <div className="px-6 py-6 border-b border-[#C5A059]/20 bg-gradient-to-b from-[#221015] to-[#160B0E]">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2D] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#160B0E] rounded-[10px] flex items-center justify-center">
                  <Gem size={18} className="text-[#C5A059]" />
                </div>
              </div>
              <div>
                <p className="text-white font-serif text-xl tracking-[0.12em] font-normal leading-none group-hover:text-[#C5A059] transition-colors">
                  TARINI
                </p>
                <p className="text-[#C5A059] text-[8.5px] tracking-[0.3em] uppercase font-semibold mt-1">
                  ADMIN SUITE
                </p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Return to Storefront Pill */}
          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-[#C5A059] text-[#C5A059] hover:text-black border border-[#C5A059]/30 text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm group"
          >
            <span>🛍️ View Live Store</span>
            <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-5 px-3 overflow-y-auto space-y-1">
          <p className="text-[#C5A059]/50 text-[10px] font-semibold uppercase tracking-[0.25em] px-3 mb-2">
            Store Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C5A059]/25 to-transparent text-[#F3E7C4] font-semibold border-l-2 border-[#C5A059] shadow-sm'
                    : 'text-white/65 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-[#C5A059]' : 'text-white/50'} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-[#C5A059]" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin info & Actions */}
        <div className="p-4 border-t border-[#C5A059]/20 bg-[#12080A]">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8C6D2D] flex items-center justify-center text-black font-bold text-xs shadow">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-white text-xs font-semibold truncate">{user?.name || 'Tarini Admin'}</p>
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-white/40 text-[10.5px] truncate">{user?.email || 'admin@tarini.com'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-medium transition-colors"
            >
              <ExternalLink size={12} /> Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium transition-colors"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Workspace ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E8DED1] px-5 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-semibold text-gray-900 tracking-wide">
                  {currentPage}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={11} /> Live Demo
                </span>
              </div>
              <p className="text-[11px] text-[#756A63] hidden sm:block">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1F1517] hover:bg-[#2B0E14] text-[#C5A059] hover:text-[#F3E7C4] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
            >
              <PlusCircle size={14} />
              <span className="hidden sm:inline">Add Product</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#1F1517] border border-[#DED3C4] text-xs font-medium tracking-wide transition-all shadow-xs"
              title="Return to Customer Storefront"
            >
              <ExternalLink size={13} className="text-[#C5A059]" />
              <span className="hidden md:inline">View Store</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
