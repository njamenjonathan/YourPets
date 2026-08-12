import React from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

interface SignInRequiredProps {
  title: string;
  message: string;
}

/**
 * Shown on pages that need an account. While Firebase is still restoring the
 * session it shows a quiet spinner instead of wrongly claiming you are signed out.
 */
export const SignInRequired: React.FC<SignInRequiredProps> = ({ title, message }) => {
  const { isAuthLoading, setIsAuthModalOpen } = usePetStore();

  if (isAuthLoading) {
    return (
      <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-3 shadow-sm">
        <Loader2 className="w-8 h-8 mx-auto text-emerald-600 animate-spin" />
        <p className="text-xs text-on-surface-variant">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4 shadow-sm">
      <Lock className="w-14 h-14 mx-auto text-amber-500" />
      <h3 className="font-serif-display font-bold text-2xl text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">{message}</p>
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors shadow-md"
      >
        Sign In / Create Account
      </button>
    </div>
  );
};
