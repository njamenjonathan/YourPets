import { useEffect, useRef, useState } from 'react';

/** Must match the closing animation duration in index.css. */
const EXIT_MS = 150;

/**
 * Keeps a modal mounted just long enough for its close animation to play.
 *
 * A component that returns null the instant `isOpen` flips to false cannot
 * animate out — it is simply gone. This holds the element in the tree for one
 * short beat and flags it as closing so the CSS can run in reverse.
 *
 *   const { mounted, closing } = useModalTransition(isOpen);
 *   if (!mounted) return null;
 *   <div className={`modal-backdrop ${closing ? 'is-closing' : ''}`}>
 */
export const useModalTransition = (isOpen: boolean): { mounted: boolean; closing: boolean } => {
  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (isOpen) {
      setClosing(false);
      setMounted(true);
      return;
    }

    if (!mounted) return;

    // Someone who prefers reduced motion gets no exit animation to wait for.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setMounted(false);
      return;
    }

    setClosing(true);
    timer.current = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isOpen, mounted]);

  return { mounted, closing };
};
