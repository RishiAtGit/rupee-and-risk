import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Activity, Eye, EyeOff, X, CheckCircle2, Chrome } from 'lucide-react';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(''); // '' | 'loading' | 'sent' | 'error'
  const [forgotError, setForgotError] = useState('');

  const { login, register, googleLogin, forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let result;
    if (isRegistering) {
      if (!fullName) {
        setError('Full Name is required for registration.');
        setIsLoading(false);
        return;
      }
      result = await register(email, password, fullName);
    } else {
      result = await login(email, password);
    }

    if (result.success) {
      navigate('/pro-dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const result = await googleLogin();
    if (result.success) {
      navigate('/pro-dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotStatus('loading');
    const result = await forgotPassword(forgotEmail);
    if (result.success) {
      setForgotStatus('sent');
    } else {
      setForgotStatus('error');
      setForgotError(result.error || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

      {/* Background Aesthetic */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e659]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00e659]/5 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-[#00e659] text-black p-2 rounded-lg">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <span className="text-white text-3xl font-bold tracking-tight">
            Rupee And Risk{' '}
            <span className="text-[#00e659] font-mono border border-[#00e659]/30 bg-[#00e659]/10 px-2 py-0.5 rounded text-sm ml-2 relative -top-1">PRO</span>
          </span>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-white mb-1">
            {isRegistering ? 'Create your account' : 'Sign in to Terminal'}
          </h2>
          <p className="text-white/50 text-sm mb-6">
            {isRegistering
              ? 'Join the ultimate financial intelligence platform.'
              : 'Enter your credentials to access the Pro Dashboard.'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-5 flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all font-mono text-sm"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all font-mono text-sm"
                required
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all font-mono text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password link */}
            {!isRegistering && (
              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setForgotEmail(email); setForgotStatus(''); setForgotError(''); }}
                  className="text-xs text-[#00e659]/70 hover:text-[#00e659] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00e659] hover:bg-[#00c94e] text-black font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Access Terminal')}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-lg py-3 transition-all disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-white/50">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="ml-2 text-[#00e659] hover:underline hover:text-white transition-colors font-medium"
          >
            {isRegistering ? 'Sign in here' : 'Apply for access'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-white/30 hover:text-white/70 transition-colors">
            &larr; Return to public portal
          </Link>
        </div>
      </div>

      {/* ── Forgot Password Modal ─────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {forgotStatus === 'sent' ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#00e659]/10 border border-[#00e659]/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-[#00e659]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Check your inbox!</h3>
                <p className="text-gray-400 text-sm">
                  A reset link has been sent to <strong className="text-white">{forgotEmail}</strong>. It expires in 1 hour.
                </p>
                <p className="text-gray-600 text-xs mt-3">Sent by Firebase / Google — check your spam folder if you don't see it.</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-6 w-full bg-[#00e659] text-black font-bold py-2.5 rounded-lg hover:bg-[#00c94e] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-white font-bold text-xl mb-1">Reset Password</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Enter your registered email. Firebase will send a secure reset link instantly.
                </p>
                {forgotStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4">
                    {forgotError}
                  </div>
                )}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotStatus === 'loading'}
                    className="w-full bg-[#00e659] text-black font-bold py-3 rounded-lg hover:bg-[#00c94e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {forgotStatus === 'loading' ? 'Sending...' : 'Send Reset Link'}
                    {forgotStatus !== 'loading' && <ArrowRight size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
