import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Gem, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../lib/utils';
import { toast } from 'sonner';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    if (!token) { toast.error('Invalid reset link.'); return; }
    try {
      await authService.resetPassword({ token, password: data.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Helmet><title>Reset Password — Jwellery</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center"><Gem size={15} className="text-white" /></div>
            <span className="font-serif text-xl text-gray-900">JWELLERY</span>
          </div>

          {success ? (
            <div className="text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h1 className="font-serif text-2xl text-gray-900 mb-2">Password Reset!</h1>
              <p className="text-gray-500 text-sm mb-4">Redirecting to login...</p>
              <Link to="/login" className="text-[#C5A059] text-sm hover:underline">Go to Login →</Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-gray-900 mb-2">Set New Password</h1>
              <p className="text-gray-500 text-sm mb-6">Create a strong password for your account.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#22181C] uppercase tracking-wide mb-1.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" className={`input-gold !pl-10 !pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#22181C] uppercase tracking-wide mb-1.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('confirmPassword')} type="password" placeholder="Re-enter password" className={`input-gold !pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-gold w-full rounded-xl py-3.5 text-sm disabled:opacity-60">
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
