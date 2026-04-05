import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Activity } from 'lucide-react';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    let result;
    if (isRegistering) {
      if (!fullName) {
        setError("Full Name is required for registration.");
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate('/pro-dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e659]/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00e659]/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-[#00e659] text-black p-2 rounded-lg">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <span className="text-white text-3xl font-bold tracking-tight">Rupee And Risk <span className="text-[#00e659] font-mono border border-[#00e659]/30 bg-[#00e659]/10 px-2 py-0.5 rounded text-sm ml-2 relative -top-1">PRO</span></span>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {isRegistering ? 'Create your account' : 'Sign in to Terminal'}
          </h2>
          <p className="text-white/50 text-sm mb-6">
            {isRegistering ? 'Join the ultimate financial intelligence platform.' : 'Enter your credentials to access the Pro Dashboard.'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#00e659]/50 focus:ring-1 focus:ring-[#00e659]/50 transition-all font-mono text-sm"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#00e659] hover:bg-[#00c94e] text-black font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Authenticating...' : (isRegistering ? 'Complete Registration' : 'Access Terminal')}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="flex justify-center w-full">
             <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In was unsuccessful. Try again.')}
              useOneTap
              theme="filled_black"
              shape="rectangular"
              size="large"
              text={isRegistering ? "signup_with" : "signin_with"}
              width="100%"
            />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-white/50">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="ml-2 text-[#00e659] hover:underline hover:text-white transition-colors font-medium"
          >
            {isRegistering ? "Sign in here" : "Apply for access"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
             <Link to="/" className="text-xs text-white/30 hover:text-white/70 transition-colors">
                &larr; Return to public portal
             </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
