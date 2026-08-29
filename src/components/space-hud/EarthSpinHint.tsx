import { useEffect, useState } from 'react';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import { APPROACH_END } from '../earth-dive/earthDivePhases';
import './SpaceHud.css';

type EarthSpinHintProps = {
  /** Phones / tablets: “keep swiping” instead of “keep scrolling”. */
  touchCopy?: boolean;
};

/**
 * Bottom-right cue while approaching Earth —
 * from the first move toward the planet through the hero spin lock.
 */
function EarthSpinHint({ touchCopy = false }: EarthSpinHintProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const p = diveProgressRef.current;
      // Approach only — at the hero shot the progress button takes over.
      const next = p > 0.01 && p < APPROACH_END - 0.0001;
      setVisible((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <p
      className={`space-scroll-hint space-scroll-hint--corner${visible ? ' is-on' : ''}`}
      aria-hidden={!visible}
    >
      <span className="space-scroll-hint-row">
        {touchCopy ? 'keep swiping' : 'almost there, keep scrolling'}
      </span>
    </p>
  );
}

export default EarthSpinHint;
