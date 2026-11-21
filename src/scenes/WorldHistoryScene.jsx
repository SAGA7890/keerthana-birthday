import { useEffect, useRef } from 'react';
import { Calendar, Compass, ScrollText } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';

function TimelineEventCard({ event, cardClassName = 'history-card' }) {
  return (
    <article
      style={{
        background:
          'linear-gradient(145deg, rgba(31, 20, 61, 0.72) 0%, rgba(19, 12, 38, 0.56) 100%)',
        borderColor: 'rgba(233, 213, 255, 0.2)',
      }}
      className={`${cardClassName} relative rounded-2xl border p-5 shadow-glow backdrop-blur-md transition duration-300 hover:border-moonGold/50 sm:p-6`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-moonGold/35 bg-[#130c26]/85 px-3 py-1 text-xs font-medium text-[#f5d08a]">
          <Calendar className="h-3.5 w-3.5" />
          <span>{event.date}</span>
        </span>
      </div>

      <h4 className="font-display text-lg font-bold tracking-wide text-[#f9f6ff] sm:text-xl">
        {event.title}
      </h4>

      <p className="mt-2.5 text-sm leading-relaxed text-[#e9d5ff]/90">
        {event.summary}
      </p>

      <p className="mt-4 text-xs text-[#d8b4fe]/75">
        <span className="font-semibold text-[#e9d5ff]">Source:</span>{' '}
        {event.source}
      </p>
    </article>
  );
}

export default function WorldHistoryScene() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0.15 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.history-exact-list',
              start: 'top 80%',
              end: 'bottom 75%',
              scrub: 0.4,
            },
          }
        );
      }

      gsap.from('.history-exact-card', {
        y: 20,
        opacity: 0.25,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.history-exact-list',
          start: 'top 88%',
          once: true,
        },
      });

      gsap.from('.history-year-card', {
        y: 20,
        opacity: 0.25,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.history-year-grid',
          start: 'top 88%',
          once: true,
        },
      });

      gsap.from('.history-closing', {
        y: 18,
        opacity: 0.25,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.history-closing',
          start: 'top 90%',
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

  const { worldHistory } = BIRTHDAY_CONFIG;

  return (
    <section
      id="world-history"
      ref={sectionRef}
      aria-labelledby="world-history-heading"
      className="relative flex w-full flex-col justify-center overflow-x-clip px-4 py-24 sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,208,138,0.08)_0%,_rgba(31,20,61,0.28)_50%,_transparent_80%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-moonGold/30 bg-[#1f143d]/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f5d08a] backdrop-blur-md sm:text-xs">
            <ScrollText className="h-3.5 w-3.5" />
            <span>{BIRTHDAY_CONFIG.birthDateFull}</span>
          </div>

          <h2
            id="world-history-heading"
            className="font-display text-3xl font-bold tracking-wide text-gradient-celestial sm:text-5xl"
          >
            {worldHistory.heading}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#e9d5ff]/85 sm:text-base">
            {worldHistory.subheading}
          </p>
        </div>

        {/* Part 1: Exact Date (21 November 2004) */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f5d08a] shadow-[0_0_10px_rgba(245,208,138,0.85)]" />
            <h3 className="font-display text-xl font-bold tracking-wide text-[#f9f6ff] sm:text-2xl">
              {worldHistory.onThisExactDayTitle}
            </h3>
          </div>

          <div className="history-exact-list relative space-y-5 pl-6 sm:pl-8">
            {/* Runs from top of list down to the last marker */}
            <div
              ref={lineRef}
              aria-hidden="true"
              className="bottom-10 left-[13px] top-7 w-[2px] origin-top bg-gradient-to-b from-[#f5d08a] via-[#d8b4fe]/70 to-[#d8b4fe]/25 sm:left-[15px]"
              style={{ position: 'absolute' }}
            />

            {worldHistory.onThisExactDayEvents.map((event) => (
              <div key={event.title} className="relative">
                <span
                  aria-hidden="true"
                  className="top-7 h-3 w-3 rounded-full border-2 border-[#f5d08a] bg-[#0b0716]"
                  style={{
                    position: 'absolute',
                    left: '-16px',
                  }}
                />
                <TimelineEventCard
                  event={event}
                  cardClassName="history-exact-card"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Broader 2004 Milestones */}
        <div className="mt-16 border-t border-[#e9d5ff]/15 pt-12">
          <div className="mb-6 flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-[#d8b4fe]" />
            <h3 className="font-display text-xl font-bold tracking-wide text-[#e9d5ff] sm:text-2xl">
              {worldHistory.during2004Title}
            </h3>
          </div>

          <div className="history-year-grid grid grid-cols-1 gap-5 md:grid-cols-3">
            {worldHistory.during2004Events.map((event) => (
              <TimelineEventCard
                key={event.title}
                event={event}
                cardClassName="history-year-card"
              />
            ))}
          </div>
        </div>

        {/* Closing Quote */}
        <blockquote
          style={{
            background:
              'linear-gradient(145deg, rgba(31, 20, 61, 0.72) 0%, rgba(19, 12, 38, 0.56) 100%)',
          }}
          className="history-closing mx-auto mt-14 max-w-3xl rounded-2xl border border-[#f5d08a]/30 px-6 py-7 text-center shadow-goldGlow backdrop-blur-md sm:px-10"
        >
          <p className="font-display text-lg font-normal leading-relaxed text-[#f9f6ff] sm:text-2xl">
            “{worldHistory.closingQuote}”
          </p>
        </blockquote>
      </div>
    </section>
  );
}