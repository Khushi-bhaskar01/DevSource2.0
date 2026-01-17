// components/EmailVerification.jsx
import React, { useState } from 'react';
import { Mail, Shield, X, CheckCircle } from 'lucide-react';
import api from '../api/axiosInstance';

export default function EmailVerification({ user, onVerificationSuccess, onClose }) {
  const [step, setStep] = useState('send'); // 'send' | 'verify'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/api/auth/send-verify-otp');
      if (res.data.success) {
        setSuccess('OTP sent to your email!');
        setStep('verify');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/verify-email', { otp });
      if (res.data.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          if (onVerificationSuccess) onVerificationSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold font-mono mb-2">Verify Your Email</h2>
          <p className="text-gray-400 text-sm font-mono">
            {step === 'send' 
              ? 'Secure your account by verifying your email address'
              : 'Enter the 6-digit code sent to your email'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            <p className="text-green-400 text-sm font-mono">{success}</p>
          </div>
        )}

        {/* Send OTP Step */}
        {step === 'send' && (
          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 font-mono">EMAIL ADDRESS</p>
                  <p className="text-white font-mono">{user?.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </div>
        )}

        {/* Verify OTP Step */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-mono mb-2 block">ENTER 6-DIGIT CODE</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-black border-2 border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-purple-500 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-sm text-purple-400 hover:text-purple-300 font-mono transition-colors disabled:opacity-50"
              >
                Didn't receive code? Resend
              </button>
            </div>
          </form>
        )}

        {/* Info */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-xs text-gray-500 text-center font-mono">
            The verification code is valid for 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}