import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { usePointerParallax } from '../hooks/usePointerParallax';
import { ForegroundBlossom, MistCloud } from '../components/FantasyArt';

const FLOATING_PETALS = [
  { id: 1, left: '10%', top: '22%', size: 'h-3 w-3', color: 'bg-blush-200/75', delay: '0s' },
  { id: 2, left: '24%', top: '68%', size: 'h-2.5 w-2.5', color: 'bg-lavender-300/75', delay: '1.2s' },
  { id: 3, left: '78%', top: '26%', size: 'h-3 w-3', color: 'bg-moonGold/75', delay: '0.7s' },
  { id: 4, left: '86%', top: '64%', size: 'h-2.5 w-2.5', color: 'bg-blush-300/75', delay: '1.9s' },
  { id: 5, left: '52%', top: '16%', size: 'h-2 w-2', color: 'bg-lavender-200/80', delay: '2.4s' },
];

export default function WishesFinaleScene({ onReplay }) {
  const sectionRef = useRef(null);
  const skyLayerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  usePointerParallax(sectionRef, !prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.finale-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const { finale, recipientName, birthDateFull } = BIRTHDAY_CONFIG;

  return (
    <section
      id="wishes-finale"
      ref={sectionRef}
      aria-labelledby="wishes-finale-heading"
      style={{ '--px': 0, '--py': 0 }}
      className="perspective-1000 relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-28 sm:px-8"
    >
      {/* Deep Galaxy & Aurora Night Sky Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(192,132,252,0.22)_0%,_rgba(46,29,89,0.38)_42%,_rgba(11,7,22,0.98)_100%)]"
      />

      {/* Parallax Sky Clouds & Floating Petals */}
      <div
        ref={skyLayerRef}
        aria-hidden="true"
        style={{
          transform:
            'translate3d(calc(var(--px) * -18px), calc(var(--py) * -14px), -30px)',
        }}
        className="pointer-events-none absolute inset-0 z-10 transition-transform duration-150 ease-out"
      >
        <div className="animate-drift absolute left-[6%] top-[18%] w-60 opacity-45 sm:w-80">
          <MistCloud className="h-auto w-full" />
        </div>
        <div
          style={{ animationDelay: '3s' }}
          className="animate-drift absolute bottom-[20%] right-[6%] w-64 opacity-45 sm:w-96"
        >
          <MistCloud className="h-auto w-full" />
        </div>

        {FLOATING_PETALS.map((petal) => (
          <span
            key={petal.id}
            style={{
              left: petal.left,
              top: petal.top,
              animationDelay: petal.delay,
            }}
            className={`animate-float-slow absolute rounded-full blur-[0.5px] ${petal.size} ${petal.color}`}
          />
        ))}
      </div>

      {/* Main Closing Wish Content */}
      <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="finale-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-moonGold/35 bg-cosmic-800/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-moonGold backdrop-blur-md sm:text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{birthDateFull}</span>
        </div>

        <h2
          id="wishes-finale-heading"
          className="finale-reveal font-display text-4xl font-bold tracking-wide text-gradient-celestial drop-shadow-[0_6px_30px_rgba(216,180,254,0.3)] sm:text-6xl"
        >
          {finale.heading}
        </h2>

        <p className="finale-reveal mt-5 max-w-xl text-base leading-relaxed text-lavender-200/90 sm:text-lg">
          {finale.wish}
        </p>

        <div className="finale-reveal mt-10">
          <motion.button
            type="button"
            onClick={onReplay}
            whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            aria-label={`Replay birthday experience for ${recipientName}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-moonGold/50 bg-cosmic-800/85 px-7 py-3.5 text-sm font-semibold tracking-wide text-stardust shadow-goldGlow backdrop-blur-md transition hover:border-moonGold hover:text-moonGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold"
          >
            <RotateCcw className="h-4 w-4 text-moonGold" />
            <span>{finale.replayLabel}</span>
          </motion.button>
        </div>
      </div>

      {/* Foreground Blossoms */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between"
      >
        <ForegroundBlossom className="-mb-4 -ml-6 w-36 opacity-80 sm:w-52" />
        <ForegroundBlossom flip className="-mb-4 -mr-6 w-36 opacity-80 sm:w-52" />
      </div>
      <p className="finale-reveal mt-12 text-[11px] uppercase tracking-[0.22em] text-lavender-300/60">
          Thank to Buddies Gemini, ChatGPT &amp; VS Code
        </p>
    </section>
    
  );
}