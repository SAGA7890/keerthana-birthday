import { useRef, useState } from 'react';
import StarfieldCanvas from './components/StarfieldCanvas';
import AudioToggle from './components/AudioToggle';
import IntroLoader from './scenes/IntroLoader';
import HeroScene from './scenes/HeroScene';
import CelebrationScene from './scenes/CelebrationScene';
import AboutYouScene from './scenes/AboutYouScene';
import WorldHistoryScene from './scenes/WorldHistoryScene';
import LetterScene from './scenes/LetterScene';
import WishesFinaleScene from './scenes/WishesFinaleScene';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const celebrationRef = useRef(null);

  const handleEnterWorld = () => {
    celebrationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full bg-cosmic-950 text-stardust">
      {/* Global Celestial Starfield */}
      <StarfieldCanvas />

      {/* User-Initiated Ambient Audio Controller */}
      <AudioToggle />

      {/* Stage 1A: 21.11.2004 Loading Sequence */}
      {!introFinished && (
        <IntroLoader onComplete={() => setIntroFinished(true)} />
      )}

      {/* Main Experience */}
      <main id="main-content" className="relative z-10">
        {/* Stage 1B: 3D Parallax Magical Entrance */}
        <HeroScene isReady={introFinished} onEnterWorld={handleEnterWorld} />

        {/* Stage 2: 3D Birthday Cake & Interactive Candles */}
        <div ref={celebrationRef}>
          <CelebrationScene />
        </div>

        {/* Stage 3: A Little About You */}
        <AboutYouScene />

        {/* Stage 4: The World on 21 November 2004 */}
        <WorldHistoryScene />

        {/* Stage 5: A Special Letter */}
        <LetterScene />

        {/* Stage 6: Final Scene — A Sky Full of Wishes */}
        <WishesFinaleScene onReplay={handleReplay} />
      </main>
    </div>
  );
}