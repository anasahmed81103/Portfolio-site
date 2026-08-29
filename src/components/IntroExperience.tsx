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
 * 1. Mount → play the intro-reveal sound once
 * 2. IntroScene draws the page, doodles, polaroids, signature
 * 3. Click / tap START JOURNEY → rocket cue, then IntroSpaceHandoff (paper plane)
 * 4. Handoff calls onSpaceHandoff → App switches to Space
 *
 * Mouse: quill cursor + ink that follows movement (no click-drag).
 * Touch: no ink layer; a docked CTA that is not covered by a capture canvas.
 */
function IntroExperience({ onSpaceHandoff }: IntroExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dock = useIntroDock();
  const [handingOff, setHandingOff] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const lockedRef = useRef(false);

  // Sketch bed — browsers may block until the first click; audio helper retries.
  useLayoutEffect(() => {
    playTransitionOnce('intro-reveal', 'introReveal', {
      volume: 1,
      fadeIn: 0.3,
      fadeOut: 0.7,
      maxDuration: 5,
      delay: 0.35,
    });
  }, []);

  const handleStart = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setButtonPressed(true);
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

    window.setTimeout(() => {
      setHandingOff(true);
    }, 120);
  }, []);

  const handleHandoffComplete = useCallback(() => {
    onSpaceHandoff?.();
  }, [onSpaceHandoff]);

  return (
    <div
      ref={rootRef}
      className={`intro-experience${dock ? ' intro-dock' : ''}`}
    >
      <IntroScene
        inkTrail={<IntroInkTrail rootRef={rootRef} active={!handingOff} />}
        startButton={
          <IntroStartButton
            onClick={handleStart}
            disabled={handingOff || buttonPressed}
            pressed={buttonPressed}
          />
        }
      />
      <IntroMobileStartButton
        onClick={handleStart}
        exiting={handingOff || buttonPressed}
      />
      {handingOff ? (
        <IntroSpaceHandoff onComplete={handleHandoffComplete} />
      ) : null}
      <IntroCursor rootRef={rootRef} />
    </div>
  );
}

export default IntroExperience;
