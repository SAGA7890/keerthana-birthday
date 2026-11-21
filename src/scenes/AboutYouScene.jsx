import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { usePointerParallax } from '../hooks/usePointerParallax';
import CelestialOrnaments3D from '../components/CelestialOrnaments3D';

export default function AboutYouScene() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  usePointerParallax(sectionRef, !prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-header-item', {
        y: 20,
        opacity: 0.25,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('.about-card', {
        y: 24,
        opacity: 0.25,
        scale: 0.98,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.about-cards-grid',
          start: 'top 86%',
          once: true,
        },
      });
    }, sectionRef);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="about-you"
      ref={sectionRef}
      aria-labelledby="about-you-heading"
      style={{ '--px': 0, '--py': 0 }}
      className="perspective-1000 relative flex min-h-[100svh] w-full flex-col justify-center overflow-x-clip px-4 py-24 sm:px-8"
    >
      {/* Soft Lavender & Gold Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(192,132,252,0.13)_0%,_rgba(31,20,61,0.28)_48%,_transparent_76%)]"
      />

      {/* Subtle Floating 3D Accent Ring on Desktop */}
      <div
        aria-hidden="true"
        style={{
          transform:
            'translate3d(calc(var(--px) * -18px), calc(var(--py) * -14px), -40px)',
        }}
        className="pointer-events-none absolute right-[7%] top-[14%] hidden h-28 w-28 rounded-full border border-moonGold/20 md:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="about-header-item mb-4 inline-flex items-center gap-2 rounded-full border border-lavender-200/20 bg-cosmic-800/65 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-lavender-200 backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-moonGold" />
            <span>{BIRTHDAY_CONFIG.recipientName}</span>
          </div>

          <h2
            id="about-you-heading"
            className="about-header-item font-display text-3xl font-bold tracking-wide text-gradient-celestial sm:text-5xl"
          >
            {BIRTHDAY_CONFIG.aboutYou.heading}
          </h2>

          <p className="about-header-item mt-4 text-sm leading-relaxed text-lavender-200/80 sm:text-base">
            {BIRTHDAY_CONFIG.aboutYou.subheading}
          </p>
        </div>

        <div className="about-cards-grid preserve-3d mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BIRTHDAY_CONFIG.aboutYou.cards.map((card, index) => (
            <article
              key={card.id}
              style={{
                transform: prefersReducedMotion
                  ? 'none'
                  : `translate3d(calc(var(--px) * ${(index % 2 === 0 ? 6 : -6)}px), calc(var(--py) * 4px), 12px)`,
              }}
              className="about-card glass-panel group relative flex flex-col justify-between rounded-2xl p-6 shadow-glow transition duration-300 hover:border-moonGold/40 sm:p-7"
            >
              <div>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <CelestialOrnaments3D accent={card.accent} />
                  <span className="text-xs font-medium tracking-[0.22em] text-lavender-300/60">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-wide text-stardust transition-colors group-hover:text-moonGold sm:text-2xl">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-lavender-200/85 sm:text-base">
                  {card.description}
                </p>
              </div>

              <div
                aria-hidden="true"
                className="mt-6 h-[1px] w-full bg-gradient-to-r from-lavender-300/25 via-moonGold/30 to-transparent"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}