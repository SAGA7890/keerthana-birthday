import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, RotateCcw, Sparkles } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { gsap } from '../utils/gsapSetup';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function LetterScene() {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.letter-header-item', {
        y: 22,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('.envelope-stage', {
        y: 30,
        opacity: 0,
        scale: 0.97,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '.envelope-stage',
          start: 'top 82%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const { letter, recipientName } = BIRTHDAY_CONFIG;

  return (
    <section
      id="special-letter"
      ref={sectionRef}
      aria-labelledby="special-letter-heading"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-8"
    >
      {/* Soft Rose & Lavender Ambient Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,207,232,0.12)_0%,_rgba(192,132,252,0.1)_42%,_transparent_75%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
        {/* Section Header */}
        <div className="text-center">
          <div className="letter-header-item mb-4 inline-flex items-center gap-2 rounded-full border border-blush-200/25 bg-cosmic-800/65 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-blush-200 backdrop-blur-md sm:text-xs">
            <MailOpen className="h-3.5 w-3.5 text-moonGold" />
            <span>{recipientName}</span>
          </div>

          <h2
            id="special-letter-heading"
            className="letter-header-item font-display text-3xl font-bold tracking-wide text-gradient-celestial sm:text-5xl"
          >
            {letter.heading}
          </h2>

          <p className="letter-header-item mt-3 text-sm text-lavender-200/80 sm:text-base">
            {isOpen ? 'A note kept inside the stars for you.' : letter.prompt}
          </p>
        </div>

        {/* Envelope & Revealed Letter Container */}
        <div className="envelope-stage mt-12 flex w-full flex-col items-center">
          {!isOpen ? (
            <div className="perspective-1000 flex w-full flex-col items-center">
              <motion.button
                type="button"
                onClick={() => setIsOpen(true)}
                whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.015 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                aria-label={`Open birthday letter for ${recipientName}`}
                className="preserve-3d group relative h-56 w-full max-w-md cursor-pointer rounded-2xl border border-lavender-200/25 bg-gradient-to-br from-cosmic-800 via-purple-900/90 to-cosmic-950 p-6 shadow-glow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold sm:h-64"
              >
                {/* Decorative Inner Border */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none inset-3 rounded-xl border border-moonGold/20"
                />

                {/* Top Envelope Flap */}
                <div
                  aria-hidden="true"
                  style={{
                    clipPath: 'polygon(0 0, 50% 56%, 100% 0)',
                  }}
                  className="pointer-events-none absolute inset-x-0 top-0 h-36 rounded-t-2xl border-b border-moonGold/30 bg-gradient-to-b from-purple-800/95 to-cosmic-800/95 transition-transform duration-500 group-hover:brightness-110 sm:h-40"
                />

                {/* Lower Pocket Fold Lines */}
                <div
                  aria-hidden="true"
                  style={{
                    clipPath: 'polygon(0 100%, 50% 42%, 100% 100%)',
                  }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-36 rounded-b-2xl bg-gradient-to-t from-cosmic-950/95 via-cosmic-900/80 to-purple-900/40 sm:h-40"
                />

                {/* Wax Seal */}
                <div className="relative z-20 mx-auto mt-14 flex h-16 w-16 items-center justify-center rounded-full border-2 border-moonGold/70 bg-gradient-to-br from-rose-400/90 via-purple-700 to-cosmic-900 shadow-goldGlow transition-transform duration-300 group-hover:scale-105 sm:mt-16">
                  <Sparkles className="h-6 w-6 text-moonGold" />
                </div>

                {/* Recipient Label on Envelope */}
                <div className="relative z-20 mt-4 text-center">
                  <span className="font-handwriting text-2xl text-blush-200 sm:text-3xl">
                    For {recipientName}
                  </span>
                </div>
              </motion.button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.article
                key="opened-letter"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 24, rotateX: -12 }
                }
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="glass-panel relative w-full max-w-2xl rounded-3xl border border-moonGold/30 px-6 py-8 text-left shadow-goldGlow sm:px-10 sm:py-10"
              >
                <div className="mb-6 flex items-center justify-between border-b border-lavender-200/15 pb-4">
                  <p className="font-handwriting text-3xl font-semibold text-moonGold sm:text-4xl">
                    {letter.salutation}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-lavender-200/20 bg-cosmic-900/75 px-3.5 py-1.5 text-xs font-medium text-lavender-200 transition hover:border-moonGold/50 hover:text-moonGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Fold Envelope</span>
                  </button>
                </div>

                <div className="space-y-5 font-handwriting text-2xl leading-relaxed text-stardust sm:text-3xl">
                  {letter.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 border-t border-lavender-200/15 pt-5 text-right font-handwriting text-2xl text-blush-200 sm:text-3xl">
                  <p>{letter.signOff}</p>
                  <p className="mt-1 font-semibold text-moonGold">
                    {letter.signature}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}