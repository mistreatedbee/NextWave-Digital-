import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { shouldUseEnhancedMotion } from '../utils/motionSafety';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Safari, touch devices, and reduced-motion users are more reliable with native scroll.
    if (!shouldUseEnhancedMotion()) return;

    const lenis = new Lenis({
      duration:       1.1,
      easing:         (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:    true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
