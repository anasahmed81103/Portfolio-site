import { useEffect, useState } from 'react';
import './SpaceHud.css';

type SpaceProgressButtonProps = {
  onProgress: () => void;
  /** Delay before the button fades in (ms). */
  delayMs?: number;
  /** Soft exit while Space → Dive handoff runs. */
  exiting?: boolean;
  /**
   * When false the chip stays hidden and the delay restarts next time it
   * becomes true. Space is always armed; Earth Dive arms at the hero lock.
   */
  armed?: boolean;
  ariaLabel?: string;
};

/**
 * “Begin descent” HUD chip. Waits `delayMs` so the visitor can enjoy orbit
 * first, then calls onProgress.
 * Styles live in SpaceHud.css (monospace, cyan glow).
 */
function SpaceProgressButton({
  onProgress,
  delayMs = 5000,
  exiting = false,
  armed = true,
  ariaLabel = 'Progress forward to Earth dive',
}: SpaceProgressButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (exiting || !armed) {
      setVisible(false);
      return;
    }
    if (delayMs <= 0) {
      setVisible(true);
      return;
    }
    const id = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, exiting, armed]);

  const shown = visible && !exiting;

  return (
    <button
      type="button"
      className={`space-progress-button${shown ? ' is-visible' : ''}${exiting ? ' is-exiting' : ''}`}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onProgress}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      disabled={exiting}
      aria-label={ariaLabel}
    >
      <span className="space-progress-button-bracket" aria-hidden="true">
        [
      </span>
      <span className="space-progress-button-label">progress_forward</span>
      <span className="space-progress-button-bracket" aria-hidden="true">
        ]
      </span>
      <span className="space-progress-button-arrow" aria-hidden="true">
        »»
      </span>
    </button>
  );
}

export default SpaceProgressButton;
