import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function IntroLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const dateRef = useRef(null);
  const lineRef = useRef(null);
  const subRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 450);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      )
        .fromTo(
          dateRef.current,
          { opacity: 0, scale: 0.92, letterSpacing: '0.35em' },
          {
            opacity: 1,
            scale: 1,
            letterSpacing: '0.22em',
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.15'
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.65, ease: 'power2.inOut' },
          '-=0.35'
        )
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.65,
          delay: 0.35,
          ease: 'power2.inOut',
        });
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete, prefersReducedMotion]);

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cosmic-950 px-6 text-center"
    >
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-lavender-400/15 blur-3xl" />

      <div ref={subRef} className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-lavender-300">
        <Sparkles className="h-3.5 w-3.5 text-moonGold" />
        <span>{BIRTHDAY_CONFIG.intro.subtitle}</span>
      </div>

      <p
        ref={dateRef}
        className="font-display text-3xl font-bold tracking-[0.22em] text-gradient-celestial sm:text-5xl"
      >
        {BIRTHDAY_CONFIG.intro.dateStamp}
      </p>

      <div
        ref={lineRef}
        className="mt-6 h-[1px] w-44 origin-center bg-gradient-to-r from-transparent via-moonGold/80 to-transparent sm:w-64"
      />

      <button
        type="button"
        onClick={onComplete}
        className="mt-10 text-xs uppercase tracking-widest text-lavender-300/70 underline-offset-4 transition hover:text-stardust hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold"
      >
        {BIRTHDAY_CONFIG.intro.skipLabel}
      </button>
    </div>
  );
}