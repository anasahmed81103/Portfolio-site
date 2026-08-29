import { useEffect, useState } from 'react';

type IntroMobileStartButtonProps = {
  exiting?: boolean;
  onClick: () => void;
};

const REVEAL_MS = 4200;

/**
 * Docked Start Journey control for narrow / touch layouts.
 * Always mounted; CSS + `.intro-dock` hide it on fine-pointer desktops.
 * Never uses GSAP, so a failed timeline cannot leave it unclickable.
 */
function IntroMobileStartButton({
  exiting = false,
  onClick,
}: IntroMobileStartButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), REVEAL_MS);
    return () => window.clearTimeout(id);
  }, []);

  const shown = visible && !exiting;

  return (
    <button
      type="button"
      className={`intro-mobile-start${visible ? ' is-visible' : ''}${exiting ? ' is-exiting' : ''}`}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onClick}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      disabled={exiting}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroMobileStartButton;
