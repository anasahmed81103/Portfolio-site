import { useEffect, useState } from 'react';
import './SpaceHud.css';

type SpaceProgressButtonProps = {
  onProgress: () => void;
  /** Delay before the button fades in (ms). */
  delayMs?: number;
  /** Soft exit while Space → Dive handoff runs. */
  exiting?: boolean;
};

/**
 * “Begin descent” HUD chip. Waits `delayMs` so the visitor can enjoy orbit
 * first, then calls onProgress (App flips stage to Earth Dive).
 * Styles live in SpaceHud.css (monospace, cyan glow).
 */
function SpaceProgressButton({
  onProgress,
  delayMs = 5000,
  exiting = false,
}: SpaceProgressButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (exiting) return;
    const id = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, exiting]);

  const shown = visible && !exiting;

  return (
    <button
      type="button"
      className={`space-progress-button${shown ? ' is-visible' : ''}${exiting ? ' is-exiting' : ''}`}
      onClick={onProgress}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      disabled={exiting}
      aria-label="Progress forward to Earth dive"
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
