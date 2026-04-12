import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(''); // '' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!token) {
      setErrorMsg('Invalid reset link. Please request a new one.');
      return;
    }

    setStatus('loading');
    try {
      await axios.post(`${API}/api/auth/reset-password`, {
        token,
        new_password: newPassword,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || 'Something went wrong. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e659]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00e659]/5 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-[#00e659] text-black p-2 rounded-lg">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <span className="text-white text-3xl font-bold tracking-tight">
            Rupee And Risk <span className="text-[#00e659] font-mono border border-[#00e659]/30 bg-[#00e659]/10 px-2 py-0.5 rounded text-sm ml-2 relative -top-1">PRO</span>
          </span>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#00e659]/10 border border-[#00e659]/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#00e659]" />
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">Password Updated!</h2>
              <p className="text-gray-400 text-sm mb-6">Your password has been changed successfully. You can now sign in with your new password.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#00e659] text-black font-bold py-3 rounded-lg hover:bg-[#00c94e] transition-colors flex items-center justify-center gap-2"
              >
                Go to Login <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-white mb-1">Set New Password</h2>
              <p className="text-white/50 text-sm mb-6">Choose a strong password for your Rupee And Risk account.</p>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="New Password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all font-mono text-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all font-mono text-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#00e659] hover:bg-[#00c94e] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                >
                  {status === 'loading' ? 'Updating...' : 'Reset Password'}
                  {status !== 'loading' && <ArrowRight size={18} />}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-white/30 hover:text-white/70 transition-colors">
            &larr; Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
