import { useEffect, useState } from 'react';

type IntroMobileStartButtonProps = {
  exiting?: boolean;
  onClick: () => void;
};

const REVEAL_MS = 4200;

/**
 * Phone / DevTools-only Start Journey control.
 * Always mounted; CSS hides it on wide screens. Never uses GSAP.
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

  const fire = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault();
    event.stopPropagation();
    if (exiting) return;
    onClick();
  };

  return (
    <button
      type="button"
      className={`intro-mobile-start${visible ? ' is-visible' : ''}${exiting ? ' is-exiting' : ''}`}
      onPointerUp={fire}
      onClick={fire}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroMobileStartButton;
