import { useEffect, useRef } from 'react';
import { CakeSlice } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';
import BirthdayCake3D from '../components/BirthdayCake3D';

const PETALS = [
  { id: 1, left: '10%', top: '18%', size: 12, delay: '0s', rotate: '25deg' },
  { id: 2, left: '84%', top: '24%', size: 14, delay: '1.4s', rotate: '-30deg' },
  { id: 3, left: '18%', top: '72%', size: 10, delay: '2.6s', rotate: '50deg' },
  { id: 4, left: '88%', top: '68%', size: 12, delay: '0.8s', rotate: '-15deg' },
];

export default function CelebrationScene() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.celebration-stagger', {
        y: 28,
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

  return (
    <section
      id="celebration"
      ref={sectionRef}
      aria-labelledby="celebration-heading"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-8"
    >
      {/* Ambient Pink & Lavender Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,168,212,0.14)_0%,_rgba(192,132,252,0.09)_38%,_transparent_72%)]"
      />

      {/* Floating Decorative Petals */}
      {PETALS.map((petal) => (
        <span
          key={petal.id}
          aria-hidden="true"
          style={{
            left: petal.left,
            top: petal.top,
            width: `${petal.size}px`,
            height: `${petal.size * 1.35}px`,
            animationDelay: petal.delay,
            transform: `rotate(${petal.rotate})`,
          }}
          className="animate-float-slow pointer-events-none absolute rounded-tl-full rounded-br-full bg-gradient-to-br from-blush-200/75 to-lavender-400/55 shadow-[0_0_12px_rgba(249,168,212,0.35)]"
        />
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="celebration-stagger mb-4 inline-flex items-center gap-2 rounded-full border border-blush-200/25 bg-cosmic-800/65 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-blush-200 backdrop-blur-md sm:text-xs">
          <CakeSlice className="h-3.5 w-3.5 text-moonGold" />
          <span>{BIRTHDAY_CONFIG.birthDateFull}</span>
        </div>

        <h2
          id="celebration-heading"
          className="celebration-stagger font-display text-3xl font-bold tracking-wide text-gradient-celestial sm:text-5xl md:text-6xl"
        >
          {BIRTHDAY_CONFIG.celebration.heading}
        </h2>

        <div className="celebration-stagger mt-6 w-full">
          <BirthdayCake3D />
        </div>
      </div>
    </section>
  );
}