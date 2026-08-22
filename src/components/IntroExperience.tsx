import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import IntroScene from './intro/IntroScene';
import IntroStartButton from './intro/IntroStartButton';
import IntroSpaceHandoff from './intro/IntroSpaceHandoff';
import IntroCursor from './intro/IntroCursor';
import IntroInkTrail from './intro/IntroInkTrail';
import { playTransition, playTransitionOnce } from '../audio/stageAudio';

type IntroExperienceProps = {
  onSpaceHandoff?: () => void;
};

/**
 * Intro stage shell. Space is reached only via the paper “START JOURNEY” handoff.
 */
function IntroExperience({ onSpaceHandoff }: IntroExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [handingOff, setHandingOff] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const lockedRef = useRef(false);

  // Single sketch bed as the diary draws in (~5s with fade).
  useLayoutEffect(() => {
    playTransitionOnce('intro-reveal', 'introReveal', {
      volume: 1,
      fadeIn: 0.3,
      fadeOut: 0.7,
      maxDuration: 5,
      delay: 1.0,
    });
  }, []);

  const handleStart = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setButtonPressed(true);
    // Rocket waits for the plane handoff to actually start.
    playTransition('rocket', {
      volume: 0.8,
      fadeIn: 0.12,
      fadeOut: 0.65,
      delay: 0.2,
    });

    window.setTimeout(() => {
      setHandingOff(true);
    }, 120);
  }, []);

  const handleHandoffComplete = useCallback(() => {
    onSpaceHandoff?.();
  }, [onSpaceHandoff]);

  const startButton: ReactNode = (
    <IntroStartButton
      onClick={handleStart}
      disabled={handingOff || buttonPressed}
      pressed={buttonPressed}
    />
  );

  return (
    <div ref={rootRef} className="intro-experience">
      <IntroScene startButton={startButton} />
      <IntroInkTrail rootRef={rootRef} active={!handingOff} />
      {handingOff ? (
        <IntroSpaceHandoff onComplete={handleHandoffComplete} />
      ) : null}
      <IntroCursor rootRef={rootRef} />
    </div>
  );
}

export default IntroExperience;
