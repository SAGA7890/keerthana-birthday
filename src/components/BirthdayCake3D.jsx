import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Mic, MicOff, RotateCcw, Sparkles, Wind } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayContent';
import { useReducedMotion } from '../hooks/useReducedMotion';

const INITIAL_CANDLES = [
  { id: 1, label: 'Candle 1', x: '-68px', y: '-18px', lit: true },
  { id: 2, label: 'Candle 2', x: '-34px', y: '-28px', lit: true },
  { id: 3, label: 'Candle 3', x: '0px', y: '-32px', lit: true },
  { id: 4, label: 'Candle 4', x: '34px', y: '-28px', lit: true },
  { id: 5, label: 'Candle 5', x: '68px', y: '-18px', lit: true },
];

export default function BirthdayCake3D() {
  const [candles, setCandles] = useState(INITIAL_CANDLES);
  const [micActive, setMicActive] = useState(false);
  const [micStatus, setMicStatus] = useState('idle'); // 'idle' | 'listening' | 'denied' | 'unsupported'
  const prefersReducedMotion = useReducedMotion();

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const rafRef = useRef(null);
  const blowCooldownRef = useRef(0);
  const celebrationFiredRef = useRef(false);

  const allBlownOut = candles.every((c) => !c.lit);

  const triggerConfetti = useCallback(() => {
    if (prefersReducedMotion || celebrationFiredRef.current) return;
    celebrationFiredRef.current = true;

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.62 },
      colors: ['#f5d08a', '#e9d5ff', '#f9a8d4', '#c084fc', '#f9f6ff'],
      disableForReducedMotion: true,
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (allBlownOut) {
      triggerConfetti();
    }
  }, [allBlownOut, triggerConfetti]);

  const extinguishCandle = useCallback((id) => {
    setCandles((prev) =>
      prev.map((candle) => (candle.id === id ? { ...candle, lit: false } : candle))
    );
  }, []);

  const blowOutAllCandles = useCallback(() => {
    setCandles((prev) => prev.map((candle) => ({ ...candle, lit: false })));
  }, []);

  const relightCandles = useCallback(() => {
    celebrationFiredRef.current = false;
    setCandles(INITIAL_CANDLES);
  }, []);

  const stopMicrophone = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicActive(false);
  }, []);

  useEffect(() => {
    return () => stopMicrophone();
  }, [stopMicrophone]);

  const toggleMicrophone = async () => {
    if (micActive) {
      stopMicrophone();
      setMicStatus('idle');
      return;
    }

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setMicStatus('unsupported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      micStreamRef.current = stream;
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      setMicActive(true);
      setMicStatus('listening');

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Average low-mid frequencies to catch a breath/blow sound
        let sum = 0;
        const sampleCount = Math.min(dataArray.length, 48);
        for (let i = 0; i < sampleCount; i += 1) {
          sum += dataArray[i];
        }
        const averageVolume = sum / sampleCount;

        const now = performance.now();
        if (averageVolume > 62 && now - blowCooldownRef.current > 450) {
          blowCooldownRef.current = now;
          setCandles((prev) => {
            const nextLitIndex = prev.findIndex((c) => c.lit);
            if (nextLitIndex === -1) return prev;
            return prev.map((c, idx) =>
              idx === nextLitIndex ? { ...c, lit: false } : c
            );
          });
        }

        rafRef.current = requestAnimationFrame(detectBlow);
      };

      rafRef.current = requestAnimationFrame(detectBlow);
    } catch {
      setMicStatus('denied');
      setMicActive(false);
    }
  };

  const litCount = candles.filter((c) => c.lit).length;

  return (
    <div className="flex w-full flex-col items-center">
      {/* 3D Stage */}
      <div className="perspective-1000 relative flex h-[340px] w-full max-w-md items-center justify-center sm:h-[380px]">
        {/* Warm Candlelight Aura */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-16 h-44 w-56 rounded-full transition-opacity duration-700 blur-3xl ${
            litCount > 0 ? 'bg-moonGold/30 opacity-100' : 'bg-lavender-400/20 opacity-50'
          }`}
        />

        {/* 3D Tilted Cake Assembly */}
        <div
          className="preserve-3d relative mt-14 flex flex-col items-center transition-transform duration-500"
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : 'rotateX(12deg) rotateY(-4deg)',
          }}
        >
          {/* Candles Row */}
          <div
            className="preserve-3d relative z-30 h-14 w-44"
            style={{ transform: 'translateZ(26px)' }}
          >
            {candles.map((candle) => (
              <button
                key={candle.id}
                type="button"
                onClick={() => extinguishCandle(candle.id)}
                aria-label={
                  candle.lit
                    ? `Blow out ${candle.label}`
                    : `${candle.label} is blown out`
                }
                style={{
                  left: `calc(50% + ${candle.x})`,
                  top: `calc(50% + ${candle.y})`,
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold rounded-full"
              >
                {/* Flame or Smoke Puff */}
                <div className="relative mb-0.5 flex h-6 w-5 items-center justify-center">
                  {candle.lit ? (
                    <motion.span
                      aria-hidden="true"
                      animate={
                        prefersReducedMotion
                          ? {}
                          : {
                              scale: [1, 1.14, 0.94, 1.08, 1],
                              rotate: [-3, 4, -2, 3, -3],
                            }
                      }
                      transition={{
                        duration: 1.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="block h-5 w-3.5 rounded-full bg-gradient-to-t from-amber-400 via-moonGold to-white shadow-[0_0_14px_rgba(245,208,138,0.95)]"
                      style={{
                        borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
                      }}
                    />
                  ) : (
                    <motion.span
                      key={`smoke-${candle.id}`}
                      aria-hidden="true"
                      initial={{ opacity: 0.75, y: 2, scale: 0.6 }}
                      animate={{ opacity: 0, y: -16, scale: 1.5 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="block h-3 w-3 rounded-full bg-lavender-200/60 blur-[2px]"
                    />
                  )}
                </div>

                {/* Wax Candle Stick */}
                <span className="h-8 w-2.5 rounded-sm border border-moonGold/40 bg-gradient-to-b from-blush-200 via-lavender-200 to-purple-400 shadow-sm" />
              </button>
            ))}
          </div>

          {/* Top Tier */}
          <div
            className="preserve-3d relative z-20 -mt-2 flex h-20 w-44 items-end justify-center rounded-t-2xl rounded-b-xl border-t-2 border-moonGold/60 bg-gradient-to-r from-purple-800 via-cosmic-700 to-purple-900 shadow-[0_10px_25px_rgba(0,0,0,0.45)] sm:w-48"
            style={{ transform: 'translateZ(14px)' }}
          >
            {/* Pastel Frosting Wave */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-6 rounded-t-2xl bg-gradient-to-r from-blush-200/85 via-lavender-200/90 to-blush-200/85"
            />
            <div className="mb-2 h-1.5 w-3/4 rounded-full bg-moonGold/50" />
          </div>

          {/* Bottom Tier */}
          <div
            className="preserve-3d relative z-10 -mt-2 flex h-24 w-64 items-end justify-center rounded-t-2xl rounded-b-2xl border-t-2 border-lavender-300/40 bg-gradient-to-r from-cosmic-900 via-purple-900 to-cosmic-900 shadow-[0_18px_36px_rgba(0,0,0,0.65)] sm:w-72"
            style={{ transform: 'translateZ(0px)' }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-7 rounded-t-2xl bg-gradient-to-r from-lavender-300/50 via-blush-300/55 to-lavender-300/50"
            />
            <div className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-moonGold/90">
              <Sparkles className="h-3 w-3" />
              <span>21.11.2004</span>
              <Sparkles className="h-3 w-3" />
            </div>
          </div>

          {/* Cake Pedestal / Platter */}
          <div
            aria-hidden="true"
            className="-mt-1 h-4 w-72 rounded-full border border-moonGold/30 bg-gradient-to-r from-cosmic-800 via-lavender-300/20 to-cosmic-800 shadow-[0_14px_30px_rgba(216,180,254,0.18)] sm:w-80"
          />
        </div>
      </div>

      {/* Helper Prompt */}
      <p className="mt-2 max-w-md text-center text-xs text-lavender-200/80 sm:text-sm">
        {micStatus === 'denied'
          ? 'Microphone access was declined—tap any candle or use "Blow All Candles" below.'
          : micStatus === 'unsupported'
          ? 'Microphone blow detection isn’t supported in this browser—tap candles or use the button below.'
          : BIRTHDAY_CONFIG.celebration.instructionMic}
      </p>

      {/* Interactive Controls (Works with or without Mic) */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!allBlownOut ? (
          <>
            <button
              type="button"
              onClick={blowOutAllCandles}
              className="inline-flex items-center gap-2 rounded-full border border-moonGold/50 bg-cosmic-800/85 px-5 py-2.5 text-xs font-semibold tracking-wider text-stardust shadow-goldGlow transition hover:border-moonGold hover:bg-cosmic-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold sm:text-sm"
            >
              <Wind className="h-4 w-4 text-moonGold" />
              <span>Blow Out Candles ({litCount} lit)</span>
            </button>

            <button
              type="button"
              onClick={toggleMicrophone}
              aria-pressed={micActive}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold sm:text-sm ${
                micActive
                  ? 'border-blush-300/70 bg-purple-900/80 text-blush-200'
                  : 'border-lavender-200/25 bg-cosmic-900/75 text-lavender-200 hover:border-lavender-300/50'
              }`}
            >
              {micActive ? (
                <>
                  <Mic className="h-4 w-4 text-blush-300" />
                  <span>Listening for Breath...</span>
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4 text-lavender-300" />
                  <span>Use Mic to Blow</span>
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={relightCandles}
            className="inline-flex items-center gap-2 rounded-full border border-lavender-200/30 bg-cosmic-800/85 px-5 py-2.5 text-xs font-medium tracking-wider text-lavender-200 transition hover:border-moonGold/60 hover:text-moonGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold sm:text-sm"
          >
            <RotateCcw className="h-4 w-4 text-moonGold" />
            <span>{BIRTHDAY_CONFIG.celebration.relightLabel}</span>
          </button>
        )}
      </div>

      {/* Wish Granted Banner */}
      <AnimatePresence>
        {allBlownOut && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="glass-panel mt-6 max-w-md rounded-2xl px-6 py-4 text-center shadow-glow"
          >
            <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-moonGold">
              <Flame className="h-3.5 w-3.5" />
              <span>Wish Sent to the Stars</span>
            </div>
            <p className="text-sm leading-relaxed text-stardust/95">
              {BIRTHDAY_CONFIG.celebration.wishGrantedMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}