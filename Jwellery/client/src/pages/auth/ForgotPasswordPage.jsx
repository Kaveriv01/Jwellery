import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Gem, Mail, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

const schema = z.object({ email: z.string().email('Please enter a valid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password — Jwellery</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center">
              <Gem size={15} className="text-white" />
            </div>
            <span className="font-serif text-xl text-gray-900">JWELLERY</span>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail size={24} className="text-green-600" />
              </div>
              <h1 className="font-serif text-2xl text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-500 text-sm mb-6">We've sent a password reset link to <strong>{getValues('email')}</strong>. The link is valid for 30 minutes.</p>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-[#c9a84c] hover:underline">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('email')} type="email" placeholder="your@email.com" className={`input-gold !pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-gold w-full rounded-xl py-3.5 text-sm disabled:opacity-60">
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#c9a84c]">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
