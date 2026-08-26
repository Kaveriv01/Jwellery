import { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Gem, RotateCcw } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../lib/utils';
import { toast } from 'sonner';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const userId = location.state?.userId;
  const email = location.state?.email;

  if (!userId) {
    navigate('/register');
    return null;
  }

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Please enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      await authService.verifyOTP({ userId, otp: otpString });
      toast.success('Email verified! Please log in to continue. 🎉');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendOTP({ userId });
      toast.success('OTP resent to your email!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Helmet><title>Verify Email — Jwellery</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center mx-auto mb-6">
            <Gem size={24} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-500 text-sm mb-8">
            Enter the 6-digit OTP sent to<br />
            <span className="font-medium text-gray-700">{email || 'your email'}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all ${
                    digit ? 'border-[#C5A059] bg-[#fdf9ee]' : 'border-gray-200 focus:border-[#C5A059]'
                  }`}
                />
              ))}
            </div>

            <motion.button type="submit" disabled={loading || otp.join('').length < 6} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-gold w-full rounded-xl py-3.5 text-sm disabled:opacity-60 mb-4">
              {loading ? 'Verifying...' : 'Verify Email'}
            </motion.button>
          </form>

          <button onClick={handleResend} disabled={resending} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#C5A059] mx-auto transition-colors disabled:opacity-50">
            <RotateCcw size={14} /> {resending ? 'Resending...' : 'Resend OTP'}
          </button>

          <p className="text-xs text-gray-400 mt-4">OTP is valid for 10 minutes</p>
        </motion.div>
      </div>
    </>
  );
}
