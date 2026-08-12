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

  // While Firebase resolves the session, show the shape of the content that is
  // about to appear rather than an empty box or a premature "signed out".
  if (isAuthLoading) {
    return (
      <div className="p-6 bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          Checking your session...
        </div>
        {[0, 1, 2].map(row => (
          <div key={row} className="flex items-center gap-4">
            <div className="skeleton w-14 h-14 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-1/3" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
        ))}
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
