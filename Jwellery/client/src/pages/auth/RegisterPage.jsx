import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Gem, Mail, Lock, User, Phone, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
  const [isQuickRegistering, setIsQuickRegistering] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (res?.requiresVerification) {
        toast.success('Account created! Please verify your email.');
        navigate('/verify-otp', { state: { userId: res.userId } });
        return;
      }

      toast.success(`Welcome to Tarini, ${data.name}! Your account is active. 🎉`);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Registration could not be completed');
    }
  };

  const handleQuickDemoRegister = async () => {
    setIsQuickRegistering(true);
    const demoPatrons = [
      { name: 'Raj Patil', email: 'raj.patil@gmail.com', phone: '9875464756' },
      { name: 'Pooja Kulkarni', email: 'pooja.kulkarni@gmail.com', phone: '9822012345' },
      { name: 'Aarav Mehta', email: 'aarav.mehta@gmail.com', phone: '9819098765' }
    ];
    const patron = demoPatrons[Math.floor(Math.random() * demoPatrons.length)];
    const uniqueEmail = patron.email.replace('@', `${Math.floor(100 + Math.random() * 900)}@`);

    setValue('name', patron.name);
    setValue('email', uniqueEmail);
    setValue('phone', patron.phone);
    setValue('password', 'Tarini@123');
    setValue('confirmPassword', 'Tarini@123');

    try {
      await registerUser({
        name: patron.name,
        email: uniqueEmail,
        phone: patron.phone,
        password: 'Tarini@123'
      });
      toast.success(`Welcome, ${patron.name}! Account registered and active. 🎉`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error('Quick registration failed');
    } finally {
      setIsQuickRegistering(false);
    }
  };

  return (
    <>
      <Helmet><title>Create Account — Tarini Fine Jewellery</title></Helmet>
      <div className="min-h-screen flex bg-gradient-to-br from-[#FDFBF7] via-[#FDFBF7] to-[#F6EBD5] overflow-hidden">
        {/* Left Editorial Brand Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#160B0E] flex-col justify-between p-16 relative overflow-hidden border-r border-[#C5A059]/20">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=1200&auto=format&fit=crop&q=80" 
              alt="Tarini High Jewellery Showcase" 
              className="w-full h-full object-cover opacity-25 scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#160B0E] via-transparent to-[#160B0E]/80" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8C6D2D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Gem size={18} className="text-[#160B0E]" />
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] text-[#FAF8F5] block leading-none">
                  TARINI
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] block mt-1">
                  Fine Jewellery
                </span>
              </div>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <Badge variant="gold" className="mb-4 text-[10px] tracking-widest uppercase">
              ✦ Exclusive Jewellery Club ✦
            </Badge>
            <h2 className="font-serif text-5xl text-[#FAF8F5] leading-tight mb-4 font-normal">
              Join Our<br />
              <span className="italic font-light text-[#C5A059]">Jewellery Circle</span>
            </h2>
            <p className="text-[#DED3C4] text-xs leading-relaxed mb-6 font-sans">
              Get early access to pure gold, diamond and silver collections, exclusive festive offers, and personalized jewellery recommendations.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#FAF8F5]">
              <div className="flex items-center gap-2 bg-[#1A1215]/80 p-2.5 rounded border border-[#C5A059]/20">
                <CheckCircle2 size={14} className="text-[#C5A059]" />
                <span className="text-[11px]">BIS 916 Hallmark</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1A1215]/80 p-2.5 rounded border border-[#C5A059]/20">
                <CheckCircle2 size={14} className="text-[#C5A059]" />
                <span className="text-[11px]">Certified Diamonds</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-[#C5A059]/20 flex items-center justify-between">
            <p className="text-[#C5A059] text-[11px] tracking-widest uppercase font-semibold">
              ✦ WELCOME10 — 10% Off Your First Jewellery Order ✦
            </p>
            <Link to="/products" className="text-xs text-[#FAF8F5] hover:text-[#C5A059] underline underline-offset-4">
              Explore Jewellery →
            </Link>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }} 
            className="w-full max-w-md my-auto"
          >
            {/* Mobile Header */}
            <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8C6D2D] flex items-center justify-center">
                <Gem size={15} className="text-[#160B0E]" />
              </div>
              <span className="font-serif text-xl tracking-widest text-[#160B0E]">TARINI</span>
            </Link>

            <div className="mb-6">
              <h1 className="font-serif text-3xl font-normal text-[#160B0E] mb-1.5 tracking-wide">
                Create Account
              </h1>
              <p className="text-xs text-[#756A63]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#C5A059] hover:text-[#9A7B38] font-bold underline underline-offset-2">
                  Sign in to your account
                </Link>
              </p>
            </div>

            {/* Quick Demo Register Shortcut Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleQuickDemoRegister}
              disabled={isQuickRegistering || isSubmitting}
              className="w-full mb-6 border-[#C5A059]/40 bg-[#FAF8F5] hover:bg-[#C5A059]/15 text-[#160B0E] text-xs font-bold uppercase tracking-wider py-5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles size={14} className="text-[#C5A059]" />
              {isQuickRegistering ? 'Registering Patron...' : '⚡ One-Click Instant Registration'}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DED3C4]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#FDFBF7] px-3 text-[11px] uppercase tracking-wider text-[#756A63] font-semibold">
                  Or Register Manually
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField icon={User} label="Full Name" error={errors.name?.message}>
                <input 
                  {...register('name')} 
                  placeholder="e.g. Raj Patil" 
                  className={`w-full h-11 pl-10 pr-3 rounded-lg border text-xs bg-white text-[#160B0E] outline-none transition-all placeholder:text-[#9E8E89] ${
                    errors.name ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-[#C5A059]/30 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]'
                  }`} 
                />
              </FormField>

              <FormField icon={Mail} label="Email Address" error={errors.email?.message}>
                <input 
                  {...register('email')} 
                  type="email" 
                  placeholder="e.g. raj@gmail.com" 
                  className={`w-full h-11 pl-10 pr-3 rounded-lg border text-xs bg-white text-[#160B0E] outline-none transition-all placeholder:text-[#9E8E89] ${
                    errors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-[#C5A059]/30 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]'
                  }`} 
                />
              </FormField>

              <FormField icon={Phone} label="Mobile Number (Optional)" error={errors.phone?.message}>
                <input 
                  {...register('phone')} 
                  type="tel" 
                  placeholder="e.g. 9875464756" 
                  className={`w-full h-11 pl-10 pr-3 rounded-lg border text-xs bg-white text-[#160B0E] outline-none transition-all placeholder:text-[#9E8E89] ${
                    errors.phone ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-[#C5A059]/30 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]'
                  }`} 
                />
              </FormField>

              <FormField icon={Lock} label="Password" error={errors.password?.message}>
                <div className="relative">
                  <input 
                    {...register('password')} 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Min. 6 characters" 
                    className={`w-full h-11 pl-10 pr-10 rounded-lg border text-xs bg-white text-[#160B0E] outline-none transition-all placeholder:text-[#9E8E89] ${
                      errors.password ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-[#C5A059]/30 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]'
                    }`} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756A63] hover:text-[#160B0E]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <FormField icon={Lock} label="Confirm Password" error={errors.confirmPassword?.message}>
                <input 
                  {...register('confirmPassword')} 
                  type="password" 
                  placeholder="Re-enter password" 
                  className={`w-full h-11 pl-10 pr-3 rounded-lg border text-xs bg-white text-[#160B0E] outline-none transition-all placeholder:text-[#9E8E89] ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-[#C5A059]/30 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]'
                  }`} 
                />
              </FormField>

              <p className="text-[11px] text-[#756A63] leading-relaxed pt-1">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-[#C5A059] hover:underline">Terms</Link> and{' '}
                <Link to="/privacy" className="text-[#C5A059] hover:underline">Privacy Policy</Link>.
              </p>

              <Button
                type="submit" 
                disabled={isSubmitting || isQuickRegistering} 
                className="w-full bg-[#C5A059] hover:bg-[#d8b56f] text-[#160B0E] font-bold text-xs uppercase tracking-[0.2em] py-6 rounded-lg shadow-md transition-all mt-2"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
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
      <label className="block text-[11px] font-bold text-[#1F1517] uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#756A63] z-10" />
        {children}
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}
