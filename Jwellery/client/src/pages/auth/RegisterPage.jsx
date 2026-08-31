import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Gem, Mail, Lock, User, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../lib/utils';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      if (res.requiresVerification) {
        toast.success('Account created! Please verify your email.');
        navigate('/verify-otp', { state: { userId: res.userId } });
        return;
      }

      if (res.accessToken) {
        sessionStorage.setItem('accessToken', res.accessToken);
      }
      toast.success(`Account created! Welcome, ${res.user?.name || data.name}! 🎉`);
      // Reload or navigate home so auth state refreshes
      window.location.href = '/';
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Helmet><title>Create Account — Jwellery</title></Helmet>
      <div className="min-h-screen flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a1a] flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900" alt="" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center">
                <Gem size={15} className="text-white" />
              </div>
              <span className="font-serif text-2xl text-white">JWELLERY</span>
            </Link>
          </div>
          <div className="relative z-10">
            <p className="font-serif text-5xl text-white leading-tight mb-4">Join Our<br />Circle</p>
            <p className="text-white/50 text-sm">Get early access, exclusive offers, and personalized jewelry recommendations.</p>
          </div>
          <p className="relative z-10 text-[#C5A059] text-xs tracking-widest">✦ WELCOME10 — 10% off your first order ✦</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center"><Gem size={15} className="text-white" /></div>
              <span className="font-serif text-xl text-gray-900">JWELLERY</span>
            </Link>
            <h1 className="font-serif text-3xl text-gray-900 mb-1">Create Account</h1>
            <p className="text-sm text-[#756A63] mb-8">Already have an account? <Link to="/login" className="text-[#C5A059] hover:underline font-medium">Sign in</Link></p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField icon={User} label="Full Name" error={errors.name?.message}>
                <input {...register('name')} placeholder="Your full name" className={`input-gold !pl-10 ${errors.name ? 'border-red-400' : ''}`} />
              </FormField>

              <FormField icon={Mail} label="Email Address" error={errors.email?.message}>
                <input {...register('email')} type="email" placeholder="your@email.com" className={`input-gold !pl-10 ${errors.email ? 'border-red-400' : ''}`} />
              </FormField>

              <FormField icon={Phone} label="Mobile Number (optional)" error={errors.phone?.message}>
                <input {...register('phone')} type="tel" placeholder="9876543210" className={`input-gold !pl-10 ${errors.phone ? 'border-red-400' : ''}`} />
              </FormField>

              <FormField icon={Lock} label="Password" error={errors.password?.message}>
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" className={`input-gold !pl-10 !pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756A63]">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </FormField>

              <FormField icon={Lock} label="Confirm Password" error={errors.confirmPassword?.message}>
                <input {...register('confirmPassword')} type="password" placeholder="Re-enter password" className={`input-gold !pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
              </FormField>

              <p className="text-[11px] text-[#756A63]">By creating an account, you agree to our <Link to="/terms" className="text-[#C5A059] hover:underline">Terms</Link> and <Link to="/privacy" className="text-[#C5A059] hover:underline">Privacy Policy</Link>.</p>

              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-gold w-full rounded-xl py-3.5 text-sm disabled:opacity-60">
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function FormField({ icon: Icon, label, error, children }) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-[#1F1517] uppercase tracking-wide mb-1.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#756A63] z-10" />
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
