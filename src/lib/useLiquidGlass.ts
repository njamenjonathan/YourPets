import { useEffect } from 'react';

const REVEAL_SELECTOR = '.reveal';
const GLASS_SELECTOR = '.liquid-glass';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

/**
 * Moves the specular highlight on every glass surface to follow the pointer.
 *
 * One delegated listener rather than a handler per card: on each frame we ask
 * the event target which glass surface it is inside, convert the pointer to
 * that element's local coordinates, and write them to `--gx` / `--gy`. The CSS
 * in index.css turns those into a radial highlight.
 *
 * Only the surface currently under the pointer is ever written to, and the
 * previous one is cleaned up, so this stays O(1) no matter how many cards are
 * on screen.
 */
export const useLiquidPointer = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Coarse pointers have nothing to track — there is no hover to speak of,
    // and the listener would only cost battery.
    if (window.matchMedia?.('(pointer: coarse)').matches) return;

    let frame = 0;
    let pending: PointerEvent | null = null;
    let active: HTMLElement | null = null;

    const clear = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty('--gx');
      el.style.removeProperty('--gy');
    };

    const apply = () => {
      frame = 0;
      const event = pending;
      pending = null;
      if (!event) return;

      const target = event.target as Element | null;
      const surface = target?.closest?.(GLASS_SELECTOR) as HTMLElement | null;

      if (surface !== active) {
        clear(active);
        active = surface;
      }

      if (!surface) return;

      const rect = surface.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      surface.style.setProperty('--gx', `${x.toFixed(2)}%`);
      surface.style.setProperty('--gy', `${y.toFixed(2)}%`);
    };

    const onPointerMove = (event: PointerEvent) => {
      pending = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onPointerLeave = () => {
      clear(active);
      active = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      clear(active);
    };
  }, []);
};

/**
 * Resolves `.reveal` sections as they scroll into view.
 *
 * Pass whatever value changes when the page content is swapped out — the
 * active tab, usually — so newly mounted sections get picked up. Elements are
 * unobserved once revealed; nothing re-hides on scroll back up, which would
 * be distracting on a catalog you scroll through twice.
 *
 * The `js-reveal-ready` flag on <html> is what lets the CSS keep `.reveal`
 * content visible when this never runs.
 */
export const useScrollReveal = (key?: unknown): void => {
  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      root.classList.remove('js-reveal-ready');
      return;
    }

    root.classList.add('js-reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      // Fire a little before the section reaches the fold, so the transition
      // has finished by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    // A new view mounts its sections in the same frame this effect runs, but
    // a view that renders in two passes (data arriving late) would miss them.
    // Re-querying on the next frame catches that without a MutationObserver.
    let frame = 0;

    const observeAll = () => {
      document
        .querySelectorAll(`${REVEAL_SELECTOR}:not(.is-visible)`)
        .forEach((el) => observer.observe(el));
    };

    observeAll();
    frame = requestAnimationFrame(observeAll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [key]);
};
