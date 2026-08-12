import React from 'react';
import { PawPrint } from 'lucide-react';

/**
 * Shared YourPets brand mark. Drawn in the browser, so it costs nothing to
 * download and stays crisp at any size.
 */
export const YourPetsLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <span
    className={`relative flex ${className} shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-amber-300/70 bg-[#002045] shadow-lg shadow-[#002045]/15 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[-3deg] dark:border-amber-200/40`}
    aria-hidden="true"
  >
    <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.95),transparent_24%),linear-gradient(135deg,rgba(250,204,21,0.96),rgba(16,185,129,0.72)_42%,rgba(0,32,69,0.15)_72%)]" />
    <span className="absolute -bottom-5 -right-4 h-14 w-14 rounded-full bg-emerald-300/30 blur-sm" />
    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white/80 blur-[1px]" />
    <PawPrint className="relative z-10 h-1/2 w-1/2 -rotate-12 text-white drop-shadow-md" strokeWidth={2.8} />
    <span className="absolute bottom-2 right-2 z-10 h-2.5 w-2.5 rounded-full border border-white/80 bg-amber-300" />
  </span>
);
