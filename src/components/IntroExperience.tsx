import { useCallback, useRef, useState, type ReactNode } from 'react';
import IntroScene from './intro/IntroScene';
import IntroStartButton from './intro/IntroStartButton';
import IntroSpaceHandoff from './intro/IntroSpaceHandoff';
import IntroCursor from './intro/IntroCursor';
import IntroInkTrail from './intro/IntroInkTrail';

type IntroExperienceProps = {
  onSpaceHandoff?: () => void;
};

/**
 * Intro stage shell — mirrors SpaceExperience / EarthDiveExperience.
 * Space is reached only via the paper “START JOURNEY” handoff.
 */
function IntroExperience({ onSpaceHandoff }: IntroExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [handingOff, setHandingOff] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const lockedRef = useRef(false);

  const handleStart = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setButtonPressed(true);

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
