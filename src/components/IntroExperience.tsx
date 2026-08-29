import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import IntroScene from './intro/IntroScene';
import IntroStartButton from './intro/IntroStartButton';
import IntroMobileStartButton from './intro/IntroMobileStartButton';
import IntroSpaceHandoff from './intro/IntroSpaceHandoff';
import IntroCursor from './intro/IntroCursor';
import IntroInkTrail from './intro/IntroInkTrail';
import { playTransition, playTransitionOnce } from '../audio/stageAudio';
import { useIntroDock } from '../hooks/useTouchLayout';

type IntroExperienceProps = {
  onSpaceHandoff?: () => void;
};

/**
 * First chapter: hand-drawn sketchbook (pure HTML/SVG + GSAP, no WebGL).
 *
 * Flow:
 * 1. Mount → play the intro-reveal sound once (desktop)
 * 2. IntroScene draws the page, doodles, polaroids, signature
 * 3. Click / tap START JOURNEY → rocket cue, then IntroSpaceHandoff
 * 4. Handoff calls onSpaceHandoff → App switches to Space
 */
function IntroExperience({ onSpaceHandoff }: IntroExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dock = useIntroDock();
  const [handingOff, setHandingOff] = useState(false);
  const lockedRef = useRef(false);

  useLayoutEffect(() => {
    if (dock) return;
    playTransitionOnce('intro-reveal', 'introReveal', {
      volume: 1,
      fadeIn: 0.3,
      fadeOut: 0.7,
      maxDuration: 5,
      delay: 0.35,
    });
  }, [dock]);

  const handleStart = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    if (!dock) {
      try {
        playTransition('rocket', {
          volume: 0.8,
          fadeIn: 0.12,
          fadeOut: 0.65,
          delay: 0.2,
        });
      } catch {
        /* Audio must never block the Space handoff. */
      }
    }
    setHandingOff(true);
  }, [dock]);

  return (
    <div
      ref={rootRef}
      className={`intro-experience${dock ? ' intro-dock' : ''}`}
    >
      <IntroScene
        inkTrail={
          dock ? null : (
            <IntroInkTrail rootRef={rootRef} active={!handingOff} />
          )
        }
      />
      <IntroStartButton
        onClick={handleStart}
        disabled={handingOff}
        pressed={handingOff}
      />
      <IntroMobileStartButton onClick={handleStart} exiting={handingOff} />
      {handingOff ? (
        <IntroSpaceHandoff onComplete={() => onSpaceHandoff?.()} />
      ) : null}
      {dock ? null : <IntroCursor rootRef={rootRef} />}
    </div>
  );
}

export default IntroExperience;
