import { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import PageLoader from './components/common/PageLoader';
import TariniLoader from './components/home/TariniLoader';

// ── Customer Pages (lazy loaded) ───────────────────────────────────────────────
const HomePage         = lazy(() => import('./pages/HomePage'));
const ProductsPage     = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CategoryPage     = lazy(() => import('./pages/CategoryPage'));
const CartPage         = lazy(() => import('./pages/CartPage'));
const WishlistPage     = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderFailurePage = lazy(() => import('./pages/OrderFailurePage'));
const OrdersPage       = lazy(() => import('./pages/profile/OrdersPage'));
const OrderDetailPage  = lazy(() => import('./pages/profile/OrderDetailPage'));
const ProfilePage      = lazy(() => import('./pages/profile/ProfilePage'));

// ── Auth Pages ─────────────────────────────────────────────────────────────────
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/auth/RegisterPage'));
const VerifyOTPPage     = lazy(() => import('./pages/auth/VerifyOTPPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('./pages/auth/ResetPasswordPage'));

// ── Static Pages ───────────────────────────────────────────────────────────────
const AboutPage         = lazy(() => import('./pages/AboutPage'));
const ContactPage       = lazy(() => import('./pages/ContactPage'));
const FAQsPage          = lazy(() => import('./pages/FAQsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/policies/PrivacyPolicyPage'));
const TermsPage         = lazy(() => import('./pages/policies/TermsPage'));
const ShippingPolicyPage = lazy(() => import('./pages/policies/ShippingPolicyPage'));
const ReturnPolicyPage  = lazy(() => import('./pages/policies/ReturnPolicyPage'));

// ── Admin Pages ────────────────────────────────────────────────────────────────
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts     = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAddProduct   = lazy(() => import('./pages/admin/AdminAddProduct'));
const AdminEditProduct  = lazy(() => import('./pages/admin/AdminEditProduct'));
const AdminCategories   = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders       = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail  = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCustomers    = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCoupons      = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminBanners      = lazy(() => import('./pages/admin/AdminBanners'));
const AdminReviews      = lazy(() => import('./pages/admin/AdminReviews'));
const AdminAnalytics    = lazy(() => import('./pages/admin/AdminAnalytics'));


export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <TariniLoader onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* ── Customer Routes ──────────────────────────────────────── */}
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="collections" element={<ProductsPage />} />
          <Route path="sale" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faqs" element={<FAQsPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="shipping" element={<ShippingPolicyPage />} />
          <Route path="returns" element={<ReturnPolicyPage />} />

          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success/:id" element={<OrderSuccessPage />} />
          <Route path="order-failure" element={<OrderFailurePage />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/orders" element={<OrdersPage />} />
            <Route path="profile/orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        {/* ── Auth Routes (no layout) ──────────────────────────────── */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<VerifyOTPPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        {/* ── Admin Routes ─────────────────────────────────────────── */}
        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminAddProduct />} />
          <Route path="products/:id/edit" element={<AdminEditProduct />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}
