import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../lib/utils';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [displayName, setDisplayName] = useState('तारिणी');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      setDisplayName(res.user.name || 'तारिणी');
      setShowSplash(true);

      // Navigate after 5 seconds (5000ms)
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 5000);
    } catch (error) {
      const msg = getErrorMessage(error);
      if (error?.response?.data?.requiresVerification) {
        navigate('/verify-otp', { state: { userId: error.response.data.userId } });
      } else {
        toast.error(msg);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <Helmet><title>Sign In — Jwellery</title></Helmet>

      {/* Embedded Shimmer and Particle Animations */}
      <style>{`
        @keyframes float-dust {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-dust-1 { animation: float-dust 8s infinite ease-in-out; }
        .animate-dust-2 { animation: float-dust 11s infinite ease-in-out; }
        
        @keyframes sweep-shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .button-shimmer::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: sweep-shimmer 3s infinite linear;
        }
      `}</style>

      <div className="min-h-screen flex bg-gradient-to-br from-[#FDFBF7] via-[#FDFBF7] to-[#F6EBD5] overflow-hidden">
        {/* ── Left Side: Luxury Editorial Brand Showcase ────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=85"
              alt="Diamond Jewelry Showcase"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/45 to-[#C5A059]/25" />
          </div>

          {/* Floating gold dust particles */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#C5A059] rounded-full blur-[1px] animate-dust-1" />
            <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-[#EAD7B0] rounded-full blur-[2px] animate-dust-2" />
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-dust-1" style={{ animationDelay: '2s' }} />
          </div>

          {/* Top Row: Brand Logo */}
          <div className="relative z-20">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl text-white tracking-[0.15em] font-light">
                JWELLERY
              </span>
              <p className="text-[8px] text-[#C5A059] tracking-[0.4em] uppercase font-semibold mt-1">
                LUXURY REDEFINED
              </p>
            </Link>
          </div>

          {/* Middle Row: Hero Headings */}
          <div className="relative z-20 space-y-4 max-w-md">
            <p className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase font-bold">
              ✦ Exclusive Portal ✦
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight font-light tracking-wide">
              WELCOME BACK
            </h1>
            <h2 className="text-[#EAD7B0] font-serif text-lg font-light tracking-wide">
              Continue Your Journey of Timeless Luxury
            </h2>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              Access your wishlist, exclusive collections, personalized recommendations and order history.
            </p>
          </div>

          {/* Bottom Row: Editorial Trust Pillars */}
          <div className="relative z-20 border-t border-white/10 pt-6 flex gap-8 text-[10px] text-white/40 tracking-[0.2em] uppercase font-light">
            <span>Crafted with Precision</span>
            <span>•</span>
            <span>BIS Hallmarked Gold</span>
            <span>•</span>
            <span>Certified Natural Diamonds</span>
          </div>
        </div>

        {/* ── Right Side: Premium Glass Authentication Card ────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-lg relative z-10"
          >
            <Card className="bg-white/95 backdrop-blur-2xl border border-[#C5A059]/35 shadow-2xl rounded-[28px] p-8 sm:p-12 border-solid ring-0">
              {/* Mobile Logo Showcase */}
              <div className="text-center mb-8 lg:hidden">
                <Link to="/" className="inline-block">
                  <span className="font-serif text-2xl text-gray-900 tracking-widest font-light">
                    JWELLERY
                  </span>
                  <p className="text-[7px] text-[#C5A059] tracking-[0.4em] uppercase font-bold mt-1">
                    Luxury Redefined
                  </p>
                </Link>
              </div>

              {/* Heading titles */}
              <CardHeader className="p-0 mb-8">
                <CardTitle className="font-serif text-3xl text-gray-900 font-light tracking-wide">
                  Sign In
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-2 font-light">
                  New to JWELLERY?{' '}
                  <Link to="/register" className="text-[#C5A059] hover:underline font-medium inline-flex items-center gap-0.5">
                    Create your luxury account →
                  </Link>
                </CardDescription>
              </CardHeader>

              {/* Inputs & Form */}
              <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Input */}
                  <motion.div variants={itemVariants}>
                    <Label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#1F1517] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`h-[60px] bg-white border border-[#C5A059]/20 rounded-xl pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-light ${
                          errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-light">{errors.email.message}</p>}
                  </motion.div>

                  {/* Password Input */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="password" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#1F1517]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        Password
                      </Label>
                      <Link to="/forgot-password" className="text-[10px] uppercase tracking-[0.1em] text-[#C5A059] hover:underline font-medium">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`h-[60px] bg-white border border-[#C5A059]/20 rounded-xl pl-12 pr-12 text-sm text-gray-800 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-light ${
                          errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1.5 font-light">{errors.password.message}</p>}
                  </motion.div>

                  {/* Sign In Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[54px] bg-gradient-to-r from-[#C5A059] via-[#F3E7C4] to-[#C5A059] text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-xl relative overflow-hidden transition-all duration-300 button-shimmer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>

              {/* Trust Badges */}
              <motion.div
                variants={itemVariants}
                className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4"
              >
                {[
                  'BIS Hallmarked Gold',
                  '100% Secure Checkout',
                  'Certified Diamonds',
                  'Trusted by Thousands',
                ].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-[10px] text-gray-500 font-light">
                    <ShieldCheck size={14} className="text-[#C5A059] flex-shrink-0" />
                    <span>{badge}</span>
                  </div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ── 5-Second Luxury Traditional Marathi Welcome Overlay (तारिणी / Tarini) ────────────────────── */}
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden"
        >
          {/* Traditional Jewelry Background with Warm Royal Overlay */}
          <div className="absolute inset-0 z-0">
            <motion.img
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: 'easeOut' }}
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=85"
              alt="Traditional Royal Jewelry"
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2C1810]/90 via-[#4A0E17]/75 to-[#C5A059]/45 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          </div>

          {/* Royal Decorative Card with Animated Framer Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center max-w-sm w-full bg-gradient-to-b from-[#FDFBF7]/95 via-[#FFF9EE]/90 to-[#F5E6C8]/95 backdrop-blur-md p-10 rounded-[32px] border-2 border-[#C5A059]/60 shadow-[0_20px_60px_rgba(0,0,0,0.4)] space-y-4"
          >
            {/* Traditional Golden Sparkle Icon with Rotation & Glow */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6B23] p-0.5 shadow-lg flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-[#3A090F] flex items-center justify-center">
                <motion.span
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#F3E7C4] text-2xl"
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>

            {/* Animated Tarini in Marathi (Scale + Maroon with Subtle Gold Glow Pulse) */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.7, letterSpacing: '0.05em' }}
              animate={{
                opacity: 1,
                scale: [0.9, 1.08, 1],
                letterSpacing: '0.15em',
              }}
              transition={{
                duration: 2.2,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-serif text-6xl sm:text-7xl text-[#5B0715] font-bold py-3 drop-shadow-[0_2px_8px_rgba(201,162,74,0.35)]"
            >
              तारिणी
            </motion.h1>

            {/* Glowing Golden Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '90px' }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#C5A059] to-transparent shadow-[0_0_10px_#C5A059]"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

