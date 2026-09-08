import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthView: React.FC = () => {
  const { login, signup, loginWithGoogle } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in was interrupted or failed.';
      setError(msg);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      signup(name, email, password);
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password');
        return;
      }
      login(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800 text-white font-bold text-3xl shadow-sm border border-emerald-700">
          🏛️
        </div>
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
            YOJANA MITRA
          </h1>
          <p className="text-xs font-semibold text-stone-500 mt-1 uppercase tracking-wider">
            Government schemes, made personal.
          </p>
        </div>
      </div>

      {/* Auth Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl border border-stone-200 shadow-sm space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-stone-900">
              {isSignUp ? 'Create Citizen Account' : 'Citizen Sign In'}
            </h2>
            <p className="text-xs text-stone-500">
              {isSignUp 
                ? 'Register to discover customized welfare schemes and scholarships'
                : 'Access your personalized scheme recommendations and deadlines'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Firebase Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoadingGoogle}
            className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoadingGoogle ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-stone-200"></div>
            <span className="shrink mx-3 text-[11px] text-stone-400 font-medium">or continue with email</span>
            <div className="grow border-t border-stone-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shiva Kumar"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@example.com"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSignUp ? 'Continue to Onboarding' : 'Sign In to Yojana Mitra'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Toggle between Sign in and Sign up */}
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
