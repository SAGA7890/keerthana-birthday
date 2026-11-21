import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Notes in Hz for a gentle "Happy Birthday" melody in F major
const NOTE_FREQ = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  C5: 523.25,
};

// [note, durationInSeconds, pauseAfterInSeconds]
const MELODY_SEQUENCE = [
  ['C4', 0.45, 0.55],
  ['C4', 0.45, 0.55],
  ['D4', 0.9, 1.05],
  ['C4', 0.9, 1.05],
  ['F4', 0.9, 1.05],
  ['E4', 1.5, 1.7],

  ['C4', 0.45, 0.55],
  ['C4', 0.45, 0.55],
  ['D4', 0.9, 1.05],
  ['C4', 0.9, 1.05],
  ['G4', 0.9, 1.05],
  ['F4', 1.5, 1.7],

  ['C4', 0.45, 0.55],
  ['C4', 0.45, 0.55],
  ['C5', 0.9, 1.05],
  ['A4', 0.9, 1.05],
  ['F4', 0.9, 1.05],
  ['E4', 0.9, 1.05],
  ['D4', 1.5, 1.7],

  ['Bb4', 0.45, 0.55],
  ['Bb4', 0.45, 0.55],
  ['A4', 0.9, 1.05],
  ['F4', 0.9, 1.05],
  ['G4', 0.9, 1.05],
  ['F4', 1.8, 2.6],
];

export default function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const outputRef = useRef(null);
  const timerRef = useRef(null);
  const stepIndexRef = useRef(0);
  const playingRef = useRef(false);

  const clearScheduledNote = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const triggerGentleNote = (ctx, destination, noteName, duration) => {
    const freq = NOTE_FREQ[noteName];
    if (!freq) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  };

  const runNextStep = () => {
    if (!playingRef.current || !audioCtxRef.current || !outputRef.current) return;

    const ctx = audioCtxRef.current;
    if (ctx.state !== 'running') return;

    const [note, duration, waitSec] =
      MELODY_SEQUENCE[stepIndexRef.current % MELODY_SEQUENCE.length];

    triggerGentleNote(ctx, outputRef.current, note, duration);
    stepIndexRef.current += 1;

    timerRef.current = window.setTimeout(runNextStep, waitSec * 1000);
  };

  useEffect(() => {
    return () => {
      playingRef.current = false;
      clearScheduledNote();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(850, ctx.currentTime);

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);

        lowpass.connect(masterGain);
        masterGain.connect(ctx.destination);

        audioCtxRef.current = ctx;
        outputRef.current = lowpass;
        outputRef.current.masterGain = masterGain;
      }

      const ctx = audioCtxRef.current;
      const filterNode = outputRef.current;
      const masterGain = filterNode.masterGain;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!playingRef.current) {
        playingRef.current = true;
        setIsPlaying(true);

        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.4);

        clearScheduledNote();
        runNextStep();
      } else {
        playingRef.current = false;
        setIsPlaying(false);
        clearScheduledNote();

        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      }
    } catch {
      playingRef.current = false;
      setIsPlaying(false);
      clearScheduledNote();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Mute birthday melody' : 'Play gentle birthday melody'}
      className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-lavender-200/20 bg-cosmic-900/75 px-3.5 py-2 text-xs font-medium text-stardust backdrop-blur-md transition hover:border-moonGold/50 hover:text-moonGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonGold sm:right-6 sm:top-6"
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-4 w-4 text-moonGold" />
          <span className="hidden sm:inline">HBD On</span>
        </>
      ) : (
        <>
          <VolumeX className="h-4 w-4 text-lavender-300" />
          <span className="hidden sm:inline">HBD Music</span>
        </>
      )}
    </button>
  );
}