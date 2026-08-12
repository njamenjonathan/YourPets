import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { YourPetsLogo } from './YourPetsLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    rememberedEmail,
    currentUser,
    loginUser,
    loginWithGoogle,
    registerUser,
    resetPassword,
    setRememberedEmail
  } = usePetStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [useRemembered, setUseRemembered] = useState(true);

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setUseRemembered(true);
    } else if (currentUser?.email) {
      setEmail(currentUser.email);
      setUseRemembered(true);
    }
  }, [rememberedEmail, currentUser, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const activeEmail = useRemembered && rememberedEmail ? rememberedEmail : email;
    if (!activeEmail || !activeEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsEmailLoading(true);
    const res = await loginUser(activeEmail, password);
    setIsEmailLoading(false);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }
    setPassword('');
    setErrorMessage(null);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsEmailLoading(true);
    const res = await registerUser(fullName, email, password);
    setIsEmailLoading(false);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setErrorMessage(null);
    }
  };


  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsEmailLoading(true);
    const res = await resetPassword(email || rememberedEmail);
    setIsEmailLoading(false);
    if (res.success) setInfoMessage(res.message);
    else setErrorMessage(res.message);
  };

  const isRememberedActive = useRemembered && !!rememberedEmail && mode === 'login';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#1a1c1e] text-on-surface w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-[#002045] text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <YourPetsLogo className="h-11 w-11" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">YourPets VIP Account</span>
              <h2 className="font-serif-display font-bold text-2xl">
                {mode === 'signup' ? 'Create Your Account' : mode === 'forgot' ? 'Reset Password' : 'Welcome Back'}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Google Auth Primary Button */}
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={async () => {
              setIsGoogleLoading(true);
              setErrorMessage(null);
              const res = await loginWithGoogle();
              setIsGoogleLoading(false);
              if (!res.success) {
                setErrorMessage(res.message);
              }
            }}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#282c31] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 py-3.5 px-4 rounded-2xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-[#32363b] transition-all shadow-sm group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-outline-variant/40 w-full" />
            <span className="bg-white dark:bg-[#1a1c1e] px-3 text-[10px] uppercase tracking-wider font-extrabold text-outline shrink-0">
              or use email
            </span>
            <div className="border-t border-outline-variant/40 w-full" />
          </div>

          {/* Tabs: Sign In / Create Account */}
          <div className="flex p-1 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/30">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login' ? 'bg-[#002045] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup' ? 'bg-[#002045] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Account
            </button>
          </div>

          {infoMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              {infoMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Remembered Email Prompt */}
              {isRememberedActive ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Saved Email Address
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUseRemembered(false);
                        setEmail('');
                      }}
                      className="text-[10px] text-emerald-700 dark:text-emerald-300 hover:underline font-bold"
                    >
                      Switch Email
                    </button>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-950 dark:text-emerald-100">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>{rememberedEmail}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold mb-1 text-on-surface">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                    />
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div>
                <label className="block font-bold mb-1 text-on-surface">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>{isEmailLoading ? 'Checking...' : 'Sign In To Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 space-y-2">
                <button type="button" onClick={() => { setMode('forgot'); setErrorMessage(null); }} className="text-[11px] font-bold text-[#002045] dark:text-emerald-300 hover:underline">Forgot password?</button>
                <span className="text-[11px] text-on-surface-variant flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Encrypted & Remembered on Device
                </span>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <label className="block font-bold mb-1 text-on-surface">Account Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface" />
              <button type="submit" className="w-full bg-[#002045] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider">{isEmailLoading ? 'Sending...' : 'Send Password Reset Email'}</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-center font-bold text-on-surface-variant hover:underline">Back to sign in</button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-on-surface">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-on-surface">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-on-surface">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-on-surface">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#002045] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>{isEmailLoading ? 'Creating...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
