import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { usePointerParallax } from '../hooks/usePointerParallax';
import {
  CelestialMoon,
  FloatingIsland,
  MistCloud,
  ForegroundBlossom,
} from '../components/FantasyArt';

export default function HeroScene({ isReady, onEnterWorld }) {
  const sectionRef = useRef(null);
  const moonLayerRef = useRef(null);
  const islandsLayerRef = useRef(null);
  const foregroundLayerRef = useRef(null);
  const contentRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();
  usePointerParallax(sectionRef, !prefersReducedMotion);

  useEffect(() => {
    if (!isReady || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Entrance stagger after intro dissolves
      gsap.from('.hero-reveal', {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      // Responsive ScrollTrigger depth parallax
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.to(moonLayerRef.current, {
          yPercent: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(islandsLayerRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(foregroundLayerRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      mm.add('(max-width: 767px)', () => {
        // Lighter mobile scroll parallax for smooth 60fps performance
        gsap.to(moonLayerRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Magical Birthday Entrance"
      style={{ '--px': 0, '--py': 0 }}
      className="perspective-1000 relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-8"
    >
      {/* Ambient Radial Nebula Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(192,132,252,0.22)_0%,_rgba(31,20,61,0.45)_45%,_rgba(11,7,22,0.96)_100%)]"
      />

      {/* LAYER 1: Distant Moon & Celestial Halo */}
      <div
        ref={moonLayerRef}
        aria-hidden="true"
        style={{
          transform:
            'translate3d(calc(var(--px) * -14px), calc(var(--py) * -14px), -80px)',
        }}
        className="pointer-events-none absolute right-[6%] top-[10%] z-10 w-40 opacity-90 transition-transform duration-150 ease-out sm:right-[12%] sm:top-[11%] sm:w-56 lg:w-64"
      >
        <CelestialMoon className="h-auto w-full drop-shadow-[0_0_35px_rgba(245,208,138,0.3)]" />
      </div>

      {/* LAYER 2: Midground Floating Sky Islands & Mist */}
      <div
        ref={islandsLayerRef}
        aria-hidden="true"
        style={{
          transform:
            'translate3d(calc(var(--px) * -26px), calc(var(--py) * -20px), -35px)',
        }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        {/* Left Floating Island */}
        <div className="animate-float-slow absolute -left-16 top-[22%] w-48 opacity-75 sm:left-[2%] sm:top-[20%] sm:w-64 lg:left-[5%] lg:w-80">
          <FloatingIsland variant="left" className="h-auto w-full" />
        </div>

        {/* Right Floating Island (hidden on smallest 360px screens to prevent clutter) */}
        <div
          style={{ animationDelay: '2.2s' }}
          className="animate-float-slow absolute -right-14 bottom-[18%] hidden w-56 opacity-75 md:block lg:right-[4%] lg:w-80"
        >
          <FloatingIsland variant="right" className="h-auto w-full" />
        </div>

        {/* Soft Drifting Clouds */}
        <div className="animate-drift absolute bottom-[22%] left-[8%] w-64 opacity-60 sm:w-96">
          <MistCloud className="h-auto w-full" />
        </div>
        <div
          style={{ animationDelay: '4s' }}
          className="animate-drift absolute right-[6%] top-[34%] w-56 opacity-50 sm:w-80"
        >
          <MistCloud className="h-auto w-full" />
        </div>
      </div>

      {/* LAYER 3: Main Hero Narrative & Recipient Reveal */}
      <div
        ref={contentRef}
        style={{
          transform:
            'translate3d(calc(var(--px) * 10px), calc(var(--py) * 8px), 20px)',
        }}
        className="relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <div className="hero-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-lavender-200/20 bg-cosmic-800/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-lavender-200 backdrop-blur-md sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-moonGold" />
          <span>{BIRTHDAY_CONFIG.hero.eyebrow}</span>
        </div>

        <p className="hero-reveal mb-3 text-base font-light tracking-wide text-blush-200 sm:text-xl md:text-2xl">
          {BIRTHDAY_CONFIG.hero.headline}
        </p>

        <h1 className="hero-reveal font-display text-4xl font-bold tracking-wide text-gradient-celestial drop-shadow-[0_6px_30px_rgba(216,180,254,0.28)] sm:text-6xl md:text-7xl lg:text-8xl">
          {BIRTHDAY_CONFIG.recipientName}
        </h1>

        <p className="hero-reveal mt-5 max-w-xl text-sm leading-relaxed text-lavender-200/85 sm:text-base md:text-lg">
          {BIRTHDAY_CONFIG.hero.subtext}
        </p>

        <div className="hero-reveal mt-9">
          <motion.button
            type="button"
            whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={onEnterWorld}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-moonGold/50 bg-gradient-to-r from-cosmic-700/90 via-purple-900/85 to-cosmic-700/90 px-8 py-4 text-sm font-semibold tracking-wider text-stardust shadow-goldGlow backdrop-blur-md transition-colors hover:border-moonGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold sm:text-base"
          >
            <span className="relative z-10">{BIRTHDAY_CONFIG.hero.ctaLabel}</span>
            <ChevronDown className="relative z-10 h-4 w-4 text-moonGold transition-transform duration-300 group-hover:translate-y-1" />
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-moonGold/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </motion.button>
        </div>
      </div>

      {/* LAYER 4: Foreground Botanical Framing */}
      <div
        ref={foregroundLayerRef}
        aria-hidden="true"
        style={{
          transform:
            'translate3d(calc(var(--px) * 34px), calc(var(--py) * 24px), 60px)',
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between"
      >
        <ForegroundBlossom className="-mb-4 -ml-6 w-36 opacity-85 sm:w-52 lg:w-64" />
        <ForegroundBlossom flip className="-mb-4 -mr-6 w-36 opacity-85 sm:w-52 lg:w-64" />
      </div>

      {/* Bottom Seamless Horizon Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-cosmic-950 to-transparent"
      />
    </section>
  );
}